import React from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { SmartMap } from '../../components/map/SmartMap';
import { CrowdBadge } from '../../components/common/CrowdBadge';
import { 
  Activity, 
  ShieldAlert, 
  Users, 
  TrendingUp, 
  Clock, 
  MapPin, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export const CrowdOverview: React.FC = () => {
  const { crowdZones, isSurgeActive, setActiveTab } = useKumbh();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Clearly Labelled: Demo / Simulated Crowd Data</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
            <Activity className="w-6 h-6 text-saffron-600" />
            <span>Kumbh Mela Crowd Density & Sector Safety</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time simulated pedestrian saturation levels across Nashik and Trimbakeshwar bathing ghats
          </p>
        </div>

        <button
          onClick={() => setActiveTab('admin')}
          className="self-start sm:self-auto bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-bold px-4 py-2 rounded-xl text-xs flex items-center space-x-1.5 shadow-sm"
        >
          <span>Open Crowd Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Surge Alert if Active */}
      {isSurgeActive && (
        <div className="p-4 bg-rose-50 border-2 border-rose-400 rounded-2xl text-rose-900 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-bold text-sm text-rose-800">
              CROWD SURGE SIMULATION IN PROGRESS (Ram Kund: 92%)
            </div>
            <p className="text-rose-700">
              Ram Kund is currently under peak congestion. Pilgrims are being rerouted via the Godavari Promenade (Route B) and Kapila Sangam Ghat.
            </p>
          </div>
        </div>
      )}

      {/* Grid of All Crowd Zones */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crowdZones.map(zone => (
          <div
            key={zone.id}
            className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">{zone.name}</h3>
                {zone.marathiName && (
                  <p className="text-xs text-saffron-700 font-serif">{zone.marathiName}</p>
                )}
              </div>
              <CrowdBadge level={zone.risk} density={zone.density} />
            </div>

            {/* Visual Density Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Saturation</span>
                <span className="font-mono">{zone.density}%</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    zone.density > 80 
                      ? 'bg-rose-600' 
                      : zone.density > 60 
                      ? 'bg-amber-500' 
                      : zone.density > 30 
                      ? 'bg-blue-500' 
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${zone.density}%` }}
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div className="bg-slate-50 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block font-semibold">Active Footfall</span>
                <span className="font-extrabold text-slate-800">{zone.activePilgrimsEstimate.toLocaleString()}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl text-center">
                <span className="text-[10px] text-slate-400 block font-semibold">Holding Capacity</span>
                <span className="font-extrabold text-slate-800">{zone.capacityMax.toLocaleString()}</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
              <span>Trend: {zone.trend.toUpperCase()}</span>
              <span>Updated: {zone.updatedAt}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Map with Crowd Heat Overlays */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            Spatial Crowd Density Layer
          </h2>
          <span className="text-xs text-slate-400">
            Interactive Heat Circles
          </span>
        </div>
        <div className="h-[420px] rounded-2xl overflow-hidden border border-slate-200">
          <SmartMap />
        </div>
      </div>

    </div>
  );
};
