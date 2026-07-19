import { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { destinations } from '@/data/destinations';
import type { Destination } from '@/types';

// Poziții demonstrative pe o hartă stilizată a lumii (procente).
const positions: Record<string, { x: number; y: number }> = {
  santorini: { x: 55, y: 42 },
  kyoto: { x: 83, y: 40 },
  barcelona: { x: 48, y: 38 },
  bali: { x: 79, y: 62 },
  zermatt: { x: 50, y: 34 },
  lisabona: { x: 44, y: 40 },
  maldive: { x: 68, y: 58 },
  roma: { x: 51, y: 39 },
  'costa-rica': { x: 24, y: 55 },
  praga: { x: 51, y: 33 },
};

export function MapDemo() {
  const [active, setActive] = useState<Destination | null>(null);

  return (
    <div className="card-surface overflow-hidden">
      <div className="flex items-center justify-between border-b border-navy-100 p-4 dark:border-navy-800">
        <div className="flex items-center gap-2">
          <Navigation size={18} className="text-turquoise-500" />
          <h3 className="font-semibold">Hartă interactivă</h3>
        </div>
        <span className="text-xs text-navy-400">demonstrativ • gata de Google Maps</span>
      </div>

      <div className="relative aspect-[2/1] bg-gradient-to-b from-navy-800 to-navy-900">
        {/* Contur stilizat */}
        <svg viewBox="0 0 100 50" className="absolute inset-0 h-full w-full opacity-20">
          <path
            d="M10,25 Q20,15 30,22 T50,20 Q65,12 80,20 T95,25 M15,30 Q25,38 40,33 T70,36 Q82,40 90,34"
            fill="none"
            stroke="#52f5dc"
            strokeWidth="0.5"
          />
        </svg>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(82,245,220,0.15) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {destinations.map((d) => {
          const pos = positions[d.id];
          if (!pos) return null;
          const isActive = active?.id === d.id;
          return (
            <button
              key={d.id}
              onClick={() => setActive(d)}
              className="group absolute -translate-x-1/2 -translate-y-full"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              aria-label={d.name}
            >
              <MapPin
                size={isActive ? 30 : 22}
                className={`drop-shadow transition-all ${
                  isActive ? 'fill-gold-400 text-gold-500' : 'fill-turquoise-400 text-turquoise-600'
                } group-hover:scale-125`}
              />
            </button>
          );
        })}

        {active && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center gap-3 rounded-2xl bg-white/95 p-3 backdrop-blur dark:bg-navy-900/95 animate-fade-in-fast sm:max-w-xs">
            <img src={active.image} alt={active.name} className="h-14 w-14 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{active.name}</p>
              <p className="truncate text-xs text-navy-500 dark:text-sand-200/70">
                {active.country} • {active.region}
              </p>
            </div>
            <a href={`/destinatie/${active.id}`} className="btn-primary px-3 py-1.5 text-xs">
              Vezi
            </a>
          </div>
        )}
      </div>
      <p className="p-3 text-center text-xs text-navy-400">
        Apasă pe un marcaj pentru detalii. Integrarea reală se face cu VITE_MAPS_API_KEY.
      </p>
    </div>
  );
}
