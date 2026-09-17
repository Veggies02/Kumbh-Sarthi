import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { SmartMap } from '../../components/map/SmartMap';
import { CrowdBadge } from '../../components/common/CrowdBadge';
import { 
  Navigation, 
  Sparkles, 
  Search, 
  MapPin, 
  AlertTriangle, 
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Waves
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    setActiveTab, 
    crowdZones, 
    places, 
    navigateToPlace,
    setInitialAssistantPrompt,
    t
  } = useKumbh();

  const [naturalSearchQuery, setNaturalSearchQuery] = useState('');

  const ramKundZone = crowdZones.find(z => z.id === 'ram-kund');
  const ramKundDensity = ramKundZone ? ramKundZone.density : 45;

  const quickActions = [
    { label: t('findTemple'), icon: '🛕', category: 'temple', color: 'bg-orange-50 border-orange-200 text-orange-900' },
    { label: t('findGhat'), icon: '🌊', category: 'ghat', color: 'bg-sky-50 border-sky-200 text-sky-900' },
    { label: t('findMedical'), icon: '🏥', category: 'medical', color: 'bg-red-50 border-red-200 text-red-900' },
    { label: t('findParking'), icon: '🅿️', category: 'parking', color: 'bg-indigo-50 border-indigo-200 text-indigo-900' },
    { label: t('findFood'), icon: '🍲', category: 'food', color: 'bg-amber-50 border-amber-200 text-amber-900' },
    { label: t('findToilets'), icon: '🚻', category: 'toilet', color: 'bg-teal-50 border-teal-200 text-teal-900' },
    { label: t('findStay'), icon: '🏨', category: 'accommodation', color: 'bg-purple-50 border-purple-200 text-purple-900' },
    { label: t('emergencySos'), icon: '🚨', isEmergency: true, color: 'bg-rose-50 border-rose-300 text-rose-900 font-bold' }
  ];

  const sampleSearchQueries = [
    'Ram Kund jaana hai',
    'I have 3 hours and I\'m travelling with my parents. Plan my pilgrimage.',
    'Find a less crowded route to the ghat',
    'Nearest drinking water and clean toilet'
  ];

  const handleNaturalSearchSubmit = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = customQuery || naturalSearchQuery;
    if (!query.trim()) return;

    const qLower = query.toLowerCase();
    // Check if query exactly matches a single place
    const matchedPlace = places.find(p => 
      qLower === p.name.toLowerCase() || 
      (p.marathiName && query.includes(p.marathiName))
    );

    if (matchedPlace) {
      navigateToPlace(matchedPlace);
      return;
    }

    if (qLower === 'ram kund jaana hai' || qLower === 'ram kund') {
      const ramKund = places.find(p => p.id === 'ram-kund');
      if (ramKund) {
        navigateToPlace(ramKund);
        return;
      }
    }

    // Otherwise route to AI Assistant with auto-execution prompt
    setInitialAssistantPrompt(query);
    setActiveTab('assistant');
  };

  return (
    <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white p-6 sm:p-10 shadow-xl">
        {/* Subtle decorative background motif */}
        <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none text-9xl select-none">
          🕉️
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-saffron-500/20 border border-saffron-400/40 text-saffron-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kumbh Mela 2026 • Nashik & Trimbakeshwar</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t('appName')}
            <span className="block text-xl sm:text-2xl font-normal text-saffron-300 mt-1 font-serif">
              {t('tagline')}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
            {t('heroDesc')}
          </p>

          {/* Primary & Secondary Call to Actions */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('map')}
              className="bg-saffron-600 hover:bg-saffron-700 active:scale-95 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-2 text-sm sm:text-base"
            >
              <MapPin className="w-4 h-4" />
              <span>{t('exploreMapBtn')}</span>
            </button>

            <button
              onClick={() => setActiveTab('itinerary')}
              className="bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold px-6 py-3 rounded-xl border border-white/20 backdrop-blur transition-all flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>{t('planPilgrimageBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Core Differentiator Banner */}
          <div className="pt-3 border-t border-white/10 text-xs text-slate-300 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-saffron-400 shrink-0" />
            <span>
              <strong>Crowd-Aware vs Regular Maps:</strong> We compare distance, accessibility, and live density to guide elderly and families away from chokepoints.
            </span>
          </div>
        </div>
      </section>

      {/* "How can we help?" Natural-Language Prompt Bar */}
      <section className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="w-4 h-4 text-saffron-600" />
          <h2 className="text-base font-bold text-slate-900">
            {t('howCanWeHelp')}
          </h2>
        </div>

        <form onSubmit={handleNaturalSearchSubmit} className="relative">
          <input
            type="text"
            value={naturalSearchQuery}
            onChange={(e) => setNaturalSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-24 py-3.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent transition-all"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all"
          >
            {t('askAiBtn')}
          </button>
        </form>

        {/* Quick query chips */}
        <div className="flex flex-wrap items-center gap-2 mt-3 text-xs text-slate-500">
          <span className="font-semibold text-slate-400">{t('tryAsking')}</span>
          {sampleSearchQueries.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleNaturalSearchSubmit(undefined, sample)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors"
            >
              "{sample}"
            </button>
          ))}
        </div>
      </section>

      {/* Quick Action Grid */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">
            Essential Facilities & Quick Discovery
          </h2>
          <button
            onClick={() => setActiveTab('facilities')}
            className="text-xs font-semibold text-saffron-700 hover:text-saffron-800 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (action.isEmergency) {
                  setActiveTab('emergency');
                } else {
                  setActiveTab('facilities');
                }
              }}
              className={`flex items-center space-x-3 p-3.5 rounded-xl border shadow-sm hover:shadow-md transition-all text-left ${action.color} active:scale-95`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="text-xs sm:text-sm font-semibold leading-snug">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Interactive Map Preview Section */}
      <section className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-slate-900">
                Live Interactive Map Preview
              </h2>
              <CrowdBadge level={ramKundDensity > 80 ? 'CRITICAL' : ramKundDensity > 60 ? 'HIGH' : 'MODERATE'} density={ramKundDensity} />
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Nashik Panchavati & Ram Kund zone (Simulated Crowd Heatmap Layer enabled)
            </p>
          </div>

          <button
            onClick={() => setActiveTab('map')}
            className="self-start sm:self-auto bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center space-x-1.5 shadow-sm"
          >
            <span>Expand Full Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
          <SmartMap />
        </div>
      </section>

      {/* Key Pilgrimage Guiding Principles */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
            <Waves className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Holy Bathing Guidance</h3>
          <p className="text-xs text-slate-600">
            Ram Kund has designated Gate 3 ramps with safety railings. For seniors, Kapila Sangam offers calm, shallow waters with zero steep steps.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Senior & Accessibility Care</h3>
          <p className="text-xs text-slate-600">
            Select "Elderly" mode to avoid foot-over-bridge bottlenecks, stairs-only pathways, and discover complimentary golf cart transits.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-slate-900">Instant One-Touch SOS</h3>
          <p className="text-xs text-slate-600">
            Emergency medical units with ICU beds, oxygen, and lost & found announcements can be reached immediately via the red SOS button.
          </p>
        </div>
      </section>

    </div>
  );
};
