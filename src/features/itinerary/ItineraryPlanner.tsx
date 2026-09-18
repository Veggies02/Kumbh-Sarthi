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

  // Generate dynamic itinerary schedule based on inputs, persona & live surge conditions
  const generateSchedule = (): (ItineraryItem & { isRerouted?: boolean; reroutedReason?: string; isMealStop?: boolean })[] => {
    // =========================================================================
    // SURGE EMERGENCY ACTIVE: Reroute away from Ram Kund based on Persona
    // =========================================================================
    if (isSurgeActive) {
      if (persona === 'children') {
        return [
          {
            time: '08:30 AM',
            placeId: 'someshwar-temple',
            placeName: 'Someshwar Nature Park & Safe Shallow Rapids',
            durationMinutes: 60,
            activity: 'Safe shallow water play, feeding river fish & nature games away from crushing crowds',
            crowdForecast: 'LOW',
            tips: 'Surge safety protocol: Gentle 1.5 ft water depth, non-slip riverbank, 100% crush-free.',
            isRerouted: true,
            reroutedReason: 'Diverted from Ram Kund (92% Stampede Risk) to Safe Child-Friendly Rapids'
          },
          {
            time: '09:40 AM',
            placeId: 'sita-gumpha',
            placeName: 'Sita Gumpha (Ramayana Legend Cave & Shaded Grove)',
            durationMinutes: 45,
            activity: 'Interactive storytelling of Lord Rama, Sita & the Golden Deer in cool shaded cavern',
            crowdForecast: 'LOW',
            tips: 'Uncrowded heritage lane with clean RO chilled water and child tracking security point.',
            isRerouted: true,
            reroutedReason: 'Bypassing congested central ghat steps'
          },
          {
            time: '10:35 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Heritage Village & Jalebi Park',
            durationMinutes: 50,
            activity: 'Traditional lunch, fresh sweet jalebis, ice cream & rural children play park',
            crowdForecast: 'MODERATE',
            tips: 'Spacious mango orchard seating with village bullock carts and safe playground.',
            isMealStop: true,
            isRerouted: false
          },
          {
            time: '11:35 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Sacred Goshala & Elephant Ground',
            durationMinutes: 45,
            activity: 'Feeding cows, receiving temple elephant blessings & playing on wide open lawn',
            crowdForecast: 'LOW',
            tips: 'Expansive open ground with 0.8 ppl/m² density — completely safe for energetic kids.',
            isRerouted: true,
            reroutedReason: 'Spacious open-air environment with zero stampede hazard'
          }
        ];
      }

      if (persona === 'wheelchair') {
        return [
          {
            time: '08:30 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple (West Gate VIP Ramp)',
            durationMinutes: 45,
            activity: 'Barrier-free ramp darshan avoiding congested main stairways',
            crowdForecast: 'MODERATE',
            tips: 'West Gate has a smooth 1:12 slope ramp and volunteer assistance.',
            isRerouted: false
          },
          {
            time: '09:25 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Upper Paved Terrace (Ram Kund Overlook)',
            durationMinutes: 35,
            activity: 'Safe high-vantage sacred river viewing without descending dangerous stairs',
            crowdForecast: 'LOW',
            tips: 'Paved flat viewing deck with clear view of Godavari basin; 100% step-free.',
            isRerouted: true,
            reroutedReason: 'Diverted from Ram Kund Stairways (92% Stampede Alert)'
          },
          {
            time: '10:10 AM',
            placeId: 'rest-panchavati-yatri',
            placeName: 'Hotel Panchavati Yatri (Elevator Dining Hall)',
            durationMinutes: 50,
            activity: 'Satvik Maharashtrian Thali in wheelchair-accessible air-conditioned hall',
            crowdForecast: 'LOW',
            tips: 'Ground level ramp, wide elevator, and accessible western washrooms.',
            isMealStop: true,
            isRerouted: false
          },
          {
            time: '11:10 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Accessible Concrete Promenade',
            durationMinutes: 45,
            activity: 'Smooth roll along shaded sadhu pavilions and Akhada grounds',
            crowdForecast: 'LOW',
            tips: 'Wide asphalt and concrete paths with accessible battery shuttles.',
            isRerouted: true,
            reroutedReason: 'Selected for level terrain and barrier-free transit'
          }
        ];
      }

      if (persona === 'solo') {
        return [
          {
            time: '06:00 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Mahadev Sanctum (Early Dhyan)',
            durationMinutes: 40,
            activity: 'Tranquil solitary Shiva meditation bypassing congested morning snan rush',
            crowdForecast: 'LOW',
            tips: 'Rare ancient Shiva temple without Nandi; extraordinary early morning stillness.',
            isRerouted: true,
            reroutedReason: 'Bypassing 92% Ram Kund bottleneck for deep meditation'
          },
          {
            time: '06:50 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Old Nashik Heritage Stepwells (Barav) & Wada Trail',
            durationMinutes: 50,
            activity: 'Solitary architectural exploration and photography of 250-year-old wooden Wadas',
            crowdForecast: 'LOW',
            tips: 'Quiet ancient heritage lanes away from mainstream pilgrim crowds.',
            isRerouted: true,
            reroutedReason: 'Alternative heritage exploration route'
          },
          {
            time: '07:50 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Heritage Misal (Solo Counter)',
            durationMinutes: 40,
            activity: 'Wood-fired spicy Nashik Misal, curd & fresh jalebis',
            crowdForecast: 'MODERATE',
            tips: 'Express solo seating counter.',
            isMealStop: true,
            isRerouted: false
          },
          {
            time: '08:40 AM',
            placeId: 'someshwar-temple',
            placeName: 'Someshwar Sacred Waterfalls & Upstream Snan',
            durationMinutes: 60,
            activity: 'Solitary peaceful holy dip in pristine upstream river flow',
            crowdForecast: 'LOW',
            tips: 'Crystal clear water with natural stone pools; zero crowd pressure.',
            isRerouted: true,
            reroutedReason: 'Shifted from crowded Ram Kund to serene Someshwar'
          }
        ];
      }

      if (persona === 'group') {
        return [
          {
            time: '08:00 AM',
            placeId: 'someshwar-temple',
            placeName: 'Someshwar River Rapids & Team Holy Snan',
            durationMinutes: 60,
            activity: 'High-energy collective holy bath in spacious upstream river rapids',
            crowdForecast: 'LOW',
            tips: 'Plenty of space for entire group to bathe together without crowding.',
            isRerouted: true,
            reroutedReason: 'Ram Kund 92% Surge Bypass: Moved group snan to spacious Someshwar'
          },
          {
            time: '09:10 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Akhada Volunteer Seva Camp',
            durationMinutes: 60,
            activity: 'Joining sadhu community food distribution seva & crowd marshaling support',
            crowdForecast: 'LOW',
            tips: 'Rewarding group volunteer activity coordinated with local civil defence.',
            isRerouted: true,
            reroutedReason: 'Mobilizing group into constructive volunteer seva'
          },
          {
            time: '10:20 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Misal (Group Banquet Shed)',
            durationMinutes: 50,
            activity: 'Lively group lunch with unlimited misal rassa & papad',
            crowdForecast: 'MODERATE',
            tips: 'Long communal wooden tables seating 15-20 people.',
            isMealStop: true,
            isRerouted: false
          },
          {
            time: '11:20 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple (Group Courtyard Darshan)',
            durationMinutes: 45,
            activity: 'Collective prayer chanting and historic stone architecture tour',
            crowdForecast: 'MODERATE',
            tips: 'Spacious outer courtyard where groups can reassemble before entering.',
            isRerouted: false
          }
        ];
      }

      // Default Surge for Elderly / Family
      return [
        {
          time: '08:30 AM',
          placeId: 'kalaram-mandir',
          placeName: 'Shree Kalaram Temple (West Gate VIP Ramp)',
          durationMinutes: 45,
          activity: 'Morning Darshan & quiet sanctum prayer away from ghat crowd',
          crowdForecast: 'MODERATE',
          tips: 'West Gate ramp entry ensures smooth access without physical strain.',
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

    // =========================================================================
    // NORMAL CONDITIONS: Tailored to TRAVELLING WITH (Persona) & DURATION
    // =========================================================================

    // -------------------------------------------------------------------------
    // 1. CHILDREN PERSONA (Safe water, fun storytelling, animals & kid treats)
    // -------------------------------------------------------------------------
    if (persona === 'children') {
      if (duration === '1h') {
        return [
          {
            time: '09:00 AM',
            placeId: 'sita-gumpha',
            placeName: 'Sita Gumpha (Laxman Rekha Storytelling Cave)',
            durationMinutes: 35,
            activity: 'Interactive Ramayana cave walk discovering where Lord Rama, Sita & Lakshman lived',
            crowdForecast: 'LOW',
            tips: 'Well-lit caverns with exciting history. Children receive a complimentary Ramayana comic.'
          },
          {
            time: '09:40 AM',
            placeId: 'rest-kondaji-chivda',
            placeName: 'Kondaji Heritage Faral & Fresh Sweet Lassi Kiosk',
            durationMinutes: 20,
            activity: 'Chilled sweet lassi, milk, warm jalebis & shaded seating',
            crowdForecast: 'LOW',
            tips: 'Clean handwash station and child-friendly snacks.',
            isMealStop: true
          }
        ];
      }

      if (duration === '3h') {
        return [
          {
            time: '08:30 AM',
            placeId: 'sita-gumpha',
            placeName: 'Sita Gumpha & Five Sacred Banyan Trees (Panch-Vati)',
            durationMinutes: 40,
            activity: 'Exploring the 5 giant historic Banyan trees & exciting cavern passages',
            crowdForecast: 'LOW',
            tips: 'Free child identity safety wristband with parent phone number provided at the entrance.'
          },
          {
            time: '09:15 AM',
            placeId: 'someshwar-temple',
            placeName: 'Someshwar Nature Park & Shallow Waterfalls',
            durationMinutes: 50,
            activity: 'Paddling in shallow natural river pools, feeding fish & wide grassy lawn play',
            crowdForecast: 'LOW',
            tips: 'Gentle 1.5 ft water depth with non-slip stone embankments. Completely safe for toddlers!'
          },
          {
            time: '10:15 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Heritage Village & Jalebi Park',
            durationMinutes: 45,
            activity: 'Rural outdoor lunch, seeing village bullock carts, wooden swings & fresh jalebis',
            crowdForecast: 'MODERATE',
            tips: 'Spacious mango grove with dedicated children playground and animal petting corner.',
            isMealStop: true
          },
          {
            time: '11:10 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Sacred Goshala & Elephant Blessing Grounds',
            durationMinutes: 40,
            activity: 'Feeding sacred cows, seeing decorated temple elephants & open field walks',
            crowdForecast: 'LOW',
            tips: 'Wide open fields with zero crush risk and fresh sugarcane juice kiosks.'
          }
        ];
      }

      if (duration === '5h') {
        return [
          {
            time: '08:00 AM',
            placeId: 'someshwar-temple',
            placeName: 'Someshwar Nature Park & Waterfalls',
            durationMinutes: 60,
            activity: 'Morning shallow water splash and family nature walk along Godavari river',
            crowdForecast: 'LOW',
            tips: 'Safe natural stone banks with gentle water currents.'
          },
          {
            time: '09:10 AM',
            placeId: 'sita-gumpha',
            placeName: 'Sita Gumpha & Living Ramayana Heritage Caves',
            durationMinutes: 50,
            activity: 'Cave exploration and learning ancient legends with illustrated story cards',
            crowdForecast: 'LOW',
            tips: 'Cool naturally air-conditioned cavern interior.'
          },
          {
            time: '10:10 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Open Festival Courtyard',
            durationMinutes: 40,
            activity: 'Visiting the open temple square, seeing temple flags & traditional puppet displays',
            crowdForecast: 'LOW',
            tips: 'Open courtyard with ample space for strollers and toddlers.'
          },
          {
            time: '11:00 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Heritage Kitchen (Child Feast)',
            durationMinutes: 50,
            activity: 'Authentic Maharashtrian village lunch with curd, mild bhakri & ice cream',
            crowdForecast: 'MODERATE',
            tips: 'High chairs and baby food warming assistance available.',
            isMealStop: true
          },
          {
            time: '12:00 PM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Goshala, Butterfly Garden & Akhada Ground',
            durationMinutes: 60,
            activity: 'Seeing sacred elephants, touching calves at Goshala & open garden exploration',
            crowdForecast: 'LOW',
            tips: 'Electric eco-rickshaws available for tired little legs.'
          }
        ];
      }

      // Full Day Children
      return [
        {
          time: '07:30 AM',
          placeId: 'someshwar-temple',
          placeName: 'Someshwar Nature Park & Waterfalls',
          durationMinutes: 90,
          activity: 'Morning nature retreat, gentle holy dip in shallow stone pools & birdwatching',
          crowdForecast: 'LOW',
          tips: 'Pristine upstream water with zero current hazard.'
        },
        {
          time: '09:15 AM',
          placeId: 'sita-gumpha',
          placeName: 'Sita Gumpha & Five Sacred Banyan Trees',
          durationMinutes: 60,
          activity: 'Cave discovery & touching ancient Ramayana Banyan tree roots',
          crowdForecast: 'LOW',
          tips: 'Child wristbands verified by Maharashtra Police Lost & Found camp.'
        },
        {
          time: '10:30 AM',
          placeId: 'kapileshwar-temple',
          placeName: 'Kapileshwar Festive Courtyard & Puppet Show',
          durationMinutes: 45,
          activity: 'Watching traditional Kathputli puppet performance and temple blessings',
          crowdForecast: 'LOW',
          tips: 'Seated shade under peepal trees.'
        },
        {
          time: '11:30 AM',
          placeId: 'rest-sadhana-misal',
          placeName: 'Sadhana Chulivarchi Heritage Village & Farm Lunch',
          durationMinutes: 60,
          activity: 'Rural lunch feast, bullock cart rides & homemade kulfi',
          crowdForecast: 'MODERATE',
          tips: 'Full family relaxation before afternoon activities.',
          isMealStop: true
        },
        {
          time: '01:00 PM',
          placeId: 'muktidham-temple',
          placeName: 'Muktidham Marble Complex & Ramayana Dioramas',
          durationMinutes: 60,
          activity: 'Exploring life-size animated Ramayana models and cool marble gardens',
          crowdForecast: 'LOW',
          tips: 'Pleasantly cool interior, ideal for afternoon heat.'
        },
        {
          time: '02:30 PM',
          placeId: 'tapovan-ashram',
          placeName: 'Tapovan Sacred Goshala & Elephant Grounds',
          durationMinutes: 90,
          activity: 'Feeding cows, seeing elephant bath rituals & open field recreation',
          crowdForecast: 'LOW',
          tips: 'Vast grassy grounds with 0.8 p/m² density — completely safe for kids.'
        },
        {
          time: '04:30 PM',
          placeId: 'ram-kund',
          placeName: 'Godavari Upper Promenade & Evening Deepotsav',
          durationMinutes: 60,
          activity: 'Releasing eco-friendly floating flower lamps (deep daan) from upper family terrace',
          crowdForecast: 'MODERATE',
          tips: 'Stay on upper safety deck; stunning view of evening Aarti without crowding.'
        }
      ];
    }

    // -------------------------------------------------------------------------
    // 2. ELDERLY PERSONA (Zero steps, VIP ramps, seated darshan, medical aid)
    // -------------------------------------------------------------------------
    if (persona === 'elderly') {
      if (duration === '1h') {
        return [
          {
            time: '09:00 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple (West Gate VIP Senior Ramp)',
            durationMinutes: 35,
            activity: 'Step-free darshan with volunteers and peaceful seated sanctum prayer',
            crowdForecast: 'MODERATE',
            tips: 'Zero stair climbing. Free wheelchairs and motorized buggy shuttles from parking.'
          },
          {
            time: '09:40 AM',
            placeId: 'water-ro-station-ramkund',
            placeName: 'Senior Resting Pavilion & Pure RO Water Hub #1',
            durationMinutes: 20,
            activity: 'Blood pressure check, hydration, and comfortable cushioned seating',
            crowdForecast: 'LOW',
            tips: 'Paramedic doctor on site 24/7 with emergency first-aid and resting cots.'
          }
        ];
      }

      if (duration === '3h') {
        return [
          {
            time: '08:30 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple (West Gate Accessible Corridor)',
            durationMinutes: 45,
            activity: 'Quiet morning Aarti darshan without standing in long queues',
            crowdForecast: 'MODERATE',
            tips: 'Dedicated senior citizens lane with wooden sitting benches inside the sanctum.'
          },
          {
            time: '09:20 AM',
            placeId: 'ram-kund',
            placeName: 'Ram Kund Senior Enclosure (Gate 3 Railing Ghat)',
            durationMinutes: 40,
            activity: 'Holy snan via gentle non-slip ramp with stainless steel handrails',
            crowdForecast: 'MODERATE',
            tips: 'Shallow bathing zone (water height 2.5 ft) with safety lifeguards on duty.'
          },
          {
            time: '10:05 AM',
            placeId: 'rest-panchavati-yatri',
            placeName: 'Hotel Panchavati Yatri (Seated Maharashtrian Thali)',
            durationMinutes: 45,
            activity: 'Unlimited satvik thali with gentle digestive herbs and AC seating',
            crowdForecast: 'MODERATE',
            tips: 'Ground floor entrance with lift to dining hall and clean western washrooms.',
            isMealStop: true
          },
          {
            time: '10:55 AM',
            placeId: 'transport-shuttle-panchavati',
            placeName: 'Panchavati Senior Electric Shuttle Station',
            durationMinutes: 20,
            activity: 'Low-floor electric shuttle ride back to base camp without walking',
            crowdForecast: 'LOW',
            tips: 'Free priority boarding for senior citizens and caregivers.'
          }
        ];
      }

      if (duration === '5h') {
        return [
          {
            time: '07:30 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Mandir (West Gate Morning Darshan)',
            durationMinutes: 60,
            activity: 'Peaceful morning prayer with seated bhajan viewing',
            crowdForecast: 'LOW',
            tips: 'West Gate has zero stairs and shaded waiting benches.'
          },
          {
            time: '08:40 AM',
            placeId: 'ram-kund',
            placeName: 'Ram Kund Senior Shallow Railing Enclosure (Gate 3)',
            durationMinutes: 50,
            activity: 'Sacred holy bath with handrail assistance and non-slip rubber mats',
            crowdForecast: 'MODERATE',
            tips: 'Designated changing cubicles reserved for seniors right at the ramp head.'
          },
          {
            time: '09:40 AM',
            placeId: 'water-ro-station-ramkund',
            placeName: 'Senior Medical Camp & Shaded Resting Pavilion #2',
            durationMinutes: 30,
            activity: 'Free health vitals check, warm herbal tea & hydration',
            crowdForecast: 'LOW',
            tips: 'On-duty geriatric nurses and free ORS packets available.'
          },
          {
            time: '10:20 AM',
            placeId: 'rest-panchavati-yatri',
            placeName: 'Hotel Panchavati Yatri (Relaxed Seated Lunch)',
            durationMinutes: 50,
            activity: 'Mild digestive satvik thali in air-conditioned comfort',
            crowdForecast: 'MODERATE',
            tips: 'Elevator access; wheelchairs can roll directly to the table.',
            isMealStop: true
          },
          {
            time: '11:20 AM',
            placeId: 'muktidham-temple',
            placeName: 'Muktidham Marble Temple (Wheelchair Ramps & Seating)',
            durationMinutes: 60,
            activity: 'Cool marble temple viewing with 18 chapters of Bhagavad Gita carved on walls',
            crowdForecast: 'LOW',
            tips: 'Benches every 20 meters; very peaceful with minimal physical exertion.'
          },
          {
            time: '12:30 PM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Shaded Satsang Pavilion (Seated Katha)',
            durationMinutes: 60,
            activity: 'Sitting comfortably under marquee listening to holy discourses and flute recital',
            crowdForecast: 'LOW',
            tips: 'Battery e-rickshaws provide door-to-door transit across the grounds.'
          }
        ];
      }

      // Full Day Elderly
      return [
        {
          time: '07:00 AM',
          placeId: 'trimbakeshwar-temple',
          placeName: 'Trimbakeshwar Jyotirlinga (Senior VIP Corridor)',
          durationMinutes: 90,
          activity: 'Step-free VIP morning Abhishek darshan of sacred Shiva Jyotirlinga',
          crowdForecast: 'MODERATE',
          tips: 'Pre-booked senior token provides direct entry with volunteer escort.'
        },
        {
          time: '08:45 AM',
          placeId: 'kushavarta-kund',
          placeName: 'Kushavarta Kund (Senior Handrail Enclosure)',
          durationMinutes: 50,
          activity: 'Sacred source snan with stainless steel railings and non-slip rubber mats',
          crowdForecast: 'LOW',
          tips: 'Assisted by certified river lifeguards.'
        },
        {
          time: '10:30 AM',
          placeId: 'transport-shuttle-panchavati',
          placeName: 'AC Transit Shuttle to Nashik City',
          durationMinutes: 45,
          activity: 'Comfortable air-conditioned bus ride with cushioned recliner seats',
          crowdForecast: 'LOW',
          tips: 'Exclusive bus lane avoids highway traffic.'
        },
        {
          time: '11:30 AM',
          placeId: 'rest-panchavati-yatri',
          placeName: 'Hotel Panchavati Yatri (Grand Satvik Thali)',
          durationMinutes: 60,
          activity: 'Extended restful lunch with pure ghee dal, soft phulkas & basundi',
          crowdForecast: 'MODERATE',
          tips: 'Relaxing ambient music and clean private washrooms.',
          isMealStop: true
        },
        {
          time: '01:00 PM',
          placeId: 'muktidham-temple',
          placeName: 'Muktidham Marble Temple Sanctuary',
          durationMinutes: 60,
          activity: 'Cool afternoon marble contemplation with zero stairs',
          crowdForecast: 'LOW',
          tips: 'Extremely peaceful resting environment during noon hours.'
        },
        {
          time: '02:30 PM',
          placeId: 'kalaram-mandir',
          placeName: 'Shree Kalaram Temple (West Gate Seated Darshan)',
          durationMinutes: 60,
          activity: 'Afternoon quiet darshan and temple blessing',
          crowdForecast: 'LOW',
          tips: 'Very short afternoon queues (under 10 mins).'
        },
        {
          time: '04:00 PM',
          placeId: 'tapovan-ashram',
          placeName: 'Tapovan Senior Discourse Pavilion & Evening Kirtan',
          durationMinutes: 90,
          activity: 'Comfortable seated Aarti viewing and spiritual blessings from Akhada sadhus',
          crowdForecast: 'LOW',
          tips: 'Spacious riverside marquee with unobstructed views of the river illumination.'
        }
      ];
    }

    // -------------------------------------------------------------------------
    // 3. WHEELCHAIR PERSONA (100% barrier-free, tactile paving, accessible WC)
    // -------------------------------------------------------------------------
    if (persona === 'wheelchair') {
      if (duration === '1h') {
        return [
          {
            time: '09:00 AM',
            placeId: 'ram-kund',
            placeName: 'Godavari North Bank Barrier-Free Esplanade',
            durationMinutes: 35,
            activity: 'Smooth paved riverfront promenade roll overlooking the holy Ram Kund',
            crowdForecast: 'LOW',
            tips: '100% barrier-free with tactile paving and gentle 1:12 gradient ramps.'
          },
          {
            time: '09:40 AM',
            placeId: 'water-ro-station-ramkund',
            placeName: 'Accessible Pilgrim Service Hub #1 (Ramps & Bio-Toilets)',
            durationMinutes: 20,
            activity: 'Accessible bio-toilets, wheelchair battery charging & drinking water',
            crowdForecast: 'LOW',
            tips: 'Wide 36-inch doors, grab rails, and wheelchair-level RO water dispensing taps.'
          }
        ];
      }

      if (duration === '3h') {
        return [
          {
            time: '08:30 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple (Dedicated Wheelchair Ramp Entrance)',
            durationMinutes: 45,
            activity: 'Smooth wheelchair ramp leading directly to sanctum viewing platform',
            crowdForecast: 'MODERATE',
            tips: 'West Gate has a dedicated accessibility corridor with volunteer pushers if needed.'
          },
          {
            time: '09:20 AM',
            placeId: 'ram-kund',
            placeName: 'North Bank Accessible Riverfront Walkway & Ramp Overlook',
            durationMinutes: 40,
            activity: 'Scenic riverfront roll enjoying the temple views and sacred vibes with zero stairs',
            crowdForecast: 'LOW',
            tips: 'Level concrete paving along the entire 800-meter promenade.'
          },
          {
            time: '10:05 AM',
            placeId: 'rest-panchavati-yatri',
            placeName: 'Hotel Panchavati Yatri (Elevator Accessible Dining)',
            durationMinutes: 45,
            activity: 'Comfortable dining at wheelchair-height banquet tables',
            crowdForecast: 'LOW',
            tips: 'Entrance has a concrete ramp; elevator takes wheelchairs directly to the dining floor.',
            isMealStop: true
          },
          {
            time: '10:55 AM',
            placeId: 'transport-shuttle-panchavati',
            placeName: 'Tapovan Low-Floor Transit Hub (Hydraulic Bus Depot)',
            durationMinutes: 20,
            activity: 'Accessible low-floor electric bus boarding with automated hydraulic ramp',
            crowdForecast: 'LOW',
            tips: 'Buses have dedicated wheelchair anchor clamps inside.'
          }
        ];
      }

      if (duration === '5h') {
        return [
          {
            time: '08:00 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple (Barrier-Free Corridor)',
            durationMinutes: 60,
            activity: 'Ramp-assisted morning darshan and prayer',
            crowdForecast: 'LOW',
            tips: 'Level smooth stone paving without thresholds.'
          },
          {
            time: '09:10 AM',
            placeId: 'ram-kund',
            placeName: 'Godavari Barrier-Free Promenade & Ram Kund Ramp Overlook',
            durationMinutes: 50,
            activity: 'Rolling along scenic riverbank taking part in holy rituals from the ramped deck',
            crowdForecast: 'MODERATE',
            tips: 'Elevated viewing platform provides safe, dignified darshan without navigating crowds.'
          },
          {
            time: '10:10 AM',
            placeId: 'rest-panchavati-yatri',
            placeName: 'Hotel Panchavati Yatri (Accessible Lunch)',
            durationMinutes: 50,
            activity: 'Satvik lunch in barrier-free dining hall',
            crowdForecast: 'LOW',
            tips: 'Fully accessible ground restrooms with assistance buttons.',
            isMealStop: true
          },
          {
            time: '11:10 AM',
            placeId: 'muktidham-temple',
            placeName: 'Muktidham Accessible Marble Complex (Zero Steps)',
            durationMinutes: 60,
            activity: 'Completely level marble floors throughout the entire 12-temple replica complex',
            crowdForecast: 'LOW',
            tips: 'One of the most wheelchair-friendly pilgrimage sites in Maharashtra.'
          },
          {
            time: '12:20 PM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Accessible Concrete Walkway & Ashram Camp',
            durationMinutes: 60,
            activity: 'Rolling through peaceful green orchards and sadhu pavilion avenues',
            crowdForecast: 'LOW',
            tips: 'Paved pathways with accessible electric golf carts on call.'
          }
        ];
      }

      // Full Day Wheelchair
      return [
        {
          time: '07:30 AM',
          placeId: 'ram-kund',
          placeName: 'Godavari North Bank Barrier-Free Esplanade',
          durationMinutes: 60,
          activity: 'Morning riverfront roll during peaceful dawn hours with cool breeze',
          crowdForecast: 'LOW',
          tips: 'Smooth, tactile-guided concrete pathway.'
        },
        {
          time: '08:45 AM',
          placeId: 'kalaram-mandir',
          placeName: 'Shree Kalaram Temple (VIP Ramp Gate)',
          durationMinutes: 60,
          activity: 'Direct ramp access to inner sanctum viewing gallery',
          crowdForecast: 'MODERATE',
          tips: 'Wheelchair marshals assist with shoe deposit and gate entry.'
        },
        {
          time: '10:00 AM',
          placeId: 'kapileshwar-temple',
          placeName: 'Kapileshwar Accessible Overlook Deck',
          durationMinutes: 45,
          activity: 'Viewing ancient Shiva temple and river basin from accessible terrace',
          crowdForecast: 'LOW',
          tips: 'Ramped approach from Tilak Road.'
        },
        {
          time: '11:00 AM',
          placeId: 'rest-panchavati-yatri',
          placeName: 'Hotel Panchavati Yatri (Grand Thali Lunch)',
          durationMinutes: 60,
          activity: 'Relaxing accessible lunch with elevator access',
          crowdForecast: 'MODERATE',
          tips: 'Spacious table arrangement accommodates all wheelchair sizes.',
          isMealStop: true
        },
        {
          time: '01:00 PM',
          placeId: 'muktidham-temple',
          placeName: 'Muktidham Marble Complex (100% Barrier-Free)',
          durationMinutes: 75,
          activity: 'Roll through smooth marble corridors exploring Gita carvings and cool shrines',
          crowdForecast: 'LOW',
          tips: 'Level surfaces, no thresholds, clean accessible restrooms.'
        },
        {
          time: '02:45 PM',
          placeId: 'someshwar-temple',
          placeName: 'Someshwar Paved River View Deck',
          durationMinutes: 60,
          activity: 'Enjoying scenic waterfall views from flat observation platform',
          crowdForecast: 'LOW',
          tips: 'Paved parking lot right beside the ramped viewing platform.'
        },
        {
          time: '04:15 PM',
          placeId: 'tapovan-ashram',
          placeName: 'Tapovan Accessible Pavilion & Evening Aarti Roll',
          durationMinutes: 90,
          activity: 'Evening devotional prayers on wide paved riverside terrace',
          crowdForecast: 'LOW',
          tips: 'Ramped viewing stands provide unobstructed sightlines for the Aarti.'
        }
      ];
    }

    // -------------------------------------------------------------------------
    // 4. FAMILY PERSONA (Changing stalls, photo points, authentic thali dining)
    // -------------------------------------------------------------------------
    if (persona === 'family') {
      if (duration === '1h') {
        return [
          {
            time: '09:00 AM',
            placeId: 'ram-kund',
            placeName: 'Ram Kund Family Enclosure & Ghat Steps',
            durationMinutes: 35,
            activity: 'Sacred snan together with family photograph point by the holy Godavari',
            crowdForecast: 'MODERATE',
            tips: 'Changing rooms, locker stalls, and dry luggage custody available at Upper Deck #2.'
          },
          {
            time: '09:40 AM',
            placeId: 'rest-kondaji-chivda',
            placeName: 'Kondaji Chivda & Traditional Family Chai Point',
            durationMinutes: 20,
            activity: 'Warm special ginger tea, fresh milk & Nashik heritage chivda',
            crowdForecast: 'LOW',
            tips: 'Safe shaded family gathering point with seating.',
            isMealStop: true
          }
        ];
      }

      if (duration === '3h') {
        return [
          {
            time: '08:30 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple & Sita Gumpha',
            durationMinutes: 50,
            activity: 'Family darshan and exploring the historic Ramayana premises together',
            crowdForecast: 'MODERATE',
            tips: 'Shoe deposit counter #2 is closest to the exit; keeps family footwear together.'
          },
          {
            time: '09:25 AM',
            placeId: 'ram-kund',
            placeName: 'Ram Kund & Lakshman Kund Sacred Family Snan',
            durationMinutes: 45,
            activity: 'Holy bathing ritual, sankalp, and deep daan with the whole family',
            crowdForecast: 'MODERATE',
            tips: 'Dedicated family changing tents right on the upper terrace with security guards.'
          },
          {
            time: '10:15 AM',
            placeId: 'rest-panchavati-yatri',
            placeName: 'Hotel Panchavati Yatri (Grand Family Thali)',
            durationMinutes: 50,
            activity: 'Relaxed family lunch with unlimited puran poli, hot jalebi & authentic thali',
            crowdForecast: 'MODERATE',
            tips: 'Family dining cabins available with fast service.',
            isMealStop: true
          },
          {
            time: '11:10 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Panchavati Heritage Promenade & Souvenir Market',
            durationMinutes: 25,
            activity: 'Buying wooden toys, brass puja vessels, and sacred Kumbh mementos',
            crowdForecast: 'LOW',
            tips: 'Government-certified fixed price souvenir stalls.'
          }
        ];
      }

      if (duration === '5h') {
        return [
          {
            time: '07:30 AM',
            placeId: 'kalaram-mandir',
            placeName: 'Shree Kalaram Temple & Sita Gumpha',
            durationMinutes: 60,
            activity: 'Family morning darshan and Panchavati Parikrama',
            crowdForecast: 'LOW',
            tips: 'Early morning ensures pleasant weather and peaceful temple lines.'
          },
          {
            time: '08:40 AM',
            placeId: 'ram-kund',
            placeName: 'Ram Kund Sacred Family Snan & Changing Stalls',
            durationMinutes: 60,
            activity: 'Sacred bath, Pitru Tarpan ritual & floating brass lamps',
            crowdForecast: 'MODERATE',
            tips: 'Secure lockers available at Municipal Kiosk #3.'
          },
          {
            time: '09:50 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Mahadev Mandir',
            durationMinutes: 40,
            activity: 'Shiva Abhishek prayer opposite Ram Kund',
            crowdForecast: 'MODERATE',
            tips: 'Unique historic temple overlooking the holy river basin.'
          },
          {
            time: '10:40 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Heritage Kitchen (Family Lunch)',
            durationMinutes: 50,
            activity: 'Wood-fired traditional lunch, Jowar bhakri, and fresh jalebi feast',
            crowdForecast: 'MODERATE',
            tips: 'Open garden seating under fruit trees, ideal for whole family relaxation.',
            isMealStop: true
          },
          {
            time: '11:40 AM',
            placeId: 'someshwar-temple',
            placeName: 'Someshwar Waterfalls & Riverside Family Park',
            durationMinutes: 60,
            activity: 'Picturesque family photography by the waterfalls & serene river walk',
            crowdForecast: 'LOW',
            tips: 'Plenty of shade, ice-cream stalls, and non-slip river paths.'
          }
        ];
      }

      // Full Day Family
      return [
        {
          time: '07:00 AM',
          placeId: 'trimbakeshwar-temple',
          placeName: 'Trimbakeshwar Jyotirlinga (Family Token Slot)',
          durationMinutes: 100,
          activity: 'Family morning Abhishek darshan of sacred Shiva Jyotirlinga',
          crowdForecast: 'MODERATE',
          tips: 'Pre-booked family token guarantees synchronized entry for everyone.'
        },
        {
          time: '08:50 AM',
          placeId: 'kushavarta-kund',
          placeName: 'Kushavarta Kund Holy Snan (Trimbakeshwar)',
          durationMinutes: 50,
          activity: 'Family sacred dip at the origin reservoir of Godavari river',
          crowdForecast: 'LOW',
          tips: 'Family changing rooms available on the north pavilion.'
        },
        {
          time: '10:30 AM',
          placeId: 'kalaram-mandir',
          placeName: 'Shree Kalaram Temple & Sita Gumpha',
          durationMinutes: 60,
          activity: 'Panchavati heritage darshan with family group photo at the historic entrance',
          crowdForecast: 'MODERATE',
          tips: 'Shoe lockers keep all family footwear together.'
        },
        {
          time: '11:45 AM',
          placeId: 'rest-panchavati-yatri',
          placeName: 'Hotel Panchavati Yatri (Grand Maharashtrian Thali Lunch)',
          durationMinutes: 60,
          activity: 'Extended family lunch feast with unlimited specialties',
          crowdForecast: 'MODERATE',
          tips: 'Air-conditioned dining hall with prompt service.',
          isMealStop: true
        },
        {
          time: '01:15 PM',
          placeId: 'muktidham-temple',
          placeName: 'Muktidham Marble Temple & Pilgrimage Garden',
          durationMinutes: 60,
          activity: 'Visiting the 12 Jyotirlinga replicas under one roof in cool marble halls',
          crowdForecast: 'LOW',
          tips: 'Pleasant, uncrowded atmosphere during mid-day.'
        },
        {
          time: '02:45 PM',
          placeId: 'someshwar-temple',
          placeName: 'Someshwar Waterfalls & River Park',
          durationMinutes: 60,
          activity: 'Family leisure walk, riverbank tea & photo sessions',
          crowdForecast: 'LOW',
          tips: 'Scenic, safe water views with cool breeze.'
        },
        {
          time: '04:15 PM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund Grand Godavari Evening Maha Aarti',
          durationMinutes: 90,
          activity: 'Family deep daan & witnessing the magnificent 1,000-lamp river Aarti',
          crowdForecast: 'HIGH',
          tips: 'Arrive by 04:30 PM to reserve comfortable seating on the upper family pavilion.'
        }
      ];
    }

    // -------------------------------------------------------------------------
    // 5. SOLO PERSONA (Dawn snan, dhyan, ancient hidden wadas & stepwells)
    // -------------------------------------------------------------------------
    if (persona === 'solo') {
      if (duration === '1h') {
        return [
          {
            time: '05:30 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Mahadev Sanctum (Dawn Dhyan)',
            durationMinutes: 35,
            activity: 'Quiet early morning Shiva meditation in rare temple without Nandi',
            crowdForecast: 'LOW',
            tips: 'Early dawn offers pin-drop silence and powerful spiritual resonance.'
          },
          {
            time: '06:10 AM',
            placeId: 'ram-kund',
            placeName: 'Ram Kund Brahma Muhurta Snan',
            durationMinutes: 20,
            activity: 'Swift, invigorating holy dip during the auspicious dawn hours',
            crowdForecast: 'LOW',
            tips: 'Zero crowd delays before 07:00 AM; water is calm and sacred.'
          }
        ];
      }

      if (duration === '3h') {
        return [
          {
            time: '06:00 AM',
            placeId: 'ram-kund',
            placeName: 'Ram Kund Dawn Shahi Snan (Brisk Ritual Dip)',
            durationMinutes: 45,
            activity: 'Pure spiritual immersion at sunrise with Vedic chanting by priests',
            crowdForecast: 'LOW',
            tips: 'Carry a quick-dry microfiber towel in your daypack for fast transitions.'
          },
          {
            time: '06:50 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Old Nashik Heritage Stepwells (Barav) & Wada Trail',
            durationMinutes: 45,
            activity: 'Solitary architectural exploration and photography of 250-year-old wooden Wadas',
            crowdForecast: 'LOW',
            tips: 'Narrow alleys reveal exquisite hand-carved teakwood balconies and secret stepwells.'
          },
          {
            time: '07:40 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Temple Silent Sanctum',
            durationMinutes: 35,
            activity: 'Deep inner contemplation and Shiva lingam prayer',
            crowdForecast: 'LOW',
            tips: 'Uncrowded side alcoves are ideal for silent Japa meditation.'
          },
          {
            time: '08:20 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Heritage Kitchen (Solo Quick Counter)',
            durationMinutes: 40,
            activity: 'Authentic spicy misal pav, curd, and hot jalebi at the quick express counter',
            crowdForecast: 'MODERATE',
            tips: 'Solo travelers get seated immediately without waiting for large tables.',
            isMealStop: true
          }
        ];
      }

      if (duration === '5h') {
        return [
          {
            time: '05:30 AM',
            placeId: 'ram-kund',
            placeName: 'Ram Kund Brahma Muhurta Holy Snan',
            durationMinutes: 45,
            activity: 'Dawn sacred dip with Vedic mantras echoing across the Godavari mist',
            crowdForecast: 'LOW',
            tips: 'The most sacred and solitary hour of the Kumbh Mela.'
          },
          {
            time: '06:20 AM',
            placeId: 'kapileshwar-temple',
            placeName: 'Kapileshwar Mahadev Deep Sanctum Meditation',
            durationMinutes: 45,
            activity: 'Solitary meditation in the cool stone sanctum',
            crowdForecast: 'LOW',
            tips: 'Atmosphere of ancient ascetic tapasya.'
          },
          {
            time: '07:15 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Old Nashik Heritage Wooden Wada & Barav Stepwell Trail',
            durationMinutes: 50,
            activity: 'Street photography and exploring hidden heritage water structures',
            crowdForecast: 'LOW',
            tips: 'Fascinating 18th-century Peshwa hydraulic engineering.'
          },
          {
            time: '08:15 AM',
            placeId: 'rest-sadhana-misal',
            placeName: 'Sadhana Chulivarchi Misal (Solo Fast Counter)',
            durationMinutes: 40,
            activity: 'Wood-fired spicy Nashik misal, jalebi & tea',
            crowdForecast: 'MODERATE',
            tips: 'Fast self-service counter.',
            isMealStop: true
          },
          {
            time: '09:05 AM',
            placeId: 'tapovan-ashram',
            placeName: 'Tapovan Sadhu Dhyan Kuti (Ascetic Monk Groves)',
            durationMinutes: 70,
            activity: 'Visiting traditional Akhadas and meditating under ancient Banyan trees',
            crowdForecast: 'LOW',
            tips: 'Opportunity for deep spiritual dialogues with wandering sadhus.'
          },
          {
            time: '10:25 AM',
            placeId: 'someshwar-temple',
            placeName: 'Someshwar Sacred Falls & Upstream Solitude',
            durationMinutes: 60,
            activity: 'Quiet reflection along the upstream rapids of Godavari',
            crowdForecast: 'LOW',
            tips: 'Tranquil natural retreat far away from municipal noise.'
          }
        ];
      }

      // Full Day Solo
      return [
        {
          time: '05:00 AM',
          placeId: 'trimbakeshwar-temple',
          placeName: 'Trimbakeshwar Jyotirlinga (Brahma Muhurta Darshan)',
          durationMinutes: 100,
          activity: 'Dawn Abhishek darshan at the 10th sacred Jyotirlinga of Shiva',
          crowdForecast: 'MODERATE',
          tips: 'Brisk solitary walk through the ancient temple corridors at first light.'
        },
        {
          time: '06:50 AM',
          placeId: 'kushavarta-kund',
          placeName: 'Kushavarta Kund Holy Snan (Origin of Godavari)',
          durationMinutes: 45,
          activity: 'Sacred solitary immersion where Sage Gautama brought river Ganga to earth',
          crowdForecast: 'LOW',
          tips: 'Crisp mountain water with potent spiritual ambiance.'
        },
        {
          time: '08:00 AM',
          placeId: 'trimbakeshwar-temple',
          placeName: 'Brahmagiri Foothills Meditation Trail',
          durationMinutes: 60,
          activity: 'Scenic solitary trek along the forested footpaths of Brahmagiri mountain',
          crowdForecast: 'LOW',
          tips: 'Dense greenery, ancient rock-cut carvings, and breathtaking valley view.'
        },
        {
          time: '09:30 AM',
          placeId: 'rest-sadhana-misal',
          placeName: 'Sadhana Chulivarchi Heritage Kitchen (Solo Counter)',
          durationMinutes: 45,
          activity: 'Hearty traditional brunch with spicy misal and wood-fired jowar bhakri',
          crowdForecast: 'MODERATE',
          tips: 'Recharge for afternoon heritage circuits.',
          isMealStop: true
        },
        {
          time: '10:30 AM',
          placeId: 'kalaram-mandir',
          placeName: 'Old Nashik Heritage Wadas & Kalaram Mandir',
          durationMinutes: 75,
          activity: 'Black stone temple architecture study and solitary prayer',
          crowdForecast: 'LOW',
          tips: 'Notice the 17-foot tall gold-plated kalash on the temple dome.'
        },
        {
          time: '12:00 PM',
          placeId: 'kapileshwar-temple',
          placeName: 'Kapileshwar Deep Sanctum Meditation',
          durationMinutes: 60,
          activity: 'Noon silent dhyan in the uncrowded Shiva inner sanctum',
          crowdForecast: 'LOW',
          tips: 'Quiet sanctuary away from mid-day heat.'
        },
        {
          time: '01:30 PM',
          placeId: 'tapovan-ashram',
          placeName: 'Tapovan Sadhu Hermitages & Dhyan Groves',
          durationMinutes: 90,
          activity: 'Deep contemplative walking meditation among sadhu kutis and holy dhunis',
          crowdForecast: 'LOW',
          tips: 'Sacred fire rituals (Dhunis) active across the Akhadas.'
        },
        {
          time: '04:00 PM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund Solitary Deep Daan & Twilight Aarti',
          durationMinutes: 90,
          activity: 'Lighting a lone clay diya on the quiet east ghat steps as twilight falls',
          crowdForecast: 'MODERATE',
          tips: 'Experience the mystical Godavari evening Aarti in meditative silence.'
        }
      ];
    }

    // -------------------------------------------------------------------------
    // 6. GROUP PERSONA (High energy, collective bath, seva, communal dining)
    // -------------------------------------------------------------------------
    if (duration === '1h') {
      return [
        {
          time: '08:30 AM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund Main Ghat Steps & Victoria Bridge Viewpoint',
          durationMinutes: 35,
          activity: 'Energetic group holy snan and collective prayer chanting on the grand steps',
          crowdForecast: 'MODERATE',
          tips: 'Victoria bridge overhead provides the perfect wide-angle group photography angle.'
        },
        {
          time: '09:10 AM',
          placeId: 'rest-kondaji-chivda',
          placeName: 'Panchavati Group Staging Point & Tea Stall',
          durationMinutes: 20,
          activity: 'Headcount check-in, sharing prasad, and hot ginger tea for everyone',
          crowdForecast: 'LOW',
          tips: 'Easy landmark to ensure no group member gets separated.',
          isMealStop: true
        }
      ];
    }

    if (duration === '3h') {
      return [
        {
          time: '08:00 AM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund Main Ghat Collective Snan & Chanting',
          durationMinutes: 50,
          activity: 'High-energy group bath with Jai Shri Ram chants and river Aarti blessings',
          crowdForecast: 'MODERATE',
          tips: 'Designate a group meeting flag or banner near Pillar #4 on the upper promenade.'
        },
        {
          time: '08:55 AM',
          placeId: 'tapovan-ashram',
          placeName: 'Tapovan Akhada Volunteer Seva Camp (Langar Seva)',
          durationMinutes: 50,
          activity: 'Joining mass food distribution seva (langar serving) alongside volunteer sadhus',
          crowdForecast: 'LOW',
          tips: 'Extremely rewarding team experience coordinated by Seva Bharati.'
        },
        {
          time: '09:50 AM',
          placeId: 'rest-sadhana-misal',
          placeName: 'Sadhana Chulivarchi Misal (Group Banquet Shed)',
          durationMinutes: 50,
          activity: 'Lively group misal feast with unlimited pav, spicy rassa, and papad',
          crowdForecast: 'MODERATE',
          tips: 'Long communal wooden tables seating 15-20 people together.',
          isMealStop: true
        },
        {
          time: '10:45 AM',
          placeId: 'kalaram-mandir',
          placeName: 'Panchavati Parikrama Heritage Loop Walk',
          durationMinutes: 35,
          activity: 'Fast-paced group walking parikrama connecting the 5 sacred Banyan trees',
          crowdForecast: 'LOW',
          tips: 'Well-marked pilgrim corridor with ample drinking water stations.'
        }
      ];
    }

    if (duration === '5h') {
      return [
        {
          time: '07:30 AM',
          placeId: 'ram-kund',
          placeName: 'Ram Kund Main Ghat Collective Holy Bath',
          durationMinutes: 60,
          activity: 'High-energy group snan ritual and collective Har Har Mahadev chanting',
          crowdForecast: 'MODERATE',
          tips: 'Pre-arrange group changing turns on Upper Terrace #2.'
        },
        {
          time: '08:40 AM',
          placeId: 'kalaram-mandir',
          placeName: 'Shree Kalaram Temple Group Darshan',
          durationMinutes: 50,
          activity: 'Group entry and viewing the magnificent black stone architecture',
          crowdForecast: 'MODERATE',
          tips: 'Group token counter #4 offers combined entry passes.'
        },
        {
          time: '09:40 AM',
          placeId: 'tapovan-ashram',
          placeName: 'Tapovan Akhada Procession & Community Seva',
          durationMinutes: 60,
          activity: 'Watching majestic Akhada sadhu processions with swords, flags & conch shells',
          crowdForecast: 'LOW',
          tips: 'Vast grounds make it easy for groups to walk together without losing anyone.'
        },
        {
          time: '10:50 AM',
          placeId: 'rest-sadhana-misal',
          placeName: 'Sadhana Chulivarchi Misal (Long Table Group Feast)',
          durationMinutes: 55,
          activity: 'Outdoor banquet dining under trees with jowar bhakri, misal, and jalebi',
          crowdForecast: 'MODERATE',
          tips: 'Pre-booking long banquet tables saves 20 mins of waiting.',
          isMealStop: true
        },
        {
          time: '11:55 AM',
          placeId: 'someshwar-temple',
          placeName: 'Someshwar River Rapids & Team Hike',
          durationMinutes: 60,
          activity: 'Scenic riverbank hike along Godavari rapids and team photo sessions',
          crowdForecast: 'LOW',
          tips: 'Fresh breeze and scenic rock formations make for unforgettable group pictures.'
        }
      ];
    }

    // Full Day Group
    return [
      {
        time: '06:30 AM',
        placeId: 'trimbakeshwar-temple',
        placeName: 'Trimbakeshwar Jyotirlinga (Group Darshan Slot)',
        durationMinutes: 110,
        activity: 'Collective group morning Shiva Jyotirlinga Abhishek and Vedic chanting',
        crowdForecast: 'MODERATE',
        tips: 'Group leader collects collective tokens from the trust counter.'
      },
      {
        time: '08:30 AM',
        placeId: 'kushavarta-kund',
        placeName: 'Kushavarta Kund Collective Snan',
        durationMinutes: 50,
        activity: 'Group holy dip at the origin of Godavari with conch sounding',
        crowdForecast: 'LOW',
        tips: 'Spacious east steps accommodate large groups easily.'
      },
      {
        time: '10:00 AM',
        placeId: 'transport-shuttle-panchavati',
        placeName: 'Dedicated Group AC Shuttle to Nashik City',
        durationMinutes: 45,
        activity: 'Chartered Kumbh electric bus ride singing bhajans together',
        crowdForecast: 'LOW',
        tips: 'Reserved bus for smooth group cohesion.'
      },
      {
        time: '11:00 AM',
        placeId: 'ram-kund',
        placeName: 'Ram Kund & Victoria Bridge Staging Point',
        durationMinutes: 60,
        activity: 'Gathering at the heart of Kumbh Mela and collective river prayers',
        crowdForecast: 'MODERATE',
        tips: 'Pillar #4 serves as official headcount regroup point.'
      },
      {
        time: '12:15 PM',
        placeId: 'rest-panchavati-yatri',
        placeName: 'Hotel Panchavati Yatri (Group Banquet Thali Feast)',
        durationMinutes: 65,
        activity: 'Mass community lunch with unlimited Maharashtrian specialties',
        crowdForecast: 'MODERATE',
        tips: 'Dedicated banquet hall accommodates groups of 20-50 people.',
        isMealStop: true
      },
      {
        time: '01:45 PM',
        placeId: 'tapovan-ashram',
        placeName: 'Tapovan Mega Akhada Camp & Community Langar Seva',
        durationMinutes: 90,
        activity: 'Volunteering in massive free food distribution for visiting devotees',
        crowdForecast: 'LOW',
        tips: 'Unforgettable experience of selfless service (Seva) at the Kumbh Mela.'
      },
      {
        time: '03:30 PM',
        placeId: 'kalaram-mandir',
        placeName: 'Shree Kalaram Temple & Panchavati Heritage Walk',
        durationMinutes: 60,
        activity: 'Group parikrama of 5 sacred Banyan trees and temple blessing',
        crowdForecast: 'LOW',
        tips: 'Wide courtyard allows gathering for group photos.'
      },
      {
        time: '04:45 PM',
        placeId: 'ram-kund',
        placeName: 'Ram Kund Grand Godavari Evening Maha Aarti (Chanting Circle)',
        durationMinutes: 90,
        activity: 'Joining thousands of devotees singing Maha Aarti with bells, conches & floating lamps',
        crowdForecast: 'HIGH',
        tips: 'Group stands together on the Upper Ghat Balcony for superior acoustic and visual vantage.'
      }
    ];
  };

  const PERSONA_CONFIG: Record<string, { title: string; desc: string; badge: string; color: string; bg: string; border: string }> = {
    children: {
      title: '🧒 Child-Safe Ramayana Discovery Circuit',
      desc: 'Features interactive mythology caves (Sita Gumpha), gentle shallow water play at Someshwar Falls, shaded family parks, kid-friendly dining, and minimal walking stretches.',
      badge: 'CHILDREN & PARENTS',
      color: 'text-amber-800 dark:text-amber-300',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800'
    },
    elderly: {
      title: '🧓 Senior-Citizen Dignity & Comfort Circuit',
      desc: 'Step-free VIP entry ramps at Kalaram Mandir, shaded priority darshan pavilions, seated Godavari Aarti views, Muktidham marble rest halls, and zero-rush pacing.',
      badge: 'SENIOR COMPLIANT',
      color: 'text-blue-800 dark:text-blue-300',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-200 dark:border-blue-800'
    },
    wheelchair: {
      title: '♿ 100% Barrier-Free Accessible Route',
      desc: 'Exclusively routes via smooth asphalted and ramped promenades, wide-door temple entrances, accessible river viewing esplanades, and designated e-rickshaw hubs.',
      badge: '100% ACCESSIBLE',
      color: 'text-teal-800 dark:text-teal-300',
      bg: 'bg-teal-50 dark:bg-teal-950/40',
      border: 'border-teal-200 dark:border-teal-800'
    },
    family: {
      title: '👨‍👩‍👦 All-Generations Family Heritage Trail',
      desc: 'Harmonious balance of holy snan at Ram Kund, Panchavati 5-banyan sacred parikrama, traditional family thali dining, and evening Ganga Maha Aarti.',
      badge: 'FAMILY FAVORITE',
      color: 'text-saffron-800 dark:text-saffron-300',
      bg: 'bg-saffron-50 dark:bg-saffron-950/40',
      border: 'border-saffron-200 dark:border-saffron-800'
    },
    solo: {
      title: '🚶 Solo Seeker & Dawn Dhyan Meditation Trail',
      desc: 'Dawn Brahma Muhurta snan, Trimbakeshwar Jyotirlinga deep meditation, quiet Brahmagiri nature trail, ancient stepwells, and discourses with Tapovan sadhus.',
      badge: 'SPIRITUAL SEEKER',
      color: 'text-purple-800 dark:text-purple-300',
      bg: 'bg-purple-50 dark:bg-purple-950/40',
      border: 'border-purple-200 dark:border-purple-800'
    },
    group: {
      title: '👥 Mass Pilgrim Jatha & Akhada Seva Expedition',
      desc: 'Synchronized group bathing, coordinated bulk token darshan, collective Har Har Mahadev chanting, Tapovan Langar volunteer seva, and group thali banquets.',
      badge: 'GROUP / AKHADA SEVA',
      color: 'text-indigo-800 dark:text-indigo-300',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-800'
    }
  };

  const currentPersonaConfig = PERSONA_CONFIG[persona] || PERSONA_CONFIG.family;
  const schedule = generateSchedule();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Wizard Configuration Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
              <Calendar className="w-6 h-6 text-saffron-600" />
              <span>Pilgrimage Itinerary Planner</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Personalized timed itinerary accounting for available time, walking limits, and crowd forecasts
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-saffron-100 dark:bg-saffron-950/60 text-saffron-800 dark:text-saffron-300 self-start sm:self-auto">
            Dynamic AI Scheduling
          </span>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Time Budget */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
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
                      ? 'bg-slate-900 text-white border-slate-900 dark:bg-saffron-600 dark:border-saffron-600 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Travelling With Persona */}
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
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
                      : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
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
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
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
                      ? 'bg-emerald-700 text-white border-emerald-700 dark:bg-emerald-600 dark:border-emerald-600 shadow'
                      : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
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
          ? 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200 shadow-md' 
          : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isSurgeActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider">
                  {isSurgeActive ? '⚡ LIVE CROWD SURGE REROUTING ACTIVE' : 'CROWD SURGE MONITORING'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isSurgeActive ? 'bg-rose-200 dark:bg-rose-900 text-rose-900 dark:text-rose-100 font-extrabold' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
                }`}>
                  {isSurgeActive ? 'Ram Kund: 92% CRITICAL' : 'Ram Kund: 42% NORMAL'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
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
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white text-rose-700 border border-rose-300 hover:bg-rose-100 dark:bg-rose-900 dark:text-rose-100 dark:border-rose-700 shadow-sm flex items-center space-x-1.5 transition-all"
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
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <span>Your Optimized Pilgrimage Schedule</span>
                {isSurgeActive && (
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-600 text-white">
                    Surge Bypass Mode
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crafted for {persona.toUpperCase()} pilgrims with {duration.toUpperCase()} available time
              </p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
              isSurgeActive 
                ? 'text-rose-700 bg-rose-50 border-rose-200 dark:text-rose-300 dark:bg-rose-950/40 dark:border-rose-900' 
                : 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:text-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-900'
            }`}>
              {isSurgeActive ? '🛡️ Stampede-Safe Route' : '✓ Low-Stress Verified'}
            </span>
          </div>

          {/* Dynamic Persona Highlight Banner */}
          <div className={`p-4 rounded-2xl border ${currentPersonaConfig.bg} ${currentPersonaConfig.border} flex items-start justify-between gap-3 shadow-xs`}>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-black uppercase tracking-wider ${currentPersonaConfig.color}`}>
                  {currentPersonaConfig.title}
                </span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-850 shadow-xs border border-current">
                  {currentPersonaConfig.badge}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {currentPersonaConfig.desc}
              </p>
            </div>
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

