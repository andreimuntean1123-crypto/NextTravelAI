import { Heart, MapPin, Check, Star, Leaf, Coffee, BedDouble, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cheapestRoomPrice } from '@/lib/hotelsService';
import { propertyTypeLabel } from '@/i18n/labels';
import { localizeHotel } from '@/i18n/hotelContent';
import { getDestinationById } from '@/data/destinations';
import { formatMoney } from '@/lib/format';
import type { BookingHotel } from '@/types';

interface Props {
  hotel: BookingHotel;
  nights?: number;
  onOpen: (hotel: BookingHotel) => void;
}

export function HotelCard({ hotel: raw, nights = 1, onOpen }: Props) {
  const { currency, isHotelSaved, toggleHotel, t, tf, language } = useApp();
  const h = localizeHotel(raw, language);
  const dest = getDestinationById(h.destinationId);
  const from = cheapestRoomPrice(h);
  const total = from * nights;

  return (
    <article className="group card-surface overflow-hidden transition hover:shadow-soft-lg sm:flex">
      {/* Image */}
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-64">
        <img
          src={h.image}
          alt={h.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          onClick={() => toggleHotel(raw.id, h.name)}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition hover:scale-110"
          aria-label={t('hotelCard.saveAria')}
        >
          <Heart size={16} className={isHotelSaved(raw.id) ? 'fill-red-500 text-red-500' : 'text-navy-600'} />
        </button>
        {h.oldPricePerNight && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            {t('hotelCard.deal')}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4 sm:flex-row sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold text-turquoise-700 dark:text-turquoise-300">
              {h.name}
            </h3>
            <span className="flex text-gold-500">
              {Array.from({ length: h.stars }).map((_, i) => (
                <Star key={i} size={12} className="fill-gold-400 text-gold-400" />
              ))}
            </span>
          </div>

          <p className="mt-0.5 flex items-center gap-1 text-sm text-navy-500 dark:text-sand-200/70">
            <MapPin size={13} /> {h.neighborhood}
            {dest ? `, ${dest.name}` : ''} • {h.distanceFromCenterKm} km {t('destDetail.fromCenter')}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
            <span className="chip bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-sand-200">
              {propertyTypeLabel(language, h.propertyType)}
            </span>
            {h.sustainable && (
              <span className="chip bg-turquoise-50 text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300">
                <Leaf size={12} /> {t('hotelModal.sustainable')}
              </span>
            )}
            {h.distanceFromBeachKm !== undefined && (
              <span className="text-navy-400">🏖️ {h.distanceFromBeachKm} km</span>
            )}
          </div>

          {/* Features */}
          <ul className="mt-3 space-y-1 text-xs text-navy-600 dark:text-sand-200/80">
            {h.freeCancellation && (
              <li className="flex items-center gap-1.5 text-turquoise-600 dark:text-turquoise-300">
                <Check size={13} /> {t('hotelModal.freeCancellation')}
              </li>
            )}
            {h.breakfastIncluded && (
              <li className="flex items-center gap-1.5">
                <Coffee size={13} /> {t('hotelModal.breakfastIncluded')}
              </li>
            )}
            <li className="flex items-center gap-1.5">
              <BedDouble size={13} /> {h.rooms.length} {t('hotelCard.roomTypesAvailable')}
            </li>
          </ul>
        </div>

        {/* Score + price */}
        <div className="mt-3 flex items-end justify-between gap-3 sm:mt-0 sm:w-44 sm:flex-col sm:items-end">
          <div className="flex items-center gap-2 sm:flex-row-reverse">
            <span className="grid h-9 min-w-9 place-items-center rounded-lg rounded-bl-none bg-navy-800 px-2 text-sm font-bold text-white dark:bg-turquoise-500 dark:text-navy-950">
              {h.reviewScore.toFixed(1)}
            </span>
            <div className="text-right sm:text-left">
              <p className="text-sm font-semibold">{h.reviewLabel}</p>
              <p className="text-xs text-navy-400">{h.reviewCount.toLocaleString('ro-RO')} {t('hotelCard.reviews')}</p>
            </div>
          </div>

          <div className="text-right">
            {h.roomsLeft !== undefined && (
              <p className="text-xs font-medium text-red-500">{tf('hotelCard.roomsLeft', { n: h.roomsLeft })}</p>
            )}
            <p className="text-xs text-navy-400">
              {nights} {nights === 1 ? t('hotels.night') : t('hotels.nights')}, {t('hotelCard.adults')}
            </p>
            {h.oldPricePerNight && (
              <span className="text-sm text-navy-400 line-through">
                {formatMoney(h.oldPricePerNight * nights, currency)}
              </span>
            )}
            <p className="text-xl font-bold">{formatMoney(total, currency)}</p>
            <p className="mb-2 text-xs text-navy-400">{t('common.from')} {formatMoney(from, currency)} {t('common.perNight')}</p>
            <button onClick={() => onOpen(raw)} className="btn-primary w-full px-4 py-2 text-sm">
              {t('hotelCard.seeRooms')}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function HotelPopularWith({ hotel }: { hotel: BookingHotel }) {
  const { t } = useApp();
  return (
    <span className="flex items-center gap-1 text-xs text-navy-400">
      <Users size={12} /> {t('hotelCard.popularWith')}: {hotel.popularWith.join(', ')}
    </span>
  );
}
