import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { AlertCircle, PhoneCall, Sliders, Globe, Radio } from 'lucide-react';
import { OfflineMeshModal } from '../common/OfflineMeshModal';

export const Header: React.FC = () => {
  const {
    crowdZones,
    language,
    setLanguage,
    setActiveTab,
    isSurgeActive,
    t
  } = useKumbh();

  const ramKundZone = crowdZones.find(z => z.id === 'ram-kund');
  const ramKundDensity = ramKundZone ? ramKundZone.density : 45;
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Branding */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-600 to-amber-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <span className="text-xl font-bold tracking-tighter">ॐ</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-saffron-600 transition-colors">
                  {t('appName')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-saffron-100 text-saffron-800 border border-saffron-200">
                  2026
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Center: Live Crowd Condition Indicator */}
          <div 
            onClick={() => setActiveTab('crowd')}
            className="hidden md:flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200 cursor-pointer hover:bg-slate-200/80 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600">Ram Kund:</span>
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                ramKundDensity > 80 
                  ? 'bg-rose-100 text-rose-700 animate-pulse' 
                  : ramKundDensity > 60 
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {ramKundDensity}% {ramKundDensity > 80 ? 'CRITICAL' : ramKundDensity > 60 ? 'HIGH' : 'MODERATE'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium italic">
              Simulated Data
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
              <Globe className="w-3.5 h-3.5 text-slate-500 ml-1 mr-1 hidden xs:block" />
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs px-2 py-1 rounded font-medium transition-all ${
                  language === 'en' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`text-xs px-2 py-1 rounded font-medium transition-all ${
                  language === 'hi' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`text-xs px-2 py-1 rounded font-medium transition-all ${
                  language === 'mr' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Offline Mesh Mode Pill (Zero Cellular Data) */}
            <button
              onClick={() => setShowOfflineModal(true)}
              className="flex items-center space-x-1 text-xs font-bold px-2 sm:px-2.5 py-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-all shadow-sm"
              title="Disaster Mesh & SMS Fallback Mode"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
              <span className="hidden lg:inline text-[11px]">Mesh</span>
              <span className="text-[9px] bg-emerald-200 text-emerald-950 font-black px-1 rounded">
                OFFLINE
              </span>
            </button>

            {/* Admin / Demo Simulator Button */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-1.5 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-lg border transition-all ${
                isSurgeActive
                  ? 'bg-purple-600 text-white border-purple-700 shadow animate-pulse'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
              title="Admin Crowd Control & Surge Simulator"
            >
              <Sliders className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden sm:inline">Admin</span>
              <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1 rounded ml-0.5">
                Sim
              </span>
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setActiveTab('emergency')}
              className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl shadow-md transition-all animate-none"
            >
              <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-bounce" />
              <span>SOS</span>
            </button>

          </div>

        </div>
      </div>

      {/* Surge Active Notification Banner if Surge was triggered */}
      {isSurgeActive && (
        <div className="bg-rose-600 text-white px-4 py-1.5 text-xs font-medium flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-7xl mx-auto w-full">
            <AlertCircle className="w-4 h-4 shrink-0 animate-ping" />
            <span className="font-semibold tracking-wide">
              CROWD SURGE SIMULATION ACTIVE: Ram Kund density has reached 92% (CRITICAL). Navigation routes have automatically adapted!
            </span>
          </div>
        </div>
      )}

      {/* Offline Disaster Mesh Modal */}
      <OfflineMeshModal isOpen={showOfflineModal} onClose={() => setShowOfflineModal(false)} />
    </header>
  );
};
