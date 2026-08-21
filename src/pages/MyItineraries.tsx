import { Link } from 'react-router-dom';
import { Map, Trash2, Calendar, Users, Wallet, Compass } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { itineraryTotalCost } from '@/lib/itinerary';
import { formatMoney } from '@/lib/format';
import { localeOf } from '@/i18n/translations';

export function MyItineraries() {
  const { itineraries, deleteItinerary, currency, t, tf, language } = useApp();

  return (
    <div className="container-page py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('myItineraries.title')}</h1>
        <p className="mt-1 text-navy-500 dark:text-sand-200/70">
          {itineraries.length ? tf('myItineraries.subtitleFilled', { n: itineraries.length }) : t('myItineraries.subtitleEmpty')}
        </p>
      </div>

      {itineraries.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
          <Map size={48} className="mb-4 text-navy-300" />
          <h3 className="text-xl font-semibold">{t('myItineraries.empty.title')}</h3>
          <p className="mt-2 max-w-sm text-navy-500 dark:text-sand-200/70">
            {t('myItineraries.empty.text')}
          </p>
          <Link to="/orase" className="btn-primary mt-6 px-5 py-2.5 text-sm">
            <Compass size={16} /> {t('myItineraries.explore')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {itineraries.map((it) => (
            <div key={it.id} className="group card-surface overflow-hidden">
              <Link to={`/itinerar/${it.id}`} className="relative block aspect-[3/2] overflow-hidden">
                <img
                  src={it.image}
                  alt={it.destinationName}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="font-display text-xl font-semibold">{it.destinationName}</h3>
                  <p className="text-sm text-sand-100/90">{it.country}</p>
                </div>
              </Link>
              <div className="p-4">
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-navy-500 dark:text-sand-200/70">
                  <span className="flex items-center gap-1">
                    <Calendar size={13} /> {it.totalDays} {t('common.days')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users size={13} /> {it.people} {t('itineraryDetail.people')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Wallet size={13} /> {formatMoney(itineraryTotalCost(it), currency)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-navy-400">
                  {t('myItineraries.createdOn')} {new Date(it.createdAt).toLocaleDateString(localeOf(language))}
                </p>
                <div className="mt-3 flex gap-2">
                  <Link to={`/itinerar/${it.id}`} className="btn-primary flex-1 py-2 text-sm">
                    {t('myItineraries.open')}
                  </Link>
                  <button
                    onClick={() => deleteItinerary(it.id)}
                    className="btn-outline px-3 py-2 text-sm text-red-500"
                    aria-label={t('myItineraries.deleteAria')}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
