import {
  Heart,
  Scale,
  Map,
  ThumbsUp,
  ThumbsDown,
  Thermometer,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useCreateItinerary } from '@/hooks/useCreateItinerary';
import { MatchRing } from '@/components/ui/MatchRing';
import { formatMoney, formatTemp, pluralDays } from '@/lib/format';
import { tripTypeLabels } from '@/data/content';
import type { Recommendation } from '@/types';

export function RecommendationCard({ rec, rank }: { rec: Recommendation; rank: number }) {
  const { currency, isFavorite, toggleFavorite, compareList, toggleCompare } = useApp();
  const createItinerary = useCreateItinerary();
  const d = rec.destination;
  const inCompare = compareList.includes(d.id);

  return (
    <article className="card-surface overflow-hidden animate-slide-up">
      <div className="grid md:grid-cols-[300px_1fr]">
        {/* Image */}
        <div className="relative aspect-[4/3] md:aspect-auto">
          <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
          <span className="absolute left-3 top-3 rounded-full bg-navy-900/80 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            #{rank} recomandare
          </span>
          <button
            onClick={() => toggleFavorite(d.id, `${d.name}, ${d.country}`)}
            className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
            aria-label="Favorite"
          >
            <Heart size={18} className={isFavorite(d.id) ? 'fill-red-500 text-red-500' : 'text-navy-600'} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-2xl font-bold">{d.name}</h3>
              <p className="flex items-center gap-1 text-sm text-navy-500 dark:text-sand-200/70">
                <MapPin size={14} /> {d.country} • {d.region}
              </p>
            </div>
            <div className="text-center">
              <MatchRing score={rec.matchScore} />
              <p className="mt-1 text-[11px] font-medium text-navy-400">potrivire</p>
            </div>
          </div>

          {/* Quick facts */}
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Fact icon={<Thermometer size={15} />} value={formatTemp(d.avgTempC)} />
            <Fact icon={<Clock size={15} />} value={pluralDays(d.recommendedDays)} />
            <Fact
              icon={<Sparkles size={15} />}
              value={d.tags.slice(0, 2).map((t) => tripTypeLabels[t]).join(', ')}
            />
            <span className="font-bold text-turquoise-600 dark:text-turquoise-300">
              de la {formatMoney(rec.estimatedPrice, currency)}
            </span>
          </div>

          {/* Reasons */}
          <div className="mt-4">
            <p className="mb-1.5 text-sm font-semibold">De ce ți se potrivește:</p>
            <ul className="space-y-1">
              {rec.reasons.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-navy-600 dark:text-sand-200/80">
                  <span className="mt-0.5 text-turquoise-500">✓</span> {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Pros / Cons */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {rec.pros.length > 0 && (
              <div className="rounded-xl bg-turquoise-50/60 p-3 dark:bg-navy-800">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-turquoise-700 dark:text-turquoise-300">
                  <ThumbsUp size={13} /> Avantaje
                </p>
                <ul className="space-y-0.5 text-xs text-navy-600 dark:text-sand-200/80">
                  {rec.pros.map((p, i) => (
                    <li key={i}>• {p}</li>
                  ))}
                </ul>
              </div>
            )}
            {rec.cons.length > 0 && (
              <div className="rounded-xl bg-gold-400/10 p-3">
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-gold-600">
                  <ThumbsDown size={13} /> De luat în calcul
                </p>
                <ul className="space-y-0.5 text-xs text-navy-600 dark:text-sand-200/80">
                  {rec.cons.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap gap-2">
            <button onClick={() => createItinerary(d)} className="btn-primary flex-1 px-4 py-2.5 text-sm">
              <Map size={16} /> Vezi itinerarul
            </button>
            <button
              onClick={() => toggleFavorite(d.id, `${d.name}, ${d.country}`)}
              className="btn-outline px-4 py-2.5 text-sm"
            >
              <Heart size={16} className={isFavorite(d.id) ? 'fill-red-500 text-red-500' : ''} />
              {isFavorite(d.id) ? 'Salvat' : 'Favorite'}
            </button>
            <button
              onClick={() => toggleCompare(d.id)}
              className={`btn px-4 py-2.5 text-sm ${
                inCompare ? 'bg-gold-500 text-navy-950' : 'btn-outline'
              }`}
            >
              <Scale size={16} /> Compară
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Fact({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <span className="flex items-center gap-1.5 text-navy-500 dark:text-sand-200/70">
      {icon} {value}
    </span>
  );
}
