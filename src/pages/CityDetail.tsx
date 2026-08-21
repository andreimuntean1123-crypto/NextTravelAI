import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, BedDouble, Star, SlidersHorizontal, X, Heart, Map as MapIcon } from 'lucide-react';
import { getCityById } from '@/data/cities';
import { getCityHotels } from '@/lib/cityHotels';
import { generateCityItinerary } from '@/lib/itinerary';
import { useApp } from '@/context/AppContext';
import { cheapestRoomPrice, type HotelSort } from '@/lib/hotelsService';
import { HotelCard } from '@/components/hotels/HotelCard';
import { HotelDetailModal } from '@/components/hotels/HotelDetailModal';
import { propertyTypeLabel, continentLabel } from '@/i18n/labels';
import { countryLabel } from '@/i18n/countries';
import type { BookingHotel, PropertyType } from '@/types';

export function CityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saveItinerary, isFavorite, toggleFavorite, t, tf, language } = useApp();
  const city = getCityById(id ?? '');
  const [selected, setSelected] = useState<BookingHotel | null>(null);
  const [nights, setNights] = useState(3);
  const [sort, setSort] = useState<HotelSort>('recommended');
  const [maxPrice, setMaxPrice] = useState(500);
  const [stars, setStars] = useState<number[]>([]);
  const [types, setTypes] = useState<PropertyType[]>([]);
  const [minScore, setMinScore] = useState(0);
  const [freeCancel, setFreeCancel] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const allHotels = useMemo(() => (city ? getCityHotels(city) : []), [city]);

  const results = useMemo(() => {
    let list = allHotels.filter((h) => {
      if (cheapestRoomPrice(h) > maxPrice) return false;
      if (stars.length && !stars.includes(h.stars)) return false;
      if (types.length && !types.includes(h.propertyType)) return false;
      if (h.reviewScore < minScore) return false;
      if (freeCancel && !h.freeCancellation) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc': return cheapestRoomPrice(a) - cheapestRoomPrice(b);
        case 'price-desc': return cheapestRoomPrice(b) - cheapestRoomPrice(a);
        case 'rating': return b.reviewScore - a.reviewScore;
        case 'stars': return b.stars - a.stars;
        case 'distance': return a.distanceFromCenterKm - b.distanceFromCenterKm;
        default: return b.reviewScore * 10 + b.stars * 5 - cheapestRoomPrice(b) / 40 - (a.reviewScore * 10 + a.stars * 5 - cheapestRoomPrice(a) / 40);
      }
    });
    return list;
  }, [allHotels, maxPrice, stars, types, minScore, freeCancel, sort]);

  if (!city) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">{t('cityDetail.notFound.title')}</h1>
        <Link to="/orase" className="btn-primary mx-auto mt-6 inline-flex px-5 py-2.5 text-sm">
          {t('cityDetail.seeAllCities')}
        </Link>
      </div>
    );
  }

  const availableTypes = Array.from(new Set(allHotels.map((h) => h.propertyType)));
  const toggle = <T,>(arr: T[], v: T, set: (x: T[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div>
      {/* Hero */}
      <div className="relative">
        <img src={city.image} alt={city.name} className="h-56 w-full object-cover sm:h-72" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 to-navy-950/20" />
        <div className="container-page absolute inset-x-0 top-4">
          <Link to="/orase" className="btn border border-white/30 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur hover:bg-white/20">
            <ArrowLeft size={16} /> {t('cityDetail.allCities')}
          </Link>
        </div>
        <div className="container-page absolute inset-x-0 bottom-0 pb-6 text-white">
          <h1 className="font-display text-4xl font-bold drop-shadow sm:text-5xl">{city.name}</h1>
          <p className="mt-1 flex items-center gap-2 text-sand-100/90">
            <MapPin size={16} /> {countryLabel(language, city.country)} • {continentLabel(language, city.continent)}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-sand-100/90">
            <BedDouble size={15} /> {allHotels.length} {t('cityDetail.hotelsAvailable')} {city.name}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => {
                const it = generateCityItinerary(
                  { id: city.id, name: city.name, country: city.country, image: city.image },
                  nights,
                  2,
                  'echilibrat',
                  language,
                );
                saveItinerary(it);
                navigate(`/itinerar/${it.id}`);
              }}
              className="btn-primary px-5 py-2.5 text-sm"
            >
              <MapIcon size={16} /> {t('cityDetail.createItinerary')} ({nights} {nights === 1 ? t('common.day') : t('common.days')})
            </button>
            <button
              onClick={() => toggleFavorite(city.id, `${city.name}, ${city.country}`)}
              className="btn border border-white/30 bg-white/10 px-4 py-2.5 text-sm text-white backdrop-blur hover:bg-white/20"
            >
              <Heart size={15} className={isFavorite(city.id) ? 'fill-red-500 text-red-500' : ''} />
              {isFavorite(city.id) ? t('cityDetail.saved') : t('cityDetail.favorites')}
            </button>
          </div>
        </div>
      </div>

      <div className="container-page py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-bold">
            {t('cityDetail.hotelsIn')} {city.name} <span className="text-navy-400">({results.length})</span>
          </h2>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm">
              <BedDouble size={16} className="text-navy-400" />
              <select value={nights} onChange={(e) => setNights(Number(e.target.value))} className="input-field w-auto py-2">
                {[1, 2, 3, 4, 5, 7, 10, 14].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? t('hotels.night') : t('hotels.nights')}</option>
                ))}
              </select>
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value as HotelSort)} className="input-field w-auto py-2">
              <option value="recommended">{t('hotels.sortRecommended')}</option>
              <option value="price-asc">{t('hotels.sortPriceAsc')}</option>
              <option value="price-desc">{t('hotels.sortPriceDesc')}</option>
              <option value="rating">{t('hotels.sortRating')}</option>
              <option value="stars">{t('hotels.sortStars')}</option>
              <option value="distance">{t('hotels.sortDistance')}</option>
            </select>
            <button onClick={() => setShowFilters((s) => !s)} className="btn-outline px-4 py-2 text-sm lg:hidden">
              <SlidersHorizontal size={16} /> {t('hotels.filters')}
            </button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="card-surface sticky top-20 space-y-5 p-5">
              <h3 className="font-semibold">{t('hotels.filterSection')}</h3>
              <div>
                <p className="mb-2 text-sm font-medium">{tf('cityDetail.maxPricePerNight', { price: maxPrice })}</p>
                <input type="range" min={20} max={500} step={10} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="w-full accent-turquoise-500" />
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">{t('hotels.reviewScore')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {[9, 8, 7].map((s) => (
                    <button key={s} onClick={() => setMinScore(minScore === s ? 0 : s)} className={`chip text-xs ${minScore === s ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}>
                      {s}+
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">{t('cityDetail.stars')}</p>
                <div className="flex gap-1.5">
                  {[5, 4, 3, 2].map((s) => (
                    <button key={s} onClick={() => toggle(stars, s, setStars)} className={`chip text-xs ${stars.includes(s) ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}>
                      {s} <Star size={10} className="fill-current" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-sm font-medium">{t('cityDetail.propertyType')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {availableTypes.map((ty) => (
                    <button key={ty} onClick={() => toggle(types, ty, setTypes)} className={`chip text-xs ${types.includes(ty) ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}>
                      {propertyTypeLabel(language, ty)}
                    </button>
                  ))}
                </div>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="checkbox" checked={freeCancel} onChange={(e) => setFreeCancel(e.target.checked)} className="h-4 w-4 rounded accent-turquoise-500" />
                {t('cityDetail.freeCancellation')}
              </label>
            </div>
          </aside>

          {/* Results */}
          <div>
            {results.length === 0 ? (
              <div className="card-surface flex flex-col items-center justify-center py-16 text-center">
                <BedDouble size={44} className="mb-3 text-navy-300" />
                <h3 className="text-lg font-semibold">{t('cityDetail.noneForFilters.title')}</h3>
                <button
                  onClick={() => { setMaxPrice(500); setStars([]); setTypes([]); setMinScore(0); setFreeCancel(false); }}
                  className="btn-primary mt-4 px-5 py-2.5 text-sm"
                >
                  <X size={15} /> {t('common.resetFilters')}
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
      </div>

      <HotelDetailModal hotel={selected} nights={nights} onClose={() => setSelected(null)} />
    </div>
  );
}
