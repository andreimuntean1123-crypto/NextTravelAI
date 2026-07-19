import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X, MapPinOff } from 'lucide-react';
import { destinations, countries } from '@/data/destinations';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { useApp } from '@/context/AppContext';
import { tripTypeLabels, climateLabels } from '@/data/content';
import type { TripType } from '@/types';

const tripTypeKeys = Object.keys(tripTypeLabels) as TripType[];
const climateKeys = ['calda', 'racoroasa', 'tropicala', 'zapada'];
const transportKeys = ['avion', 'masina', 'tren', 'autobuz', 'croaziera'];
const transportLbl: Record<string, string> = {
  avion: 'Avion',
  masina: 'Mașină',
  tren: 'Tren',
  autobuz: 'Autobuz',
  croaziera: 'Croazieră',
};

type SortKey = 'popularity' | 'rating' | 'price-asc' | 'price-desc' | 'duration';

export function Discover() {
  const [params, setParams] = useSearchParams();
  const { currency } = useApp();

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [type, setType] = useState<string>(params.get('type') ?? '');
  const [country, setCountry] = useState('');
  const [climate, setClimate] = useState('');
  const [transport, setTransport] = useState('');
  const [maxPrice, setMaxPrice] = useState(300);
  const [minRating, setMinRating] = useState(0);
  const [maxDays, setMaxDays] = useState(14);
  const [sort, setSort] = useState<SortKey>('popularity');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setQuery(params.get('q') ?? '');
    setType(params.get('type') ?? '');
  }, [params]);

  const filtered = useMemo(() => {
    let list = destinations.filter((d) => {
      if (query) {
        const q = query.toLowerCase();
        if (
          !d.name.toLowerCase().includes(q) &&
          !d.country.toLowerCase().includes(q) &&
          !d.region.toLowerCase().includes(q) &&
          !d.shortDescription.toLowerCase().includes(q)
        )
          return false;
      }
      if (type && !d.tags.includes(type as TripType)) return false;
      if (country && d.country !== country) return false;
      if (climate && d.climate !== climate) return false;
      if (transport && !d.bestTransport.includes(transport as never)) return false;
      if (d.pricePerDay > maxPrice) return false;
      if (d.rating < minRating) return false;
      if (d.recommendedDays > maxDays) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'rating':
          return b.rating - a.rating;
        case 'price-asc':
          return a.pricePerDay - b.pricePerDay;
        case 'price-desc':
          return b.pricePerDay - a.pricePerDay;
        case 'duration':
          return a.recommendedDays - b.recommendedDays;
        default:
          return b.popularity - a.popularity;
      }
    });
    return list;
  }, [query, type, country, climate, transport, maxPrice, minRating, maxDays, sort]);

  const reset = () => {
    setQuery('');
    setType('');
    setCountry('');
    setClimate('');
    setTransport('');
    setMaxPrice(300);
    setMinRating(0);
    setMaxDays(14);
    setSort('popularity');
    setParams({});
  };

  const activeFilters =
    [country, climate, transport, type].filter(Boolean).length +
    (maxPrice < 300 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (maxDays < 14 ? 1 : 0);

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Descoperă destinații</h1>
        <p className="mt-1 text-navy-500 dark:text-sand-200/70">
          {filtered.length} destinații găsite • filtrează după preferințele tale
        </p>
      </div>

      {/* Search + sort bar */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută destinație, țară..."
            className="input-field pl-11"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          className="input-field w-auto"
        >
          <option value="popularity">Popularitate</option>
          <option value="rating">Rating</option>
          <option value="price-asc">Preț crescător</option>
          <option value="price-desc">Preț descrescător</option>
          <option value="duration">Durată</option>
        </select>
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="btn-outline px-4 py-2.5 text-sm lg:hidden"
        >
          <SlidersHorizontal size={16} /> Filtre
          {activeFilters > 0 && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-turquoise-500 text-xs text-navy-950">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="card-surface sticky top-20 space-y-6 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filtre</h3>
              {activeFilters > 0 && (
                <button onClick={reset} className="flex items-center gap-1 text-xs text-turquoise-600">
                  <X size={13} /> Resetează
                </button>
              )}
            </div>

            <FilterGroup label="Tip de vacanță">
              <div className="flex flex-wrap gap-1.5">
                {tripTypeKeys.map((k) => (
                  <button
                    key={k}
                    onClick={() => setType(type === k ? '' : k)}
                    className={`chip text-xs ${
                      type === k
                        ? 'bg-turquoise-500 text-navy-950'
                        : 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-sand-200'
                    }`}
                  >
                    {tripTypeLabels[k]}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Țară">
              <select value={country} onChange={(e) => setCountry(e.target.value)} className="input-field py-2 text-sm">
                <option value="">Toate țările</option>
                {countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label="Climă">
              <div className="flex flex-wrap gap-1.5">
                {climateKeys.map((k) => (
                  <button
                    key={k}
                    onClick={() => setClimate(climate === k ? '' : k)}
                    className={`chip text-xs ${
                      climate === k
                        ? 'bg-turquoise-500 text-navy-950'
                        : 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-sand-200'
                    }`}
                  >
                    {climateLabels[k]}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Transport">
              <div className="flex flex-wrap gap-1.5">
                {transportKeys.map((k) => (
                  <button
                    key={k}
                    onClick={() => setTransport(transport === k ? '' : k)}
                    className={`chip text-xs ${
                      transport === k
                        ? 'bg-turquoise-500 text-navy-950'
                        : 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-sand-200'
                    }`}
                  >
                    {transportLbl[k]}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label={`Preț max / zi: ${maxPrice}€`}>
              <input
                type="range"
                min={50}
                max={300}
                step={10}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-turquoise-500"
              />
            </FilterGroup>

            <FilterGroup label={`Rating minim: ${minRating.toFixed(1)}`}>
              <input
                type="range"
                min={0}
                max={9.5}
                step={0.5}
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full accent-turquoise-500"
              />
            </FilterGroup>

            <FilterGroup label={`Durată max: ${maxDays} zile`}>
              <input
                type="range"
                min={2}
                max={14}
                step={1}
                value={maxDays}
                onChange={(e) => setMaxDays(Number(e.target.value))}
                className="w-full accent-turquoise-500"
              />
            </FilterGroup>
          </div>
        </aside>

        {/* Results */}
        <div>
          {filtered.length === 0 ? (
            <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
              <MapPinOff size={48} className="mb-4 text-navy-300" />
              <h3 className="text-xl font-semibold">Nicio destinație găsită</h3>
              <p className="mt-2 max-w-sm text-navy-500 dark:text-sand-200/70">
                Niciun rezultat pentru filtrele curente. Încearcă să relaxezi criteriile sau
                resetează filtrele.
              </p>
              <button onClick={reset} className="btn-primary mt-5 px-5 py-2.5 text-sm">
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          )}
          {currency !== 'EUR' && (
            <p className="mt-6 text-center text-xs text-navy-400">
              Prețurile sunt convertite din EUR la un curs demonstrativ.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}
