import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { 
  Play, 
  RotateCcw, 
  Zap, 
  Navigation, 
  Bot, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Check
} from 'lucide-react';

export const DemoPitchController: React.FC = () => {
  const {
    places,
    setActiveTab,
    setPersona,
    setPreference,
    setDestination,
    triggerCrowdSurge,
    resetCrowdSimulation,
    setInitialAssistantPrompt,
    isSurgeActive
  } = useKumbh();

  const [isExpanded, setIsExpanded] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const ramKund = places.find(p => p.id === 'ram-kund') || places[0];

  const handleStep = (stepNumber: number) => {
    setActiveStep(stepNumber);

    switch (stepNumber) {
      case 1:
        // Set Destination to Ram Kund, Persona to Elderly, Preference to Least Crowded
        setDestination(ramKund);
        setPersona('elderly');
        setPreference('least-crowded');
        setActiveTab('navigation');
        break;

      case 2:
        // Trigger Crowd Surge (Ram Kund 45% -> 92%)
        triggerCrowdSurge();
        setActiveTab('navigation');
        break;

      case 3:
        // Ask AI 3-hour itinerary
        setInitialAssistantPrompt("I have 3 hours and I'm travelling with my parents. Plan my pilgrimage.");
        setActiveTab('assistant');
        break;

      case 4:
        // Open Emergency SOS
        setActiveTab('emergency');
        break;

      default:
        break;
    }
  };

  const handleReset = () => {
    resetCrowdSimulation();
    setActiveStep(null);
    setActiveTab('home');
  };

  return (
    <div className="fixed bottom-16 lg:bottom-5 right-4 z-50">
      
      {/* Collapsed Pill Button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white text-xs font-black px-3.5 py-2 rounded-full shadow-2xl border-2 border-purple-300 flex items-center space-x-2 transition-all transform hover:scale-105"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>⚡ 60s Judge Demo Guide</span>
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Expanded Step-by-Step Interactive Controller */}
      {isExpanded && (
        <div className="bg-slate-900/95 backdrop-blur-md text-white rounded-3xl p-4 shadow-2xl border-2 border-purple-500/80 w-80 sm:w-96 space-y-3 animate-in slide-in-from-bottom-5">
          
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-xs tracking-wider uppercase text-purple-300">
                Judge 60-Second Pitch Pilot
              </span>
            </div>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-300 leading-snug">
            Click each step below to demonstrate the end-to-end innovation in under 60 seconds:
          </p>

          <div className="space-y-1.5">
            
            {/* Step 1 */}
            <button
              onClick={() => handleStep(1)}
              className={`w-full p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                activeStep === 1 
                  ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">1</span>
                <span>Elderly Route (Route B Recommended)</span>
              </div>
              <Navigation className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Step 2 */}
            <button
              onClick={() => handleStep(2)}
              className={`w-full p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                activeStep === 2 || isSurgeActive
                  ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">2</span>
                <span>Trigger Surge 92% (Watch Reroute)</span>
              </div>
              <Zap className="w-3.5 h-3.5 text-amber-300" />
            </button>

            {/* Step 3 */}
            <button
              onClick={() => handleStep(3)}
              className={`w-full p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                activeStep === 3 
                  ? 'bg-purple-600 text-white font-bold ring-2 ring-purple-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">3</span>
                <span>AI 3-Hour Itinerary for Parents</span>
              </div>
              <Bot className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Step 4 */}
            <button
              onClick={() => handleStep(4)}
              className={`w-full p-2 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all ${
                activeStep === 4 
                  ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-300' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] font-bold">4</span>
                <span>Instant Emergency SOS & Hospital</span>
              </div>
              <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
            </button>

          </div>

          <div className="pt-1 flex items-center justify-between text-[11px]">
            <button
              onClick={handleReset}
              className="text-slate-400 hover:text-white flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Normal</span>
            </button>

            <span className="text-purple-300 font-medium italic">
              Kumbh Mela Hackathon 2026
            </span>
          </div>

        </div>
      )}

    </div>
  );
};
