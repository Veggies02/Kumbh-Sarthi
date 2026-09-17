import React, { useState, useRef, useEffect } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { askGeminiPilgrimAssistant } from '../../services/geminiService';
import { ChatMessage, Place } from '../../types';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  Navigation, 
  Clock, 
  MapPin, 
  Trash2,
  Volume2,
  VolumeX,
  Square,
  Radio
} from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const { 
    places, 
    crowdZones, 
    language, 
    navigateToPlace,
    initialAssistantPrompt,
    setInitialAssistantPrompt 
  } = useKumbh();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Play official police radio walkie-talkie chime before speech
  const playRadioChime = (): Promise<void> => {
    return new Promise((resolve) => {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) {
          resolve();
          return;
        }
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        
        // Chime tone 1: 880 Hz
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0.18, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.16);

        // Chime tone 2: 587 Hz
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(587.33, now + 0.18);
        gain2.gain.setValueAtTime(0.18, now + 0.18);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.40);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.18);
        osc2.stop(now + 0.40);

        setTimeout(() => resolve(), 420);
      } catch {
        resolve();
      }
    });
  };

  const stripMarkdownForSpeech = (raw: string): string => {
    return raw
      .replace(/[*#_`~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\n+/g, '. ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMsgId(null);
  };

  const speakText = async (text: string, msgId?: string) => {
    if (!('speechSynthesis' in window)) return;

    // If currently speaking this specific message, toggle stop
    if (isSpeaking && speakingMsgId === msgId) {
      stopSpeaking();
      return;
    }

    // Stop any existing speech
    stopSpeaking();

    const cleanText = stripMarkdownForSpeech(text);
    if (!cleanText) return;

    setIsSpeaking(true);
    if (msgId) setSpeakingMsgId(msgId);

    // 1. Play realistic radio chime
    await playRadioChime();

    // Check if still wanted (not stopped during chime)
    if (!('speechSynthesis' in window)) {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const voices = window.speechSynthesis.getVoices();
    const isDevanagari = /[\u0900-\u097F]/.test(cleanText);

    if (language === 'mr' || (isDevanagari && (cleanText.includes('आहे') || cleanText.includes('करा')))) {
      utterance.voice = voices.find(v => v.lang.startsWith('mr') || v.name.toLowerCase().includes('marathi'))
        || voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'))
        || voices.find(v => v.lang.includes('IN')) || null;
      utterance.lang = utterance.voice?.lang || 'mr-IN';
    } else if (language === 'hi' || isDevanagari) {
      utterance.voice = voices.find(v => v.lang.startsWith('hi') || v.name.toLowerCase().includes('hindi'))
        || voices.find(v => v.lang.includes('IN')) || null;
      utterance.lang = utterance.voice?.lang || 'hi-IN';
    } else {
      utterance.voice = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'))
        || voices.find(v => v.lang.startsWith('en')) || null;
      utterance.lang = utterance.voice?.lang || 'en-IN';
    }

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setSpeakingMsgId(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const initialGreeting: ChatMessage = {
    id: 'msg-1',
    sender: 'assistant',
    text: `🙏 **Namaste! I am Kumbh Saathi AI.**\n\nI can help you navigate Nashik and Trimbakeshwar safely during Kumbh Mela 2026. You can speak to me in **English, हिन्दी (Hindi), or मराठी (Marathi)**.\n\nAsk me about low-crowd routes, timing for holy snan at Ram Kund, facilities for elderly parents, or request a customized 3-hour pilgrimage plan!`,
    timestamp: 'Just now',
    referencedPlaces: places.slice(0, 2)
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Auto-execute if initial prompt was passed from another screen
  useEffect(() => {
    if (initialAssistantPrompt && initialAssistantPrompt.trim() !== '') {
      const promptToRun = initialAssistantPrompt;
      setInitialAssistantPrompt('');
      handleSendMessage(promptToRun);
    }
  }, [initialAssistantPrompt]);

  const quickQuestions = [
    { label: 'Elderly Itinerary', text: 'I have 3 hours and I\'m travelling with my parents. Plan my pilgrimage.' },
    { label: 'राम कुंड - कम भीड़ मार्ग', text: 'Ram Kund jaana hai, bheed kam wali route batao' },
    { label: '३ तासांचे दर्शन नियोजन', text: 'माझ्याकडे ३ तास आहेत आणि आई-वडील सोबत आहेत. दर्शन नियोजन सांगा.' },
    { label: 'Drinking Water & Medical', text: 'Where are the nearest RO drinking water hubs and emergency clinics?' }
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || loading) return;

    // Stop speaking user enters a new prompt
    stopSpeaking();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setLoading(true);

    try {
      const result = await askGeminiPilgrimAssistant({
        userQuery: query,
        places,
        crowdZones,
        language
      });

      const newAiId = `ai-${Date.now()}`;
      const aiMsg: ChatMessage = {
        id: newAiId,
        sender: 'assistant',
        text: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        referencedPlaces: result.referencedPlaces
      };

      setMessages(prev => [...prev, aiMsg]);

      // Speak aloud automatically if voiceEnabled is on!
      if (voiceEnabled) {
        speakText(result.text, newAiId);
      }
    } catch (e) {
      console.error(e);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Sorry, I encountered an issue processing your request. Please try asking again or check our nearby facilities section.',
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    stopSpeaking();
    setMessages([initialGreeting]);
  };

  return (
    <div className="h-[calc(100vh-4rem)] max-w-5xl mx-auto flex flex-col bg-white shadow-sm border-x border-slate-200">
      
      {/* Assistant Header */}
      <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-saffron-50 via-white to-amber-50 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-saffron-500 to-amber-600 flex items-center justify-center text-white shadow-md">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-slate-900">
                AI Pilgrim Saathi
              </h2>
              <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Gemini Powered
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Grounded in verified Nashik & Trimbakeshwar database • English, हिन्दी, मराठी
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
              }
              setVoiceEnabled(!voiceEnabled);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              voiceEnabled
                ? isSpeaking
                  ? 'bg-saffron-600 text-white border-saffron-600 shadow-sm animate-pulse'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
            }`}
            title={voiceEnabled ? 'Voice output enabled (Click to mute)' : 'Voice muted (Click to enable)'}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce' : ''}`} />
                <span>{isSpeaking ? 'Speaking...' : 'Voice: ON'}</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Voice: MUTE</span>
              </>
            )}
          </button>

          {isSpeaking && (
            <button
              onClick={stopSpeaking}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 flex items-center space-x-1"
              title="Stop speaking"
            >
              <Square className="w-3 h-3 fill-rose-600" />
              <span>Stop</span>
            </button>
          )}

          <button
            onClick={handleClearChat}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto flex items-center space-x-2 scrollbar-none shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-saffron-600 shrink-0" />
        <span className="text-xs font-semibold text-slate-400 shrink-0">Quick Ask:</span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q.text)}
            className="text-xs whitespace-nowrap bg-white hover:bg-saffron-50 border border-slate-200 hover:border-saffron-300 text-slate-700 px-3 py-1.5 rounded-full shadow-sm font-medium transition-all shrink-0"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isAi = msg.sender === 'assistant';
          const isCurrentSpeaking = isSpeaking && speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isAi ? '' : 'flex-row-reverse space-x-reverse'}`}
            >
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 shadow-sm ${
                isAi 
                  ? 'bg-saffron-600 text-white' 
                  : 'bg-slate-800 text-white'
              }`}>
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Content */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isAi 
                    ? isCurrentSpeaking 
                      ? 'bg-amber-50/90 border-2 border-saffron-500 text-slate-800 rounded-tl-none shadow-md'
                      : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-none' 
                    : 'bg-saffron-600 text-white rounded-tr-none'
                }`}>
                  <div className="whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Footer with Audio Listen button for AI responses */}
                  {isAi ? (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60">
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                          isCurrentSpeaking
                            ? 'bg-saffron-600 text-white shadow-xs animate-pulse'
                            : 'text-saffron-700 hover:bg-saffron-100/70 border border-saffron-200/60 bg-white'
                        }`}
                        title={isCurrentSpeaking ? 'Stop audio' : 'Listen with police radio chime'}
                      >
                        {isCurrentSpeaking ? (
                          <>
                            <Square className="w-3 h-3 fill-white" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3 text-saffron-600" />
                            <span>Listen (ऐका / सुनें)</span>
                          </>
                        )}
                      </button>
                      <div className="text-[10px] text-slate-400">
                        {msg.timestamp}
                      </div>
                    </div>
                  ) : (
                    <div className="text-[10px] mt-2 text-right text-saffron-200">
                      {msg.timestamp}
                    </div>
                  )}
                </div>

                {/* Referenced Places (Interactive Badges) */}
                {isAi && msg.referencedPlaces && msg.referencedPlaces.length > 0 && (
                  <div className="pt-1 flex flex-wrap gap-2">
                    {msg.referencedPlaces.map((place: Place) => (
                      <div
                        key={place.id}
                        className="bg-white border border-slate-200 rounded-xl p-2.5 shadow-sm text-xs flex items-center justify-between gap-3 hover:border-saffron-300 transition-colors"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{place.name}</div>
                          <div className="text-[10px] text-slate-500 capitalize">{place.category} • {place.locationName}</div>
                        </div>
                        <button
                          onClick={() => navigateToPlace(place)}
                          className="bg-saffron-600 hover:bg-saffron-700 text-white px-2.5 py-1 rounded-lg font-semibold text-[11px] flex items-center space-x-1 shrink-0 shadow-xs"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>Navigate</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-saffron-600 text-white flex items-center justify-center text-xs shadow-sm">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-500 text-xs flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-saffron-600 animate-spin" />
              <span>Analyzing crowd densities and composing advice...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-200 bg-white shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask in English, हिन्दी, or मराठी... (e.g., 'Parents ke saath hoon, bheed kam wali route')"
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="bg-saffron-600 hover:bg-saffron-700 disabled:opacity-50 text-white font-bold p-3 rounded-xl shadow-md transition-all shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Kumbh Saathi grounds advice in actual spatial coordinates & simulated crowd density. In medical crises, immediately tap Emergency SOS.
        </p>
      </div>

    </div>
  );
};
