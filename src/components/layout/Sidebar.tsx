import React from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { 
  Home, 
  Map, 
  Navigation, 
  Bot, 
  Compass, 
  Calendar, 
  Users, 
  Activity, 
  AlertTriangle, 
  SlidersHorizontal 
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, isSurgeActive, t } = useKumbh();

  const navItems = [
    { id: 'home', label: t('navDiscover'), icon: Home },
    { id: 'map', label: t('navMap'), icon: Map },
    { id: 'navigation', label: t('navRoutes'), icon: Navigation, highlight: true },
    { id: 'facilities', label: t('navFacilities'), icon: Compass },
    { id: 'assistant', label: t('navAssistant'), icon: Bot, badge: 'Gemini' },
    { id: 'itinerary', label: t('navItinerary'), icon: Calendar },
    { id: 'crowd', label: t('navCrowd'), icon: Activity, alert: isSurgeActive },
    { id: 'family', label: t('navFamily'), icon: Users },
    { id: 'emergency', label: t('navEmergency'), icon: AlertTriangle, danger: true }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 hidden lg:flex transition-colors duration-200">
      <div className="p-4 space-y-1 overflow-y-auto flex-1">
        
        <div className="px-3 pb-2 pt-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Pilgrim Assistance
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          let btnClass = 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white';
          if (isActive) {
            btnClass = 'bg-saffron-50 dark:bg-saffron-950/60 text-saffron-700 dark:text-saffron-300 font-semibold border-r-4 border-saffron-600 shadow-sm';
          }
          if (item.danger) {
            btnClass = isActive 
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold border-r-4 border-rose-600'
              : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-medium';
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 text-left ${btnClass}`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-4 h-4 ${
                  isActive 
                    ? item.danger ? 'text-rose-600' : 'text-saffron-600'
                    : 'text-slate-400 dark:text-slate-500'
                }`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {item.badge}
                </span>
              )}

              {item.alert && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>
          );
        })}
      </div>

      {/* College & Hackathon Accreditation Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Team: Coding Janta Party</p>
          <p>K.V.N. Naik College</p>
          <p className="text-[10px] text-slate-400 dark:text-slate-500">PS3 — Kumbh Hackathon 2026</p>
        </div>
      </div>
    </aside>
  );
};
