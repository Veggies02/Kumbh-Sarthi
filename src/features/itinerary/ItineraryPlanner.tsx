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
  ArrowRight,
  AlertTriangle,
  Zap,
  Utensils,
  Star,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

interface RecommendedRestaurant {
  id: string;
  name: string;
  marathiName: string;
  specialty: string;
  distanceKm: number;
  rating: number;
  priceRange: string;
  timing: string;
  type: 'thali' | 'misal' | 'langar' | 'snacks';
  location: string;
  lat: number;
  lng: number;
  imageUrl: string;
  tag: string;
}

const NASHIK_RESTAURANTS: RecommendedRestaurant[] = [
  {
    id: 'rest-panchavati-yatri',
    name: 'Hotel Panchavati Yatri (Pure Veg Thali)',
    marathiName: 'हॉटेल पंचवटी यात्री थाळी',
    specialty: 'Authentic Maharashtrian Unlimited Thali & Puran Poli',
    distanceKm: 0.4,
    rating: 4.8,
    priceRange: '₹180 - ₹250',
    timing: '11:00 AM - 03:30 PM, 07:00 PM - 10:30 PM',
    type: 'thali',
    location: '430 Vakil Wadi, MG Road / Panchavati',
    lat: 19.9980,
    lng: 73.7885,
    imageUrl: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=800&q=80',
    tag: 'Top Recommended for Families & Elders'
  },
  {
    id: 'rest-sadhana-misal',
    name: 'Sadhana Chulivarchi Misal & Heritage Kitchen',
    marathiName: 'साधना चुलीवरची मिसळ',
    specialty: 'Wood-fired spicy Nashik Misal Pav, Jalebi & Chulivarche Jowar Bhakri',
    distanceKm: 1.2,
    rating: 4.7,
    priceRange: '₹90 - ₹160',
    timing: '08:00 AM - 03:00 PM (Lunch Special)',
    type: 'misal',
    location: 'Bardan Phata, Near Someshwar Waterfalls',
    lat: 20.0210,
    lng: 73.7420,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    tag: 'Famous 50-Year Heritage Specialty'
  },
  {
    id: 'rest-gurudwara-langar',
    name: 'Gurudwara Guru Gobind Singh 24/7 Langar',
    marathiName: 'गुरुद्वारा मोफत २४ तास गुरु का लंगर',
    specialty: 'Hot Dal-Roti, Kheer, Subzi & Warm Milk (Free Seva for all pilgrims)',
    distanceKm: 0.3,
    rating: 5.0,
    priceRange: 'Free Seva (महाप्रसाद)',
    timing: 'Open 24 Hours Continuously',
    type: 'langar',
    location: 'Panchavati Riverbank, Godavari Promenade',
    lat: 20.0065,
    lng: 73.7880,
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80',
    tag: 'Spiritual Community Kitchen'
  },
  {
    id: 'rest-met-annakshetra',
    name: 'MET Bhujbal Pilgrim Annakshetra Langar',
    marathiName: 'एमईटी ज्ञान मंदिर अन्नछत्र',
    specialty: 'Hygienic fresh khichdi, tea, warm milk for toddlers & elders',
    distanceKm: 2.1,
    rating: 4.9,
    priceRange: 'Free Seva',
    timing: '24 Hours Open',
    type: 'langar',
    location: 'MET Campus Gate 2, Adgaon Highway',
    lat: 20.0460,
    lng: 73.8575,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    tag: 'Volunteer Mass Dining'
  },
  {
    id: 'rest-kondaji-chivda',
    name: 'Kondaji Chivda & Traditional Faral Center',
    marathiName: 'कोंडाजी चिवडा व फराळ केंद्र',
    specialty: 'Nashik iconic heritage chivda, sabudana vada & upvas faral',
    distanceKm: 0.6,
    rating: 4.6,
    priceRange: '₹40 - ₹120',
    timing: '08:00 AM - 09:30 PM',
    type: 'snacks',
    location: 'Saraf Bazaar, Old Nashik',
    lat: 19.9975,
    lng: 73.7890,
    imageUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    tag: '100-Year Heritage Snack'
  }
];

export const ItineraryPlanner: React.FC = () => {
  const { 
    places, 
    navigateToPlace, 
    isSurgeActive, 
    triggerCrowdSurge, 
    resetCrowdSimulation 
  } = useKumbh();

  // Inputs
  const [duration, setDuration] = useState<'1h' | '3h' | '5h' | 'fullday'>('3h');
  const [persona, setPersona] = useState<TravelPersona>('elderly');
  const [focus, setFocus] = useState<'spiritual' | 'balanced' | 'low-crowd' | 'accessible'>('low-crowd');
  const [showMealModal, setShowMealModal] = useState(false);

  // Generate dynamic itinerary schedule based on inputs & live surge conditions
  const generateSchedule = (): (ItineraryItem & { isRerouted?: boolean; reroutedReason?: string; isMealStop?: boolean })[] => {
    // -------------------------------------------------------------------------
    // SURGE EMERGENCY ACTIVE: Reroute away from Ram Kund 92% bottleneck!
    // -------------------------------------------------------------------------
    if (isSurgeActive) {
      if (duration === '1h') {
        return [
          {
            time: '09:00 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Mahadev Mandir (Surge Bypass)',
            durationMinutes: 35,
            activity: 'Peaceful Shiva darshan avoiding high-density Ram Kund ghat steps',
            crowdForecast: 'LOW',
            tips: 'Ram Kund is at 92% critical surge. Kapileshwar provides immediate, tranquil darshan.',
            isRerouted: true,
            reroutedReason: 'Diverted from Ram Kund (92% CRITICAL SURGE)'
          },
          {
            time: '09:40 AM',
            placeId: 'water-sita-gumpha',
            placeName: 'Sita Gumpha Quiet Promenade & Hydration',
            durationMinutes: 20,
            activity: 'Hydration and seated rest at shaded heritage corridor',
            crowdForecast: 'LOW',
            tips: 'Uncrowded heritage lane with free chilled RO water dispensing point.',
            isRerouted: true,
            reroutedReason: 'Safely avoiding ghat bottleneck'
          }
        ];
      }

      if (duration === '3h') {
        return [
          {
            time: '08:30 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple (West Gate VIP Ramp)',
            durationMinutes: 45,
            activity: 'Morning Darshan & quiet sanctum prayer',
            crowdForecast: 'MODERATE',
            tips: 'Use West Gate for elderly accessible entry. Volunteer wheelchairs available.',
            isRerouted: false
          },
          {
            time: '09:25 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Temple (Alternate Sacred Snan View)',
            durationMinutes: 35,
            activity: 'Sacred river view without descending into dangerous 92% crowd surge',
            crowdForecast: 'LOW',
            tips: 'Surge mitigation protocol: High vantage terrace overlooking Godavari basin.',
            isRerouted: true,
            reroutedReason: 'Diverted from Ram Kund Ghat Steps (92% Surge Risk)'
          },
          {
            time: '10:05 AM',
            placeId: 'rest-panchavati-yatri',
            placeName: 'Hotel Panchavati Yatri (Early Satvik Lunch)',
            durationMinutes: 45,
            activity: 'Pure Veg Maharashtrian Thali & Rest',
            crowdForecast: 'LOW',
            tips: 'Air-conditioned family seating with elevator access.',
            isMealStop: true,
            isRerouted: false
          },
          {
            time: '11:00 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Dandakaranya & Laxman Rekha Mandir',
            durationMinutes: 50,
            activity: 'Spiritual visit to serene sadhu groves and Akhada pavilions',
            crowdForecast: 'LOW',
            tips: 'Vast open ground with 0.8 p/m² crowd density — extremely peaceful and safe.',
            isRerouted: true,
            reroutedReason: 'Selected for spacious, stampede-free open atmosphere'
          }
        ];
      }

      if (duration === '5h') {
        return [
          {
            time: '07:30 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Mandir',
            durationMinutes: 60,
            activity: 'Morning Aarti darshan',
            crowdForecast: 'LOW',
            tips: 'Early morning ensures tranquil temple atmosphere.',
            isRerouted: false
          },
          {
            time: '08:45 AM',
            placeId: 'someshwar-temple',
            placeName: 'Someshwar Temple & Sacred Falls (Surge Sanctuary)',
            durationMinutes: 60,
            activity: 'Sacred snan in tranquil upstream Godavari waterfalls',
            crowdForecast: 'LOW',
            tips: 'Scenic, safe water flow with non-slip stone embankments. Only 15 mins by shuttle.',
            isRerouted: true,
            reroutedReason: 'Rerouted from surging Ram Kund to pristine upstream Someshwar'
          },
          {
            time: '10:00 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Heritage Lunch',
            durationMinutes: 50,
            activity: 'Famous wood-fired traditional lunch & fresh jalebi',
            crowdForecast: 'MODERATE',
            tips: 'Spacious rural seating under mango orchards, perfect for family relaxation.',
            isMealStop: true,
            isRerouted: false
          },
          {
            time: '11:00 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Akhada Discourses & Holy Sadhugram',
            durationMinutes: 70,
            activity: 'Darshan of saints and Akhada rituals',
            crowdForecast: 'LOW',
            tips: 'Autonomous e-rickshaws operating for senior citizens.',
            isRerouted: true,
            reroutedReason: 'Bypassing congested market lanes'
          },
          {
            time: '12:20 PM',
            placeId: 'muktidham-temple',
            placeName: 'Muktidham Temple (Makhmalabad / Nashik Road)',
            durationMinutes: 40,
            activity: 'Pure white marble temple viewing & Gita inscriptions',
            crowdForecast: 'LOW',
            tips: 'Cool marble interior, comfortable benches for elders.',
            isRerouted: true,
            reroutedReason: 'Low-crowd spiritual alternative'
          }
        ];
      }

      // Full Day Surge Reroute
      return [
        {
          time: '07:00 AM',
          placeId: 'trimbakeshwar-temple',
          placeName: 'Trimbakeshwar Jyotirlinga (Pre-Booked Morning Slot)',
          durationMinutes: 90,
          activity: 'Shiva Jyotirlinga Abhishek & prayer',
          crowdForecast: 'MODERATE',
          tips: 'Trimbak highway corridor open; avoid central Nashik choke-points.',
          isRerouted: false
        },
        {
          time: '09:00 AM',
          placeId: 'kushavarta-kund',
          placeName: 'Kushavarta Kund Snan (Trimbakeshwar)',
          durationMinutes: 50,
          activity: 'Sacred source bath with safety handrails',
          crowdForecast: 'LOW',
          tips: 'Controlled token entry guarantees space.',
          isRerouted: false
        },
        {
          time: '11:00 AM',
          placeId: 'someshwar-temple',
          placeName: 'Someshwar Waterfalls & Riverside Park',
          durationMinutes: 60,
          activity: 'Peaceful upstream river visit avoiding Ram Kund crush',
          crowdForecast: 'LOW',
          tips: 'Surge bypass active. Zero crowd pressure.',
          isRerouted: true,
          reroutedReason: 'Ram Kund 92% Surge Bypass'
        },
        {
          time: '12:30 PM',
          placeId: 'rest-panchavati-yatri',
          placeName: 'Hotel Panchavati Yatri (Afternoon Thali Lunch)',
          durationMinutes: 60,
          activity: 'Pure vegetarian traditional thali dining',
          crowdForecast: 'MODERATE',
          tips: 'Rest and recharge before evening events.',
          isMealStop: true,
          isRerouted: false
        },
        {
          time: '02:30 PM',
          placeId: 'kalaram-mandir',
          placeName: 'Shree Kalaram Temple & Sita Gumpha',
          durationMinutes: 60,
          activity: 'Afternoon quiet darshan',
          crowdForecast: 'LOW',
          tips: 'Shortest afternoon queues.',
          isRerouted: false
        },
        {
          time: '04:30 PM',
          placeId: 'tapovan-ashram',
          placeName: 'Tapovan Evening Satsang & Maha Aarti',
          durationMinutes: 90,
          activity: 'Sacred river deep daan & evening prayers at Tapovan',
          crowdForecast: 'LOW',
          tips: 'Spacious riverside ghat opposite to congested central ghats.',
          isRerouted: true,
          reroutedReason: 'Shifted Aarti to spacious Tapovan Ghat'
        }
      ];
    }

    // -------------------------------------------------------------------------
    // NORMAL CONDITIONS: Tailored to Duration, Persona & Focus
    // -------------------------------------------------------------------------
    if (duration === '1h') {
      return [
        {
          time: '09:00 AM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund (Gate 3 Accessible Enclosure)',
          durationMinutes: 35,
          activity: 'Holy river viewing / brief holy snan (dip) via non-slip ramp',
          crowdForecast: 'MODERATE',
          tips: 'Use Gate 3 ramp for step-free access and proximity to First Aid Camp #1.'
        },
        {
          time: '09:40 AM',
          placeId: 'water-ro-station-ramkund',
          placeName: 'RO Pure Water Hub #1 & Resting Kiosk',
          durationMinutes: 20,
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
          tips: persona === 'elderly' ? 'Enter through West Gate. Free wheelchairs available from trust volunteers.' : 'Stone architectural carvings dating to 1782.'
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
          tips: 'Senior citizens have designated shallow bathing sections with safety railings.'
        },
        {
          time: '10:45 AM',
          placeId: 'rest-panchavati-yatri',
          placeName: 'Hotel Panchavati Yatri (Pure Veg Thali Lunch)',
          durationMinutes: 40,
          activity: 'Delicious Maharashtrian Satvik Lunch',
          crowdForecast: 'MODERATE',
          tips: 'Recommended nearby authentic dining with clean AC seating.',
          isMealStop: true
        },
        {
          time: '11:30 AM',
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
          placeId: 'rest-sadhana-misal',
          placeName: 'Sadhana Chulivarchi Misal & Heritage Kitchen',
          durationMinutes: 50,
          activity: 'Authentic Nashik Misal & Jowar Bhakri Lunch',
          crowdForecast: 'MODERATE',
          tips: 'Famous wood-fired heritage dining with open garden seating.',
          isMealStop: true
        },
        {
          time: '12:10 PM',
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
        placeId: 'rest-panchavati-yatri',
        placeName: 'Hotel Panchavati Yatri (Grand Thali Lunch)',
        durationMinutes: 60,
        activity: 'Rest and authentic Maharashtrian satvik lunch',
        crowdForecast: 'MODERATE',
        tips: 'Seated air-conditioned halls with pure ghee delicacies.',
        isMealStop: true
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

      {/* Surge Status / Simulation Control Bar */}
      <div className={`p-4 rounded-2xl border transition-all ${
        isSurgeActive 
          ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-md' 
          : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isSurgeActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 text-slate-600'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider">
                  {isSurgeActive ? '⚡ LIVE CROWD SURGE REROUTING ACTIVE' : 'CROWD SURGE MONITORING'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSurgeActive ? 'bg-rose-200 text-rose-900 font-extrabold' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isSurgeActive ? 'Ram Kund: 92% CRITICAL' : 'Ram Kund: 42% NORMAL'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                {isSurgeActive 
                  ? 'Ghat steps bottleneck detected. All itineraries are dynamically diverted to Kapileshwar, Someshwar Falls, and Tapovan to prevent stampede risks.'
                  : 'AI flow sensors normal. Itineraries follow standard Ram Kund & Kalaram Mandir heritage routes.'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
            {isSurgeActive ? (
              <button
                onClick={resetCrowdSimulation}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-100 shadow-sm flex items-center space-x-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Normal</span>
              </button>
            ) : (
              <button
                onClick={triggerCrowdSurge}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 shadow-sm flex items-center space-x-1.5 transition-all"
              >
                <Zap className="w-3.5 h-3.5 animate-bounce" />
                <span>Simulate Crowd Surge</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Generated Itinerary Timeline & Interactive Map Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Timeline Schedule (Left 7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <span>Your Optimized Pilgrimage Schedule</span>
                {isSurgeActive && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white">
                    Surge Bypass Mode
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500">
                Crafted for {persona.toUpperCase()} pilgrims with {duration.toUpperCase()} available time
              </p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isSurgeActive 
                ? 'text-rose-700 bg-rose-50 border-rose-200' 
                : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              {isSurgeActive ? '🛡️ Stampede-Safe Route' : '✓ Low-Stress Verified'}
            </span>
          </div>

          {/* Timeline Items */}
          <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-saffron-200">
            {schedule.map((item, index) => {
              const matchedPlace = places.find(p => p.id === item.placeId);
              const matchedRestaurant = NASHIK_RESTAURANTS.find(r => r.id === item.placeId);

              return (
                <div key={index} className="relative group">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm ${
                    item.isRerouted 
                      ? 'bg-rose-600 ring-2 ring-rose-300' 
                      : item.isMealStop 
                      ? 'bg-amber-500 ring-2 ring-amber-200' 
                      : 'bg-saffron-600'
                  }`} />

                  <div className={`rounded-2xl p-4 border transition-all space-y-2.5 ${
                    item.isRerouted 
                      ? 'bg-rose-50/70 border-rose-200 hover:border-rose-400' 
                      : item.isMealStop
                      ? 'bg-amber-50/70 border-amber-200 hover:border-amber-400'
                      : 'bg-slate-50 border-slate-200/80 hover:border-saffron-300'
                  }`}>
                    
                    {/* Time & Duration Pill */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <Clock className={`w-3.5 h-3.5 ${item.isRerouted ? 'text-rose-600' : 'text-saffron-600'}`} />
                        <span className={`text-xs font-extrabold ${item.isRerouted ? 'text-rose-700' : 'text-saffron-700'}`}>
                          {item.time}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          ({item.durationMinutes} mins)
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {item.isRerouted && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center space-x-1">
                            <ShieldAlert className="w-2.5 h-2.5" />
                            <span>SURGE REROUTED</span>
                          </span>
                        )}
                        {item.isMealStop && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 flex items-center space-x-1">
                            <Utensils className="w-2.5 h-2.5" />
                            <span>LUNCH / SATVIK PRASAD</span>
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {item.crowdForecast} CROWD
                        </span>
                      </div>
                    </div>

                    {/* Surge Reason Banner if rerouted */}
                    {item.isRerouted && item.reroutedReason && (
                      <div className="p-2 rounded-lg bg-rose-100/90 border border-rose-300 text-xs font-semibold text-rose-900 flex items-center space-x-2">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span><strong>Reroute Notice:</strong> {item.reroutedReason}</span>
                      </div>
                    )}

                    {/* Place Name */}
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <span>{item.placeName}</span>
                    </h3>

                    {/* Activity Description */}
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.activity}
                    </p>

                    {/* Tips & Accessibility */}
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-[11px] text-slate-600 flex items-start space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span><strong>Saathi Tip:</strong> {item.tips}</span>
                    </div>

                    {/* Quick Navigate Button */}
                    <div className="pt-1 flex justify-end">
                      {matchedPlace ? (
                        <button
                          onClick={() => navigateToPlace(matchedPlace)}
                          className="text-xs font-bold text-saffron-700 hover:text-saffron-800 flex items-center space-x-1"
                        >
                          <span>Start Route to this Stop</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : matchedRestaurant ? (
                        <button
                          onClick={() => {
                            const restPlace: Place = {
                              id: matchedRestaurant.id,
                              name: matchedRestaurant.name,
                              marathiName: matchedRestaurant.marathiName,
                              category: 'food',
                              lat: matchedRestaurant.lat,
                              lng: matchedRestaurant.lng,
                              locationName: matchedRestaurant.location,
                              description: matchedRestaurant.specialty,
                              facilities: ['Drinking Water', 'Dining Area', 'Restrooms', 'Satvik Pure Veg'],
                              accessibility: {
                                wheelchairAccessible: true,
                                hasRamps: true,
                                hasStairsOnly: false,
                                elderlyFriendlyScore: 9,
                                accessibilityNotes: 'Elderly friendly seating with clean facilities.'
                              },
                              openStatus: 'open',
                              openHours: matchedRestaurant.timing,
                              currentCrowdLevel: 'LOW',
                              currentWaitMinutes: 10,
                              imageUrl: matchedRestaurant.imageUrl
                            };
                            navigateToPlace(restPlace);
                          }}
                          className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1"
                        >
                          <span>Navigate to Dining Stop</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : null}
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Map Snapshot & Verified Dining Section (Right 5 Cols) */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          
          {/* Map Snapshot */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Itinerary Route Map Overview
                </h3>
                <p className="text-xs text-slate-500">
                  Stops plotted across Nashik Panchavati sector
                </p>
              </div>
              {isSurgeActive && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-300">
                  Bypassing Ram Kund
                </span>
              )}
            </div>
            <div className="h-[280px] rounded-2xl overflow-hidden border border-slate-200">
              <SmartMap />
            </div>
          </div>

          {/* Recommended Pure-Veg Pilgrimage Dining & Langars */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-800">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Verified Lunch & Dinner Spots
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Hygienic Pure Veg & Free Langars near Panchavati
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                100% Satvik
              </span>
            </div>

            <div className="space-y-3">
              {NASHIK_RESTAURANTS.map((restaurant) => (
                <div 
                  key={restaurant.id}
                  className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={restaurant.imageUrl} 
                      alt={restaurant.name}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      loading="lazy"
                    />
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <h4 className="text-xs font-bold text-slate-900">
                          {restaurant.name}
                        </h4>
                      </div>
                      <p className="text-[11px] font-medium text-saffron-700">
                        {restaurant.marathiName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {restaurant.specialty} • <span className="font-semibold text-slate-700">{restaurant.priceRange}</span>
                      </p>
                      <div className="flex items-center space-x-2 mt-0.5 text-[10px] text-slate-500">
                        <span className="flex items-center text-amber-600 font-bold">
                          <Star className="w-3 h-3 fill-amber-400 stroke-amber-500 mr-0.5" />
                          {restaurant.rating}
                        </span>
                        <span>•</span>
                        <span>{restaurant.distanceKm} km away</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">{restaurant.timing}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const restPlace: Place = {
                        id: restaurant.id,
                        name: restaurant.name,
                        marathiName: restaurant.marathiName,
                        category: 'food',
                        lat: restaurant.lat,
                        lng: restaurant.lng,
                        locationName: restaurant.location,
                        description: restaurant.specialty,
                        facilities: ['Drinking Water', 'Dining Area', 'Restrooms', 'Satvik Pure Veg'],
                        accessibility: {
                          wheelchairAccessible: true,
                          hasRamps: true,
                          hasStairsOnly: false,
                          elderlyFriendlyScore: 9,
                          accessibilityNotes: 'Clean dining area with accessible seating.'
                        },
                        openStatus: 'open',
                        openHours: restaurant.timing,
                        currentCrowdLevel: 'LOW',
                        currentWaitMinutes: 10,
                        imageUrl: restaurant.imageUrl
                      };
                      navigateToPlace(restPlace);
                    }}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center space-x-1 shadow-sm shrink-0 transition-all"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>Navigate</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

