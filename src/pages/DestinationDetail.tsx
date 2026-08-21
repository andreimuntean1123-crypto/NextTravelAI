import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Heart,
  Scale,
  Map,
  MapPin,
  Thermometer,
  Star,
  Clock,
  Globe,
  Languages,
  Utensils,
  BedDouble,
  Ticket,
  ArrowLeft,
} from 'lucide-react';
import { getDestinationById } from '@/data/destinations';
import { getHotelsByDestination } from '@/data/hotels';
import { cheapestRoomPrice } from '@/lib/hotelsService';
import { HotelDetailModal } from '@/components/hotels/HotelDetailModal';
import { useApp } from '@/context/AppContext';
import { useCreateItinerary } from '@/hooks/useCreateItinerary';
import { WeatherWidget } from '@/components/tools/WeatherWidget';
import { StarRating } from '@/components/ui/StarRating';
import { formatMoney, formatTemp, formatDuration } from '@/lib/format';
import { tripTypeLabel } from '@/i18n/labels';
import { localizeDestination } from '@/i18n/destinationContent';
import { localizeHotel } from '@/i18n/hotelContent';
import type { BookingHotel } from '@/types';

export function DestinationDetail() {
  const { id } = useParams();
  const rawDest = getDestinationById(id ?? '');
  const { currency, isFavorite, toggleFavorite, compareList, toggleCompare, language, t, tf } = useApp();
  const createItinerary = useCreateItinerary();
  const [activeImg, setActiveImg] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState<BookingHotel | null>(null);
  const destHotels = getHotelsByDestination(id ?? '');

  if (!rawDest) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">{t('destDetail.notFound.title')}</h1>
        <Link to="/orase" className="btn-primary mx-auto mt-6 inline-flex px-5 py-2.5 text-sm">
          {t('destDetail.discover')}
        </Link>
      </div>
    );
  }

  const dest = localizeDestination(rawDest, language);
  const inCompare = compareList.includes(rawDest.id);
  const gallery = [dest.image, ...dest.gallery];

  return (
    <div>
      {/* Gallery hero */}
      <div className="relative">
        <img src={gallery[activeImg]} alt={dest.name} className="h-[45vh] w-full object-cover sm:h-[55vh]" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/20 to-navy-950/30" />
        <div className="container-page absolute inset-x-0 top-4">
          <Link to="/orase" className="btn border border-white/30 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur hover:bg-white/20">
            <ArrowLeft size={16} /> {t('destDetail.back')}
          </Link>
        </div>
        <div className="container-page absolute inset-x-0 bottom-0 pb-6 text-white">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {dest.tags.map((tag) => (
                  <span key={tag} className="chip bg-white/15 text-white backdrop-blur">
                    {tripTypeLabel(language, tag)}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-4xl font-bold drop-shadow sm:text-5xl">{dest.name}</h1>
              <p className="mt-1 flex items-center gap-1 text-sand-100/90">
                <MapPin size={16} /> {dest.country} • {dest.region}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold backdrop-blur">
                <Star size={15} className="fill-gold-400 text-gold-400" /> {dest.rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnails */}
      <div className="container-page -mt-2 flex gap-2 overflow-x-auto py-4 no-scrollbar">
        {gallery.map((g, i) => (
          <button
            key={i}
            onClick={() => setActiveImg(i)}
            className={`h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
              activeImg === i ? 'border-turquoise-500' : 'border-transparent opacity-70'
            }`}
          >
            <img src={g} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>

      <div className="container-page grid gap-8 py-6 lg:grid-cols-[1fr_360px]">
        {/* Main */}
        <div className="space-y-8">
          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <FactCard icon={<Thermometer size={18} />} label={t('destDetail.temperature')} value={formatTemp(dest.avgTempC)} />
            <FactCard icon={<Clock size={18} />} label={t('destDetail.idealDuration')} value={`${dest.recommendedDays} ${t('common.days')}`} />
            <FactCard icon={<Globe size={18} />} label={t('destDetail.pricePerDay')} value={formatMoney(dest.pricePerDay, currency)} />
            <FactCard icon={<Star size={18} />} label={t('destDetail.popularity')} value={`${dest.popularity}%`} />
          </div>

          <section>
            <h2 className="mb-3 text-2xl font-bold">{t('destDetail.about')} {dest.name}</h2>
            <p className="leading-relaxed text-navy-600 dark:text-sand-200/80">{dest.description}</p>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-navy-500 dark:text-sand-200/70">
              <span className="flex items-center gap-1.5">
                <Languages size={15} /> {dest.languages.join(', ')}
              </span>
              <span className="flex items-center gap-1.5">
                <Globe size={15} /> {dest.currency} • {dest.timezone}
              </span>
            </div>
          </section>

          {/* Highlights */}
          <section>
            <h3 className="mb-3 text-lg font-semibold">{t('destDetail.highlights')}</h3>
            <div className="flex flex-wrap gap-2">
              {dest.highlights.map((h) => (
                <span key={h} className="chip bg-turquoise-50 text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300">
                  ✦ {h}
                </span>
              ))}
            </div>
          </section>

          {/* Attractions */}
          <Section icon={<Ticket size={18} />} title={t('destDetail.attractions')}>
            <div className="grid gap-3 sm:grid-cols-2">
              {dest.attractions.map((a) => (
                <div key={a.name} className="rounded-2xl border border-navy-100 p-4 dark:border-navy-800">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium">{a.name}</p>
                    <span className="chip shrink-0 bg-navy-50 text-xs dark:bg-navy-800">{a.category}</span>
                  </div>
                  <p className="mt-1 text-sm text-navy-500 dark:text-sand-200/70">{a.description}</p>
                  <p className="mt-2 text-xs text-navy-400">
                    {formatDuration(a.durationHours)} • {a.cost ? formatMoney(a.cost, currency) : t('common.free')}
                  </p>
                </div>
              ))}
            </div>
          </Section>

          {/* Hotels */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-turquoise-500"><BedDouble size={18} /></span>
                {t('destDetail.hotelsIn')} {dest.name} <span className="text-navy-400">({destHotels.length})</span>
              </h3>
              <Link to={`/hoteluri?dest=${rawDest.id}`} className="text-sm font-semibold text-turquoise-600 dark:text-turquoise-300">
                {t('destDetail.seeAll')} →
              </Link>
            </div>
            <div className="space-y-3">
              {destHotels.slice(0, 4).map((raw) => {
                const h = localizeHotel(raw, language);
                return (
                <button
                  key={h.id}
                  onClick={() => setSelectedHotel(raw)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-navy-100 p-3 text-left transition hover:border-turquoise-400 dark:border-navy-800"
                >
                  <img src={h.image} alt={h.name} className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {h.name} <span className="text-gold-500">{'★'.repeat(h.stars)}</span>
                    </p>
                    <p className="text-xs text-navy-500 dark:text-sand-200/70">
                      {h.neighborhood} • {h.distanceFromCenterKm} km {t('destDetail.fromCenter')} • {h.rooms.length} {t('destDetail.roomTypes')}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="grid h-6 min-w-6 place-items-center rounded bg-navy-800 px-1.5 text-xs font-bold text-white dark:bg-turquoise-500 dark:text-navy-950">
                        {h.reviewScore.toFixed(1)}
                      </span>
                      <span className="text-xs font-medium">{h.reviewLabel}</span>
                      <span className="text-xs text-navy-400">({h.reviewCount.toLocaleString('ro-RO')})</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-xs text-navy-400">{t('common.from')}</p>
                    <p className="text-lg font-bold text-turquoise-600 dark:text-turquoise-300">
                      {formatMoney(cheapestRoomPrice(h), currency)}
                    </p>
                    <p className="text-xs text-navy-400">{t('common.perNight')}</p>
                  </div>
                </button>
                );
              })}
            </div>
          </section>

          {/* Restaurants */}
          <Section icon={<Utensils size={18} />} title={t('destDetail.restaurants')}>
            <div className="grid gap-3 sm:grid-cols-3">
              {dest.restaurants.map((r) => (
                <div key={r.name} className="rounded-2xl border border-navy-100 p-4 dark:border-navy-800">
                  <p className="font-medium">{r.name}</p>
                  <p className="text-sm text-navy-500 dark:text-sand-200/70">{r.cuisine}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-navy-400">
                    <span>{'€'.repeat(r.priceLevel)}</span>
                    <span className="flex items-center gap-1">
                      <Star size={12} className="fill-gold-400 text-gold-400" /> {r.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">
          <div className="card-surface p-5">
            <p className="text-sm text-navy-400">{t('destDetail.estimatedCost')}</p>
            <p className="text-2xl font-bold text-turquoise-600 dark:text-turquoise-300">
              {formatMoney(dest.pricePerDay * dest.recommendedDays * 2, currency)}
            </p>
            <p className="mb-4 text-xs text-navy-400">
              {tf('destDetail.estimatedFor', { days: dest.recommendedDays })}
            </p>
            <button onClick={() => createItinerary(rawDest)} className="btn-primary w-full py-3 text-sm">
              <Map size={16} /> {t('destDetail.createItinerary')}
            </button>
            <div className="mt-2 flex gap-2">
              <button onClick={() => toggleFavorite(rawDest.id, `${dest.name}, ${dest.country}`)} className="btn-outline flex-1 py-2.5 text-sm">
                <Heart size={15} className={isFavorite(rawDest.id) ? 'fill-red-500 text-red-500' : ''} />
                {isFavorite(rawDest.id) ? t('destDetail.saved') : t('destDetail.favorites')}
              </button>
              <Link
                to="/compara"
                onClick={() => !inCompare && toggleCompare(rawDest.id)}
                className={`btn flex-1 justify-center py-2.5 text-sm ${inCompare ? 'bg-gold-500 text-navy-950' : 'btn-outline'}`}
              >
                <Scale size={15} /> {t('destDetail.compare')}
              </Link>
            </div>
            <Link to={`/hoteluri?dest=${rawDest.id}`} className="btn-outline mt-2 w-full justify-center py-2.5 text-sm">
              <BedDouble size={15} /> {tf('destDetail.viewAllHotels', { n: destHotels.length })}
            </Link>
          </div>

          <WeatherWidget destination={rawDest} />

          <div className="card-surface p-5">
            <h3 className="mb-2 font-semibold">{t('destDetail.goodToKnow')}</h3>
            <ul className="space-y-2">
              {dest.goodToKnow.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-navy-600 dark:text-sand-200/80">
                  <span className="text-turquoise-500">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="card-surface p-5">
            <div className="mb-1 flex items-center justify-between">
              <h3 className="font-semibold">{t('destDetail.visitorRating')}</h3>
              <StarRating value={dest.rating / 2} />
            </div>
            <p className="text-sm text-navy-500 dark:text-sand-200/70">
              {tf('destDetail.basedOnReviews', { rating: dest.rating })}
            </p>
          </div>
        </aside>
      </div>

      <HotelDetailModal hotel={selectedHotel} nights={dest.recommendedDays} onClose={() => setSelectedHotel(null)} />
    </div>
  );
}

function FactCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card-surface flex flex-col items-center gap-1 p-4 text-center">
      <span className="text-turquoise-500">{icon}</span>
      <span className="text-xs text-navy-400">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
        <span className="text-turquoise-500">{icon}</span> {title}
      </h3>
      {children}
    </section>
  );
}
