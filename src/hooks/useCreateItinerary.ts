import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { generateItinerary } from '@/lib/itinerary';
import type { Destination, Pace } from '@/types';

// Generează un itinerar din datele curente și navighează la pagina lui.
export function useCreateItinerary() {
  const { saveItinerary, preferences } = useApp();
  const navigate = useNavigate();

  return (dest: Destination, overrideDays?: number) => {
    const days = overrideDays ?? Number(preferences.days) ?? dest.recommendedDays;
    const people = Number(preferences.people) || 2;
    const pace = (preferences.pace as Pace) || 'echilibrat';
    const itinerary = generateItinerary(dest, days || dest.recommendedDays, people, pace);
    saveItinerary(itinerary);
    navigate(`/itinerar/${itinerary.id}`);
  };
}
