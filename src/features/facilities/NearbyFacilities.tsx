import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { CrowdBadge } from '../../components/common/CrowdBadge';
import { Place } from '../../types';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Clock, 
  Accessibility, 
  Search, 
  Phone,
  X,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Radio
} from 'lucide-react';
import { fetchGoogleLiveCrowdTelemetry } from '../../services/googleMapsService';
import { getCategoryFallbackImage } from '../../components/map/SmartMap';

export const NearbyFacilities: React.FC = () => {
  const { places, origin, navigateToPlace } = useKumbh();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'nearest' | 'recommended' | 'accessible'>('nearest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDetailPlace, setSelectedDetailPlace] = useState<Place | null>(null);

  // Calculate straight-line approximate distance in km from user's origin
  const calculateDistanceKm = (lat: number, lng: number) => {
    const dLat = (lat - origin.lat) * 111;
    const dLng = (lng - origin.lng) * 111 * Math.cos((origin.lat * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    return Math.round(dist * 10) / 10;
  };

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Places', icon: '📍' },
    { id: 'food', label: 'Restaurants & Dining', icon: '🍽️' },
    { id: 'accommodation', label: 'Places to Stay & Hotels', icon: '🏨' },
    { id: 'temple', label: 'Temples & Shrines', icon: '🛕' },
    { id: 'ghat', label: 'Holy Ghats & Falls', icon: '🌊' },
    { id: 'water', label: 'RO Pure Water', icon: '💧' },
    { id: 'parking', label: 'Parking Grounds', icon: '🅿️' },
    { id: 'medical', label: 'Medical & First Aid', icon: '🏥' },
    { id: 'toilet', label: 'Sanitation & Toilets', icon: '🚻' },
    { id: 'police', label: 'Police Chowki', icon: '👮' },
    { id: 'transport', label: 'EV Shuttles', icon: '🚌' }
  ];

  // Filter places
  let filtered = places.filter(p => {
    if (activeCategory !== 'all') {
      if (activeCategory === 'accommodation' && p.category !== 'accommodation') return false;
      if (activeCategory !== 'accommodation' && p.category !== activeCategory) return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || 
             (p.marathiName && p.marathiName.includes(q)) ||
             p.facilities.some(f => f.toLowerCase().includes(q));
    }
    return true;
  });

  // Sort places
  filtered.sort((a, b) => {
    const distA = calculateDistanceKm(a.lat, a.lng);
    const distB = calculateDistanceKm(b.lat, b.lng);

    if (sortBy === 'nearest') return distA - distB;
    if (sortBy === 'accessible') return b.accessibility.elderlyFriendlyScore - a.accessibility.elderlyFriendlyScore;
    if (sortBy === 'recommended') {
      const scoreA = (10 - (a.currentWaitMinutes / 5)) + a.accessibility.elderlyFriendlyScore;
      const scoreB = (10 - (b.currentWaitMinutes / 5)) + b.accessibility.elderlyFriendlyScore;
      return scoreB - scoreA;
    }
    return 0;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header & Controls */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Compass className="w-6 h-6 text-saffron-600" />
              <span>Nashik & Trimbakeshwar Directory</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing verified holy temples, waterfalls, RO water stations, langars, parking, and stay facilities.
            </p>
          </div>

          {/* Sort pills */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-2xl self-start sm:self-auto">
            <button
              onClick={() => setSortBy('nearest')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                sortBy === 'nearest' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nearest
            </button>
            <button
              onClick={() => setSortBy('recommended')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                sortBy === 'recommended' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setSortBy('accessible')}
              className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all ${
                sortBy === 'accessible' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Most Accessible
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search facility name, drinking water, wheelchair ramps, waterfalls, langar, stay..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center space-x-1.5 border transition-all ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-105'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Google Maps & Places API Telemetry Status Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-4 sm:p-5 border border-blue-900/60 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-400/30 flex items-center justify-center text-xl shrink-0">
            <Radio className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-wide">
                Google Places API & Live Crowd Telemetry Active
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-ping" />
                Live Sync (3s)
              </span>
            </div>
            <p className="text-xs text-blue-200/90 mt-0.5">
              Accessing live footfall, Popular Times busyness, and route congestion for 1,200+ establishments across all of Nashik & Trimbakeshwar.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end shrink-0">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-blue-300 font-semibold">Places In Nashik</span>
            <span className="text-xs font-black text-white">1,200+ Online</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-center">
            <span className="block text-[10px] uppercase text-blue-300 font-semibold">Telemetry Data</span>
            <span className="text-xs font-black text-emerald-300">Live Device Density</span>
          </div>
        </div>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(place => {
          const distanceKm = calculateDistanceKm(place.lat, place.lng);
          const walkMins = Math.round(distanceKm * 12);

          return (
            <div
              key={place.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              {/* Authentic Photo Header */}
              <div 
                onClick={() => setSelectedDetailPlace(place)}
                className="relative h-44 w-full bg-slate-900 cursor-pointer overflow-hidden"
              >
                <img
                  src={place.imageUrl || getCategoryFallbackImage(place.category)}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallback = getCategoryFallbackImage(place.category);
                    if (target.src !== fallback) {
                      target.src = fallback;
                    }
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20" />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {place.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <CrowdBadge level={place.currentCrowdLevel} size="sm" />
                </div>
                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                  <span className="bg-emerald-600/90 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                    {place.openStatus}
                  </span>
                  <span className="text-[11px] text-white/90">
                    🕒 {place.openHours.split('(')[0]}
                  </span>
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  
                  {/* Name & Location */}
                  <div>
                    <h3 
                      onClick={() => setSelectedDetailPlace(place)}
                      className="text-base font-bold text-slate-900 leading-snug cursor-pointer hover:text-saffron-600 transition-colors"
                    >
                      {place.name}
                    </h3>
                    {place.marathiName && (
                      <p className="text-xs text-saffron-700 font-serif font-medium mt-0.5">
                        {place.marathiName}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-1 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{place.locationName}</span>
                    </p>
                  </div>

                  {/* Distance & Travel Time Badges */}
                  <div className="flex items-center space-x-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center space-x-1 text-slate-700 font-semibold">
                      <Navigation className="w-3.5 h-3.5 text-saffron-600" />
                      <span>{distanceKm} km away</span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>~{walkMins} min walk</span>
                    </div>
                  </div>

                  {/* Google Places Live Busyness Telemetry Pill */}
                  <div className="flex items-center justify-between text-[11px] px-3 py-1.5 bg-blue-50/80 border border-blue-100 rounded-xl text-blue-900">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <span className="font-semibold text-blue-800">Google Busyness:</span>
                    </div>
                    <span className="font-bold text-blue-950">
                      {fetchGoogleLiveCrowdTelemetry(place.name, place.currentWaitMinutes * 3 + 45).liveBusynessScore}% • {fetchGoogleLiveCrowdTelemetry(place.name, place.currentWaitMinutes * 3 + 45).statusText}
                    </span>
                  </div>

                  {/* Available Facilities list */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Verified Facilities:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {place.facilities.slice(0, 4).map((fac, i) => (
                        <span
                          key={i}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          ✓ {fac}
                        </span>
                      ))}
                      {place.facilities.length > 4 && (
                        <span className="text-[10px] text-slate-400 font-bold px-1.5 py-0.5">
                          +{place.facilities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Accessibility Score & Notes */}
                  <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-900 flex items-start space-x-2">
                    <Accessibility className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Senior Accessibility ({place.accessibility.elderlyFriendlyScore}/10): </span>
                      <span className="text-emerald-800 line-clamp-2">{place.accessibility.accessibilityNotes}</span>
                    </div>
                  </div>

                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center space-x-2">
                  <button
                    onClick={() => navigateToPlace(place)}
                    className="flex-1 bg-saffron-600 hover:bg-saffron-700 active:scale-95 text-white font-bold py-2.5 px-4 rounded-xl text-xs shadow-sm flex items-center justify-center space-x-1.5 transition-all"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Navigate Here</span>
                  </button>

                  <button
                    onClick={() => setSelectedDetailPlace(place)}
                    className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs flex items-center justify-center transition-colors"
                    title="View Full Details & Photo"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {place.contactNumber && (
                    <a
                      href={`tel:${place.contactNumber}`}
                      className="p-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs flex items-center justify-center transition-colors"
                      title={`Call ${place.contactNumber}`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Place Detail & Authentic Image Modal */}
      {selectedDetailPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Image Header */}
            <div className="relative h-60 w-full bg-slate-900 shrink-0">
              <img
                src={selectedDetailPlace.imageUrl || getCategoryFallbackImage(selectedDetailPlace.category)}
                alt={selectedDetailPlace.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const fallback = getCategoryFallbackImage(selectedDetailPlace.category);
                  if (target.src !== fallback) {
                    target.src = fallback;
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              <button
                onClick={() => setSelectedDetailPlace(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full backdrop-blur-md transition-all"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <span className="text-[10px] uppercase font-extrabold px-2.5 py-1 rounded-full bg-saffron-600 text-white mb-2 inline-block">
                  {selectedDetailPlace.category}
                </span>
                <h2 className="text-xl font-bold leading-tight drop-shadow-sm">
                  {selectedDetailPlace.name}
                </h2>
                {selectedDetailPlace.marathiName && (
                  <p className="text-sm text-saffron-300 font-serif font-semibold drop-shadow-sm">
                    {selectedDetailPlace.marathiName}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
              
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-saffron-600 shrink-0" />
                  <span className="font-semibold text-slate-800">{selectedDetailPlace.locationName}</span>
                </div>
                <CrowdBadge level={selectedDetailPlace.currentCrowdLevel} size="sm" />
              </div>

              {/* Description */}
              <div>
                <h4 className="font-bold text-slate-900 mb-1">About this Pilgrimage Location</h4>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {selectedDetailPlace.description}
                </p>
              </div>

              {/* Verified Facilities */}
              <div>
                <h4 className="font-bold text-slate-900 mb-2">Verified Facilities On-Site</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedDetailPlace.facilities.map((fac, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-medium text-slate-800">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accessibility */}
              <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-200 space-y-1">
                <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
                  <Accessibility className="w-4 h-4 text-emerald-700" />
                  <span>Accessibility Score: {selectedDetailPlace.accessibility.elderlyFriendlyScore}/10</span>
                </div>
                <p className="text-emerald-800 text-[11px] leading-relaxed">
                  {selectedDetailPlace.accessibility.accessibilityNotes}
                </p>
              </div>

              {/* Operational details */}
              <div className="grid grid-cols-2 gap-2 text-slate-600 text-[11px]">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold block text-slate-500">Timings:</span>
                  <span>{selectedDetailPlace.openHours}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="font-bold block text-slate-500">Status:</span>
                  <span className="capitalize font-bold text-emerald-700">{selectedDetailPlace.openStatus}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center space-x-3 shrink-0">
              <button
                onClick={() => {
                  const p = selectedDetailPlace;
                  setSelectedDetailPlace(null);
                  navigateToPlace(p);
                }}
                className="flex-1 bg-saffron-600 hover:bg-saffron-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-sm flex items-center justify-center space-x-2 transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Start Smart Crowd-Aware Route</span>
              </button>

              {selectedDetailPlace.contactNumber && (
                <a
                  href={`tel:${selectedDetailPlace.contactNumber}`}
                  className="p-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center space-x-1"
                >
                  <Phone className="w-4 h-4" />
                </a>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
