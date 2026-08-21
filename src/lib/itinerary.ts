import { tf, translate } from '@/i18n/translations';
import { slotLabelText } from '@/i18n/labels';
import type {
  Destination,
  Itinerary,
  ItineraryActivity,
  ItineraryDay,
  Language,
  Pace,
} from '@/types';

let idCounter = 0;
const uid = () => `act-${Date.now()}-${idCounter++}`;

const paceSlots: Record<Pace, number> = {
  relaxat: 2,
  echilibrat: 3,
  'foarte-activ': 4,
};

// Generează un itinerar pe zile din datele destinației.
export function generateItinerary(
  dest: Destination,
  days: number,
  people: number,
  pace: Pace = 'echilibrat',
  lang: Language = 'ro',
): Itinerary {
  const slotsPerDay = paceSlots[pace];
  const attractions = [...dest.attractions];
  const restaurants = [...dest.restaurants];
  const itineraryDays: ItineraryDay[] = [];

  for (let d = 0; d < days; d++) {
    const activities: ItineraryActivity[] = [];

    // Dimineața — obiectiv principal
    const morning = attractions[(d * 2) % attractions.length];
    activities.push({
      id: uid(),
      slot: 'dimineata',
      title: morning.name,
      type: 'obiectiv',
      durationHours: morning.durationHours,
      cost: morning.cost * people,
      distanceKm: Number((1.5 + (d % 3)).toFixed(1)),
      tip: morning.description,
    });

    // Prânz — restaurant
    const lunch = restaurants[d % restaurants.length];
    activities.push({
      id: uid(),
      slot: 'pranz',
      title: tf(lang, 'itin.lunchAt', { name: lunch.name }),
      type: 'masa',
      durationHours: 1.5,
      cost: lunch.priceLevel * 18 * people,
      distanceKm: 0.8,
      tip: `${lunch.cuisine}. ${lunch.note}`,
    });

    // După-amiaza — al doilea obiectiv (dacă ritmul permite)
    if (slotsPerDay >= 3) {
      const afternoon = attractions[(d * 2 + 1) % attractions.length];
      activities.push({
        id: uid(),
        slot: 'dupa-amiaza',
        title: afternoon.name,
        type: 'activitate',
        durationHours: afternoon.durationHours,
        cost: afternoon.cost * people,
        distanceKm: Number((2 + (d % 4)).toFixed(1)),
        tip: afternoon.description,
      });
    } else {
      activities.push({
        id: uid(),
        slot: 'dupa-amiaza',
        title: translate(lang, 'itin.freeTime'),
        type: 'relaxare',
        durationHours: 2,
        cost: 0,
        tip: translate(lang, 'itin.enjoyPace'),
      });
    }

    // Seara — cină + experiență
    const dinner = restaurants[(d + 1) % restaurants.length];
    activities.push({
      id: uid(),
      slot: 'seara',
      title: tf(lang, 'itin.dinnerAt', { name: dinner.name }),
      type: 'masa',
      durationHours: 2,
      cost: dinner.priceLevel * 25 * people,
      distanceKm: 1.2,
      tip: `${dinner.cuisine}. ${dinner.note}`,
    });

    itineraryDays.push({
      day: d + 1,
      title: dayTitle(d, dest, lang),
      activities,
    });
  }

  return {
    id: `itin-${dest.id}-${Date.now()}`,
    destinationId: dest.id,
    destinationName: dest.name,
    country: dest.country,
    image: dest.image,
    days: itineraryDays,
    people,
    totalDays: days,
    createdAt: Date.now(),
    pace,
  };
}

function dayTitle(index: number, dest: Destination, lang: Language): string {
  const titles = [
    tf(lang, 'itin.day.arrival', { name: dest.name }),
    translate(lang, 'itin.day.cultural'),
    translate(lang, 'itin.day.nature'),
    translate(lang, 'itin.day.food'),
    translate(lang, 'itin.day.adventure'),
    translate(lang, 'itin.day.hidden'),
    translate(lang, 'itin.day.free'),
    translate(lang, 'itin.day.last'),
  ];
  return titles[index % titles.length];
}

// Reface o singură zi cu variație.
export function regenerateDay(
  itinerary: Itinerary,
  dayNumber: number,
  dest: Destination,
  lang: Language = 'ro',
): Itinerary {
  const fresh = generateItinerary(dest, itinerary.totalDays, itinerary.people, itinerary.pace, lang);
  const newDay = fresh.days[(dayNumber) % fresh.days.length];
  return {
    ...itinerary,
    days: itinerary.days.map((d) =>
      d.day === dayNumber ? { ...newDay, day: dayNumber, title: tf(lang, 'itin.day.renewed', { title: d.title }) } : d,
    ),
  };
}

export function itineraryTotalCost(itinerary: Itinerary): number {
  return itinerary.days.reduce(
    (sum, day) => sum + day.activities.reduce((s, a) => s + a.cost, 0),
    0,
  );
}

export function slotLabelsFor(lang: Language): Record<string, { label: string; icon: string }> {
  return {
    dimineata: { label: slotLabelText(lang, 'dimineata'), icon: '🌅' },
    pranz: { label: slotLabelText(lang, 'pranz'), icon: '🍽️' },
    'dupa-amiaza': { label: slotLabelText(lang, 'dupa-amiaza'), icon: '🌤️' },
    seara: { label: slotLabelText(lang, 'seara'), icon: '🌙' },
  };
}

// ─── Itinerar generic pentru un oraș (fără date curate detaliate) ──

const CITY_MORNING_KEYS = [
  'itin.cityMorning1',
  'itin.cityMorning2',
  'itin.cityMorning3',
  'itin.cityMorning4',
  'itin.cityMorning5',
] as const;
const CITY_AFTERNOON_KEYS = [
  'itin.cityAfternoon1',
  'itin.cityAfternoon2',
  'itin.cityAfternoon3',
  'itin.cityAfternoon4',
  'itin.cityAfternoon5',
] as const;

export function generateCityItinerary(
  city: { id: string; name: string; country: string; image: string },
  days: number,
  people: number,
  pace: Pace = 'echilibrat',
  lang: Language = 'ro',
): Itinerary {
  const slots = paceSlots[pace];
  const itineraryDays: ItineraryDay[] = [];

  for (let d = 0; d < days; d++) {
    const activities: ItineraryActivity[] = [];
    activities.push({
      id: uid(),
      slot: 'dimineata',
      title: `${translate(lang, CITY_MORNING_KEYS[d % CITY_MORNING_KEYS.length])} ${city.name}`,
      type: 'obiectiv',
      durationHours: 2.5,
      cost: 12 * people,
      distanceKm: Number((1 + (d % 3)).toFixed(1)),
      tip: translate(lang, 'itin.tipEarly'),
    });
    activities.push({
      id: uid(),
      slot: 'pranz',
      title: tf(lang, 'itin.cityLunch', { name: city.name }),
      type: 'masa',
      durationHours: 1.5,
      cost: 18 * people,
      distanceKm: 0.7,
      tip: translate(lang, 'itin.tipTraditional'),
    });
    if (slots >= 3) {
      activities.push({
        id: uid(),
        slot: 'dupa-amiaza',
        title: translate(lang, CITY_AFTERNOON_KEYS[d % CITY_AFTERNOON_KEYS.length]),
        type: 'activitate',
        durationHours: 2.5,
        cost: 15 * people,
        distanceKm: Number((1.5 + (d % 4)).toFixed(1)),
        tip: translate(lang, 'itin.tipRelaxedPhotos'),
      });
    } else {
      activities.push({
        id: uid(),
        slot: 'dupa-amiaza',
        title: translate(lang, 'itin.freeTime'),
        type: 'relaxare',
        durationHours: 2,
        cost: 0,
        tip: translate(lang, 'itin.tipEnjoyPlace'),
      });
    }
    activities.push({
      id: uid(),
      slot: 'seara',
      title: tf(lang, 'itin.cityDinner', { name: city.name }),
      type: 'masa',
      durationHours: 2,
      cost: 26 * people,
      distanceKm: 1,
      tip: translate(lang, 'itin.tipBookWeekend'),
    });

    itineraryDays.push({ day: d + 1, title: dayTitle(d, { name: city.name } as Destination, lang), activities });
  }

  return {
    id: `itin-${city.id}-${Date.now()}`,
    destinationId: city.id,
    destinationName: city.name,
    country: city.country,
    image: city.image,
    days: itineraryDays,
    people,
    totalDays: days,
    createdAt: Date.now(),
    pace,
  };
}
