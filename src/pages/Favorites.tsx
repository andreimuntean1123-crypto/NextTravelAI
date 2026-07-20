import { Link } from 'react-router-dom';
import { Heart, Compass, Scale, MapPin, BedDouble, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { destinations } from '@/data/destinations';
import { cities } from '@/data/cities';
import { hotels } from '@/data/hotels';
import { cheapestRoomPrice } from '@/lib/hotelsService';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { formatMoney } from '@/lib/format';

export function Favorites() {
  const { favorites, savedHotels, compareList, currency, toggleFavorite, toggleHotel } = useApp();

  const favDestinations = destinations.filter((d) => favorites.includes(d.id));
  const favCities = cities.filter((c) => favorites.includes(c.id));
  const favHotels = hotels.filter((h) => savedHotels.includes(h.id));

  const total = favDestinations.length + favCities.length + favHotels.length;

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Favorite</h1>
          <p className="mt-1 text-navy-500 dark:text-sand-200/70">
            {total
              ? `${total} elemente salvate (destinații, orașe, hoteluri).`
              : 'Salvează destinațiile, orașele și hotelurile care îți plac.'}
          </p>
        </div>
        {compareList.length > 0 && (
          <Link to="/compara" className="btn-outline px-4 py-2.5 text-sm">
            <Scale size={16} /> Compară ({compareList.length})
          </Link>
        )}
      </div>

      {total === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
          <Heart size={48} className="mb-4 text-navy-300" />
          <h3 className="text-xl font-semibold">Nimic la favorite încă</h3>
          <p className="mt-2 max-w-sm text-navy-500 dark:text-sand-200/70">
            Apasă pe inima de pe orice destinație, oraș sau hotel ca să îl adaugi aici.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/orase" className="btn-primary px-5 py-2.5 text-sm">
              <Compass size={16} /> Explorează orașe
            </Link>
            <Link to="/hoteluri" className="btn-outline px-5 py-2.5 text-sm">
              <BedDouble size={16} /> Vezi hoteluri
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Destinații */}
          {favDestinations.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Destinații ({favDestinations.length})</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favDestinations.map((d) => (
                  <DestinationCard key={d.id} destination={d} />
                ))}
              </div>
            </section>
          )}

          {/* Orașe */}
          {favCities.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Orașe ({favCities.length})</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favCities.map((c) => (
                  <div key={c.id} className="group card-surface overflow-hidden">
                    <Link to={`/oras/${c.id}`} className="relative block aspect-[16/10] overflow-hidden">
                      <img src={c.image} alt={c.name} className="h-full w-full object-cover transition group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                      <div className="absolute bottom-2 left-3 text-white">
                        <h3 className="font-display text-lg font-semibold">{c.name}</h3>
                        <p className="flex items-center gap-1 text-xs text-sand-100/90">
                          <MapPin size={11} /> {c.country}
                        </p>
                      </div>
                    </Link>
                    <div className="flex items-center justify-between p-3">
                      <Link to={`/oras/${c.id}`} className="text-sm font-medium text-turquoise-600 dark:text-turquoise-300">
                        Vezi hoteluri
                      </Link>
                      <button
                        onClick={() => toggleFavorite(c.id, `${c.name}, ${c.country}`)}
                        className="grid h-8 w-8 place-items-center rounded-full hover:bg-navy-100 dark:hover:bg-navy-800"
                        aria-label="Elimină de la favorite"
                      >
                        <Heart size={16} className="fill-red-500 text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Hoteluri */}
          {favHotels.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-semibold">Hoteluri salvate ({favHotels.length})</h2>
              <div className="space-y-3">
                {favHotels.map((h) => (
                  <div key={h.id} className="card-surface flex items-center gap-4 p-4">
                    <img src={h.image} alt={h.name} className="h-16 w-20 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">
                        {h.name} <span className="text-gold-500">{'★'.repeat(h.stars)}</span>
                      </p>
                      <p className="flex items-center gap-1 text-sm text-navy-500 dark:text-sand-200/70">
                        <Star size={12} className="fill-gold-400 text-gold-400" /> {h.reviewScore.toFixed(1)} {h.reviewLabel} • {h.neighborhood}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-turquoise-600 dark:text-turquoise-300">
                        {formatMoney(cheapestRoomPrice(h), currency)}
                      </p>
                      <p className="text-xs text-navy-400">/ noapte</p>
                    </div>
                    <button
                      onClick={() => toggleHotel(h.id, h.name)}
                      className="grid h-9 w-9 place-items-center rounded-full hover:bg-navy-100 dark:hover:bg-navy-800"
                      aria-label="Elimină hotelul"
                    >
                      <Heart size={17} className="fill-red-500 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
