import { Link } from 'react-router-dom';
import { Scale, X, Compass, Check, Minus } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { destinations } from '@/data/destinations';
import { formatMoney, formatTemp } from '@/lib/format';
import { tripTypeLabel, climateLabel } from '@/i18n/labels';
import { localizeDestination } from '@/i18n/destinationContent';

export function Compare() {
  const { compareList, toggleCompare, clearCompare, currency, t, tf, language } = useApp();
  const rawItems = destinations.filter((d) => compareList.includes(d.id));
  const items = rawItems.map((d) => localizeDestination(d, language));

  if (items.length === 0) {
    return (
      <div className="container-page py-20">
        <div className="card-surface mx-auto max-w-lg p-10 text-center">
          <Scale size={48} className="mx-auto mb-4 text-navy-300" />
          <h1 className="text-2xl font-bold">{t('compare.empty.title')}</h1>
          <p className="mt-2 text-navy-500 dark:text-sand-200/70">
            {t('compare.empty.text')}
          </p>
          <Link to="/orase" className="btn-primary mx-auto mt-6 inline-flex px-5 py-2.5 text-sm">
            <Compass size={16} /> {t('compare.empty.cta')}
          </Link>
        </div>
      </div>
    );
  }

  const rows: { label: string; render: (d: (typeof items)[0]) => React.ReactNode }[] = [
    { label: t('compare.rowCountry'), render: (d) => d.country },
    { label: t('compare.rowRegion'), render: (d) => d.region },
    { label: t('compare.rowRating'), render: (d) => `★ ${d.rating.toFixed(1)}` },
    { label: t('compare.rowPopularity'), render: (d) => `${d.popularity}%` },
    { label: t('compare.rowPricePerDay'), render: (d) => formatMoney(d.pricePerDay, currency) },
    { label: t('compare.rowIdealDuration'), render: (d) => `${d.recommendedDays} ${t('common.days')}` },
    { label: t('compare.rowTemperature'), render: (d) => formatTemp(d.avgTempC) },
    { label: t('compare.rowClimate'), render: (d) => climateLabel(language, d.climate) },
    { label: t('compare.rowTypes'), render: (d) => d.tags.map((ty) => tripTypeLabel(language, ty)).join(', ') },
    { label: t('compare.rowCurrency'), render: (d) => d.currency },
    {
      label: t('compare.rowHotelFrom'),
      render: (d) => formatMoney(Math.min(...d.hotels.map((h) => h.pricePerNight)), currency),
    },
  ];

  const bestPrice = Math.min(...items.map((d) => d.pricePerDay));
  const bestRating = Math.max(...items.map((d) => d.rating));

  return (
    <div className="container-page py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">{t('compare.title')}</h1>
          <p className="mt-1 text-navy-500 dark:text-sand-200/70">
            {tf('compare.subtitle', { n: items.length })}
          </p>
        </div>
        <button onClick={clearCompare} className="btn-outline px-4 py-2.5 text-sm">
          <X size={16} /> {t('compare.clear')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-separate border-spacing-0">
          <thead>
            <tr>
              <th className="sticky left-0 w-32 bg-sand-50 dark:bg-navy-950" />
              {items.map((d, i) => (
                <th key={d.id} className="p-2 align-top">
                  <div className="card-surface overflow-hidden">
                    <div className="relative aspect-[3/2]">
                      <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                      <button
                        onClick={() => toggleCompare(rawItems[i].id)}
                        className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90"
                        aria-label={t('compare.remove')}
                      >
                        <X size={15} className="text-navy-700" />
                      </button>
                    </div>
                    <div className="p-3 text-center">
                      <Link to={`/destinatie/${d.id}`} className="font-display font-semibold hover:text-turquoise-600">
                        {d.name}
                      </Link>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={row.label} className={ri % 2 ? 'bg-white/50 dark:bg-navy-900/40' : ''}>
                <td className="sticky left-0 bg-sand-50 p-3 text-sm font-medium text-navy-500 dark:bg-navy-950 dark:text-sand-200/70">
                  {row.label}
                </td>
                {items.map((d) => {
                  const highlight =
                    (row.label === t('compare.rowPricePerDay') && d.pricePerDay === bestPrice) ||
                    (row.label === t('compare.rowRating') && d.rating === bestRating);
                  return (
                    <td key={d.id} className="p-3 text-center text-sm">
                      <span
                        className={
                          highlight
                            ? 'inline-flex items-center gap-1 rounded-full bg-turquoise-50 px-2.5 py-1 font-semibold text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300'
                            : ''
                        }
                      >
                        {highlight && <Check size={13} />}
                        {row.render(d)}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr>
              <td className="sticky left-0 bg-sand-50 dark:bg-navy-950" />
              {items.map((d) => (
                <td key={d.id} className="p-3 text-center">
                  <Link to={`/destinatie/${d.id}`} className="btn-primary w-full py-2 text-sm">
                    {t('compare.details')}
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {items.length < 3 && (
        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-navy-400">
          <Minus size={14} /> {t('compare.maxNote')}
        </p>
      )}
    </div>
  );
}
