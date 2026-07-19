import type {
  Destination,
  Itinerary,
  ItineraryActivity,
  ItineraryDay,
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
      title: `Prânz la ${lunch.name}`,
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
        title: 'Timp liber & relaxare',
        type: 'relaxare',
        durationHours: 2,
        cost: 0,
        tip: 'Savurează atmosfera în ritmul tău.',
      });
    }

    // Seara — cină + experiență
    const dinner = restaurants[(d + 1) % restaurants.length];
    activities.push({
      id: uid(),
      slot: 'seara',
      title: `Cină la ${dinner.name}`,
      type: 'masa',
      durationHours: 2,
      cost: dinner.priceLevel * 25 * people,
      distanceKm: 1.2,
      tip: `${dinner.cuisine}. ${dinner.note}`,
    });

    itineraryDays.push({
      day: d + 1,
      title: dayTitle(d, dest),
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

function dayTitle(index: number, dest: Destination): string {
  const titles = [
    `Sosire & primele impresii în ${dest.name}`,
    'Explorare culturală',
    'Natură & priveliști',
    'Gastronomie & relaxare',
    'Aventură',
    'Locuri ascunse',
    'Zi liberă & shopping',
    'Ultima zi & suveniruri',
  ];
  return titles[index % titles.length];
}

// Reface o singură zi cu variație.
export function regenerateDay(
  itinerary: Itinerary,
  dayNumber: number,
  dest: Destination,
): Itinerary {
  const fresh = generateItinerary(dest, itinerary.totalDays, itinerary.people, itinerary.pace);
  const newDay = fresh.days[(dayNumber) % fresh.days.length];
  return {
    ...itinerary,
    days: itinerary.days.map((d) =>
      d.day === dayNumber ? { ...newDay, day: dayNumber, title: `${d.title} (reînnoit)` } : d,
    ),
  };
}

export function itineraryTotalCost(itinerary: Itinerary): number {
  return itinerary.days.reduce(
    (sum, day) => sum + day.activities.reduce((s, a) => s + a.cost, 0),
    0,
  );
}

export const slotLabels: Record<string, { label: string; icon: string }> = {
  dimineata: { label: 'Dimineața', icon: '🌅' },
  pranz: { label: 'Prânz', icon: '🍽️' },
  'dupa-amiaza': { label: 'După-amiaza', icon: '🌤️' },
  seara: { label: 'Seara', icon: '🌙' },
};
