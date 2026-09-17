import React, { createContext, useContext, useState, useEffect } from 'react';
import { Place, CrowdZone, TravelPersona, RoutePreference, RouteOption, FamilyMember } from '../types';
import { INITIAL_PLACES, INITIAL_CROWD_ZONES, MOCK_FAMILY_MEMBERS, ORIGIN_PRESETS } from '../data/kumbhData';
import { computeRoutes, enrichRoutesWithRealRoads } from '../services/routingEngine';
import { TRANSLATIONS, Translations } from '../data/translations';

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
  setOriginPreset: (presetId: string) => void;
  trackLiveLocation: () => Promise<void>;
}

const KumbhContext = createContext<KumbhContextType | undefined>(undefined);

export const KumbhProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [places] = useState<Place[]>(INITIAL_PLACES);
  const [crowdZones, setCrowdZones] = useState<CrowdZone[]>(INITIAL_CROWD_ZONES);
  const [persona, setPersona] = useState<TravelPersona>('elderly');
  const [preference, setPreference] = useState<RoutePreference>('least-crowded');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [language, setLanguage] = useState<'en' | 'hi' | 'mr'>('en');
  const [familyMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS);
  const [isSurgeActive, setIsSurgeActive] = useState<boolean>(false);
  const [initialAssistantPrompt, setInitialAssistantPrompt] = useState<string>('');
  const [isTrackingLive, setIsTrackingLive] = useState<boolean>(false);

  // Default origin: MET Bhujbal Knowledge City (Adgaon, Nashik)
  const defaultOriginPreset = ORIGIN_PRESETS[0];
  const [origin, setOrigin] = useState<OriginType>({
    lat: defaultOriginPreset.lat,
    lng: defaultOriginPreset.lng,
    name: defaultOriginPreset.name,
    isLiveGps: false
  });

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
