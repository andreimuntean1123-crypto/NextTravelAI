import type { Destination } from '@/types';

export interface WeatherDay {
  day: string;
  tempC: number;
  icon: string;
  label: string;
}

// Prognoză demonstrativă generată determinist din temperatura medie.
// Se poate înlocui cu un API de vreme (VITE_WEATHER_API_KEY).
export function getMockForecast(dest: Destination): WeatherDay[] {
  const days = ['Azi', 'Mâine', 'Mie', 'Joi', 'Vin'];
  const base = dest.avgTempC;

  const pick = (temp: number): { icon: string; label: string } => {
    if (dest.climate === 'zapada' || temp < 3) return { icon: '❄️', label: 'Ninsoare' };
    if (temp >= 28) return { icon: '☀️', label: 'Însorit' };
    if (temp >= 20) return { icon: '🌤️', label: 'Parțial noros' };
    if (temp >= 12) return { icon: '⛅', label: 'Noros' };
    return { icon: '🌧️', label: 'Ploaie ușoară' };
  };

  return days.map((day, i) => {
    const variation = [(i * 7) % 5, (i * 3) % 4, (i * 5) % 6][i % 3] - 2;
    const tempC = Math.round(base + variation);
    const { icon, label } = pick(tempC);
    return { day, tempC, icon, label };
  });
}
