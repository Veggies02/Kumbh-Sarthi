import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { AlertCircle, PhoneCall, Globe, Radio, Sun, Moon } from 'lucide-react';
import { OfflineMeshModal } from '../common/OfflineMeshModal';
import { LoginModal } from '../auth/LoginModal';

export const Header: React.FC = () => {
  const {
    crowdZones,
    language,
    setLanguage,
    activeTab,
    setActiveTab,
    isSurgeActive,
    currentUser,
    currentFamily,
    isAuthModalOpen,
    setIsAuthModalOpen,
    theme,
    toggleTheme,
    t
  } = useKumbh();

  const ramKundZone = crowdZones.find(z => z.id === 'ram-kund');
  const ramKundDensity = ramKundZone ? ramKundZone.density : 45;
  const [showOfflineModal, setShowOfflineModal] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
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
                <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover:text-saffron-600 dark:group-hover:text-saffron-400 transition-colors">
                  {t('appName')}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-saffron-100 dark:bg-saffron-950/80 text-saffron-800 dark:text-saffron-300 border border-saffron-200 dark:border-saffron-700">
                  2026
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                {t('appSubtitle')}
              </p>
            </div>
          </div>

          {/* Center: Live Crowd Condition Indicator */}
          <div 
            onClick={() => setActiveTab('crowd')}
            className="hidden md:flex items-center space-x-3 px-3.5 py-1.5 rounded-full bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200/80 dark:hover:bg-slate-700/80 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Ram Kund:</span>
              <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                ramKundDensity > 80 
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 animate-pulse' 
                  : ramKundDensity > 60 
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300' 
                  : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
              }`}>
                {ramKundDensity}% {ramKundDensity > 80 ? 'CRITICAL' : ramKundDensity > 60 ? 'HIGH' : 'MODERATE'}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium italic">
              Simulated Data
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            
            {/* Theme Toggle Button (Light / Dark) */}
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm active:scale-95"
              title={theme === 'dark' ? 'Switch to Light Theme (Day Mode)' : 'Switch to Dark Theme (Night Mode)'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px] font-bold text-amber-300 hidden xs:inline">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-[11px] font-bold text-slate-700 hidden xs:inline">Dark</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="relative flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 ml-1 mr-1 hidden xs:block" />
              <button
                onClick={() => setLanguage('en')}
                className={`text-xs px-2 py-1 rounded font-medium transition-all ${
                  language === 'en' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('hi')}
                className={`text-xs px-2 py-1 rounded font-medium transition-all ${
                  language === 'hi' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                हिन्दी
              </button>
              <button
                onClick={() => setLanguage('mr')}
                className={`text-xs px-2 py-1 rounded font-medium transition-all ${
                  language === 'mr' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                मराठी
              </button>
            </div>

            {/* Offline Mesh Mode Pill (Zero Cellular Data) */}
            <button
              onClick={() => setShowOfflineModal(true)}
              className="flex items-center space-x-1 text-xs font-bold px-2 sm:px-2.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-all shadow-sm"
              title="Disaster Mesh & SMS Fallback Mode"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
              <span className="hidden lg:inline text-[11px]">Mesh</span>
              <span className="text-[9px] bg-emerald-200 dark:bg-emerald-800 text-emerald-950 dark:text-emerald-100 font-black px-1 rounded">
                OFFLINE
              </span>
            </button>

            {/* Current User Session & Family Code Pill */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center space-x-2 text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-all shadow-sm"
              title="Click to Switch User / View Family Database"
            >
              <div className="w-5 h-5 rounded-full bg-saffron-500 text-white flex items-center justify-center font-bold text-[11px]">
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="font-bold text-[11px] truncate max-w-[95px] text-slate-900 dark:text-white">{currentUser.name.split(' ')[0]}</div>
                {currentFamily && currentUser.role === 'pilgrim' && (
                  <div className="text-[9px] text-saffron-700 dark:text-saffron-400 font-mono font-black">{currentFamily.familyCode}</div>
                )}
                {currentUser.role === 'police_admin' && (
                  <div className="text-[9px] text-indigo-700 dark:text-indigo-400 font-black">POLICE</div>
                )}
              </div>
            </button>

            {/* Segregated Police ICCC Portal Entry / Exit */}
            {activeTab === 'admin' ? (
              <button
                onClick={() => setActiveTab('home')}
                className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-400 bg-indigo-900 text-white hover:bg-indigo-950 transition-all shadow"
                title="Return to Pilgrim Mobile View"
              >
                <span>← Exit War Room</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  if (currentUser.role === 'police_admin') {
                    setActiveTab('admin');
                  } else {
                    setIsAuthModalOpen(true);
                  }
                }}
                className="flex items-center space-x-1.5 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 transition-all shadow-sm"
                title="Police Command & Control Center Access"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span className="hidden sm:inline">Police ICCC</span>
                <span className="text-[9px] bg-indigo-600 text-white font-extrabold px-1 rounded">
                  PORTAL
                </span>
              </button>
            )}

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

      {/* Identity & Access / Family Group Database Modal */}
      <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
};
