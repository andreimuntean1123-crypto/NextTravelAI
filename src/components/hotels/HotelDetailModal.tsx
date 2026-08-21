import { useState } from 'react';
import {
  Star,
  MapPin,
  Check,
  Heart,
  Leaf,
  Users,
  Maximize2,
  BedDouble,
  Coffee,
} from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { useApp } from '@/context/AppContext';
import { propertyTypeLabel, boardLabel } from '@/i18n/labels';
import { localizeHotel } from '@/i18n/hotelContent';
import { getDestinationById } from '@/data/destinations';
import { formatMoney } from '@/lib/format';
import type { BookingHotel, HotelRoom } from '@/types';

interface Props {
  hotel: BookingHotel | null;
  nights: number;
  onClose: () => void;
}

export function HotelDetailModal({ hotel: rawHotel, nights, onClose }: Props) {
  const { currency, isHotelSaved, toggleHotel, language, t, tf } = useApp();
  const [activeImg, setActiveImg] = useState(0);
  const [booked, setBooked] = useState<string | null>(null);

  if (!rawHotel) return null;
  const hotel = localizeHotel(rawHotel, language);
  const dest = getDestinationById(hotel.destinationId);
  const gallery = hotel.gallery.length ? hotel.gallery : [hotel.image];

  return (
    <Modal open={!!rawHotel} onClose={onClose} size="xl">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between gap-4 pr-8">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold">{hotel.name}</h2>
            <span className="flex text-gold-500">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star key={i} size={14} className="fill-gold-400 text-gold-400" />
              ))}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-navy-500 dark:text-sand-200/70">
            <MapPin size={14} /> {hotel.neighborhood}
            {dest ? `, ${dest.name}, ${dest.country}` : ''} • {hotel.distanceFromCenterKm} km {t('destDetail.fromCenter')}
          </p>
        </div>
        <button
          onClick={() => toggleHotel(rawHotel.id, hotel.name)}
          className="btn-outline shrink-0 px-3 py-2 text-sm"
        >
          <Heart size={15} className={isHotelSaved(rawHotel.id) ? 'fill-red-500 text-red-500' : ''} />
          {isHotelSaved(rawHotel.id) ? t('hotelModal.saved') : t('hotelModal.save')}
        </button>
      </div>

      {/* Gallery */}
      <div className="mb-5">
        <img src={gallery[activeImg]} alt={hotel.name} className="h-64 w-full rounded-2xl object-cover" />
        <div className="mt-2 flex gap-2">
          {gallery.map((g, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              className={`h-14 w-20 overflow-hidden rounded-lg border-2 transition ${
                activeImg === i ? 'border-turquoise-500' : 'border-transparent opacity-70'
              }`}
            >
              <img src={g} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      {/* Score + badges */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-2 rounded-xl bg-navy-50 px-3 py-2 dark:bg-navy-800">
          <span className="grid h-9 min-w-9 place-items-center rounded-lg bg-navy-800 px-2 text-sm font-bold text-white dark:bg-turquoise-500 dark:text-navy-950">
            {hotel.reviewScore.toFixed(1)}
          </span>
          <span className="text-sm">
            <strong>{hotel.reviewLabel}</strong> · {hotel.reviewCount.toLocaleString('ro-RO')} {t('hotelModal.reviews')}
          </span>
        </span>
        <span className="chip bg-navy-50 dark:bg-navy-800">{propertyTypeLabel(language, hotel.propertyType)}</span>
        {hotel.sustainable && (
          <span className="chip bg-turquoise-50 text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300">
            <Leaf size={13} /> {t('hotelModal.sustainable')}
          </span>
        )}
        <span className="flex items-center gap-1 text-xs text-navy-400">
          <Users size={13} /> {t('hotelModal.popularWith')}: {hotel.popularWith.join(', ')}
        </span>
      </div>

      <p className="mb-5 text-sm leading-relaxed text-navy-600 dark:text-sand-200/80">
        {hotel.description}
      </p>

      {/* Amenities */}
      <div className="mb-6">
        <h3 className="mb-2 font-semibold">{t('hotelModal.amenities')}</h3>
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((a) => (
            <span key={a} className="chip bg-navy-50 text-navy-600 dark:bg-navy-800 dark:text-sand-200">
              <Check size={12} className="text-turquoise-500" /> {a}
            </span>
          ))}
        </div>
      </div>

      {/* Rooms */}
      <div>
        <h3 className="mb-3 font-semibold">
          {t('hotelModal.roomsAvailable')} <span className="text-navy-400">({hotel.rooms.length})</span>
        </h3>
        <div className="space-y-3">
          {hotel.rooms.map((room, i) => (
            <RoomRow
              key={i}
              room={room}
              nights={nights}
              currency={currency}
              booked={booked === room.name}
              onBook={() => {
                setBooked(room.name);
                setTimeout(() => setBooked(null), 3000);
              }}
            />
          ))}
        </div>
      </div>

      <p className="mt-5 rounded-xl bg-navy-50 p-3 text-center text-xs text-navy-400 dark:bg-navy-800">
        {tf('hotelModal.footerNote', { board: boardLabel(language, hotel.board) })}
      </p>
    </Modal>
  );
}

function RoomRow({
  room,
  nights,
  currency,
  booked,
  onBook,
}: {
  room: HotelRoom;
  nights: number;
  currency: import('@/types').Currency;
  booked: boolean;
  onBook: () => void;
}) {
  const { t, tf } = useApp();
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-navy-100 p-4 dark:border-navy-800">
      <div className="min-w-0 flex-1">
        <p className="font-medium">{room.name}</p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500 dark:text-sand-200/70">
          <span className="flex items-center gap-1">
            <Users size={12} /> {room.capacity} {t('hotelModal.guests')}
          </span>
          <span className="flex items-center gap-1">
            <BedDouble size={12} /> {room.beds}
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 size={12} /> {room.sizeM2} m²
          </span>
        </div>
        <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {room.freeCancellation && (
            <span className="flex items-center gap-1 text-turquoise-600 dark:text-turquoise-300">
              <Check size={12} /> {t('hotelModal.freeCancellation')}
            </span>
          )}
          {room.breakfastIncluded && (
            <span className="flex items-center gap-1 text-navy-500 dark:text-sand-200/70">
              <Coffee size={12} /> {t('hotelModal.breakfastIncluded')}
            </span>
          )}
          {room.roomsLeft !== undefined && (
            <span className="text-red-500">{tf('hotelModal.roomsLeft', { n: room.roomsLeft })}</span>
          )}
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold">{formatMoney(room.pricePerNight * nights, currency)}</p>
        <p className="text-xs text-navy-400">
          {formatMoney(room.pricePerNight, currency)} × {nights} {nights === 1 ? t('hotels.night') : t('hotels.nights')}
        </p>
        <button
          onClick={onBook}
          className={`mt-2 px-4 py-2 text-sm ${booked ? 'btn-navy' : 'btn-primary'}`}
        >
          {booked ? (<><Check size={15} /> {t('hotelModal.booked')}</>) : t('hotelModal.book')}
        </button>
      </div>
    </div>
  );
}
