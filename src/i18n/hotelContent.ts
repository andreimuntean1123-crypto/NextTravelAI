import type { BookingHotel, Language } from '@/types';
import { propertyTypeLabel } from '@/i18n/labels';

// Traduceri pentru textele generate în hotels.ts: scorul de recenzii,
// facilitățile, tipurile de cameră și propoziția de descriere a hotelului.
// Numele hotelurilor/cartierelor rămân proprii, neschimbate.

const AMENITIES: Record<string, { en: string; ru: string }> = {
  'Wi-Fi gratuit': { en: 'Free Wi-Fi', ru: 'Бесплатный Wi-Fi' },
  Piscină: { en: 'Pool', ru: 'Бассейн' },
  'Spa & wellness': { en: 'Spa & wellness', ru: 'Спа и велнес' },
  Restaurant: { en: 'Restaurant', ru: 'Ресторан' },
  Bar: { en: 'Bar', ru: 'Бар' },
  'Sală de fitness': { en: 'Fitness room', ru: 'Тренажёрный зал' },
  'Recepție 24/7': { en: '24/7 reception', ru: 'Круглосуточная стойка регистрации' },
  'Transfer aeroport': { en: 'Airport transfer', ru: 'Трансфер из аэропорта' },
  'Room service': { en: 'Room service', ru: 'Room-сервис' },
  Parcare: { en: 'Parking', ru: 'Парковка' },
  'Aer condiționat': { en: 'Air conditioning', ru: 'Кондиционер' },
  Concierge: { en: 'Concierge', ru: 'Консьерж' },
  'Mic dejun': { en: 'Breakfast', ru: 'Завтрак' },
  Recepție: { en: 'Reception', ru: 'Стойка регистрации' },
  'Plajă privată': { en: 'Private beach', ru: 'Частный пляж' },
  'Vedere la mare': { en: 'Sea view', ru: 'Вид на море' },
  'Piscină exterioară': { en: 'Outdoor pool', ru: 'Открытый бассейн' },
  Animație: { en: 'Entertainment', ru: 'Анимация' },
  Bucătărie: { en: 'Kitchen', ru: 'Кухня' },
  'Mașină de spălat': { en: 'Washing machine', ru: 'Стиральная машина' },
};

const ROOM_NAMES: Record<string, { en: string; ru: string }> = {
  'Cameră dublă standard': { en: 'Standard double room', ru: 'Стандартный двухместный номер' },
  'Cameră twin': { en: 'Twin room', ru: 'Номер твин' },
  'Cameră dublă deluxe': { en: 'Deluxe double room', ru: 'Двухместный номер делюкс' },
  'Cameră cu vedere': { en: 'Room with a view', ru: 'Номер с видом' },
  'Cameră de familie': { en: 'Family room', ru: 'Семейный номер' },
  'Suită junior': { en: 'Junior suite', ru: 'Джуниор-люкс' },
  'Apartament cu 1 dormitor': { en: 'One-bedroom apartment', ru: 'Апартаменты с одной спальней' },
  'Suită prezidențială': { en: 'Presidential suite', ru: 'Президентский люкс' },
};

const BEDS: Record<string, { en: string; ru: string }> = {
  '1 pat dublu': { en: '1 double bed', ru: '1 двуспальная кровать' },
  '2 paturi single': { en: '2 single beds', ru: '2 односпальные кровати' },
  '1 pat king-size': { en: '1 king-size bed', ru: '1 кровать king-size' },
  '2 paturi duble': { en: '2 double beds', ru: '2 двуспальные кровати' },
  '1 pat king + canapea': { en: '1 king bed + sofa', ru: '1 кровать king + диван' },
  '1 dormitor + living': { en: '1 bedroom + living room', ru: '1 спальня + гостиная' },
  '1 pat king + living': { en: '1 king bed + living room', ru: '1 кровать king + гостиная' },
};

const POPULAR_WITH: Record<string, { en: string; ru: string }> = {
  Cupluri: { en: 'Couples', ru: 'Пары' },
  Familii: { en: 'Families', ru: 'Семьи' },
  'Călători de afaceri': { en: 'Business travelers', ru: 'Деловые путешественники' },
  Grupuri: { en: 'Groups', ru: 'Группы' },
  Solo: { en: 'Solo travelers', ru: 'Путешественники соло' },
};

// Cartiere generice folosite de generatorul de hoteluri per-oraș
// (lib/cityHotels.ts) — nu sunt nume proprii, deci merită traduse.
const GENERIC_NEIGHBORHOODS: Record<string, { en: string; ru: string }> = {
  'Centrul istoric': { en: 'Old Town', ru: 'Исторический центр' },
  Centru: { en: 'City Center', ru: 'Центр' },
  'Zona veche': { en: 'Old Quarter', ru: 'Старый квартал' },
  'Cartierul de afaceri': { en: 'Business District', ru: 'Деловой квартал' },
  Faleză: { en: 'Waterfront', ru: 'Набережная' },
  'Zona gării': { en: 'Station Area', ru: 'Район вокзала' },
  'Cartierul artelor': { en: 'Arts District', ru: 'Квартал искусств' },
  'Parcul central': { en: 'Central Park Area', ru: 'Район центрального парка' },
  Riverside: { en: 'Riverside', ru: 'У реки' },
  'Zona universitară': { en: 'University Area', ru: 'Университетский район' },
  'Piața mare': { en: 'Main Square', ru: 'Главная площадь' },
  'Districtul modern': { en: 'Modern District', ru: 'Современный район' },
};

export const translateNeighborhood = (lang: Language, ro: string) => tr(GENERIC_NEIGHBORHOODS, lang, ro);

function tr(dict: Record<string, { en: string; ru: string }>, lang: Language, ro: string): string {
  if (lang === 'ro') return ro;
  return dict[ro]?.[lang] ?? ro;
}

export const translateAmenity = (lang: Language, ro: string) => tr(AMENITIES, lang, ro);
export const translateRoomName = (lang: Language, ro: string) => tr(ROOM_NAMES, lang, ro);
export const translateBeds = (lang: Language, ro: string) => tr(BEDS, lang, ro);
export const translatePopularWith = (lang: Language, ro: string) => tr(POPULAR_WITH, lang, ro);

const REVIEW_LABELS: Record<Language, (score: number) => string> = {
  ro: (score) => {
    if (score >= 9.3) return 'Excepțional';
    if (score >= 9) return 'Superb';
    if (score >= 8.5) return 'Fantastic';
    if (score >= 8) return 'Foarte bine';
    if (score >= 7) return 'Bine';
    return 'Plăcut';
  },
  en: (score) => {
    if (score >= 9.3) return 'Exceptional';
    if (score >= 9) return 'Superb';
    if (score >= 8.5) return 'Fantastic';
    if (score >= 8) return 'Very good';
    if (score >= 7) return 'Good';
    return 'Pleasant';
  },
  ru: (score) => {
    if (score >= 9.3) return 'Исключительно';
    if (score >= 9) return 'Превосходно';
    if (score >= 8.5) return 'Фантастично';
    if (score >= 8) return 'Очень хорошо';
    if (score >= 7) return 'Хорошо';
    return 'Приятно';
  },
};

export function reviewLabelFor(lang: Language, score: number): string {
  return REVIEW_LABELS[lang](score);
}

export function localizeHotel(hotel: BookingHotel, lang: Language): BookingHotel {
  if (lang === 'ro') return hotel;
  const neighborhood = translateNeighborhood(lang, hotel.neighborhood);
  return {
    ...hotel,
    neighborhood,
    reviewLabel: reviewLabelFor(lang, hotel.reviewScore),
    amenities: hotel.amenities.map((a) => translateAmenity(lang, a)),
    popularWith: hotel.popularWith.map((p) => translatePopularWith(lang, p)),
    rooms: hotel.rooms.map((r) => ({
      ...r,
      name: translateRoomName(lang, r.name),
      beds: translateBeds(lang, r.beds),
    })),
    description: describeHotel(hotel, lang, neighborhood),
  };
}

// Reconstruiește propoziția de descriere a hotelului în limba cerută
// (aceeași structură ca template-ul original din hotels.ts).
export function describeHotel(hotel: BookingHotel, lang: Language, neighborhoodOverride?: string): string {
  const reviewWord = reviewLabelFor(lang, hotel.reviewScore).toLowerCase();
  const typeLabel = propertyTypeLabel(lang, hotel.propertyType).toLowerCase();
  const neighborhood = neighborhoodOverride ?? translateNeighborhood(lang, hotel.neighborhood);
  if (lang === 'en') {
    return (
      `${hotel.name} is a ${hotel.stars}-star ${typeLabel} located in ${neighborhood}, ` +
      `${hotel.distanceFromCenterKm} km from the center. Guests praise its ${reviewWord} ` +
      `value for money and convenient location.`
    );
  }
  if (lang === 'ru') {
    return (
      `${hotel.name} — ${hotel.stars}-звёздочный объект типа «${typeLabel}», расположенный в ${neighborhood}, ` +
      `в ${hotel.distanceFromCenterKm} км от центра. Гости отмечают ${reviewWord} соотношение ` +
      `цены и качества, а также удобное расположение.`
    );
  }
  return hotel.description;
}
