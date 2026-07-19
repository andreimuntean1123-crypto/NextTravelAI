// ─────────────────────────────────────────────────────────────
//  Tipuri centrale ale aplicației NextTravelAI
// ─────────────────────────────────────────────────────────────

export type TripType =
  | 'plaja'
  | 'munte'
  | 'city-break'
  | 'natura'
  | 'aventura'
  | 'relaxare'
  | 'cultura'
  | 'gastronomie'
  | 'shopping'
  | 'viata-de-noapte'
  | 'romantica'
  | 'familie';

export type Climate = 'calda' | 'racoroasa' | 'tropicala' | 'zapada' | 'indiferent';

export type Transport = 'avion' | 'masina' | 'tren' | 'autobuz' | 'croaziera';

export type Accommodation =
  | 'hotel'
  | 'resort'
  | 'apartament'
  | 'vila'
  | 'pensiune'
  | 'hostel'
  | 'cabana';

export type Pace = 'relaxat' | 'echilibrat' | 'foarte-activ';

export interface Hotel {
  name: string;
  stars: number;
  pricePerNight: number; // în EUR
  rating: number; // 0-10
  type: Accommodation;
  area: 'centrala' | 'linistita';
  amenities: string[];
}

export interface Restaurant {
  name: string;
  cuisine: string;
  priceLevel: 1 | 2 | 3;
  rating: number;
  note: string;
}

// ─── Hotel în stil Booking ────────────────────────────────────

export type BoardType = 'fara-masa' | 'mic-dejun' | 'demipensiune' | 'all-inclusive';

export type PropertyType =
  | 'hotel'
  | 'resort'
  | 'apartament'
  | 'vila'
  | 'pensiune'
  | 'hostel'
  | 'cabana'
  | 'boutique'
  | 'aparthotel'
  | 'bed-breakfast';

export interface HotelRoom {
  name: string;
  capacity: number; // persoane
  beds: string;
  sizeM2: number;
  pricePerNight: number; // EUR
  breakfastIncluded: boolean;
  freeCancellation: boolean;
  roomsLeft: number;
}

export interface BookingHotel {
  id: string;
  destinationId: string;
  name: string;
  propertyType: PropertyType;
  stars: number;
  image: string;
  gallery: string[];
  area: 'centrala' | 'linistita';
  neighborhood: string;
  distanceFromCenterKm: number;
  distanceFromBeachKm?: number;
  reviewScore: number; // 0-10
  reviewLabel: string; // „Superb", „Fantastic"...
  reviewCount: number;
  pricePerNight: number; // EUR, prețul curent
  oldPricePerNight?: number; // pentru oferte
  board: BoardType;
  boardOptions: BoardType[];
  freeCancellation: boolean;
  payAtProperty: boolean;
  breakfastIncluded: boolean;
  amenities: string[];
  rooms: HotelRoom[]; // camerele hotelului, fiecare cu preț propriu
  roomsLeft?: number; // urgență („mai sunt X camere")
  sustainable: boolean;
  popularWith: string[];
  description: string;
}

export interface Attraction {
  name: string;
  category: string;
  durationHours: number;
  cost: number; // EUR de persoană
  description: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  description: string;
  tags: TripType[];
  climate: Climate;
  bestTransport: Transport[];
  avgTempC: number;
  pricePerDay: number; // EUR estimativ / persoană / zi
  recommendedDays: number;
  popularity: number; // 0-100
  rating: number; // 0-10
  languages: string[];
  currency: string;
  timezone: string;
  hotels: Hotel[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  highlights: string[];
  goodToKnow: string[];
}

// ─── Chestionar ───────────────────────────────────────────────

export type QuestionType = 'single' | 'multi' | 'text' | 'number' | 'range';

export interface QuestionOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

export interface Question {
  id: string;
  step: number;
  title: string;
  subtitle?: string;
  type: QuestionType;
  options?: QuestionOption[];
  placeholder?: string;
  optional?: boolean;
  min?: number;
  max?: number;
  unit?: string;
}

export type AnswerValue = string | string[] | number;

export interface TravelPreferences {
  origin?: string;
  destinationWish?: string;
  hasDestination?: string;
  period?: string;
  days?: number;
  people?: number;
  children?: string;
  budget?: number;
  budgetIncludesTransport?: string;
  tripTypes?: string[];
  climate?: string;
  transport?: string[];
  accommodation?: string[];
  stars?: number;
  board?: string;
  areaPref?: string;
  activities?: string[];
  pace?: string;
  popularVsHidden?: string;
  food?: string[];
  avoidFood?: string;
  allergies?: string;
  accessibility?: string;
  wifi?: string;
  saveVsComfort?: string;
  likedDestinations?: string;
  dislikedDestinations?: string;
  topThree?: string;
  wantVariants?: string;
  savePreferences?: string;
  [key: string]: AnswerValue | undefined;
}

// ─── Recomandări ──────────────────────────────────────────────

export interface Recommendation {
  destination: Destination;
  matchScore: number; // 0-100
  estimatedPrice: number; // total EUR
  reasons: string[];
  pros: string[];
  cons: string[];
}

// ─── Itinerar ─────────────────────────────────────────────────

export type DaySlot = 'dimineata' | 'pranz' | 'dupa-amiaza' | 'seara';

export interface ItineraryActivity {
  id: string;
  slot: DaySlot;
  title: string;
  type: 'obiectiv' | 'masa' | 'activitate' | 'transport' | 'relaxare';
  durationHours: number;
  cost: number;
  distanceKm?: number;
  tip?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
}

export interface Itinerary {
  id: string;
  destinationId: string;
  destinationName: string;
  country: string;
  image: string;
  days: ItineraryDay[];
  people: number;
  totalDays: number;
  createdAt: number;
  pace: Pace;
}

// ─── Buget ────────────────────────────────────────────────────

export interface BudgetBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  activities: number;
  localTransport: number;
  shopping: number;
  emergency: number;
}

// ─── Chat AI ──────────────────────────────────────────────────

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  suggestions?: string[];
  recommendations?: Recommendation[];
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
}

// ─── Utilizator ───────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: number;
  read: boolean;
  type: 'oferta' | 'itinerar' | 'sistem';
}

export interface SavedBudget {
  id: string;
  label: string;
  total: number;
  people: number;
  days: number;
  breakdown: BudgetBreakdown;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  email: string;
  homeCity: string;
  memberSince: number;
}

export type Language = 'ro' | 'en';
export type Currency = 'EUR' | 'RON' | 'USD' | 'GBP';
export type Theme = 'light' | 'dark';
