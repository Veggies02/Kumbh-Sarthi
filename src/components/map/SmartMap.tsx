import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useKumbh } from '../../store/kumbhStore';
import { Place, PlaceCategory } from '../../types';
import { CrowdBadge } from '../common/CrowdBadge';
import { 
  Navigation, 
  Eye, 
  MapPin, 
  ShieldAlert, 
  Layers, 
  Crosshair,
  Sparkles
} from 'lucide-react';

interface SmartMapProps {
  centerPlaceId?: string;
  showNavigationPath?: boolean;
  compactHeight?: boolean;
}

export const getCategoryFallbackImage = (category?: string) => {
  switch (category) {
    case 'temple':
      return 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80';
    case 'ghat':
      return 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80';
    case 'food':
      return 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?auto=format&fit=crop&w=800&q=80';
    case 'accommodation':
      return 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
    case 'water':
      return 'https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80';
    case 'parking':
      return 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80';
    case 'medical':
      return 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80';
    default:
      return 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80';
  }
};

export const SmartMap: React.FC<SmartMapProps> = ({
  centerPlaceId,
  showNavigationPath = false,
  compactHeight = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const crowdLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const familyLayerRef = useRef<L.LayerGroup | null>(null);

  const {
    places,
    crowdZones,
    familyMembers,
    selectedPlace,
    setSelectedPlace,
    navigateToPlace,
    routes,
    selectedRouteId,
    origin,
    trackLiveLocation,
    isTrackingLive,
    t
  } = useKumbh();

  // Active category filter chip
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Layer toggles: Map, Crowd, Facilities
  const [showCrowdLayer, setShowCrowdLayer] = useState<boolean>(true);
  const [showFacilities, setShowFacilities] = useState<boolean>(true);

  // Selected place for modal drawer
  const [drawerPlace, setDrawerPlace] = useState<Place | null>(selectedPlace);

  // Sync drawerPlace with selectedPlace
  useEffect(() => {
    if (selectedPlace) {
      setDrawerPlace(selectedPlace);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([selectedPlace.lat, selectedPlace.lng], 16, { animate: true });
      }
    }
  }, [selectedPlace]);

  // Center coordinate: Nashik Ram Kund / Panchavati
  const defaultLat = 19.9995;
  const defaultLng = 73.7915;

  // 1. Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Create Map instance
    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: 15,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Standard OpenStreetMap tiles (100% free, zero watermark, no API key required)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Kumbh Saathi',
      maxZoom: 19
    }).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
    crowdLayerRef.current = L.layerGroup().addTo(map);
    routeLayerRef.current = L.layerGroup().addTo(map);
    familyLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // 1b. Render Family Member Pins Layer (Dad photo, Mom R, Brother Y)
  useEffect(() => {
    if (!familyLayerRef.current) return;
    familyLayerRef.current.clearLayers();

    familyMembers.forEach(member => {
      let iconHtml = '';
      if (member.avatarUrl) {
        // Dad: Circular Photo Pin extracted from user photo
        iconHtml = `
          <div class="relative group cursor-pointer transition-transform hover:scale-110">
            <div class="w-11 h-11 rounded-full border-2 border-white shadow-xl overflow-hidden bg-amber-500 ring-2 ring-amber-400">
              <img src="${member.avatarUrl}" class="w-full h-full object-cover" alt="${member.name}" />
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow"></div>
            <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap border border-slate-700">
              Dad
            </div>
          </div>
        `;
      } else if (member.badgeText === 'R' || member.relation.toLowerCase().includes('mother')) {
        // Mother: Purple circular badge with white "R"
        iconHtml = `
          <div class="relative group cursor-pointer transition-transform hover:scale-110">
            <div class="w-10 h-10 rounded-full border-2 border-white shadow-xl bg-purple-600 ring-2 ring-purple-400 flex items-center justify-center text-white font-black text-base tracking-tight">
              R
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow"></div>
            <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap border border-slate-700">
              Mother (R)
            </div>
          </div>
        `;
      } else {
        // Brother: Indigo circular badge with white "Y"
        iconHtml = `
          <div class="relative group cursor-pointer transition-transform hover:scale-110">
            <div class="w-10 h-10 rounded-full border-2 border-white shadow-xl bg-indigo-600 ring-2 ring-indigo-400 flex items-center justify-center text-white font-black text-base tracking-tight">
              ${member.badgeText || 'Y'}
            </div>
            <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 rounded-full border-2 border-white shadow animate-pulse"></div>
            <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap border border-slate-700">
              Brother (${member.badgeText || 'Y'})
            </div>
          </div>
        `;
      }

      const memberIcon = L.divIcon({
        html: iconHtml,
        className: 'family-custom-pin',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const marker = L.marker([member.lat, member.lng], { icon: memberIcon });

      const popupHtml = `
        <div class="p-2 space-y-2 text-xs font-sans min-w-[200px]">
          <div class="flex items-center space-x-2.5">
            ${member.avatarUrl 
              ? `<img src="${member.avatarUrl}" class="w-9 h-9 rounded-full border-2 border-amber-400 object-cover" />`
              : `<div class="w-9 h-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center text-base">${member.badgeText || member.relation[0]}</div>`
            }
            <div>
              <strong class="text-sm font-bold text-slate-900 block">${member.name}</strong>
              <span class="text-[11px] text-amber-700 font-semibold">${member.relation} • Battery: ${member.batteryLevel}%</span>
            </div>
          </div>
          <div class="bg-slate-50 p-2 rounded-lg border border-slate-100 text-slate-700">
            <div class="font-medium text-[11px]">📍 ${member.locationNote}</div>
            <div class="text-[10px] text-slate-400 mt-1">Status: ${member.status.toUpperCase()} • Ping: ${member.lastSeenTime}</div>
          </div>
          <button 
            onclick="window.__navigateToFamilyMember && window.__navigateToFamilyMember('${member.id}')"
            class="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow transition-colors flex items-center justify-center gap-1.5"
          >
            <span>🧭</span>
            <span>Navigate to ${member.name.split(' ')[0]}</span>
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);
      familyLayerRef.current?.addLayer(marker);
    });
  }, [familyMembers]);

  // Expose global callback for popup navigation
  useEffect(() => {
    (window as any).__navigateToFamilyMember = (memberId: string) => {
      const found = familyMembers.find(m => m.id === memberId);
      if (found) {
        navigateToPlace({
          id: found.id,
          name: `${found.name} (${found.relation})`,
          category: 'temple',
          lat: found.lat,
          lng: found.lng,
          locationName: found.locationNote,
          description: `Live family member location. Battery: ${found.batteryLevel}%.`,
          facilities: ['Live Family Pin', 'Battery: ' + found.batteryLevel + '%'],
          accessibility: {
            wheelchairAccessible: true,
            hasRamps: true,
            hasStairsOnly: false,
            elderlyFriendlyScore: 8,
            accessibilityNotes: 'Direct low-crowd rendezvous route.'
          },
          openStatus: 'open',
          openHours: '24/7 Live Tracking',
          currentCrowdLevel: 'LOW',
          currentWaitMinutes: 0
        });
      }
    };
    return () => {
      delete (window as any).__navigateToFamilyMember;
    };
  }, [familyMembers, navigateToPlace]);

  // 2. Render Crowd Zones Layer
  useEffect(() => {
    if (!crowdLayerRef.current) return;
    crowdLayerRef.current.clearLayers();

    if (!showCrowdLayer) return;

    crowdZones.forEach(zone => {
      // Color based on density risk
      let strokeColor = '#10B981'; // Green
      let fillColor = '#34D399';
      if (zone.risk === 'CRITICAL' || zone.density > 80) {
        strokeColor = '#DC2626'; // Red
        fillColor = '#EF4444';
      } else if (zone.risk === 'HIGH' || zone.density > 60) {
        strokeColor = '#D97706'; // Amber
        fillColor = '#F59E0B';
      } else if (zone.risk === 'MODERATE' || zone.density > 30) {
        strokeColor = '#2563EB'; // Blue
        fillColor = '#60A5FA';
      }

      const circle = L.circle([zone.lat, zone.lng], {
        radius: zone.radiusMeters,
        color: strokeColor,
        weight: 2,
        fillColor: fillColor,
        fillOpacity: zone.density > 80 ? 0.35 : 0.22,
        dashArray: zone.density > 80 ? '4, 4' : undefined
      });

      const popupHtml = `
        <div class="text-xs p-1 space-y-1 font-sans">
          <div class="flex items-center justify-between gap-2">
            <strong class="text-slate-900 text-sm font-bold">${zone.name}</strong>
            <span class="text-[10px] px-1.5 py-0.5 rounded font-bold ${
              zone.density > 80 ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'
            }">${zone.density}% (${zone.risk})</span>
          </div>
          <p class="text-slate-600">Simulated Pilgrims: <strong>${zone.activePilgrimsEstimate.toLocaleString()}</strong></p>
          <div class="text-[10px] text-amber-700 bg-amber-50 p-1 rounded font-medium">
            Simulated / Demo Crowd Data Layer
          </div>
        </div>
      `;

      circle.bindPopup(popupHtml);
      crowdLayerRef.current?.addLayer(circle);
    });
  }, [crowdZones, showCrowdLayer]);

  // 3. Render Custom Place Markers
  useEffect(() => {
    if (!markersLayerRef.current) return;
    markersLayerRef.current.clearLayers();

    if (!showFacilities) return;

    // Filter places based on chip
    const filteredPlaces = places.filter(p => {
      if (activeCategory === 'all') return true;
      if (activeCategory === 'temple') return p.category === 'temple';
      if (activeCategory === 'ghat') return p.category === 'ghat';
      if (activeCategory === 'medical') return p.category === 'medical';
      if (activeCategory === 'toilet') return p.category === 'toilet';
      if (activeCategory === 'water') return p.category === 'water';
      if (activeCategory === 'food') return p.category === 'food';
      if (activeCategory === 'parking') return p.category === 'parking';
      if (activeCategory === 'stay') return p.category === 'accommodation';
      if (activeCategory === 'emergency') return p.category === 'police' || p.category === 'medical';
      return true;
    });

    // Helper for marker colors & icons
    const getCategoryStyles = (category: PlaceCategory) => {
      switch (category) {
        case 'temple':
          return { bg: '#EA580C', icon: '🛕' };
        case 'ghat':
          return { bg: '#0284C7', icon: '🌊' };
        case 'medical':
          return { bg: '#DC2626', icon: '🏥' };
        case 'police':
          return { bg: '#475569', icon: '👮' };
        case 'toilet':
          return { bg: '#0D9488', icon: '🚻' };
        case 'water':
          return { bg: '#2563EB', icon: '💧' };
        case 'food':
          return { bg: '#D97706', icon: '🍽️' };
        case 'parking':
          return { bg: '#4F46E5', icon: '🅿️' };
        case 'accommodation':
          return { bg: '#7C3AED', icon: '🏨' };
        case 'transport':
          return { bg: '#059669', icon: '🚌' };
        default:
          return { bg: '#64748B', icon: '📍' };
      }
    };

    filteredPlaces.forEach(place => {
      const style = getCategoryStyles(place.category);
      const isCurrentlySelected = drawerPlace?.id === place.id;

      const markerHtml = `
        <div class="relative cursor-pointer transition-transform hover:scale-125 ${isCurrentlySelected ? 'scale-125 z-30' : ''}">
          <div style="background-color: ${style.bg};" class="w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-md border-2 border-white">
            ${style.icon}
          </div>
          ${isCurrentlySelected ? '<div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-saffron-600 rotate-45"></div>' : ''}
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      marker.on('click', () => {
        setSelectedPlace(place);
        setDrawerPlace(place);
      });

      markersLayerRef.current?.addLayer(marker);
    });

    // Render User GPS / MET Bhujbal location marker
    if (origin) {
      const isMet = origin.name.includes('MET Bhujbal');
      const userMarkerHtml = `
        <div class="relative cursor-pointer transition-transform hover:scale-125">
          <div class="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-xl border-2 border-white ring-4 ring-blue-300/70 animate-pulse">
            <span class="text-sm">📍</span>
          </div>
          <div class="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap border border-slate-700">
            ${origin.isLiveGps ? 'You (Live GPS)' : isMet ? 'MET Bhujbal Campus' : origin.name}
          </div>
        </div>
      `;
      const userIcon = L.divIcon({
        html: userMarkerHtml,
        className: 'user-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      const userMarker = L.marker([origin.lat, origin.lng], { icon: userIcon });
      userMarker.bindPopup(`
        <div class="text-xs p-1">
          <strong class="text-blue-700 font-bold block">${origin.name}</strong>
          <p class="text-slate-600 mt-0.5">Your starting location for Kumbh Mela pilgrimage navigation.</p>
        </div>
      `);
      markersLayerRef.current?.addLayer(userMarker);
    }
  }, [places, activeCategory, showFacilities, drawerPlace, origin]);

  // 4. Render Navigation Path Polylines (if in navigation view)
  useEffect(() => {
    if (!routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    if (!showNavigationPath || routes.length === 0) return;

    routes.forEach(route => {
      const isSelected = route.id === selectedRouteId;
      const isSurgingRamKund = route.crowdLevel === 'CRITICAL';

      let routeColor = '#64748B'; // Default grey for unselected
      let routeWeight = 4;
      let routeOpacity = 0.5;

      if (isSelected) {
        routeWeight = 7;
        routeOpacity = 0.95;
        if (isSurgingRamKund) {
          routeColor = '#DC2626'; // Bright Red for congested Route A
        } else if (route.id === 'route-b') {
          routeColor = '#10B981'; // Emerald Green for recommended Route B
        } else {
          routeColor = '#EA580C'; // Saffron Orange for active
        }
      }

      const polyline = L.polyline(route.pathCoordinates, {
        color: routeColor,
        weight: routeWeight,
        opacity: routeOpacity,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: !isSelected ? '6, 8' : undefined
      });

      routeLayerRef.current?.addLayer(polyline);
    });

    // Fit map bounds to show route
    const activeRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
    if (activeRoute && mapInstanceRef.current) {
      const bounds = L.latLngBounds(activeRoute.pathCoordinates);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [routes, selectedRouteId, showNavigationPath]);

  // Quick Center Helper
  const handleRecenter = (lat: number, lng: number, zoom = 16) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], zoom, { animate: true });
    }
  };

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All', icon: '📍' },
    { id: 'food', label: 'Restaurants', icon: '🍽️' },
    { id: 'stay', label: 'Places to Stay', icon: '🏨' },
    { id: 'temple', label: 'Temples', icon: '🛕' },
    { id: 'ghat', label: 'Ghats', icon: '🌊' },
    { id: 'water', label: 'Water', icon: '💧' },
    { id: 'medical', label: 'Medical', icon: '🏥' },
    { id: 'parking', label: 'Parking', icon: '🅿️' },
    { id: 'toilet', label: 'Toilets', icon: '🚻' },
    { id: 'emergency', label: 'Emergency', icon: '🚨' }
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-100 overflow-hidden">
      
      {/* Top Filter Chips Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center justify-between gap-2">
          
          {/* Scrollable Filter Chips */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 max-w-[calc(100%-140px)] pointer-events-auto scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shadow-md transition-all ${
                  activeCategory === cat.id
                    ? 'bg-slate-900 text-white scale-105'
                    : 'bg-white/95 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Layer Toggles & View Controls */}
          <div className="flex items-center space-x-1.5 pointer-events-auto">
            <button
              onClick={() => {
                trackLiveLocation();
                if (origin) handleRecenter(origin.lat, origin.lng, 15);
              }}
              className={`text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-md border flex items-center space-x-1 transition-all ${
                isTrackingLive 
                  ? 'bg-blue-600 text-white border-blue-700 animate-pulse' 
                  : 'bg-white text-blue-700 border-blue-200 hover:bg-blue-50'
              }`}
              title="Track My Location / MET Bhujbal Campus"
            >
              <span>📍</span>
              <span className="hidden sm:inline">Track Me</span>
            </button>

            <button
              onClick={() => setShowCrowdLayer(!showCrowdLayer)}
              className={`text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-md border flex items-center space-x-1 transition-all ${
                showCrowdLayer 
                  ? 'bg-amber-500 text-white border-amber-600' 
                  : 'bg-white text-slate-600 border-slate-200'
              }`}
              title="Toggle Crowd Density Overlay"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Crowd</span>
            </button>

            <button
              onClick={() => handleRecenter(defaultLat, defaultLng)}
              className="bg-white hover:bg-slate-50 text-slate-700 p-2 rounded-xl shadow-md border border-slate-200"
              title="Recenter Ram Kund"
            >
              <Crosshair className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Floating Simulated Crowd Legend Strip */}
        {showCrowdLayer && (
          <div className="self-start pointer-events-auto bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-md border border-slate-200 flex items-center space-x-3 text-[11px]">
            <div className="flex items-center space-x-1 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              <span>Simulated Density:</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-600 font-medium">0–30% Low</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-slate-600 font-medium">31–60% Mod</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="text-slate-600 font-medium">61–80% High</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping" />
                <span className="text-rose-700 font-bold">81%+ Critical</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Map Canvas Container */}
      <div 
        ref={mapContainerRef} 
        className={`w-full ${compactHeight ? 'h-72' : 'h-full flex-1'}`}
      />

      {/* Bottom Info Drawer for Selected Place */}
      {drawerPlace && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 animate-in fade-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto">
          
          {/* Place Photo Banner */}
          <div className="relative h-44 -mx-4 -mt-4 mb-3 rounded-t-2xl overflow-hidden bg-slate-900 shadow-inner">
            <img
              src={drawerPlace.imageUrl || getCategoryFallbackImage(drawerPlace.category)}
              alt={drawerPlace.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const fallback = getCategoryFallbackImage(drawerPlace.category);
                if (target.src !== fallback) {
                  target.src = fallback;
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/30" />
            <div className="absolute bottom-2 left-3 right-3 text-white text-xs font-semibold drop-shadow flex items-center justify-between">
              <span className="truncate">{drawerPlace.locationName}</span>
              <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded-full backdrop-blur border border-white/20">
                📷 Verified Image
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 capitalize">
                  {drawerPlace.category}
                </span>
                <CrowdBadge level={drawerPlace.currentCrowdLevel} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                {drawerPlace.name}
              </h3>
              {drawerPlace.marathiName && (
                <p className="text-xs text-saffron-700 font-medium font-serif">
                  {drawerPlace.marathiName}
                </p>
              )}
            </div>
            <button
              onClick={() => setDrawerPlace(null)}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2">
            {drawerPlace.description}
          </p>

          {/* Facilities Badges */}
          <div className="mt-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Available Facilities:
            </span>
            <div className="flex flex-wrap gap-1 mt-1">
              {drawerPlace.facilities.map((fac, idx) => (
                <span
                  key={idx}
                  className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                >
                  ✓ {fac}
                </span>
              ))}
            </div>
          </div>

          {/* Elderly / Accessibility Notice */}
          <div className="mt-2.5 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start space-x-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Accessibility: </span>
              {drawerPlace.accessibility.accessibilityNotes}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex items-center space-x-2">
            <button
              onClick={() => navigateToPlace(drawerPlace)}
              className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white font-bold py-2 px-4 rounded-xl text-sm shadow-md flex items-center justify-center space-x-2 active:scale-95 transition-all"
            >
              <Navigation className="w-4 h-4" />
              <span>Navigate Here</span>
            </button>

            <button
              onClick={() => {
                handleRecenter(drawerPlace.lat, drawerPlace.lng, 17);
              }}
              className="px-3 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs flex items-center space-x-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Center</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
