import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Place, CrowdZone, TravelPersona, RoutePreference, RouteOption, FamilyMember } from '../types';
import { INITIAL_PLACES, INITIAL_CROWD_ZONES, ORIGIN_PRESETS } from '../data/kumbhData';
import { computeRoutes, enrichRoutesWithRealRoads } from '../services/routingEngine';
import { TRANSLATIONS, Translations } from '../data/translations';
import { kumbhDb, UserProfile, FamilyGroup } from '../services/kumbhDbService';

interface OriginType {
  lat: number;
  lng: number;
  name: string;
  isLiveGps?: boolean;
}

interface KumbhContextType {
  places: Place[];
  crowdZones: CrowdZone[];
  persona: TravelPersona;
  preference: RoutePreference;
  activeTab: string;
  selectedPlace: Place | null;
  origin: OriginType;
  destination: Place | null;
  routes: RouteOption[];
  selectedRouteId: string;
  language: 'en' | 'hi' | 'mr';
  familyMembers: FamilyMember[];
  isSurgeActive: boolean;
  initialAssistantPrompt: string;
  isTrackingLive: boolean;

  // Authentication & Database
  currentUser: UserProfile;
  currentFamily?: FamilyGroup;
  userRole: 'pilgrim' | 'police_admin';
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  switchDemoUser: (presetKey: 'me' | 'dad' | 'mom' | 'brother' | 'grandpa' | 'police') => void;
  loginPilgrimByPhone: (phone: string) => { success: boolean; message?: string };
  registerPilgrim: (data: {
    name: string;
    phone: string;
    familyCodeAction: 'create' | 'join';
    familyCode?: string;
    familyName?: string;
    baseCamp?: string;
    bloodGroup?: string;
    medicalNotes?: string;
    relation?: string;
  }) => { success: boolean; message?: string };
  loginPolice: (badge: string, pin: string) => { success: boolean; message?: string };
  logout: () => void;
  
  // Helpers
  t: (key: keyof Translations) => string;

  // Actions
  setPersona: (p: TravelPersona) => void;
  setPreference: (pr: RoutePreference) => void;
  setActiveTab: (tab: string) => void;
  setSelectedPlace: (p: Place | null) => void;
  setDestination: (p: Place | null) => void;
  setSelectedRouteId: (id: string) => void;
  setLanguage: (l: 'en' | 'hi' | 'mr') => void;
  setInitialAssistantPrompt: (prompt: string) => void;
  updateZoneDensity: (zoneId: string, density: number) => void;
  triggerCrowdSurge: () => void;
  toggleCrowdSurge: () => void;
  resetCrowdSimulation: () => void;
  navigateToPlace: (place: Place) => void;
  setOrigin: (origin: OriginType) => void;
  setOriginPreset: (presetId: string) => void;
  trackLiveLocation: () => Promise<void>;
}

const KumbhContext = createContext<KumbhContextType | undefined>(undefined);

const userToFamilyMember = (u: UserProfile): FamilyMember => {
  let badgeLetter = 'M';
  if (u.name.toLowerCase().includes('sahil') || u.name.toLowerCase().includes('vedant') || u.relation?.toLowerCase().includes('me') || u.id === 'user-sahil-me' || u.id === 'user-vedant-me') badgeLetter = 'S';
  else if (u.name.toLowerCase().includes('vinod') || u.relation?.toLowerCase().includes('father')) badgeLetter = 'Dad';
  else if (u.name.toLowerCase().includes('anita') || u.relation?.toLowerCase().includes('mother')) badgeLetter = 'R';
  else if (u.name.toLowerCase().includes('yash') || u.relation?.toLowerCase().includes('brother')) badgeLetter = 'Y';
  else if (u.name.toLowerCase().includes('dattatraya') || u.relation?.toLowerCase().includes('grandpa')) badgeLetter = 'D';

  return {
    id: u.id,
    name: u.name,
    relation: u.relation || (u.familyRole === 'guardian' ? 'Family Guardian' : 'Family Member'),
    lat: u.lat || 20.0050,
    lng: u.lng || 73.7915,
    batteryLevel: u.batteryLevel ?? 88,
    lastSeenTime: 'Just now (Live GPS)',
    status: u.status === 'alert' ? 'needs_help' : u.status === 'moving' ? 'moving' : 'safe',
    locationNote: u.locationNote || 'Panchavati Sector',
    avatarUrl: u.avatarUrl,
    badgeText: badgeLetter
  };
};

export const KumbhProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places] = useState<Place[]>(INITIAL_PLACES);
  const [crowdZones, setCrowdZones] = useState<CrowdZone[]>(INITIAL_CROWD_ZONES);
  const [persona, setPersona] = useState<TravelPersona>('elderly');
  const [preference, setPreference] = useState<RoutePreference>('least-crowded');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [isSurgeActive, setIsSurgeActive] = useState<boolean>(false);
  const [initialAssistantPrompt, setInitialAssistantPrompt] = useState<string>('');
  const [isTrackingLive, setIsTrackingLive] = useState<boolean>(false);

  // Authentication & Database State
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => kumbhDb.getCurrentUser());
  const [currentFamily, setCurrentFamily] = useState<FamilyGroup | undefined>(() => {
    const user = kumbhDb.getCurrentUser();
    return user.familyId ? kumbhDb.getFamilyById(user.familyId) : undefined;
  });
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    const user = kumbhDb.getCurrentUser();
    if (user.familyId) {
      const dbMembers = kumbhDb.getFamilyMembers(user.familyId);
      if (dbMembers.length > 0) return dbMembers.map(userToFamilyMember);
    }
    return kumbhDb.getAllUsers().filter(u => u.role === 'pilgrim').slice(0, 5).map(userToFamilyMember);
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const refreshFamilyState = useCallback((user: UserProfile) => {
    if (user.familyId) {
      const fam = kumbhDb.getFamilyById(user.familyId);
      setCurrentFamily(fam);
      const members = kumbhDb.getFamilyMembers(user.familyId);
      setFamilyMembers(members.map(userToFamilyMember));
    } else {
      setCurrentFamily(undefined);
      setFamilyMembers([]);
    }
  }, []);

  const switchDemoUser = (presetKey: 'me' | 'dad' | 'mom' | 'brother' | 'grandpa' | 'police') => {
    const user = kumbhDb.switchDemoUser(presetKey);
    setCurrentUser(user);
    if (user.role === 'police_admin') {
      setActiveTab('admin');
    } else {
      refreshFamilyState(user);
      if (activeTab === 'admin') {
        setActiveTab('home');
      }
    }

    // DYNAMIC ROUTE ORIGIN SYNC:
    // If the switched user has a location, immediately switch origin so all destinations are routed from their location!
    if (user.lat && user.lng) {
      setOrigin({
        lat: user.lat,
        lng: user.lng,
        name: `${user.name} (${user.locationNote || 'Live Location'})`,
        isLiveGps: true
      });
    }
  };

  const loginPilgrimByPhone = (phone: string) => {
    const allUsers = kumbhDb.getAllUsers();
    const cleanPhone = phone.replace(/\s+/g, '').replace('+91', '');
    const found = allUsers.find(u => u.phone.replace(/\s+/g, '').includes(cleanPhone));
    if (found) {
      kumbhDb.setCurrentUser(found);
      setCurrentUser(found);
      refreshFamilyState(found);
      if (found.lat && found.lng) {
        setOrigin({
          lat: found.lat,
          lng: found.lng,
          name: `${found.name} (${found.locationNote || 'Live Location'})`,
          isLiveGps: true
        });
      }
      return { success: true, message: `Welcome back, ${found.name}!` };
    }
    return { success: false, message: 'No registered pilgrim found with this phone number. Please register.' };
  };

  const registerPilgrim = (data: Parameters<typeof kumbhDb.registerPilgrim>[0]) => {
    const res = kumbhDb.registerPilgrim(data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      refreshFamilyState(res.user);
      if (res.user.lat && res.user.lng) {
        setOrigin({
          lat: res.user.lat,
          lng: res.user.lng,
          name: `${res.user.name} (${res.user.locationNote || 'Live Location'})`,
          isLiveGps: true
        });
      }
    }
    return res;
  };

  const loginPolice = (badge: string, pin: string) => {
    const res = kumbhDb.loginPolice(badge, pin);
    if (res.success && res.user) {
      setCurrentUser(res.user);
      setActiveTab('admin');
    }
    return res;
  };

  const logout = () => {
    // Default back to Dad for demo convenience
    const defaultUser = kumbhDb.switchDemoUser('dad');
    setCurrentUser(defaultUser);
    refreshFamilyState(defaultUser);
    if (defaultUser.lat && defaultUser.lng) {
      setOrigin({
        lat: defaultUser.lat,
        lng: defaultUser.lng,
        name: `${defaultUser.name} (${defaultUser.locationNote || 'Live Location'})`,
        isLiveGps: true
      });
    }
    setActiveTab('home');
  };

  // Default origin: Current logged-in user's GPS position, fallback to MET Bhujbal Knowledge City
  const [origin, setOrigin] = useState<OriginType>(() => {
    const user = kumbhDb.getCurrentUser();
    if (user && user.lat && user.lng) {
      return {
        lat: user.lat,
        lng: user.lng,
        name: `${user.name} (${user.locationNote || 'Live Location'})`,
        isLiveGps: true
      };
    }
    const defaultOriginPreset = ORIGIN_PRESETS[0];
    return {
      lat: defaultOriginPreset.lat,
      lng: defaultOriginPreset.lng,
      name: defaultOriginPreset.name,
      isLiveGps: false
    };
  });

  // Sync origin whenever currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.lat && currentUser.lng) {
      setOrigin({
        lat: currentUser.lat,
        lng: currentUser.lng,
        name: `${currentUser.name} (${currentUser.locationNote || 'Live Location'})`,
        isLiveGps: true
      });
    }
  }, [currentUser]);

  // Default destination: Ram Kund (id: 'ram-kund')
  const defaultDest = INITIAL_PLACES.find(p => p.id === 'ram-kund') || INITIAL_PLACES[0];
  const [destination, setDestination] = useState<Place | null>(defaultDest);

  // Routes calculated reactively
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRouteId, setSelectedRouteId] = useState<string>('route-b');

  // Recalculate routes whenever destination, persona, preference or crowdZones update
  useEffect(() => {
    let isCurrent = true;
    if (destination) {
      const computed = computeRoutes({
        origin,
        destination: {
          lat: destination.lat,
          lng: destination.lng,
          name: destination.name,
          id: destination.id
        },
        persona,
        preference,
        crowdZones
      });
      setRoutes(computed);
      // Auto-select the recommended route
      const recommended = computed.find(r => r.isRecommended);
      if (recommended) {
        setSelectedRouteId(recommended.id);
      }

      // Asynchronously fetch live OSRM street network curves for all routes
      enrichRoutesWithRealRoads(computed, origin, {
        lat: destination.lat,
        lng: destination.lng
      }).then(enriched => {
        if (isCurrent && enriched && enriched.length > 0) {
          setRoutes(enriched);
        }
      }).catch(() => {
        // Silently preserve precomputed road geometry
      });
    }

    return () => {
      isCurrent = false;
    };
  }, [origin, destination, persona, preference, crowdZones]);

  const updateZoneDensity = (zoneId: string, density: number) => {
    setCrowdZones(prev => prev.map(zone => {
      if (zone.id === zoneId) {
        let risk: CrowdZone['risk'] = 'LOW';
        if (density > 80) risk = 'CRITICAL';
        else if (density > 60) risk = 'HIGH';
        else if (density > 30) risk = 'MODERATE';

        return {
          ...zone,
          density,
          risk,
          activePilgrimsEstimate: Math.round((density / 100) * zone.capacityMax),
          updatedAt: 'Just now'
        };
      }
      return zone;
    }));
  };

  const triggerCrowdSurge = () => {
    setIsSurgeActive(true);
    // Surge Ram Kund to 92% (CRITICAL) and Panchavati to 74% (HIGH)
    setCrowdZones(prev => prev.map(zone => {
      if (zone.id === 'ram-kund') {
        return {
          ...zone,
          density: 92,
          risk: 'CRITICAL',
          trend: 'rising',
          activePilgrimsEstimate: 46000,
          updatedAt: 'Just now'
        };
      }
      if (zone.id === 'panchavati') {
        return {
          ...zone,
          density: 74,
          risk: 'HIGH',
          trend: 'rising',
          activePilgrimsEstimate: 31000,
          updatedAt: 'Just now'
        };
      }
      return zone;
    }));
  };

  const toggleCrowdSurge = () => {
    if (isSurgeActive) {
      resetCrowdSimulation();
    } else {
      triggerCrowdSurge();
    }
  };

  const resetCrowdSimulation = () => {
    setIsSurgeActive(false);
    setCrowdZones(INITIAL_CROWD_ZONES);
  };

  const t = (key: keyof Translations): string => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  const setOriginPreset = (presetId: string) => {
    const preset = ORIGIN_PRESETS.find(p => p.id === presetId);
    if (preset) {
      setOrigin({
        lat: preset.lat,
        lng: preset.lng,
        name: preset.name,
        isLiveGps: false
      });
      setIsTrackingLive(false);
    }
  };

  const trackLiveLocation = async (): Promise<void> => {
    setIsTrackingLive(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setOrigin({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: 'Live GPS (Current Location)',
            isLiveGps: true
          });
        },
        (error) => {
          console.warn('Live GPS denied or timed out, falling back to MET Bhujbal Knowledge City:', error);
          const met = ORIGIN_PRESETS[0];
          setOrigin({
            lat: met.lat,
            lng: met.lng,
            name: met.name,
            isLiveGps: true
          });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      const met = ORIGIN_PRESETS[0];
      setOrigin({
        lat: met.lat,
        lng: met.lng,
        name: met.name,
        isLiveGps: true
      });
    }
  };

  const navigateToPlace = (place: Place) => {
    // If the active logged-in persona has a location, route from their place
    if (currentUser && currentUser.lat && currentUser.lng) {
      setOrigin({
        lat: currentUser.lat,
        lng: currentUser.lng,
        name: `${currentUser.name} (${currentUser.locationNote || 'Live Location'})`,
        isLiveGps: true
      });
    }
    setDestination(place);
    setSelectedPlace(place);
    setActiveTab('navigation');
  };

  return (
    <KumbhContext.Provider
      value={{
        places,
        crowdZones,
        persona,
        preference,
        activeTab,
        selectedPlace,
        origin,
        destination,
        routes,
        selectedRouteId,
        language,
        familyMembers,
        isSurgeActive,
        initialAssistantPrompt,
        isTrackingLive,
        currentUser,
        currentFamily,
        userRole: currentUser.role,
        isAuthModalOpen,
        setIsAuthModalOpen,
        switchDemoUser,
        loginPilgrimByPhone,
        registerPilgrim,
        loginPolice,
        logout,
        t,
        setPersona,
        setPreference,
        setActiveTab,
        setSelectedPlace,
        setDestination,
        setSelectedRouteId,
        setLanguage,
        setInitialAssistantPrompt,
        updateZoneDensity,
        triggerCrowdSurge,
        toggleCrowdSurge,
        resetCrowdSimulation,
        navigateToPlace,
        setOrigin,
        setOriginPreset,
        trackLiveLocation
      }}
    >
      {children}
    </KumbhContext.Provider>
  );
};

export const useKumbh = () => {
  const context = useContext(KumbhContext);
  if (!context) {
    throw new Error('useKumbh must be used within a KumbhProvider');
  }
  return context;
};
