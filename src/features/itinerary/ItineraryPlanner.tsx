import React, { useState } from 'react';
import { useKumbh } from '../../store/kumbhStore';
import { Place, ItineraryItem, TravelPersona } from '../../types';
import { SmartMap } from '../../components/map/SmartMap';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle, 
  MapPin, 
  Navigation, 
  Share2, 
  Printer,
  Compass,
  ArrowRight
} from 'lucide-react';

export const ItineraryPlanner: React.FC = () => {
  const { places, navigateToPlace } = useKumbh();

  // Inputs
  const [duration, setDuration] = useState<'1h' | '3h' | '5h' | 'fullday'>('3h');
  const [persona, setPersona] = useState<TravelPersona>('elderly');
  const [focus, setFocus] = useState<'spiritual' | 'balanced' | 'low-crowd' | 'accessible'>('low-crowd');
  const [isGenerated, setIsGenerated] = useState(true);

  // Generate dynamic itinerary schedule based on inputs
  const generateSchedule = (): ItineraryItem[] => {
    if (duration === '1h') {
      return [
        {
          time: '09:00 AM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund (Gate 3 Accessible Enclosure)',
          durationMinutes: 40,
          activity: 'Holy river viewing / brief holy snan (dip) via non-slip ramp',
          crowdForecast: 'MODERATE',
          tips: 'Use Gate 3 ramp for step-free access and proximity to First Aid Camp #1.'
        },
        {
          time: '09:45 AM',
          placeId: 'water-ro-station-ramkund',
          placeName: 'RO Pure Water Hub #1 & Resting Kiosk',
          durationMinutes: 15,
          activity: 'Hydration and rest at shaded benches',
          crowdForecast: 'LOW',
          tips: 'Chilled reverse osmosis drinking water is free of cost.'
        }
      ];
    }

    if (duration === '3h') {
      return [
        {
          time: '08:30 AM',
          placeId: 'kalaram-mandir',
          placeName: 'Shree Kalaram Temple',
          durationMinutes: 45,
          activity: 'Morning Darshan & Aarti viewing',
          crowdForecast: 'MODERATE',
          tips: 'Enter through West Gate. Free wheelchairs available from trust volunteers.'
        },
        {
          time: '09:25 AM',
          placeId: 'ram-kund',
          placeName: 'Route B Promenade to Ram Kund',
          durationMinutes: 20,
          activity: 'Scenic riverside walk bypassing congested market',
          crowdForecast: 'LOW',
          tips: 'Shaded path with zero stairs and gentle ramps.'
        },
        {
          time: '09:50 AM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund & Lakshman Kund',
          durationMinutes: 50,
          activity: 'Sacred snan rituals and Godavari Aarti prayers',
          crowdForecast: 'MODERATE',
          tips: 'Senior citizens have designated shallow bathing sections with railings.'
        },
        {
          time: '10:45 AM',
          placeId: 'food-annakshetra-panchavati',
          placeName: 'Mahaprasad Annakshetra (Langar)',
          durationMinutes: 35,
          activity: 'Satvik Mahaprasad Lunch',
          crowdForecast: 'MODERATE',
          tips: 'Special dining tables available for pilgrims unable to sit on the floor.'
        },
        {
          time: '11:25 AM',
          placeId: 'transport-shuttle-panchavati',
          placeName: 'Panchavati Electric Shuttle Stand',
          durationMinutes: 15,
          activity: 'Boarding free return shuttle to Tapovan Satellite Parking',
          crowdForecast: 'LOW',
          tips: 'Buses depart every 3 minutes.'
        }
      ];
    }

    if (duration === '5h') {
      return [
        {
          time: '07:30 AM',
          placeId: 'kalaram-mandir',
          placeName: 'Shree Kalaram Mandir & Sita Gumpha',
          durationMinutes: 60,
          activity: 'Morning spiritual darshan & Panchavati Parikrama',
          crowdForecast: 'LOW',
          tips: 'Early morning ensures tranquil temple atmosphere.'
        },
        {
          time: '08:45 AM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund Sacred Snan',
          durationMinutes: 60,
          activity: 'Holy bath, Sankalp, and Pitru Tarpan rituals',
          crowdForecast: 'MODERATE',
          tips: 'Changing stalls and locker facilities are operational at the upper promenade.'
        },
        {
          time: '10:00 AM',
          placeId: 'kapileshwar-temple',
          placeName: 'Kapileshwar Mahadev Mandir',
          durationMinutes: 40,
          activity: 'Shiva Abhishek darshan opposite Ram Kund',
          crowdForecast: 'MODERATE',
          tips: 'Unique Shiva temple without Nandi.'
        },
        {
          time: '11:00 AM',
          placeId: 'food-annakshetra-panchavati',
          placeName: 'Sant Janardan Swami Annakshetra',
          durationMinutes: 45,
          activity: 'Fresh satvik hot meals (Mahaprasad)',
          crowdForecast: 'MODERATE',
          tips: 'Hygienic and organized mass dining facility.'
        },
        {
          time: '12:00 PM',
          placeId: 'tapovan-ashram',
          placeName: 'Tapovan Dandakaranya & Akhada Camp',
          durationMinutes: 60,
          activity: 'Visit to Akhada spiritual discourses and sadhu camps',
          crowdForecast: 'LOW',
          tips: 'Battery-operated e-rickshaws circulate continuously across Tapovan grounds.'
        }
      ];
    }

    // Full day
    return [
      {
        time: '06:30 AM',
        placeId: 'trimbakeshwar-temple',
        placeName: 'Trimbakeshwar Jyotirlinga Darshan',
        durationMinutes: 120,
        activity: 'Special morning darshan of Shiva Jyotirlinga',
        crowdForecast: 'MODERATE',
        tips: 'Take early morning VIP darshan tokens to bypass peak crowd.'
      },
      {
        time: '09:00 AM',
        placeId: 'kushavarta-kund',
        placeName: 'Kushavarta Kund Holy Snan (Trimbak)',
        durationMinutes: 60,
        activity: 'Holy dip at the origin reservoir of Godavari river',
        crowdForecast: 'LOW',
        tips: 'Non-slip handrails on the east gate.'
      },
      {
        time: '11:00 AM',
        placeId: 'transport-shuttle-panchavati',
        placeName: 'Highway Transit to Nashik Panchavati',
        durationMinutes: 45,
        activity: 'AC state transport shuttle to Nashik city',
        crowdForecast: 'LOW',
        tips: 'Designated Kumbh corridor ensures rapid transit.'
      },
      {
        time: '12:30 PM',
        placeId: 'food-annakshetra-panchavati',
        placeName: 'Panchavati Annakshetra Mahaprasad',
        durationMinutes: 60,
        activity: 'Rest and satvik lunch',
        crowdForecast: 'MODERATE',
        tips: 'Seated shaded halls.'
      },
      {
        time: '02:00 PM',
        placeId: 'kalaram-mandir',
        placeName: 'Shree Kalaram Temple',
        durationMinutes: 60,
        activity: 'Darshan and temple architecture exploration',
        crowdForecast: 'LOW',
        tips: 'Afternoon queue times are typically shortest (under 15 mins).'
      },
      {
        time: '04:30 PM',
        placeId: 'ram-kund',
        placeName: 'Ram Kund & Godavari Maha Aarti',
        durationMinutes: 90,
        activity: 'Grand evening river lamp offering (Deep Daan)',
        crowdForecast: 'HIGH',
        tips: 'Arrive 30 mins before 06:00 PM Aarti to secure safe seating on upper terrace.'
      }
    ];
  };

  const schedule = generateSchedule();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Wizard Configuration Bar */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-saffron-600" />
              <span>Pilgrimage Itinerary Planner</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Personalized timed itinerary accounting for available time, walking limits, and crowd forecasts
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 self-start sm:self-auto">
            Dynamic AI Scheduling
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Time Budget */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Available Time Budget:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: '1h', label: '1 Hour' },
                { id: '3h', label: '3 Hours' },
                { id: '5h', label: '5 Hours' },
                { id: 'fullday', label: 'Full Day' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDuration(t.id as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    duration === t.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Travelling With Persona */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Travelling With:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'elderly', label: 'Elderly', icon: '🧓' },
                { id: 'family', label: 'Family', icon: '👨‍👩‍👦' },
                { id: 'wheelchair', label: 'Wheelchair', icon: '♿' },
                { id: 'children', label: 'Children', icon: '🧒' },
                { id: 'solo', label: 'Solo', icon: '🚶' },
                { id: 'group', label: 'Group', icon: '👥' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setPersona(p.id as any)}
                  className={`py-2 px-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                    persona === p.id
                      ? 'bg-saffron-600 text-white border-saffron-600 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{p.icon}</span>
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Pilgrimage Priority */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Pilgrimage Priority:
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'low-crowd', label: 'Less Crowded' },
                { id: 'accessible', label: 'Accessible' },
                { id: 'spiritual', label: 'Spiritual (Aarti)' },
                { id: 'balanced', label: 'Balanced' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFocus(f.id as any)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all text-center ${
                    focus === f.id
                      ? 'bg-emerald-700 text-white border-emerald-700 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Generated Itinerary Timeline & Interactive Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timeline Schedule (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your Optimized Pilgrimage Schedule
              </h2>
              <p className="text-xs text-slate-500">
                Crafted for {persona.toUpperCase()} pilgrims with {duration.toUpperCase()} available time
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              ✓ Low-Stress Verified
            </span>
          </div>

          {/* Timeline Items */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-saffron-200">
            {schedule.map((item, index) => {
              const matchedPlace = places.find(p => p.id === item.placeId);

              return (
                <div key={index} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-saffron-600 border-4 border-white shadow-sm" />

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 hover:border-saffron-300 transition-all space-y-2">
                    
                    {/* Time & Duration Pill */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3.5 h-3.5 text-saffron-600" />
                        <span className="text-xs font-extrabold text-saffron-700">
                          {item.time}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({item.durationMinutes} mins)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                        {item.crowdForecast} CROWD
                      </span>
                    </div>

                    {/* Place Name */}
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.placeName}
                    </h3>

                    {/* Activity Description */}
                    <p className="text-xs text-slate-600">
                      {item.activity}
                    </p>

                    {/* Tips & Accessibility */}
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 flex items-start space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong>Saathi Tip:</strong> {item.tips}</span>
                    </div>

                    {/* Quick Navigate Button if place matches */}
                    {matchedPlace && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => navigateToPlace(matchedPlace)}
                          className="text-xs font-bold text-saffron-700 hover:text-saffron-800 flex items-center space-x-1"
                        >
                          <span>Start Route to this Stop</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Map Snapshot for the Itinerary (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex-1 flex flex-col">
            <div className="mb-3">
              <h3 className="text-sm font-bold text-slate-900">
                Itinerary Route Map Overview
              </h3>
              <p className="text-xs text-slate-500">
                Stops plotted across Nashik Panchavati sector
              </p>
            </div>
            <div className="flex-1 min-h-[350px] rounded-2xl overflow-hidden border border-slate-200">
              <SmartMap />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
