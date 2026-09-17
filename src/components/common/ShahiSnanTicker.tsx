import React, { useState, useEffect } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Compass,
  Sparkles,
  Sun,
  Moon,
  Sunset,
  MapPin,
  Navigation,
  CheckCircle
} from 'lucide-react';

interface MuhuratSlot {
  name: string;
  timeLabel: string;
  period: 'dawn' | 'noon' | 'sunset' | 'night';
  hour: number;
  minute: number;
  significance: string;
}

const MUHURAT_SCHEDULE: MuhuratSlot[] = [
  {
    name: 'Brahma Muhurta Sacred Shahi Snan',
    timeLabel: '04:15 AM',
    period: 'dawn',
    hour: 4,
    minute: 15,
    significance: 'Most auspicious dawn royal bathing window in holy Godavari'
  },
  {
    name: 'Surya Puja & Sangam Snan',
    timeLabel: '11:45 AM',
    period: 'noon',
    hour: 11,
    minute: 45,
    significance: 'Mid-day solar prayer & holy dip at Kapila Sangam'
  },
  {
    name: 'Godavari Sandhya Snan & Maha Aarti',
    timeLabel: '06:30 PM',
    period: 'sunset',
    hour: 18,
    minute: 30,
    significance: 'Sunset river illumination, deepotsav & evening holy snan'
  },
  {
    name: 'Nishita Choghadiya Snan & Dhyan',
    timeLabel: '11:15 PM',
    period: 'night',
    hour: 23,
    minute: 15,
    significance: 'Auspicious night contemplative snan for sadhus & sanyasis'
  }
];

export const ShahiSnanTicker: React.FC = () => {
  const { origin, places, navigateToPlace, isSurgeActive, setActiveTab } = useKumbh();
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSlot, setActiveSlot] = useState<MuhuratSlot>(MUHURAT_SCHEDULE[2]);
  const [countdown, setCountdown] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate upcoming muhurat dynamically against REAL local device clock
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      // Find the next upcoming muhurat today, or roll over to tomorrow's first
      let nextSlot = MUHURAT_SCHEDULE.find(slot => 
        slot.hour > currentHour || (slot.hour === currentHour && slot.minute > currentMinute)
      );

      let targetDate = new Date(now);
      if (nextSlot) {
        targetDate.setHours(nextSlot.hour, nextSlot.minute, 0, 0);
      } else {
        // Roll over to tomorrow's Brahma Muhurta
        nextSlot = MUHURAT_SCHEDULE[0];
        targetDate.setDate(targetDate.getDate() + 1);
        targetDate.setHours(nextSlot.hour, nextSlot.minute, 0, 0);
      }

      setActiveSlot(nextSlot);

      const diffMs = Math.max(0, targetDate.getTime() - now.getTime());
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      setCountdown({ hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  // Distance calculator from current origin GPS
  const calculateDistanceKm = (lat: number, lng: number) => {
    const dLat = (lat - origin.lat) * 111;
    const dLng = (lng - origin.lng) * 111 * Math.cos((origin.lat * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    return Math.round(dist * 10) / 10;
  };

  // Estimate transit/walking time with festival pedestrian factoring (~2.7 min/km)
  const estimateTransitMinutes = (distKm: number) => {
    return Math.max(4, Math.round(distKm * 2.7));
  };

  const kapilaPlace = places.find(p => p.id.includes('kapila') || p.name.includes('Kapila')) || places[1];
  const ramKundPlace = places.find(p => p.id === 'ram-kund') || places[0];

  const totalMinutesToMuhurat = countdown.hours * 60 + countdown.minutes;

  // 4 Sacred Ghats with GPS and real-time computation
  const rawGhats = [
    {
      id: 'ram-kund',
      name: 'Ram Kund',
      lat: 20.0050,
      lng: 73.7915,
      queueWait: isSurgeActive ? 48 : 22,
      status: isSurgeActive ? 'CRITICAL (92%)' : 'MODERATE (45%)',
      badgeColor: isSurgeActive ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300',
      isRec: false
    },
    {
      id: 'kapila-sangam',
      name: 'Kapila Sangam',
      lat: 20.0118,
      lng: 73.8055,
      queueWait: 6,
      status: 'FAST FLOW (20%)',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      isRec: true
    },
    {
      id: 'someshwar-ghat',
      name: 'Someshwar Ghat',
      lat: 19.9880,
      lng: 73.7380,
      queueWait: 14,
      status: 'NORMAL (35%)',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      isRec: false
    },
    {
      id: 'kushavarta-kund',
      name: 'Trimbak Kushavarta',
      lat: 19.9325,
      lng: 73.5308,
      queueWait: isSurgeActive ? 65 : 35,
      status: isSurgeActive ? 'HEAVY (88%)' : 'NORMAL (40%)',
      badgeColor: isSurgeActive ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-amber-100 text-amber-800 border-amber-300',
      isRec: false
    }
  ];

  // Enrich ghats with distance, travel time, and total time from user location
  const ghatQueues = rawGhats.map(ghat => {
    const distKm = calculateDistanceKm(ghat.lat, ghat.lng);
    const travelMins = estimateTransitMinutes(distKm);
    const totalMins = travelMins + ghat.queueWait;
    const leadMins = totalMinutesToMuhurat - totalMins;

    let leadText = '';
    if (leadMins > 60) {
      leadText = `Arrive ${Math.floor(leadMins / 60)}h ${leadMins % 60}m before Aarti`;
    } else if (leadMins > 0) {
      leadText = `Arrive ${leadMins}m before Muhurat`;
    } else {
      leadText = '⚠️ Leave now to catch Muhurat';
    }

    return {
      ...ghat,
      distKm,
      travelMins,
      totalMins,
      leadText
    };
  });

  const ramKundData = ghatQueues[0];
  const kapilaData = ghatQueues[1];
  const timeSaved = Math.max(1, ramKundData.totalMins - kapilaData.totalMins);

  const handleQuickDivert = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (kapilaPlace) {
      navigateToPlace(kapilaPlace);
    } else {
      setActiveTab('navigation');
    }
  };

  const handleSelectGhat = (ghatId: string) => {
    const target = places.find(p => p.id === ghatId || p.id.includes(ghatId.split('-')[0])) || places[0];
    navigateToPlace(target);
  };

  const getSlotIcon = (period: string) => {
    switch (period) {
      case 'dawn': return <Sun className="w-3.5 h-3.5 text-amber-300" />;
      case 'sunset': return <Sunset className="w-3.5 h-3.5 text-amber-200" />;
      case 'night': return <Moon className="w-3.5 h-3.5 text-indigo-300" />;
      default: return <Sparkles className="w-3.5 h-3.5 text-yellow-300" />;
    }
  };

  const originShortName = origin.name.split(',')[0].replace('MET Bhujbal Knowledge City', 'MET Campus');

  return (
    <div className="bg-gradient-to-r from-amber-600 via-saffron-600 to-amber-700 text-white border-b border-amber-400/40 text-xs shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-wrap lg:flex-nowrap items-center justify-between gap-3">
        
        {/* Left: Dynamic Real-Time Muhurat & Countdown (Single Clean Row) */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)} 
          className="flex items-center space-x-2.5 cursor-pointer select-none group min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-black/25 backdrop-blur border border-white/20 flex items-center justify-center font-serif text-sm shrink-0 shadow-inner group-hover:scale-105 transition-transform">
            🕉️
          </div>

          <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 min-w-0">
            {/* Event Name & Timing Pill */}
            <div className="flex items-center space-x-1.5 min-w-0">
              <span className="font-black uppercase text-[9px] tracking-wider bg-black/30 px-2 py-0.5 rounded-md text-amber-200 shrink-0 border border-white/10 flex items-center space-x-1">
                {getSlotIcon(activeSlot.period)}
                <span>Next Muhurat</span>
              </span>
              <span className="font-extrabold text-white text-xs truncate">
                {activeSlot.name}
              </span>
              <span className="text-[11px] font-mono font-black bg-white/20 px-2 py-0.5 rounded-md text-white border border-white/20 shrink-0">
                {activeSlot.timeLabel}
              </span>
            </div>

            {/* Countdown Badge */}
            <div className="flex items-center space-x-1.5 bg-black/35 px-2.5 py-0.5 rounded-md border border-white/15 text-[11px] font-mono shrink-0">
              <Clock className="w-3 h-3 text-amber-300 shrink-0 animate-pulse" />
              <span className="text-amber-200 font-medium">Starts in:</span>
              <span className="text-white font-black tracking-wide">
                {String(countdown.hours).padStart(2, '0')}h : {String(countdown.minutes).padStart(2, '0')}m : {String(countdown.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Right: Live ETA From User Location & 1-Click Reroute */}
        <div className="flex items-center space-x-2.5 shrink-0 ml-auto lg:ml-0">
          
          {/* Quick ETA Pill */}
          <div 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/15 text-[11px] cursor-pointer hover:bg-black/40 transition-colors"
            title="Click to view full travel + queue breakdown"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="text-amber-100">
              Ram Kund: <strong className="text-white font-mono">{ramKundData.totalMins}m</strong>
            </span>
            <span className="text-white/30">•</span>
            <span className="text-emerald-200 font-semibold">
              Kapila: <strong className="text-white font-mono">{kapilaData.totalMins}m</strong>
            </span>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleQuickDivert}
            className="bg-slate-950 hover:bg-slate-900 text-amber-300 hover:text-white font-black px-3.5 py-1.5 rounded-xl text-[11px] flex items-center space-x-1.5 shadow-md border border-amber-400/50 transition-all active:scale-95 shrink-0"
            title="Divert to Kapila Sangam Ghat"
          >
            <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span className="hidden sm:inline">Divert to Kapila</span>
            <span className="sm:hidden">Divert</span>
            <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded ml-0.5">
              Save {timeSaved}m
            </span>
          </button>

          {/* Expand Drawer Button */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            title="Toggle All Ghat Queue & Travel Times"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Expanded Ghat Comparison Drawer with Complete Door-to-Snan ETAs */}
      {isExpanded && (
        <div className="bg-slate-950/95 border-t border-amber-400/20 px-4 sm:px-8 py-3.5 text-slate-200 animate-in slide-in-from-top-2 duration-200">
          <div className="max-w-7xl mx-auto space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-amber-300 font-bold border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Door-to-Snan Total Time (Travel from {origin.name} + Ghat Turnstile Queue):</span>
              </div>
              <span className="text-slate-400 font-normal">Real-time GPS & turnstile calibration</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              {ghatQueues.map((ghat) => (
                <div 
                  key={ghat.id} 
                  className={`p-3 rounded-2xl border flex flex-col justify-between space-y-2.5 transition-all ${
                    ghat.isRec 
                      ? 'bg-emerald-950/70 border-emerald-500/80 ring-2 ring-emerald-400/40 shadow-lg' 
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-sm text-white">{ghat.name}</span>
                      {ghat.isRec ? (
                        <span className="text-[9px] bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded-full">
                          FASTEST SNAN
                        </span>
                      ) : (
                        <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${ghat.badgeColor}`}>
                          {ghat.status.split(' ')[0]}
                        </span>
                      )}
                    </div>

                    {/* Big Total Time Display */}
                    <div className="bg-black/40 rounded-xl p-2.5 border border-white/10 space-y-1">
                      <div className="flex items-baseline justify-between">
                        <span className="text-[10px] text-slate-400 uppercase font-bold">Total Time Remaining:</span>
                        <span className="font-mono text-lg font-black text-amber-400">
                          {ghat.totalMins} mins
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-300 flex justify-between pt-0.5 border-t border-white/10">
                        <span>🚗 Travel: <strong>{ghat.travelMins}m</strong> ({ghat.distKm} km)</span>
                        <span>⏳ Queue: <strong>{ghat.queueWait}m</strong></span>
                      </div>
                    </div>

                    <div className="text-[10px] text-amber-200/90 flex items-center space-x-1 mt-1.5 font-medium">
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span className="truncate">{ghat.leadText}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectGhat(ghat.id)}
                    className={`w-full py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all active:scale-95 shadow ${
                      ghat.isRec 
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-300" />
                    <span>Navigate Here (~{ghat.travelMins}m)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
