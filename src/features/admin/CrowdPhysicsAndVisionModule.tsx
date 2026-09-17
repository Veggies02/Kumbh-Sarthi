import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Video, 
  ShieldAlert, 
  Eye, 
  Maximize2, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Layers, 
  RefreshCw,
  Cpu,
  BarChart3
} from 'lucide-react';

interface CrowdPhysicsAndVisionProps {
  isSurgeActive: boolean;
  onToggleSurge: () => void;
}

export const CrowdPhysicsAndVisionModule: React.FC<CrowdPhysicsAndVisionProps> = ({
  isSurgeActive,
  onToggleSurge
}) => {
  const [selectedCam, setSelectedCam] = useState<number>(1);
  const [showBoundingBoxes, setShowBoundingBoxes] = useState<boolean>(true);
  const [showHeatmapTint, setShowHeatmapTint] = useState<boolean>(true);
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0').slice(0, 2));
    };
    updateTime();
    const interval = setInterval(updateTime, 250);
    return () => clearInterval(interval);
  }, []);

  // Physics metrics based on surge state
  const density = isSurgeActive ? 5.2 : 2.1; // persons/m²
  const velocity = isSurgeActive ? 0.14 : 0.85; // m/s
  const velocityVariance = isSurgeActive ? 0.92 : 0.12; // m²/s²
  const pressureTensor = (density * velocityVariance).toFixed(2);
  const shockwaveRisk = isSurgeActive ? 88 : 14; // percentage

  const cameras = [
    {
      id: 1,
      name: 'CAM 01 — Ram Kund Main Ghat Steps',
      location: 'Central Panchavati Sector',
      headcount: isSurgeActive ? 186 : 58,
      inflow: isSurgeActive ? '+24/min (Stagnant)' : '+12/min (Fluid)',
      status: isSurgeActive ? 'CRITICAL SURGE' : 'OPTIMAL FLOW',
      statusColor: isSurgeActive ? 'text-rose-400 bg-rose-950/80 border-rose-600' : 'text-emerald-400 bg-emerald-950/80 border-emerald-600',
      bgImg: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      fps: '30.0 FPS',
      resolution: '1920x1080'
    },
    {
      id: 2,
      name: 'CAM 04 — Ahilyabai Holkar Bridge Bottleneck',
      location: 'Victoria Bridge East Pedestrian Span',
      headcount: isSurgeActive ? 142 : 44,
      inflow: isSurgeActive ? '+19/min (Bidirectional)' : '+8/min (Regulated)',
      status: isSurgeActive ? 'WARNING' : 'CLEAR',
      statusColor: isSurgeActive ? 'text-amber-400 bg-amber-950/80 border-amber-600' : 'text-emerald-400 bg-emerald-950/80 border-emerald-600',
      bgImg: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?auto=format&fit=crop&w=800&q=80',
      fps: '29.9 FPS',
      resolution: '1920x1080'
    },
    {
      id: 3,
      name: 'CAM 08 — Tapovan Sadhugram Main Ingress',
      location: 'Northern Highway Transit Gate',
      headcount: isSurgeActive ? 84 : 32,
      inflow: '+15/min (Shuttle Sync)',
      status: 'CONTROLLED',
      statusColor: 'text-blue-400 bg-blue-950/80 border-blue-600',
      bgImg: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=800&q=80',
      fps: '30.0 FPS',
      resolution: '1920x1080'
    }
  ];

  const currentCamData = cameras.find(c => c.id === selectedCam) || cameras[0];

  // Simulated AI Bounding Boxes for devotees
  const boundingBoxes = [
    { top: '24%', left: '22%', width: '12%', height: '28%', label: 'Person 0.94', alert: isSurgeActive },
    { top: '38%', left: '42%', width: '14%', height: '32%', label: 'Person 0.91', alert: isSurgeActive },
    { top: '30%', left: '60%', width: '13%', height: '30%', label: 'Person 0.88', alert: isSurgeActive },
    { top: '48%', left: '15%', width: '15%', height: '34%', label: 'Person 0.96', alert: isSurgeActive },
    { top: '50%', left: '72%', width: '16%', height: '36%', label: 'Elderly Devotee 0.92', alert: true },
    { top: '56%', left: '38%', width: '18%', height: '38%', label: 'Child Inflow 0.89', alert: false }
  ];

  return (
    <div className="space-y-6">

      {/* ========================================================================= */}
      {/* USP #2: AI Stampede Early-Warning Index (Helbing Physics Model)           */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 border border-indigo-900/50 shadow-xl space-y-6 relative overflow-hidden">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-900/60 pb-5">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0 shadow-inner">
              <Activity className="w-6 h-6 animate-pulse text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  AI Stampede Early-Warning Index
                </h3>
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-400/30">
                  Helbing Crowd Turbulence Model
                </span>
              </div>
              <p className="text-xs text-indigo-200/70 mt-0.5">
                Physics-based crowd fluid dynamics detecting micro-turbulent shockwaves before physical crushes occur.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={onToggleSurge}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center space-x-1.5 shadow-lg ${
                isSurgeActive 
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse' 
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{isSurgeActive ? 'Discharge Shockwave' : '⚡ Simulate Turbulence Test'}</span>
            </button>
          </div>
        </div>

        {/* Physics Formula Callout Strip */}
        <div className="bg-black/40 border border-indigo-500/30 rounded-2xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3 font-mono">
            <span className="text-[11px] text-indigo-300 font-bold uppercase tracking-wider">Governing Equation:</span>
            <span className="bg-indigo-950/80 px-3 py-1 rounded-lg text-indigo-200 font-black border border-indigo-800">
              P(x,t) = ρ · Var(v)
            </span>
          </div>
          <div className="text-[11px] text-slate-300">
            <strong>Critical Threshold:</strong> When pedestrian density exceeds <code className="text-amber-400 font-bold">4.0 ppl/m²</code> and velocity drops below <code className="text-rose-400 font-bold">0.2 m/s</code>, laminar flow breaks into turbulent shockwaves.
          </div>
        </div>

        {/* 4 Core Physics Telemetry Dials */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Metric 1: Crowd Density */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pedestrian Density (ρ)
            </span>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl sm:text-3xl font-black ${density >= 4.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {density}
              </span>
              <span className="text-xs text-slate-400 font-semibold">ppl / m²</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Safety Cap: <strong>3.5 ppl/m²</strong>
            </div>
          </div>

          {/* Metric 2: Mean Radial Velocity */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Mean Velocity (v̄)
            </span>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl sm:text-3xl font-black ${velocity < 0.2 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {velocity}
              </span>
              <span className="text-xs text-slate-400 font-semibold">m / s</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Stagnation Limit: <strong>&lt; 0.20 m/s</strong>
            </div>
          </div>

          {/* Metric 3: Pedestrian Pressure Tensor */}
          <div className="bg-slate-900/90 rounded-2xl p-4 border border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Pressure Tensor (P)
            </span>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl sm:text-3xl font-black ${isSurgeActive ? 'text-amber-400' : 'text-cyan-400'}`}>
                {pressureTensor}
              </span>
              <span className="text-xs text-slate-400 font-semibold">kPa·s</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1">
              Variance: <strong>{velocityVariance} m²/s²</strong>
            </div>
          </div>

          {/* Metric 4: Shockwave Probability */}
          <div className={`rounded-2xl p-4 border space-y-1 ${
            isSurgeActive 
              ? 'bg-rose-950/60 border-rose-500/60' 
              : 'bg-emerald-950/40 border-emerald-500/40'
          }`}>
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block">
              Stampede Shockwave Risk
            </span>
            <div className="flex items-baseline space-x-2">
              <span className={`text-2xl sm:text-3xl font-black ${isSurgeActive ? 'text-rose-300 animate-pulse' : 'text-emerald-300'}`}>
                {shockwaveRisk}%
              </span>
              <span className="text-xs font-bold uppercase">
                {isSurgeActive ? 'CRITICAL' : 'SAFE'}
              </span>
            </div>
            <div className="text-[11px] text-slate-300 pt-1">
              {isSurgeActive ? 'Auto-interlocks ACTIVE' : 'Laminar crowd flow'}
            </div>
          </div>

        </div>

        {/* Dynamic Automated Mitigation Interlock Actions */}
        <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-slate-200 flex items-center space-x-1.5 uppercase tracking-wider text-[10px]">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Automated Algorithmic Interlocks (Autonomous Safety Protocol):</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-400">
              Latency: 140ms
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
              isSurgeActive ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSurgeActive ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className="text-[11px]">Dynamic Gate Divergence: Corridor B Open</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
              isSurgeActive ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSurgeActive ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className="text-[11px]">Digital VMS Signage: Flipped to Promenade</span>
            </div>

            <div className={`p-2.5 rounded-xl border flex items-center space-x-2 ${
              isSurgeActive ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSurgeActive ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className="text-[11px]">Police VHF PA Radio: Warning Transmitted</span>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* USP #3: Multi-CCTV AI Vision Stream Simulator (Live YOLO Bounding Boxes) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping mr-1" />
                Live Video AI Stream
              </span>
              <span className="text-[11px] font-bold text-slate-400">YOLO-v9 Edge Inference</span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-900 mt-1 flex items-center space-x-2">
              <Video className="w-5 h-5 text-indigo-600" />
              <span>Multi-Camera Computer Vision Surveillance Wall</span>
            </h3>
          </div>

          {/* Stream Overlay Controls */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowBoundingBoxes(!showBoundingBoxes)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                showBoundingBoxes ? 'bg-indigo-50 text-indigo-700 border-indigo-300' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Bounding Boxes: {showBoundingBoxes ? 'ON' : 'OFF'}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowHeatmapTint(!showHeatmapTint)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
                showHeatmapTint ? 'bg-amber-50 text-amber-800 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Thermal Tint</span>
            </button>
          </div>
        </div>

        {/* Camera Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {cameras.map(cam => (
            <button
              key={cam.id}
              onClick={() => setSelectedCam(cam.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                selectedCam === cam.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md ring-2 ring-indigo-500/40'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-mono font-bold">{cam.name.split('—')[0].trim()}</span>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border ${cam.statusColor}`}>
                  {cam.status}
                </span>
              </div>
              <div className="font-bold text-xs truncate">{cam.name.split('—')[1]?.trim() || cam.name}</div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>Headcount: <strong>{cam.headcount}</strong></span>
                <span>{cam.inflow}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Live Video Monitor Frame */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl aspect-[16/9] max-h-[460px] flex items-center justify-center">
          
          {/* Background Video Frame Mockup */}
          <img 
            src={currentCamData.bgImg} 
            alt={currentCamData.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${showHeatmapTint && isSurgeActive ? 'hue-rotate-[320deg] saturate-150' : ''}`}
          />

          {/* Dark Surveillance Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 pointer-events-none" />

          {/* Top Video OSD (On-Screen Display) */}
          <div className="absolute top-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white pointer-events-none z-20">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span className="font-black bg-rose-600/90 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
                REC • LIVE
              </span>
              <span className="font-bold text-slate-200 text-[11px]">{currentCamData.name}</span>
            </div>

            <div className="flex items-center space-x-3 text-[10px] text-slate-300">
              <span>{currentCamData.resolution}</span>
              <span>{currentCamData.fps}</span>
              <span className="text-amber-400 font-bold">{timestamp}</span>
            </div>
          </div>

          {/* Simulated AI YOLO Bounding Boxes Overlay */}
          {showBoundingBoxes && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {boundingBoxes.map((box, idx) => (
                <div
                  key={idx}
                  style={{
                    top: box.top,
                    left: box.left,
                    width: box.width,
                    height: box.height
                  }}
                  className={`absolute border-2 transition-all rounded-sm flex flex-col justify-between p-0.5 ${
                    box.alert 
                      ? 'border-rose-500 bg-rose-500/15 shadow-[0_0_12px_rgba(244,63,94,0.6)]' 
                      : 'border-emerald-400 bg-emerald-400/10'
                  }`}
                >
                  <span className={`text-[9px] font-mono font-black px-1 rounded-sm w-max ${
                    box.alert ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {box.label}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full self-end bg-white" />
                </div>
              ))}
            </div>
          )}

          {/* Thermal Tint Alert Graphic */}
          {showHeatmapTint && isSurgeActive && (
            <div className="absolute inset-0 bg-rose-600/15 mix-blend-color-burn pointer-events-none z-10 animate-pulse" />
          )}

          {/* Bottom Live Analytics Bar */}
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white z-20 pointer-events-none">
            <div className="flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[11px] font-semibold text-slate-300">Total In-Frame Headcount:</span>
              <span className="font-mono font-black text-amber-400 text-sm">{currentCamData.headcount} devotees</span>
            </div>

            <div className="flex items-center space-x-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[11px] font-semibold text-slate-300">Flow Status:</span>
              <span className={`font-mono font-bold text-xs ${isSurgeActive ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentCamData.inflow}
              </span>
            </div>
          </div>

        </div>

        {/* Video Wall Footer Note */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
          <span>Inference Engine: <strong>TensorRT FP16 On-Premises Edge Server (Panchavati Command Post)</strong></span>
          <span className="text-emerald-700 font-bold">✓ 0.0% Cloud Data Leakage</span>
        </div>

      </div>

    </div>
  );
};
