import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { SmartMap } from '../../components/map/SmartMap';
import { CrowdBadge } from '../../components/common/CrowdBadge';
import { TravelPersona, RoutePreference, Place } from '../../types';
import { 
  Navigation, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Sparkles,
  Zap,
  Scale,
  Volume2,
  VolumeX
} from 'lucide-react';

export const SmartNavigation: React.FC = () => {
  const {
    places,
    origin,
    destination,
    setDestination,
    persona,
    setPersona,
    preference,
    setPreference,
    routes,
    selectedRouteId,
    setSelectedRouteId,
    isSurgeActive,
    toggleCrowdSurge,
    setOriginPreset,
    trackLiveLocation,
    isTrackingLive,
    language,
    t
  } = useKumbh();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [navigationStarted, setNavigationStarted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Play realistic two-tone police radio walkie-talkie chime (Web Audio API)
  const playPoliceRadioChime = (): Promise<void> => {
    return new Promise((resolve) => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) {
          resolve();
          return;
        }
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        
        // Tone 1: 880 Hz (A5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.18);

        // Tone 2: 587.33 Hz (D5)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(587.33, now + 0.2);
        gain2.gain.setValueAtTime(0.2, now + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.2);
        osc2.stop(now + 0.45);

        setTimeout(() => resolve(), 480);
      } catch {
        resolve();
      }
    });
  };

  const playVoiceAnnouncement = async () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    // 1. Play realistic police radio chime first
    await playPoliceRadioChime();

    // 2. Discover available system voices
    const voices = window.speechSynthesis.getVoices();
    const mrVoice = voices.find(v => v.lang.startsWith('mr') || v.name.toLowerCase().includes('marathi'));
    const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'));
    const inVoice = voices.find(v => v.lang.includes('IN') || v.name.toLowerCase().includes('india'));
    const defaultVoice = inVoice || voices[0];

    let textToSpeak = '';
    let chosenVoice = defaultVoice;
    let chosenLang = 'en-US';

    if (language === 'mr') {
      if (mrVoice) {
        textToSpeak = 'सावधान भाविकांनो! रामकुंड घाटावर गर्दीची पातळी ९२ टक्के झाली आहे. कृपया चेंगराचेंगरी टाळण्यासाठी पोलीस प्रशासनाने दिलेल्या पर्यायी मार्ग ब, गोदावरी प्रॉमनेडचा वापर करावा.';
        chosenVoice = mrVoice;
        chosenLang = mrVoice.lang;
      } else if (hiVoice) {
        textToSpeak = 'सावधान भाविकांनो! रामकुंड घाटावर गर्दीची पातळी ९२ टक्के झाली आहे. कृपया चेंगराचेंगरी टाळण्यासाठी पोलीस प्रशासनाने दिलेल्या पर्यायी मार्ग ब, गोदावरी प्रॉमनेडचा वापर करावा.';
        chosenVoice = hiVoice;
        chosenLang = hiVoice.lang;
      } else {
        // Phonetic Marathi fallback for machines without installed Indic voice pack
        textToSpeak = 'Saavdhaan bhaavikaanno! Ram Kund ghaataavar gardi 92 percent zhaali aahe. Chakarachangari taalnyaasaathi krupaya paryaayi maarg B, Godavari Promenade chaa vaapar karaavaa.';
        chosenVoice = defaultVoice;
        chosenLang = defaultVoice?.lang || 'en-US';
      }
    } else if (language === 'hi') {
      if (hiVoice) {
        textToSpeak = 'कृपया ध्यान दें! रामकुंड घाट पर भीड़ ९२ प्रतिशत हो चुकी है। भगदड़ से बचने के लिए सभी श्रद्धालु वैकल्पिक मार्ग बी गोदावरी प्रॉमनेड का उपयोग करें।';
        chosenVoice = hiVoice;
        chosenLang = hiVoice.lang;
      } else {
        // Phonetic Hindi fallback for machines without installed Indic voice pack
        textToSpeak = 'Kripya dhyaan dein! Ram Kund ghaat par bheed 92 percent ho chuki hai. Bhagdad se bachne ke liye sabhi shradhhaalu kripya vikalpik maarg B, Godavari Promenade kaa upayog karein.';
        chosenVoice = defaultVoice;
        chosenLang = defaultVoice?.lang || 'en-US';
      }
    } else {
      textToSpeak = 'Attention pilgrims! Ram Kund has reached critical surge capacity of 92 percent. Police administration requests all devotees to follow Route B via Godavari Promenade for safe passage.';
      chosenVoice = inVoice || defaultVoice;
      chosenLang = 'en-US';
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      if (chosenVoice) utterance.voice = chosenVoice;
      utterance.lang = chosenLang;
      utterance.rate = 0.92;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsSpeaking(false);
    }
  };

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];

  const personas: { id: TravelPersona; label: string; icon: string; desc: string }[] = [
    { id: 'elderly', label: t('elderly'), icon: '🧓', desc: 'Prioritizes ramps, avoids stairs & high crowd' },
    { id: 'wheelchair', label: t('wheelchair'), icon: '♿', desc: '100% barrier-free paved paths' },
    { id: 'children', label: t('children'), icon: '🧒', desc: 'Low density, safe wide walkways' },
    { id: 'family', label: t('family'), icon: '👨‍👩‍👦', desc: 'Balanced pace with resting spots' },
    { id: 'solo', label: t('solo'), icon: '🚶', desc: 'Optimized for agility and speed' },
    { id: 'group', label: t('group'), icon: '👥', desc: 'Broad avenues to avoid splitting' }
  ];

  const preferences: { id: RoutePreference; label: string; desc: string }[] = [
    { id: 'least-crowded', label: t('leastCrowded'), desc: 'Avoids choke points' },
    { id: 'accessible', label: t('accessibleFirst'), desc: 'Step-free ramps & smooth terrain' },
    { id: 'fastest', label: t('fastest'), desc: 'Minimum total time' },
    { id: 'balanced', label: t('balanced'), desc: 'Optimal time vs comfort' }
  ];

  // Filter destination suggestions
  const filteredPlaces = places.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.marathiName && p.marathiName.includes(searchQuery))
  );

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col lg:flex-row overflow-hidden bg-slate-100">
      
      {/* Left Control & Route Comparison Panel */}
      <div className="w-full lg:w-[480px] xl:w-[520px] bg-white border-r border-slate-200 flex flex-col h-full z-20 shadow-md">
        
        {/* Destination & Origin Bar */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/70 space-y-3 shrink-0">
          
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <Navigation className="w-5 h-5 text-saffron-600" />
              <span>{t('navTitle')}</span>
            </h2>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              Crowd-Aware v2.0
            </span>
          </div>

          {/* Location Inputs */}
          <div className="space-y-2 relative">
            
            {/* Origin Selector Box with Live Location Tracker */}
            <div className="relative">
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-sm">
                <div 
                  onClick={() => setShowOriginDropdown(!showOriginDropdown)}
                  className="flex items-center space-x-2 flex-1 cursor-pointer truncate"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 animate-ping" />
                  <div className="truncate text-slate-700">
                    <span className="font-semibold text-slate-400 mr-1">{t('originLabel')}</span>
                    <strong className="text-slate-900">{origin.name}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => trackLiveLocation()}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center space-x-1 shrink-0 ml-1 ${
                    isTrackingLive 
                      ? 'bg-blue-600 text-white border-blue-700 animate-pulse' 
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
                  title="Track Live GPS Location"
                >
                  <span>📍</span>
                  <span>{isTrackingLive ? 'Tracking' : 'GPS'}</span>
                </button>
              </div>

              {/* Origin Switcher Dropdown */}
              {showOriginDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 z-50 divide-y divide-slate-100 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setOriginPreset('met-bhujbal');
                      setShowOriginDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">MET Bhujbal Knowledge City</div>
                      <div className="text-[10px] text-slate-500">Adgaon, Nashik (Campus Base)</div>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Selected Base</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOriginPreset('panchavati-stand');
                      setShowOriginDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Panchavati Malegaon Stand</div>
                      <div className="text-[10px] text-slate-500">Central Nashik Pilgrim Station</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setOriginPreset('tapovan-parking');
                      setShowOriginDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs hover:bg-blue-50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900">Tapovan Satellite Mega Parking P1</div>
                      <div className="text-[10px] text-slate-500">Long-distance transit terminal</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      trackLiveLocation();
                      setShowOriginDropdown(false);
                    }}
                    className="w-full px-3 py-2 text-left text-xs bg-blue-50/70 hover:bg-blue-100 text-blue-900 font-bold flex items-center space-x-1.5"
                  >
                    <span>🎯</span>
                    <span>Use Device GPS Live Coordinates</span>
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-xl border-2 border-saffron-500 text-xs shadow-sm">
                <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <input
                  type="text"
                  placeholder={t('destPlaceholder')}
                  value={destination ? destination.name : searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchDropdown(true);
                  }}
                  onFocus={() => setShowSearchDropdown(true)}
                  className="flex-1 bg-transparent text-slate-900 font-bold focus:outline-none placeholder:text-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Suggestions Dropdown */}
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-200 max-h-56 overflow-y-auto z-50 divide-y divide-slate-100">
                  {filteredPlaces.map(place => (
                    <button
                      key={place.id}
                      type="button"
                      onClick={() => {
                        setDestination(place);
                        setShowSearchDropdown(false);
                        setSearchQuery('');
                      }}
                      className="w-full px-3.5 py-2.5 text-left text-xs hover:bg-saffron-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900">{place.name}</div>
                        <div className="text-[11px] text-slate-500 capitalize">{place.category} • {place.locationName}</div>
                      </div>
                      <CrowdBadge level={place.currentCrowdLevel} size="sm" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Destination Preview Card with Authentic Photo */}
            {destination && (
              <div className="bg-white rounded-2xl p-2.5 border border-slate-200 shadow-xs flex items-center space-x-3">
                {destination.imageUrl ? (
                  <img
                    src={destination.imageUrl}
                    alt={destination.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-100 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl shrink-0">
                    🛕
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 truncate">{destination.name}</h3>
                    <CrowdBadge level={destination.currentCrowdLevel} size="sm" />
                  </div>
                  {destination.marathiName && (
                    <p className="text-[11px] text-saffron-700 font-serif font-semibold truncate">{destination.marathiName}</p>
                  )}
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{destination.locationName}</p>
                </div>
              </div>
            )}
          </div>

          {/* Traveling With (Persona) Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {t('travellingWith')}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {personas.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 border transition-all ${
                    persona === p.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title={p.desc}
                >
                  <span>{p.icon}</span>
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Route Preference Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              {t('routePriority')}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {preferences.map(pref => (
                <button
                  key={pref.id}
                  onClick={() => setPreference(pref.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold text-center border transition-all ${
                    preference === pref.id
                      ? 'bg-saffron-600 text-white border-saffron-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Route Comparison Cards (Scrollable) */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">

          {/* Google Maps Live Traffic & Busyness Telemetry Sync Bar */}
          <div className="flex items-center justify-between text-[11px] px-3 py-1.5 bg-blue-50/90 border border-blue-200/80 rounded-xl text-blue-950 shadow-sm">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold">Google Maps Telemetry:</span>
            </div>
            <span className="font-semibold text-blue-700">Live Traffic & Footfall Synced</span>
          </div>

          {/* Quick In-Situ Hackathon Surge Simulator */}
          <div className="p-3 bg-gradient-to-r from-purple-900 to-slate-900 rounded-2xl text-white text-xs shadow-md flex items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <Zap className={`w-4 h-4 shrink-0 ${isSurgeActive ? 'text-amber-400 animate-bounce' : 'text-purple-300'}`} />
              <div>
                <span className="font-extrabold block text-xs">Judge Live Surge Simulator</span>
                <span className="text-[10px] text-slate-300">
                  {isSurgeActive ? 'Ram Kund: 92% (CRITICAL SURGE)' : 'Ram Kund: 45% (Normal Flow)'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleCrowdSurge}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow ${
                isSurgeActive 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                  : 'bg-purple-600 hover:bg-purple-500 text-white'
              }`}
            >
              {isSurgeActive ? t('resetSurgeBtn') : t('simulateSurgeBtn')}
            </button>
          </div>
          
          {/* Surge Alert Banner */}
          {isSurgeActive && (
            <div className="p-3 bg-rose-50 border-2 border-rose-400 rounded-xl text-xs space-y-1 text-rose-900 animate-pulse">
              <div className="flex items-center space-x-2 font-bold text-rose-700">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>{t('simSurgeActive')}</span>
              </div>
              <p className="text-[11px] text-rose-800 leading-snug">
                {destination && (destination.id.includes('kund') || destination.id.includes('panchavati') || destination.id.includes('kalaram'))
                  ? `Direct corridor to ${destination.name} is severely congested (97%). Route B has been automatically prioritized to ensure safety.`
                  : destination && destination.id.includes('adgaon')
                  ? `Critical crowd surge active at Panchavati (92%). Note: Your local corridor to ${destination.name} in Adgaon is clear and unaffected.`
                  : `High congestion surge active in central sectors. Safe bypass route has been automatically prioritized.`}
              </p>

              {/* Police Public Address Voice Broadcast Button */}
              <div className="pt-2 flex flex-col space-y-2 border-t border-rose-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping mr-1" />
                    Police PA Broadcast:
                  </span>
                  <button
                    type="button"
                    onClick={playVoiceAnnouncement}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[11px] flex items-center space-x-1.5 shadow-sm transition-all ${
                      isSpeaking 
                        ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold ring-2 ring-amber-300' 
                        : 'bg-rose-600 hover:bg-rose-700 text-white'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-bounce" />}
                    <span>{isSpeaking ? 'Stop Broadcast' : '📢 Play Police Voice PA'}</span>
                  </button>
                </div>

                {isSpeaking && (
                  <div className="flex items-center justify-between px-3 py-1.5 bg-rose-100/90 border border-rose-300 rounded-xl text-[11px] font-semibold text-rose-900 shadow-inner animate-fadeIn">
                    <div className="flex items-center space-x-2">
                      <span className="inline-block w-2 h-2 rounded-full bg-rose-600 animate-ping shrink-0" />
                      <span className="truncate">
                        Transmitting ({language === 'mr' ? 'मराठी - Marathi' : language === 'hi' ? 'हिंदी - Hindi' : 'English'})...
                      </span>
                    </div>
                    {/* Live Equalizer Soundwave Animation */}
                    <div className="flex items-end space-x-1 h-3.5 shrink-0 pl-2">
                      <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_100ms] h-2" />
                      <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_300ms] h-3.5" />
                      <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_150ms] h-1.5" />
                      <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_400ms] h-3" />
                      <span className="w-1 bg-rose-600 rounded-full animate-[bounce_0.6s_infinite_200ms] h-2.5" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>{t('availableOptions')} ({routes.length})</span>
            <span className="text-saffron-700 font-bold">
              {persona === 'elderly' ? '👴 Elder Priority' : persona === 'wheelchair' ? '♿ Ramp Priority' : persona === 'children' ? '🧒 Child Safety' : persona === 'solo' ? '🚶 Speed Priority' : '⚖️ Balanced Priority'}
            </span>
          </div>

          {routes.map(route => {
            const isSelected = selectedRoute.id === route.id;
            const isRec = route.isRecommended;

            let cardBorder = isSelected ? 'border-2 border-saffron-500 bg-saffron-50/20' : 'border border-slate-200 bg-white';
            if (route.crowdLevel === 'CRITICAL') {
              cardBorder = isSelected ? 'border-2 border-rose-500 bg-rose-50/20' : 'border border-rose-200 bg-white';
            }

            return (
              <div
                key={route.id}
                onClick={() => setSelectedRouteId(route.id)}
                className={`p-4 rounded-2xl cursor-pointer transition-all shadow-sm hover:shadow-md ${cardBorder}`}
              >
                
                {/* Recommendation Pill */}
                {isRec && (
                  <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider mb-2 shadow-sm">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{t('recommendedForYou')} • {persona.toUpperCase()}</span>
                  </div>
                )}

                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{route.name}</h3>
                    <p className="text-xs text-slate-500">{route.subtitle}</p>
                  </div>
                  <CrowdBadge level={route.crowdLevel} density={route.crowdExposurePercent} />
                </div>

                {/* Primary Metrics: Distance & Duration */}
                <div className="grid grid-cols-3 gap-2 mt-3 p-2 bg-slate-50 rounded-xl text-center">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Distance</span>
                    <span className="text-sm font-extrabold text-slate-900">{route.distanceKm} km</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Time</span>
                    <span className="text-sm font-extrabold text-slate-900">{route.durationMinutes} min</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Accessibility</span>
                    <span className="text-sm font-extrabold text-emerald-700">{route.accessibilityScore}/10</span>
                  </div>
                </div>

                {/* Recommendation Rationale Callout */}
                <div className={`mt-3 p-2 rounded-xl text-xs flex items-start space-x-2 ${
                  isRec 
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium'
                    : 'bg-slate-50 border border-slate-200 text-slate-700'
                }`}>
                  <Sparkles className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isRec ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <div>
                    <span className="font-bold">{isRec ? 'Why this route: ' : 'Summary: '}</span>
                    {route.recommendationReason}
                  </div>
                </div>

                {/* Highlights & Warnings */}
                <div className="mt-2.5 space-y-1">
                  {route.highlights.map((hl, i) => (
                    <div key={i} className="text-[11px] text-slate-600 flex items-center space-x-1.5">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{hl}</span>
                    </div>
                  ))}
                  {route.warnings.map((warn, i) => (
                    <div key={i} className="text-[11px] text-rose-600 flex items-center space-x-1.5 font-medium">
                      <span className="font-bold">⚠️</span>
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>

                {/* Transparent Formula Breakdown */}
                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-[10px] text-slate-500 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-700">
                      <span>Multi-Factor Composite Score:</span>
                      <span className="font-mono">{route.scoringBreakdown.totalScore} pts (Lower is better)</span>
                    </div>
                    <p className="text-slate-400 italic">
                      Formula: (Time × W_time) + (Crowd × W_crowd) + Risk - (Accessibility × W_acc)
                    </p>
                  </div>
                )}

              </div>
            );
          })}

          {/* Core Innovation Differentiator Card */}
          <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2.5 shadow-sm text-xs border border-slate-800">
            <div className="flex items-center space-x-2 text-saffron-400 font-extrabold">
              <Scale className="w-4 h-4 text-saffron-400" />
              <span>Why Google Maps Fails at Kumbh Mela</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="bg-slate-800/90 p-2.5 rounded-xl border border-rose-900/50">
                <span className="text-rose-400 font-bold block mb-1">❌ Google Maps (Route A)</span>
                <p className="text-slate-300">
                  Routes blindly via shortest 1.8km bazaar road. Traps elderly in 25-min human gridlock with steep steps and no wheelchair ramps.
                </p>
              </div>
              <div className="bg-slate-800/90 p-2.5 rounded-xl border border-emerald-900/50">
                <span className="text-emerald-400 font-bold block mb-1">✓ Kumbh Saathi (Route B)</span>
                <p className="text-slate-300">
                  Selects 2.2km promenade (+4 min). 100% barrier-free ramps, 60% lower crowd density, continuous shade, and first aid stations.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Fixed Action Button */}
        <div className="p-4 border-t border-slate-200 bg-white shrink-0">
          <button
            onClick={() => setNavigationStarted(!navigationStarted)}
            className="w-full bg-saffron-600 hover:bg-saffron-700 active:scale-95 text-white font-bold py-3 px-4 rounded-xl shadow-lg flex items-center justify-center space-x-2 text-sm transition-all"
          >
            <Navigation className="w-4 h-4" />
            <span>{navigationStarted ? 'Exit Step-by-Step Guidance' : `Start Guidance via ${selectedRoute.name.split('—')[0]}`}</span>
          </button>
        </div>

      </div>

      {/* Right Map Canvas Panel with Route Overlay */}
      <div className="flex-1 h-full relative">
        <SmartMap showNavigationPath={true} />

        {/* Live HUD Floating on Map if Guidance Started */}
        {navigationStarted && (
          <div className="absolute bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-96 z-30 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in slide-in-from-bottom">
            <div className="flex items-center justify-between text-xs text-saffron-400 font-semibold mb-1">
              <span>ACTIVE PILGRIM NAVIGATION</span>
              <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">GPS Demo</span>
            </div>
            <div className="text-lg font-bold">
              Turn Right onto Shaded Riverwalk (Route B)
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center space-x-3">
              <span>In 80 meters</span>
              <span>•</span>
              <span>Remaining: {selectedRoute.distanceKm} km ({selectedRoute.durationMinutes} min)</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-emerald-400 font-medium">✓ Low crowd path ahead</span>
              <button
                onClick={() => setNavigationStarted(false)}
                className="text-slate-400 hover:text-white underline text-[11px]"
              >
                End
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
