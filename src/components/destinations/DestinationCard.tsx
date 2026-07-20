import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Thermometer, Scale, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatMoney, formatTemp } from '@/lib/format';
import { tripTypeLabels } from '@/data/content';
import type { Destination } from '@/types';

interface Props {
  destination: Destination;
  matchScore?: number;
}

export function DestinationCard({ destination: d, matchScore }: Props) {
  const { currency, isFavorite, toggleFavorite, compareList, toggleCompare } = useApp();
  const navigate = useNavigate();
  const inCompare = compareList.includes(d.id);

  return (
    <article className="group card-surface overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={d.image}
          alt={`${d.name}, ${d.country}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />

        <button
          onClick={() => toggleFavorite(d.id, `${d.name}, ${d.country}`)}
          aria-label={isFavorite(d.id) ? 'Elimină de la favorite' : 'Salvează la favorite'}
          className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
        >
          <Heart
            size={18}
            className={isFavorite(d.id) ? 'fill-red-500 text-red-500' : 'text-navy-600'}
          />
        </button>

        {matchScore !== undefined && (
          <span className="absolute left-3 top-3 rounded-full bg-turquoise-500 px-3 py-1 text-xs font-bold text-navy-950 shadow">
            {matchScore}% potrivire
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white">
          <div>
            <h3 className="font-display text-xl font-semibold drop-shadow">{d.name}</h3>
            <p className="flex items-center gap-1 text-sm text-sand-100/90">
              <MapPin size={13} /> {d.country}
            </p>
          </div>
          <span className="rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium backdrop-blur">
            ★ {d.rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {d.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="chip bg-turquoise-50 text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300"
            >
              {tripTypeLabels[tag]}
            </span>
          ))}
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-navy-600 dark:text-sand-200/80">
          {d.shortDescription}
        </p>

        <div className="mb-4 flex items-center gap-4 text-sm text-navy-500 dark:text-sand-200/70">
          <span className="flex items-center gap-1">
            <Thermometer size={14} /> {formatTemp(d.avgTempC)}
          </span>
          <span className="font-semibold text-turquoise-600 dark:text-turquoise-300">
            {formatMoney(d.pricePerDay, currency)} <span className="font-normal text-navy-400">/ zi</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/destinatie/${d.id}`} className="btn-primary flex-1 px-4 py-2 text-sm">
            Detalii <ArrowRight size={15} />
          </Link>
          <button
            onClick={() => toggleCompare(d.id)}
            aria-label="Compară"
            title="Adaugă la comparație"
            className={`btn px-3 py-2 text-sm ${
              inCompare
                ? 'bg-gold-500 text-navy-950'
                : 'border border-navy-200 dark:border-navy-700 text-navy-600 dark:text-sand-200'
            }`}
            onDoubleClick={() => navigate('/compara')}
          >
            <Scale size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
