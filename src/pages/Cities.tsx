import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  MapPin,
  Globe2,
  ChevronLeft,
  ChevronRight,
  BedDouble,
  SlidersHorizontal,
  X,
  Heart,
} from 'lucide-react';
import { cities, continents, cityCountries, totalCities, type Continent } from '@/data/cities';
import { cityCheapestHotel } from '@/lib/cityHotels';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/format';

const PER_PAGE = 48;

const priceTierLabels: Record<1 | 2 | 3, string> = {
  1: 'Accesibil €',
  2: 'Mediu €€',
  3: 'Premium €€€',
};

export function Cities() {
  const { currency, isFavorite, toggleFavorite } = useApp();
  const [params] = useSearchParams();

  const [query, setQuery] = useState(params.get('q') ?? '');
  const [continent, setContinent] = useState<Continent | ''>('');
  const [country, setCountry] = useState('');
  const [tiers, setTiers] = useState<(1 | 2 | 3)[]>([]);
  const [minPopularity, setMinPopularity] = useState(0);
  const [sort, setSort] = useState<'popular' | 'az' | 'price'>('popular');
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setQuery(params.get('q') ?? '');
  }, [params]);

  const filtered = useMemo(() => {
    let list = cities.filter((c) => {
      if (continent && c.continent !== continent) return false;
      if (country && c.country !== country) return false;
      if (tiers.length && !tiers.includes(c.priceTier)) return false;
      if (c.popularity < minPopularity) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!c.name.toLowerCase().includes(q) && !c.country.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'az') return a.name.localeCompare(b.name, 'ro');
      if (sort === 'price') return a.priceTier - b.priceTier;
      return b.popularity - a.popularity;
    });
    return list;
  }, [query, continent, country, tiers, minPopularity, sort]);

  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const current = Math.min(page, Math.max(0, pageCount - 1));
  const shown = filtered.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  const change = (fn: () => void) => {
    fn();
    setPage(0);
  };

  const toggleTier = (t: 1 | 2 | 3) =>
    change(() => setTiers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t])));

  const reset = () => {
    change(() => {
      setContinent('');
      setCountry('');
      setTiers([]);
      setMinPopularity(0);
    });
  };

  const activeFilters =
    (continent ? 1 : 0) + (country ? 1 : 0) + tiers.length + (minPopularity > 0 ? 1 : 0);

  // Țări disponibile pentru continentul selectat.
  const countriesForContinent = continent
    ? Array.from(new Set(cities.filter((c) => c.continent === continent).map((c) => c.country))).sort()
    : cityCountries;

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Globe2 className="text-turquoise-500" /> Orașe populare
        </h1>
        <p className="mt-1 text-navy-500 dark:text-sand-200/70">
          {filtered.length.toLocaleString('ro-RO')} din {totalCities.toLocaleString('ro-RO')} orașe •
          apasă pe un oraș pentru hotelurile disponibile acolo
        </p>
      </div>

      {/* Top controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            value={query}
            onChange={(e) => change(() => setQuery(e.target.value))}
            placeholder="Caută oraș sau țară (ex. Roma, Japonia)..."
            className="input-field pl-11"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
          className="input-field w-auto"
        >
          <option value="popular">Popularitate</option>
          <option value="az">Alfabetic (A–Z)</option>
          <option value="price">Preț</option>
        </select>
        <button onClick={() => setShowFilters((s) => !s)} className="btn-outline px-4 py-2.5 text-sm lg:hidden">
          <SlidersHorizontal size={16} /> Filtre
          {activeFilters > 0 && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-turquoise-500 text-xs text-navy-950">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters sidebar */}
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

            <FilterGroup label="Continent">
              <div className="flex flex-wrap gap-1.5">
                {continents.map((c) => (
                  <button
                    key={c}
                    onClick={() => change(() => { setContinent(continent === c ? '' : c); setCountry(''); })}
                    className={`chip text-xs ${
                      continent === c
                        ? 'bg-turquoise-500 text-navy-950'
                        : 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-sand-200'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label="Țară">
              <select
                value={country}
                onChange={(e) => change(() => setCountry(e.target.value))}
                className="input-field py-2 text-sm"
              >
                <option value="">Toate țările</option>
                {countriesForContinent.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FilterGroup>

            <FilterGroup label="Nivel de preț">
              <div className="flex flex-wrap gap-1.5">
                {([1, 2, 3] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => toggleTier(t)}
                    className={`chip text-xs ${
                      tiers.includes(t)
                        ? 'bg-turquoise-500 text-navy-950'
                        : 'bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-sand-200'
                    }`}
                  >
                    {priceTierLabels[t]}
                  </button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup label={`Popularitate minimă: ${minPopularity}%`}>
              <input
                type="range"
                min={0}
                max={95}
                step={5}
                value={minPopularity}
                onChange={(e) => change(() => setMinPopularity(Number(e.target.value)))}
                className="w-full accent-turquoise-500"
              />
            </FilterGroup>
          </div>
        </aside>

        {/* Results */}
        <div>
          {/* Continent quick chips (top of results) */}
          <div className="mb-5 flex flex-wrap gap-2">
            <button
              onClick={() => change(() => { setContinent(''); setCountry(''); })}
              className={`chip text-sm ${continent === '' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
            >
              Toate
            </button>
            {continents.map((c) => (
              <button
                key={c}
                onClick={() => change(() => { setContinent(continent === c ? '' : c); setCountry(''); })}
                className={`chip text-sm ${continent === c ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
              >
                {c}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
              <MapPin size={48} className="mb-4 text-navy-300" />
              <h3 className="text-xl font-semibold">Niciun oraș găsit</h3>
              <p className="mt-2 max-w-sm text-navy-500 dark:text-sand-200/70">
                Niciun rezultat pentru criteriile curente. Încearcă să relaxezi filtrele.
              </p>
              {activeFilters > 0 && (
                <button onClick={reset} className="btn-primary mt-5 px-5 py-2.5 text-sm">
                  Resetează filtrele
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((c) => (
                <Link
                  key={c.id}
                  to={`/oras/${c.id}`}
                  className="group card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-soft-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                    <span className="absolute right-2 top-2 rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-semibold text-navy-700 backdrop-blur">
                      {c.continent}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(c.id, `${c.name}, ${c.country}`);
                      }}
                      aria-label="Adaugă la favorite"
                      className="absolute left-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
                    >
                      <Heart
                        size={15}
                        className={isFavorite(c.id) ? 'fill-red-500 text-red-500' : 'text-navy-600'}
                      />
                    </button>
                    <div className="absolute bottom-2 left-3 right-3 text-white">
                      <h3 className="font-display text-lg font-semibold drop-shadow">{c.name}</h3>
                      <p className="flex items-center gap-1 text-xs text-sand-100/90">
                        <MapPin size={11} /> {c.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 text-sm">
                    <span className="flex items-center gap-1 text-xs text-navy-400">
                      <BedDouble size={13} /> hoteluri de la
                    </span>
                    <span className="font-bold text-turquoise-600 dark:text-turquoise-300">
                      {formatMoney(cityCheapestHotel(c), currency)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pageCount > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={current === 0}
                className="btn-outline px-3 py-2 text-sm"
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <span className="px-3 text-sm text-navy-500 dark:text-sand-200/70">
                Pagina {current + 1} / {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={current >= pageCount - 1}
                className="btn-outline px-3 py-2 text-sm"
              >
                Următor <ChevronRight size={16} />
              </button>
            </div>
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
