import { getMockForecast } from '@/lib/weather';
import type { Destination } from '@/types';
import { CloudSun } from 'lucide-react';

export function WeatherWidget({ destination }: { destination: Destination }) {
  const forecast = getMockForecast(destination);

  return (
    <div className="card-surface p-5">
      <div className="mb-4 flex items-center gap-2">
        <CloudSun size={18} className="text-gold-500" />
        <h3 className="font-semibold">Vremea în {destination.name}</h3>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {forecast.map((day) => (
          <div
            key={day.day}
            className="flex flex-col items-center gap-1 rounded-xl bg-navy-50 py-3 dark:bg-navy-800"
          >
            <span className="text-xs font-medium text-navy-400">{day.day}</span>
            <span className="text-2xl">{day.icon}</span>
            <span className="text-sm font-bold">{day.tempC}°</span>
            <span className="text-[10px] text-navy-400">{day.label}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-navy-400">
        Prognoză demonstrativă • gata de OpenWeather (VITE_WEATHER_API_KEY)
      </p>
    </div>
  );
}
