import type { BoardType, BookingHotel, HotelRoom, PropertyType } from '@/types';
import type { City } from '@/data/cities';

// ─────────────────────────────────────────────────────────────
//  Generează hoteluri „valabile" pentru orice oraș, la cerere.
//  Determinist (același oraș → aceleași hoteluri), deci nu stocăm
//  mii de obiecte în bundle. Pregătit pentru înlocuire cu Booking API.
// ─────────────────────────────────────────────────────────────

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

const img = (i: string) => `https://images.unsplash.com/${i}?auto=format&fit=crop&w=800&q=80`;

const PREFIXES = ['Grand', 'Royal', 'Central', 'Plaza', 'Boutique', 'Garden', 'Park', 'Riverside', 'Old Town', 'Palace', 'Comfort', 'City', 'Sun', 'Panorama', 'Imperial', 'Marina', 'Bella', 'Continental', 'Metropolitan', 'Aurora'];
const SUFFIXES = ['Hotel', 'Suites', 'Resort', 'Inn', 'Lodge', 'Aparthotel', 'Boutique', 'Residence', 'Palace', 'House', 'Rooms'];
const NEIGHBORHOODS = ['Centrul istoric', 'Centru', 'Zona veche', 'Cartierul de afaceri', 'Faleză', 'Zona gării', 'Cartierul artelor', 'Parcul central', 'Riverside', 'Zona universitară', 'Piața mare', 'Districtul modern'];

const PROP_BY_INDEX: PropertyType[] = ['hotel', 'boutique', 'apartament', 'resort', 'aparthotel', 'pensiune', 'hostel', 'vila', 'bed-breakfast', 'hotel', 'boutique', 'hotel'];

const AMENITIES_BY_STARS: Record<number, string[]> = {
  5: ['Wi-Fi gratuit', 'Piscină', 'Spa & wellness', 'Restaurant', 'Bar', 'Sală de fitness', 'Recepție 24/7', 'Transfer aeroport', 'Room service', 'Parcare', 'Aer condiționat', 'Concierge'],
  4: ['Wi-Fi gratuit', 'Piscină', 'Restaurant', 'Bar', 'Sală de fitness', 'Recepție 24/7', 'Aer condiționat', 'Parcare', 'Mic dejun'],
  3: ['Wi-Fi gratuit', 'Recepție 24/7', 'Aer condiționat', 'Mic dejun', 'Bar', 'Parcare'],
  2: ['Wi-Fi gratuit', 'Recepție', 'Aer condiționat'],
};

const ROOM_CATALOG = [
  { name: 'Cameră dublă standard', capacity: 2, beds: '1 pat dublu', sizeM2: 22, mult: 1 },
  { name: 'Cameră twin', capacity: 2, beds: '2 paturi single', sizeM2: 24, mult: 1.05 },
  { name: 'Cameră dublă deluxe', capacity: 2, beds: '1 pat king-size', sizeM2: 30, mult: 1.3 },
  { name: 'Cameră cu vedere', capacity: 2, beds: '1 pat king-size', sizeM2: 32, mult: 1.45 },
  { name: 'Cameră de familie', capacity: 4, beds: '2 paturi duble', sizeM2: 40, mult: 1.7 },
  { name: 'Suită junior', capacity: 3, beds: '1 pat king + canapea', sizeM2: 45, mult: 2 },
  { name: 'Apartament cu 1 dormitor', capacity: 4, beds: '1 dormitor + living', sizeM2: 55, mult: 2.1 },
  { name: 'Suită prezidențială', capacity: 4, beds: '1 pat king + living', sizeM2: 80, mult: 3.2 },
];

const REVIEW_TEXT = (s: number): string =>
  s >= 9.3 ? 'Excepțional' : s >= 9 ? 'Superb' : s >= 8.5 ? 'Fantastic' : s >= 8 ? 'Foarte bine' : s >= 7 ? 'Bine' : 'Plăcut';

const PRICE_BASE: Record<1 | 2 | 3, number> = { 1: 42, 2: 78, 3: 135 };

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

function buildRooms(basePrice: number, stars: number, seed: number, breakfast: boolean): HotelRoom[] {
  const count = Math.min(ROOM_CATALOG.length, 3 + Math.max(0, stars - 2));
  const start = seed % 2;
  return ROOM_CATALOG.slice(start, start + count).map((r, i) => ({
    name: r.name,
    capacity: r.capacity,
    beds: r.beds,
    sizeM2: r.sizeM2,
    pricePerNight: Math.round(basePrice * r.mult),
    breakfastIncluded: breakfast || i % 2 === 1,
    freeCancellation: (seed + i) % 3 !== 0,
    roomsLeft: 1 + ((seed + i * 7) % 6),
  }));
}

// Câte hoteluri are un oraș (mai multe pentru orașe populare).
function hotelCount(city: City): number {
  const h = hash(city.id);
  const base = city.popularity > 85 ? 10 : city.popularity > 70 ? 8 : 6;
  return base + (h % 3); // 6-12
}

export function getCityHotels(city: City): BookingHotel[] {
  const n = hotelCount(city);
  const result: BookingHotel[] = [];

  for (let i = 0; i < n; i++) {
    const seed = hash(`${city.id}-${i}`);
    const stars = [5, 5, 4, 4, 4, 3, 3, 3, 2, 4, 5, 3][i % 12];
    const propertyType = PROP_BY_INDEX[i % PROP_BY_INDEX.length];
    const prefix = PREFIXES[seed % PREFIXES.length];
    const suffix = SUFFIXES[(seed >> 3) % SUFFIXES.length];
    const name = `${city.name} ${prefix} ${suffix}`;
    const neighborhood = NEIGHBORHOODS[(seed >> 5) % NEIGHBORHOODS.length];
    const area: 'centrala' | 'linistita' = i % 3 === 0 ? 'linistita' : 'centrala';

    const priceMult = 0.7 + (stars - 2) * 0.35 + (seed % 30) / 100;
    const basePrice = Math.round(PRICE_BASE[city.priceTier] * priceMult);

    const reviewScore = Math.min(9.8, Number((7.4 + stars * 0.42 + (seed % 60) / 100).toFixed(1)));
    const amenities = [...(AMENITIES_BY_STARS[stars] ?? AMENITIES_BY_STARS[3])];
    if (propertyType === 'resort') amenities.push('Piscină exterioară', 'Animație');
    if (['vila', 'apartament', 'aparthotel'].includes(propertyType)) amenities.push('Bucătărie', 'Mașină de spălat');

    const board: BoardType = propertyType === 'resort' ? 'all-inclusive' : stars >= 4 ? 'mic-dejun' : 'fara-masa';
    const boardOptions: BoardType[] = propertyType === 'resort'
      ? ['mic-dejun', 'demipensiune', 'all-inclusive']
      : stars >= 4
        ? ['fara-masa', 'mic-dejun', 'demipensiune']
        : ['fara-masa', 'mic-dejun'];

    const hasDeal = seed % 3 === 0;
    const distanceFromCenterKm = area === 'centrala'
      ? Number((0.2 + (seed % 12) / 10).toFixed(1))
      : Number((2 + (seed % 60) / 10).toFixed(1));

    result.push({
      id: `${city.id}-h${i + 1}`,
      destinationId: city.id,
      name,
      propertyType,
      stars,
      image: img(HOTEL_IMAGES[seed % HOTEL_IMAGES.length]),
      gallery: [
        img(HOTEL_IMAGES[seed % HOTEL_IMAGES.length]),
        img(HOTEL_IMAGES[(seed + 3) % HOTEL_IMAGES.length]),
        img(HOTEL_IMAGES[(seed + 7) % HOTEL_IMAGES.length]),
      ],
      area,
      neighborhood,
      distanceFromCenterKm,
      reviewScore,
      reviewLabel: REVIEW_TEXT(reviewScore),
      reviewCount: 120 + (seed % 3400),
      pricePerNight: basePrice,
      oldPricePerNight: hasDeal ? Math.round(basePrice * (1.15 + (seed % 25) / 100)) : undefined,
      board,
      boardOptions,
      freeCancellation: seed % 4 !== 0,
      payAtProperty: seed % 2 === 0,
      breakfastIncluded: board !== 'fara-masa',
      amenities: Array.from(new Set(amenities)),
      rooms: buildRooms(basePrice, stars, seed, board !== 'fara-masa'),
      roomsLeft: seed % 5 === 0 ? 1 + (seed % 4) : undefined,
      sustainable: seed % 3 === 1,
      popularWith: ['Cupluri', 'Familii', 'Solo', 'Grupuri'].slice(seed % 2, (seed % 2) + 2),
      description:
        `${name} este o proprietate de ${stars} stele în ${neighborhood}, ${city.name} (${city.country}), ` +
        `la ${distanceFromCenterKm} km de centru. Oaspeții apreciază raportul calitate-preț și locația.`,
    });
  }

  return result;
}

export function cityCheapestHotel(city: City): number {
  const hs = getCityHotels(city);
  return Math.min(...hs.map((h) => Math.min(h.pricePerNight, ...h.rooms.map((r) => r.pricePerNight))));
}
