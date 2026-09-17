export type PlaceCategory = 
  | 'temple'
  | 'ghat'
  | 'medical'
  | 'police'
  | 'toilet'
  | 'water'
  | 'food'
  | 'parking'
  | 'accommodation'
  | 'transport'
  | 'emergency';

export interface Place {
  id: string;
  name: string;
  marathiName?: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  locationName: string; // e.g., 'Panchavati, Nashik' or 'Trimbakeshwar'
  description: string;
  facilities: string[]; // e.g., ['Drinking Water', 'Wheelchair Ramp', 'Bio-Toilets', 'Medical Post']
  accessibility: {
    wheelchairAccessible: boolean;
    hasRamps: boolean;
    hasStairsOnly: boolean;
    elderlyFriendlyScore: number; // 1-10
    accessibilityNotes: string;
  };
  openStatus: 'open' | 'crowded' | 'restricted' | 'closed';
  openHours: string;
  currentCrowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  currentWaitMinutes: number;
  contactNumber?: string;
  imageUrl?: string;
}

export type CrowdRisk = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface CrowdZone {
  id: string;
  name: string;
  marathiName?: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  density: number; // 0 to 100%
  risk: CrowdRisk;
  activePilgrimsEstimate: number;
  capacityMax: number;
  trend: 'rising' | 'falling' | 'stable';
  updatedAt: string;
  simulated: boolean;
}

export type TravelPersona = 'elderly' | 'children' | 'wheelchair' | 'family' | 'solo' | 'group';

export type RoutePreference = 'fastest' | 'least-crowded' | 'accessible' | 'balanced';

export interface RouteOption {
  id: string;
  name: string;
  subtitle: string;
  distanceKm: number;
  durationMinutes: number;
  crowdLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  riskScore: number; // 1-10
  accessibilityScore: number; // 1-10
  crowdExposurePercent: number;
  pathCoordinates: [number, number][]; // [lat, lng] array
  highlights: string[];
  warnings: string[];
  isRecommended: boolean;
  recommendationReason: string;
  scoringBreakdown: {
    distancePenalty: number;
    timePenalty: number;
    crowdPenalty: number;
    accessibilityBonus: number;
    totalScore: number;
  };
}

export interface ItineraryItem {
  time: string;
  placeId: string;
  placeName: string;
  durationMinutes: number;
  activity: string;
  crowdForecast: 'LOW' | 'MODERATE' | 'HIGH';
  tips: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  lat: number;
  lng: number;
  batteryLevel: number;
  lastSeenTime: string;
  status: 'safe' | 'needs_help' | 'moving';
  locationNote: string;
  avatarUrl?: string;
  badgeText?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; action: () => void }[];
  referencedPlaces?: Place[];
}
