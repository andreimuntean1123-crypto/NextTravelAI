import { translate } from '@/i18n/translations';
import type { Destination, Language } from '@/types';

export interface WeatherDay {
  day: string;
  tempC: number;
  icon: string;
  label: string;
}

// Prognoză demonstrativă generată determinist din temperatura medie.
// Se poate înlocui cu un API de vreme (VITE_WEATHER_API_KEY).
export function getMockForecast(dest: Destination, lang: Language = 'ro'): WeatherDay[] {
  const dayKeys = ['wx.today', 'wx.tomorrow', 'wx.wed', 'wx.thu', 'wx.fri'] as const;
  const days = dayKeys.map((k) => translate(lang, k));
  const base = dest.avgTempC;

  const pick = (temp: number): { icon: string; label: string } => {
    if (dest.climate === 'zapada' || temp < 3) return { icon: '❄️', label: translate(lang, 'wx.snow') };
    if (temp >= 28) return { icon: '☀️', label: translate(lang, 'wx.sunny') };
    if (temp >= 20) return { icon: '🌤️', label: translate(lang, 'wx.partlyCloudy') };
    if (temp >= 12) return { icon: '⛅', label: translate(lang, 'wx.cloudy') };
    return { icon: '🌧️', label: translate(lang, 'wx.lightRain') };
  };

  return days.map((day, i) => {
    const variation = [(i * 7) % 5, (i * 3) % 4, (i * 5) % 6][i % 3] - 2;
    const tempC = Math.round(base + variation);
    const { icon, label } = pick(tempC);
    return { day, tempC, icon, label };
  });
}
