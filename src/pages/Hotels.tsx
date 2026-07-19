import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Hotel as HotelIcon, BedDouble } from 'lucide-react';
import { searchHotels, allAmenities, type HotelSort } from '@/lib/hotelsService';
import { HotelCard } from '@/components/hotels/HotelCard';
import { HotelDetailModal } from '@/components/hotels/HotelDetailModal';
import { propertyTypeLabels, boardLabels, totalHotels } from '@/data/hotels';
import { destinations } from '@/data/destinations';
import type { BoardType, BookingHotel, PropertyType } from '@/types';

const propertyTypeKeys = Object.keys(propertyTypeLabels) as PropertyType[];
const boardKeys = Object.keys(boardLabels) as BoardType[];

export function Hotels() {
  const [params] = useSearchParams();
  const [selected, setSelected] = useState<BookingHotel | null>(null);

  const [query, setQuery] = useState('');
  const [destinationId, setDestinationId] = useState(params.get('dest') ?? '');
  const [nights, setNights] = useState(3);
  const [maxPrice, setMaxPrice] = useState(800);
  const [stars, setStars] = useState<number[]>([]);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [boards, setBoards] = useState<BoardType[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [freeCancellation, setFreeCancellation] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [sustainable, setSustainable] = useState(false);
  const [sort, setSort] = useState<HotelSort>('recommended');
  const [showFilters, setShowFilters] = useState(false);

  const results = useMemo(
    () =>
      searchHotels(
        {
          query,
          destinationId: destinationId || undefined,
          maxPrice,
          stars,
          propertyTypes: types,
          boards,
          minReviewScore: minScore,
          amenities,
          freeCancellation,
          breakfastIncluded: breakfast,
          sustainable,
        },
        sort,
      ),
    [query, destinationId, maxPrice, stars, types, boards, minScore, amenities, freeCancellation, breakfast, sustainable, sort],
  );

  const toggle = <T,>(arr: T[], val: T, setter: (v: T[]) => void) =>
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const reset = () => {
    setQuery('');
    setDestinationId('');
    setMaxPrice(800);
    setStars([]);
    setTypes([]);
    setBoards([]);
    setMinScore(0);
    setAmenities([]);
    setFreeCancellation(false);
    setBreakfast(false);
    setSustainable(false);
  };

  const activeCount =
    stars.length + types.length + boards.length + amenities.length +
    (destinationId ? 1 : 0) + (maxPrice < 800 ? 1 : 0) + (minScore > 0 ? 1 : 0) +
    (freeCancellation ? 1 : 0) + (breakfast ? 1 : 0) + (sustainable ? 1 : 0);

  return (
    <div className="container-page py-10">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <HotelIcon className="text-turquoise-500" /> Hoteluri
        </h1>
        <p className="mt-1 text-navy-500 dark:text-sand-200/70">
          {results.length} din {totalHotels} proprietăți • fiecare cu prețul și camerele sale
        </p>
      </div>

      {/* Top controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Caută hotel sau cartier..."
            className="input-field pl-11"
          />
        </div>
        <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)} className="input-field w-auto">
          <option value="">Toate destinațiile</option>
          {destinations.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}, {d.country}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm">
          <BedDouble size={16} className="text-navy-400" />
          <select value={nights} onChange={(e) => setNights(Number(e.target.value))} className="input-field w-auto">
            {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? 'noapte' : 'nopți'}
              </option>
            ))}
          </select>
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value as HotelSort)} className="input-field w-auto">
          <option value="recommended">Recomandate</option>
          <option value="price-asc">Preț crescător</option>
          <option value="price-desc">Preț descrescător</option>
          <option value="rating">Scor recenzii</option>
          <option value="stars">Stele</option>
          <option value="distance">Distanță de centru</option>
        </select>
        <button onClick={() => setShowFilters((s) => !s)} className="btn-outline px-4 py-2.5 text-sm lg:hidden">
          <SlidersHorizontal size={16} /> Filtre
          {activeCount > 0 && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-turquoise-500 text-xs text-navy-950">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Filters */}
        <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="card-surface sticky top-20 space-y-5 p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Filtrează</h3>
              {activeCount > 0 && (
                <button onClick={reset} className="flex items-center gap-1 text-xs text-turquoise-600">
                  <X size={13} /> Resetează
                </button>
              )}
            </div>

            <Group label={`Preț max / noapte: ${maxPrice}€`}>
              <input type="range" min={20} max={800} step={10} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-turquoise-500" />
            </Group>

            <Group label="Scor recenzii">
              <div className="flex flex-wrap gap-1.5">
                {[9, 8, 7].map((s) => (
                  <button
                    key={s}
                    onClick={() => setMinScore(minScore === s ? 0 : s)}
                    className={`chip text-xs ${minScore === s ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
                  >
                    {s}+ {s === 9 ? 'Superb' : s === 8 ? 'Foarte bine' : 'Bine'}
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Stele">
              <div className="flex gap-1.5">
                {[5, 4, 3, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => toggle(stars, s, setStars)}
                    className={`chip text-xs ${stars.includes(s) ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
                  >
                    {s} ★
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Tip de proprietate">
              <div className="flex flex-wrap gap-1.5">
                {propertyTypeKeys.map((t) => (
                  <button
                    key={t}
                    onClick={() => toggle(types, t, setTypes)}
                    className={`chip text-xs ${types.includes(t) ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
                  >
                    {propertyTypeLabels[t]}
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Regim de masă">
              <div className="flex flex-wrap gap-1.5">
                {boardKeys.map((b) => (
                  <button
                    key={b}
                    onClick={() => toggle(boards, b, setBoards)}
                    className={`chip text-xs ${boards.includes(b) ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
                  >
                    {boardLabels[b]}
                  </button>
                ))}
              </div>
            </Group>

            <Group label="Opțiuni">
              <div className="space-y-2 text-sm">
                <Toggle label="Anulare gratuită" checked={freeCancellation} onChange={setFreeCancellation} />
                <Toggle label="Mic dejun inclus" checked={breakfast} onChange={setBreakfast} />
                <Toggle label="Sustenabil 🌿" checked={sustainable} onChange={setSustainable} />
              </div>
            </Group>

            <Group label="Facilități">
              <div className="max-h-44 space-y-1.5 overflow-y-auto pr-1 text-sm">
                {allAmenities.map((a) => (
                  <Toggle
                    key={a}
                    label={a}
                    checked={amenities.includes(a)}
                    onChange={() => toggle(amenities, a, setAmenities)}
                  />
                ))}
              </div>
            </Group>
          </div>
        </aside>

        {/* Results */}
        <div>
          {results.length === 0 ? (
            <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
              <HotelIcon size={48} className="mb-4 text-navy-300" />
              <h3 className="text-xl font-semibold">Niciun hotel găsit</h3>
              <p className="mt-2 max-w-sm text-navy-500 dark:text-sand-200/70">
                Niciun rezultat pentru filtrele curente. Încearcă să relaxezi criteriile.
              </p>
              <button onClick={reset} className="btn-primary mt-5 px-5 py-2.5 text-sm">
                Resetează filtrele
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((h) => (
                <HotelCard key={h.id} hotel={h} nights={nights} onOpen={setSelected} />
              ))}
            </div>
          )}
        </div>
      </div>

      <HotelDetailModal hotel={selected} nights={nights} onClose={() => setSelected(null)} />
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium">{label}</p>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded accent-turquoise-500"
      />
      <span className="text-navy-600 dark:text-sand-200/80">{label}</span>
    </label>
  );
}
