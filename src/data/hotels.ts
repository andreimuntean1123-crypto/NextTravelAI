import { destinations } from '@/data/destinations';
import type { BoardType, BookingHotel, HotelRoom, PropertyType } from '@/types';

// ─────────────────────────────────────────────────────────────
//  Hoteluri în stil Booking.com — set demonstrativ bogat.
//  Fiecare destinație are mai multe proprietăți, cu toate
//  câmpurile pe care le-ai vedea pe Booking. Pregătit pentru a
//  fi înlocuit cu un API real (VITE_HOTELS_API_KEY).
// ─────────────────────────────────────────────────────────────

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Bibliotecă de imagini pentru hoteluri (Unsplash).
const HOTEL_IMAGES = [
  'photo-1566073771259-6a8506099945',
  'photo-1551882547-ff40c63fe5fa',
  'photo-1520250497591-112f2f40a3f4',
  'photo-1571003123894-1f0594d2b5d9',
  'photo-1611892440504-42a792e24d32',
  'photo-1618773928121-c32242e63f39',
  'photo-1582719508461-905c673771fd',
  'photo-1445019980597-93fa8acb246c',
  'photo-1590490360182-c33d57733427',
  'photo-1596394516093-501ba68a0ba6',
  'photo-1564501049412-61c2a3083791',
  'photo-1542314831-068cd1dbfeeb',
];

const REVIEW_TEXT = (score: number): string => {
  if (score >= 9.3) return 'Excepțional';
  if (score >= 9) return 'Superb';
  if (score >= 8.5) return 'Fantastic';
  if (score >= 8) return 'Foarte bine';
  if (score >= 7) return 'Bine';
  return 'Plăcut';
};

const AMENITIES_BY_STARS: Record<number, string[]> = {
  5: ['Wi-Fi gratuit', 'Piscină', 'Spa & wellness', 'Restaurant', 'Bar', 'Sală de fitness', 'Recepție 24/7', 'Transfer aeroport', 'Room service', 'Parcare', 'Aer condiționat', 'Concierge'],
  4: ['Wi-Fi gratuit', 'Piscină', 'Restaurant', 'Bar', 'Sală de fitness', 'Recepție 24/7', 'Aer condiționat', 'Parcare', 'Mic dejun'],
  3: ['Wi-Fi gratuit', 'Recepție 24/7', 'Aer condiționat', 'Mic dejun', 'Bar', 'Parcare'],
  2: ['Wi-Fi gratuit', 'Recepție', 'Aer condiționat'],
};

// Catalog de tipuri de cameră: multiplicator de preț față de prețul de bază.
const ROOM_CATALOG: { name: string; capacity: number; beds: string; sizeM2: number; mult: number }[] = [
  { name: 'Cameră dublă standard', capacity: 2, beds: '1 pat dublu', sizeM2: 22, mult: 1 },
  { name: 'Cameră twin', capacity: 2, beds: '2 paturi single', sizeM2: 24, mult: 1.05 },
  { name: 'Cameră dublă deluxe', capacity: 2, beds: '1 pat king-size', sizeM2: 30, mult: 1.3 },
  { name: 'Cameră cu vedere', capacity: 2, beds: '1 pat king-size', sizeM2: 32, mult: 1.45 },
  { name: 'Cameră de familie', capacity: 4, beds: '2 paturi duble', sizeM2: 40, mult: 1.7 },
  { name: 'Suită junior', capacity: 3, beds: '1 pat king + canapea', sizeM2: 45, mult: 2 },
  { name: 'Apartament cu 1 dormitor', capacity: 4, beds: '1 dormitor + living', sizeM2: 55, mult: 2.1 },
  { name: 'Suită prezidențială', capacity: 4, beds: '1 pat king + living', sizeM2: 80, mult: 3.2 },
];

// Construiește camerele unui hotel (fiecare cu prețul ei) din prețul de bază.
function buildRooms(basePrice: number, stars: number, seedHash: number, breakfast: boolean): HotelRoom[] {
  // Numărul de tipuri de cameră crește cu numărul de stele.
  const count = Math.min(ROOM_CATALOG.length, 3 + Math.max(0, stars - 2));
  const start = seedHash % 2; // mică variație a selecției
  const chosen = ROOM_CATALOG.slice(start, start + count);
  return chosen.map((r, i) => {
    const price = Math.round(basePrice * r.mult);
    return {
      name: r.name,
      capacity: r.capacity,
      beds: r.beds,
      sizeM2: r.sizeM2,
      pricePerNight: price,
      breakfastIncluded: breakfast || i % 2 === 1,
      freeCancellation: (seedHash + i) % 3 !== 0,
      roomsLeft: 1 + ((seedHash + i * 7) % 6),
    };
  });
}

const POPULAR_WITH_POOL = ['Cupluri', 'Familii', 'Călători de afaceri', 'Grupuri', 'Solo'];

// Hash determinist dintr-un string (pentru câmpuri stabile).
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

interface HotelSeed {
  name: string;
  type: PropertyType;
  stars: number;
  price: number; // preț de bază / noapte (EUR)
  area: 'centrala' | 'linistita';
  neighborhood: string;
  score?: number; // suprascrie scorul calculat
  beachKm?: number;
  sustainable?: boolean;
}

// Construiește un hotel Booking complet dintr-un seed.
function build(destinationId: string, seed: HotelSeed, index: number): BookingHotel {
  const id = `${destinationId}-h${index + 1}`;
  const h = hash(id);
  const baseScore = seed.score ?? 7.4 + seed.stars * 0.42 + ((h % 60) / 100);
  const reviewScore = Math.min(9.8, Number(baseScore.toFixed(1)));
  const reviewCount = 180 + (h % 3200);
  const amenities = [...(AMENITIES_BY_STARS[seed.stars] ?? AMENITIES_BY_STARS[3])];
  if (seed.beachKm !== undefined && seed.beachKm <= 0.3) amenities.push('Plajă privată', 'Vedere la mare');
  if (seed.type === 'resort') amenities.push('Piscină exterioară', 'Animație');
  if (seed.type === 'vila' || seed.type === 'apartament' || seed.type === 'aparthotel')
    amenities.push('Bucătărie', 'Mașină de spălat');

  const board: BoardType =
    seed.type === 'resort' ? 'all-inclusive' : seed.stars >= 4 ? 'mic-dejun' : 'fara-masa';
  const boardOptions: BoardType[] = seed.type === 'resort'
    ? ['mic-dejun', 'demipensiune', 'all-inclusive']
    : seed.stars >= 4
      ? ['fara-masa', 'mic-dejun', 'demipensiune']
      : ['fara-masa', 'mic-dejun'];

  const hasDeal = h % 3 === 0;
  const distanceFromCenter = seed.area === 'centrala'
    ? Number((0.2 + (h % 12) / 10).toFixed(1))
    : Number((2 + (h % 60) / 10).toFixed(1));

  return {
    id,
    destinationId,
    name: seed.name,
    propertyType: seed.type,
    stars: seed.stars,
    image: img(HOTEL_IMAGES[h % HOTEL_IMAGES.length]),
    gallery: [
      img(HOTEL_IMAGES[h % HOTEL_IMAGES.length]),
      img(HOTEL_IMAGES[(h + 3) % HOTEL_IMAGES.length]),
      img(HOTEL_IMAGES[(h + 7) % HOTEL_IMAGES.length]),
    ],
    area: seed.area,
    neighborhood: seed.neighborhood,
    distanceFromCenterKm: distanceFromCenter,
    distanceFromBeachKm: seed.beachKm,
    reviewScore,
    reviewLabel: REVIEW_TEXT(reviewScore),
    reviewCount,
    pricePerNight: seed.price,
    oldPricePerNight: hasDeal ? Math.round(seed.price * (1.15 + (h % 25) / 100)) : undefined,
    board,
    boardOptions,
    freeCancellation: h % 4 !== 0,
    payAtProperty: h % 2 === 0,
    breakfastIncluded: board !== 'fara-masa',
    amenities: Array.from(new Set(amenities)),
    rooms: buildRooms(seed.price, seed.stars, h, board !== 'fara-masa'),
    roomsLeft: h % 5 === 0 ? 1 + (h % 4) : undefined,
    sustainable: seed.sustainable ?? h % 3 === 1,
    popularWith: [POPULAR_WITH_POOL[h % POPULAR_WITH_POOL.length], POPULAR_WITH_POOL[(h + 1) % POPULAR_WITH_POOL.length]],
    description:
      `${seed.name} este o proprietate de ${seed.stars} stele situată în ${seed.neighborhood}, ` +
      `la ${distanceFromCenter} km de centru. Oaspeții apreciază ${REVIEW_TEXT(reviewScore).toLowerCase()} raportul ` +
      `calitate-preț și locația convenabilă.`,
  };
}

// Seed-uri curate per destinație.
const SEEDS: Record<string, HotelSeed[]> = {
  santorini: [
    { name: 'Aegean Blue Suites', type: 'resort', stars: 5, price: 320, area: 'linistita', neighborhood: 'Imerovigli', beachKm: 0.4, sustainable: true },
    { name: 'Oia White Cave Hotel', type: 'boutique', stars: 4, price: 190, area: 'centrala', neighborhood: 'Oia' },
    { name: 'Caldera Grand Resort', type: 'resort', stars: 5, price: 410, area: 'linistita', neighborhood: 'Imerovigli', beachKm: 0.6 },
    { name: 'Fira Sunset Apartments', type: 'apartament', stars: 3, price: 110, area: 'centrala', neighborhood: 'Fira' },
    { name: 'Kamari Beach Hotel', type: 'hotel', stars: 4, price: 145, area: 'linistita', neighborhood: 'Kamari', beachKm: 0.1 },
    { name: 'Santorini Sky Villas', type: 'vila', stars: 5, price: 520, area: 'linistita', neighborhood: 'Pyrgos' },
    { name: 'Perissa Black Sand Rooms', type: 'pensiune', stars: 3, price: 85, area: 'linistita', neighborhood: 'Perissa', beachKm: 0.2 },
    { name: 'Thira Central Hostel', type: 'hostel', stars: 2, price: 45, area: 'centrala', neighborhood: 'Fira' },
  ],
  kyoto: [
    { name: 'Gion Ryokan Heritage', type: 'boutique', stars: 5, price: 280, area: 'centrala', neighborhood: 'Gion', sustainable: true },
    { name: 'Sakura Boutique Kyoto', type: 'hotel', stars: 4, price: 160, area: 'centrala', neighborhood: 'Nakagyo' },
    { name: 'Arashiyama Machiya', type: 'vila', stars: 3, price: 95, area: 'linistita', neighborhood: 'Arashiyama' },
    { name: 'Kyoto Station Grand', type: 'hotel', stars: 5, price: 240, area: 'centrala', neighborhood: 'Shimogyo' },
    { name: 'Higashiyama Zen Inn', type: 'pensiune', stars: 4, price: 130, area: 'linistita', neighborhood: 'Higashiyama' },
    { name: 'Nishiki Aparthotel', type: 'aparthotel', stars: 3, price: 105, area: 'centrala', neighborhood: 'Nishiki' },
    { name: 'Fushimi Garden Lodge', type: 'bed-breakfast', stars: 3, price: 78, area: 'linistita', neighborhood: 'Fushimi' },
    { name: 'Kyoto Backpackers Hostel', type: 'hostel', stars: 2, price: 38, area: 'centrala', neighborhood: 'Shimogyo' },
  ],
  barcelona: [
    { name: 'Casa Mercè Luxury', type: 'hotel', stars: 5, price: 260, area: 'centrala', neighborhood: 'Eixample' },
    { name: 'Gothic Quarter Boutique', type: 'boutique', stars: 4, price: 145, area: 'centrala', neighborhood: 'Barri Gòtic' },
    { name: 'Barceloneta Beach Flats', type: 'apartament', stars: 3, price: 90, area: 'centrala', neighborhood: 'Barceloneta', beachKm: 0.15 },
    { name: 'Gràcia Design Hotel', type: 'boutique', stars: 4, price: 165, area: 'linistita', neighborhood: 'Gràcia', sustainable: true },
    { name: 'Diagonal Mar Resort', type: 'resort', stars: 5, price: 300, area: 'linistita', neighborhood: 'Sant Martí', beachKm: 0.3 },
    { name: 'Ramblas Central Hotel', type: 'hotel', stars: 3, price: 105, area: 'centrala', neighborhood: 'La Rambla' },
    { name: 'Poblenou Aparthotel', type: 'aparthotel', stars: 4, price: 130, area: 'linistita', neighborhood: 'Poblenou' },
    { name: 'Sants Station Hostel', type: 'hostel', stars: 2, price: 42, area: 'centrala', neighborhood: 'Sants' },
  ],
  bali: [
    { name: 'Ubud Jungle Resort', type: 'resort', stars: 5, price: 210, area: 'linistita', neighborhood: 'Ubud', sustainable: true },
    { name: 'Seminyak Beach Villa', type: 'vila', stars: 4, price: 130, area: 'centrala', neighborhood: 'Seminyak', beachKm: 0.2 },
    { name: 'Canggu Surf Lodge', type: 'pensiune', stars: 3, price: 55, area: 'centrala', neighborhood: 'Canggu', beachKm: 0.4 },
    { name: 'Nusa Dua Grand Resort', type: 'resort', stars: 5, price: 260, area: 'linistita', neighborhood: 'Nusa Dua', beachKm: 0.1 },
    { name: 'Uluwatu Cliff Villas', type: 'vila', stars: 5, price: 320, area: 'linistita', neighborhood: 'Uluwatu' },
    { name: 'Kuta Central Hotel', type: 'hotel', stars: 3, price: 48, area: 'centrala', neighborhood: 'Kuta', beachKm: 0.3 },
    { name: 'Sanur Garden Bungalows', type: 'apartament', stars: 4, price: 90, area: 'linistita', neighborhood: 'Sanur', beachKm: 0.25 },
    { name: 'Ubud Backpacker Home', type: 'hostel', stars: 2, price: 22, area: 'centrala', neighborhood: 'Ubud' },
  ],
  zermatt: [
    { name: 'Matterhorn Grand Chalet', type: 'cabana', stars: 5, price: 420, area: 'linistita', neighborhood: 'Winkelmatten' },
    { name: 'Alpine Lodge Zermatt', type: 'hotel', stars: 4, price: 240, area: 'centrala', neighborhood: 'Bahnhofstrasse' },
    { name: 'Cozy Peak Cabin', type: 'cabana', stars: 3, price: 140, area: 'linistita', neighborhood: 'Ried', sustainable: true },
    { name: 'Gornergrat View Hotel', type: 'hotel', stars: 5, price: 380, area: 'centrala', neighborhood: 'Centru' },
    { name: 'Snow Crystal Aparthotel', type: 'aparthotel', stars: 4, price: 210, area: 'linistita', neighborhood: 'Wiesti' },
    { name: 'Edelweiss Pension', type: 'pensiune', stars: 3, price: 120, area: 'centrala', neighborhood: 'Centru' },
    { name: 'Zermatt Youth Chalet', type: 'hostel', stars: 2, price: 65, area: 'linistita', neighborhood: 'Spiss' },
  ],
  lisabona: [
    { name: 'Tejo River Suites', type: 'hotel', stars: 5, price: 220, area: 'centrala', neighborhood: 'Baixa' },
    { name: 'Alfama Charm Hotel', type: 'boutique', stars: 4, price: 120, area: 'centrala', neighborhood: 'Alfama' },
    { name: 'Bairro Alto Apartments', type: 'apartament', stars: 3, price: 75, area: 'centrala', neighborhood: 'Bairro Alto' },
    { name: 'Belém Riverside Hotel', type: 'hotel', stars: 4, price: 135, area: 'linistita', neighborhood: 'Belém', sustainable: true },
    { name: 'Príncipe Real Boutique', type: 'boutique', stars: 5, price: 195, area: 'linistita', neighborhood: 'Príncipe Real' },
    { name: 'Cais do Sodré Aparthotel', type: 'aparthotel', stars: 3, price: 88, area: 'centrala', neighborhood: 'Cais do Sodré' },
    { name: 'Graça Guesthouse', type: 'bed-breakfast', stars: 3, price: 62, area: 'linistita', neighborhood: 'Graça' },
    { name: 'Lisbon Story Hostel', type: 'hostel', stars: 2, price: 35, area: 'centrala', neighborhood: 'Baixa' },
  ],
  maldive: [
    { name: 'Overwater Paradise Resort', type: 'resort', stars: 5, price: 780, area: 'linistita', neighborhood: 'Atolul Baa', beachKm: 0, sustainable: true },
    { name: 'Coral Lagoon Villas', type: 'vila', stars: 5, price: 520, area: 'linistita', neighborhood: 'Atolul Ari', beachKm: 0 },
    { name: 'Maafushi Local Retreat', type: 'pensiune', stars: 3, price: 130, area: 'centrala', neighborhood: 'Maafushi', beachKm: 0.1 },
    { name: 'Sunset Reef Resort', type: 'resort', stars: 5, price: 640, area: 'linistita', neighborhood: 'Atolul Raa', beachKm: 0 },
    { name: 'Hulhumalé Beach Hotel', type: 'hotel', stars: 4, price: 180, area: 'centrala', neighborhood: 'Hulhumalé', beachKm: 0.2 },
    { name: 'Thulusdhoo Surf Inn', type: 'pensiune', stars: 3, price: 95, area: 'linistita', neighborhood: 'Thulusdhoo', beachKm: 0.15 },
  ],
  roma: [
    { name: 'Palazzo Navona Luxury', type: 'hotel', stars: 5, price: 300, area: 'centrala', neighborhood: 'Piazza Navona' },
    { name: 'Trastevere Boutique', type: 'boutique', stars: 4, price: 155, area: 'centrala', neighborhood: 'Trastevere' },
    { name: 'Roma Central Apartments', type: 'apartament', stars: 3, price: 95, area: 'centrala', neighborhood: 'Monti' },
    { name: 'Vaticano Grand Hotel', type: 'hotel', stars: 5, price: 260, area: 'linistita', neighborhood: 'Prati' },
    { name: 'Colosseo View Hotel', type: 'hotel', stars: 4, price: 170, area: 'centrala', neighborhood: 'Celio' },
    { name: 'Testaccio Aparthotel', type: 'aparthotel', stars: 3, price: 105, area: 'linistita', neighborhood: 'Testaccio', sustainable: true },
    { name: 'Spagna Design Suites', type: 'boutique', stars: 5, price: 320, area: 'centrala', neighborhood: 'Piazza di Spagna' },
    { name: 'Termini Budget Hostel', type: 'hostel', stars: 2, price: 40, area: 'centrala', neighborhood: 'Esquilino' },
  ],
  'costa-rica': [
    { name: 'Arenal Volcano Lodge', type: 'resort', stars: 4, price: 180, area: 'linistita', neighborhood: 'La Fortuna', sustainable: true },
    { name: 'Manuel Antonio Eco Villa', type: 'vila', stars: 4, price: 140, area: 'linistita', neighborhood: 'Manuel Antonio', beachKm: 0.5 },
    { name: 'Tamarindo Surf Cabinas', type: 'cabana', stars: 3, price: 70, area: 'centrala', neighborhood: 'Tamarindo', beachKm: 0.2 },
    { name: 'Monteverde Cloud Lodge', type: 'cabana', stars: 4, price: 130, area: 'linistita', neighborhood: 'Monteverde', sustainable: true },
    { name: 'Santa Teresa Beach Hotel', type: 'hotel', stars: 4, price: 120, area: 'linistita', neighborhood: 'Santa Teresa', beachKm: 0.1 },
    { name: 'San José City Hotel', type: 'hotel', stars: 3, price: 65, area: 'centrala', neighborhood: 'San José' },
    { name: 'Puerto Viejo Jungle Hostel', type: 'hostel', stars: 2, price: 28, area: 'linistita', neighborhood: 'Puerto Viejo' },
  ],
  praga: [
    { name: 'Old Town Grand Hotel', type: 'hotel', stars: 5, price: 190, area: 'centrala', neighborhood: 'Staré Město' },
    { name: 'Charles Bridge Boutique', type: 'boutique', stars: 4, price: 110, area: 'centrala', neighborhood: 'Malá Strana' },
    { name: 'Vinohrady Apartments', type: 'apartament', stars: 3, price: 60, area: 'linistita', neighborhood: 'Vinohrady', sustainable: true },
    { name: 'Wenceslas Square Hotel', type: 'hotel', stars: 4, price: 95, area: 'centrala', neighborhood: 'Nové Město' },
    { name: 'Prague Castle View Suites', type: 'boutique', stars: 5, price: 210, area: 'linistita', neighborhood: 'Hradčany' },
    { name: 'Žižkov Aparthotel', type: 'aparthotel', stars: 3, price: 55, area: 'linistita', neighborhood: 'Žižkov' },
    { name: 'Holešovice Guesthouse', type: 'bed-breakfast', stars: 3, price: 48, area: 'linistita', neighborhood: 'Holešovice' },
    { name: 'Prague Central Hostel', type: 'hostel', stars: 2, price: 25, area: 'centrala', neighborhood: 'Nové Město' },
  ],
};

export const hotels: BookingHotel[] = Object.entries(SEEDS).flatMap(([destId, seeds]) =>
  seeds.map((seed, i) => build(destId, seed, i)),
);

export function getHotelsByDestination(destinationId: string): BookingHotel[] {
  return hotels.filter((h) => h.destinationId === destinationId);
}

export function getHotelById(id: string): BookingHotel | undefined {
  return hotels.find((h) => h.id === id);
}

export const totalHotels = hotels.length;

// Verificare că fiecare destinație are hoteluri (utile pentru UI).
export const destinationsWithHotels = destinations.filter(
  (d) => getHotelsByDestination(d.id).length > 0,
);

export const boardLabels: Record<BoardType, string> = {
  'fara-masa': 'Fără masă',
  'mic-dejun': 'Mic dejun inclus',
  demipensiune: 'Demipensiune',
  'all-inclusive': 'All-inclusive',
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  hotel: 'Hotel',
  resort: 'Resort',
  apartament: 'Apartament',
  vila: 'Vilă',
  pensiune: 'Pensiune',
  hostel: 'Hostel',
  cabana: 'Cabană',
  boutique: 'Hotel boutique',
  aparthotel: 'Aparthotel',
  'bed-breakfast': 'Bed & Breakfast',
};
