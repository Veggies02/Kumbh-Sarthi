import React from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { Home, Map, Navigation, Bot, AlertTriangle, Compass, SlidersHorizontal } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t } = useKumbh();

  const primaryTabs = [
    { id: 'home', label: t('navDiscover'), icon: Home },
    { id: 'map', label: t('navMap'), icon: Map },
    { id: 'navigation', label: t('navRoutes'), icon: Navigation },
    { id: 'facilities', label: t('navFacilities'), icon: Compass },
    { id: 'assistant', label: t('navAssistant'), icon: Bot },
    { id: 'emergency', label: 'SOS', icon: AlertTriangle, isAlert: true }
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur border-t border-slate-200 dark:border-slate-800 px-2 py-1 shadow-lg transition-colors duration-200">
      <div className="flex items-center justify-around">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          let colorClass = isActive ? 'text-saffron-600 dark:text-saffron-400 font-bold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200';
          if (tab.isAlert) {
            colorClass = isActive ? 'text-rose-600 dark:text-rose-400 font-extrabold' : 'text-rose-500 dark:text-rose-400 font-semibold';
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center py-1 px-1.5 min-w-[48px] rounded-lg transition-colors ${colorClass}`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {tab.isAlert && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping" />
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[55px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
