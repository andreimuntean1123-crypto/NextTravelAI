import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Globe2, ChevronLeft, ChevronRight, BedDouble } from 'lucide-react';
import { cities, continents, totalCities, type Continent } from '@/data/cities';
import { cityCheapestHotel } from '@/lib/cityHotels';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/format';

const PER_PAGE = 48;

export function Cities() {
  const { currency } = useApp();
  const [query, setQuery] = useState('');
  const [continent, setContinent] = useState<Continent | ''>('');
  const [sort, setSort] = useState<'popular' | 'az' | 'price'>('popular');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let list = cities.filter((c) => {
      if (continent && c.continent !== continent) return false;
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
  }, [query, continent, sort]);

  const pageCount = Math.ceil(filtered.length / PER_PAGE);
  const current = Math.min(page, Math.max(0, pageCount - 1));
  const shown = filtered.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  const changeFilter = (fn: () => void) => {
    fn();
    setPage(0);
  };

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Globe2 className="text-turquoise-500" /> Orașe populare
        </h1>
        <p className="mt-1 text-navy-500 dark:text-sand-200/70">
          {filtered.length.toLocaleString('ro-RO')} din {totalCities.toLocaleString('ro-RO')} orașe din întreaga lume •
          apasă pe un oraș pentru hotelurile disponibile acolo
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            value={query}
            onChange={(e) => changeFilter(() => setQuery(e.target.value))}
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
      </div>

      {/* Continent chips */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => changeFilter(() => setContinent(''))}
          className={`chip text-sm ${continent === '' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
        >
          Toate continentele
        </button>
        {continents.map((c) => (
          <button
            key={c}
            onClick={() => changeFilter(() => setContinent(c))}
            className={`chip text-sm ${continent === c ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {shown.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
          <MapPin size={48} className="mb-4 text-navy-300" />
          <h3 className="text-xl font-semibold">Niciun oraș găsit</h3>
          <p className="mt-2 text-navy-500 dark:text-sand-200/70">Încearcă alt termen de căutare.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
  );
}
