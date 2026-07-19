import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Trash2,
  Plus,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Share2,
  FileDown,
  Zap,
  Coffee,
  Wallet,
  MapPin,
  Clock,
  Route,
  Check,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getDestinationById } from '@/data/destinations';
import { regenerateDay, itineraryTotalCost, slotLabels } from '@/lib/itinerary';
import { generateItinerary } from '@/lib/itinerary';
import { formatMoney, formatDuration } from '@/lib/format';
import type { ItineraryActivity, Pace } from '@/types';

let addCounter = 0;

export function ItineraryDetail() {
  const { id } = useParams();
  const { itineraries, updateItinerary, currency } = useApp();
  const [shareMsg, setShareMsg] = useState(false);

  const itinerary = itineraries.find((it) => it.id === id);

  const totalCost = useMemo(
    () => (itinerary ? itineraryTotalCost(itinerary) : 0),
    [itinerary],
  );

  if (!itinerary) {
    return (
      <div className="container-page py-20 text-center">
        <h1 className="text-2xl font-bold">Itinerarul nu a fost găsit</h1>
        <p className="mt-2 text-navy-500 dark:text-sand-200/70">
          Poate a fost șters sau linkul este greșit.
        </p>
        <Link to="/itinerariile-mele" className="btn-primary mx-auto mt-6 inline-flex px-5 py-2.5 text-sm">
          Vezi itinerariile mele
        </Link>
      </div>
    );
  }

  const dest = getDestinationById(itinerary.destinationId);

  const removeActivity = (day: number, actId: string) => {
    updateItinerary({
      ...itinerary,
      days: itinerary.days.map((d) =>
        d.day === day ? { ...d, activities: d.activities.filter((a) => a.id !== actId) } : d,
      ),
    });
  };

  const moveActivity = (day: number, index: number, dir: -1 | 1) => {
    updateItinerary({
      ...itinerary,
      days: itinerary.days.map((d) => {
        if (d.day !== day) return d;
        const acts = [...d.activities];
        const target = index + dir;
        if (target < 0 || target >= acts.length) return d;
        [acts[index], acts[target]] = [acts[target], acts[index]];
        return { ...d, activities: acts };
      }),
    });
  };

  const addActivity = (day: number) => {
    const title = window.prompt('Ce activitate vrei să adaugi?');
    if (!title) return;
    const newAct: ItineraryActivity = {
      id: `custom-${Date.now()}-${addCounter++}`,
      slot: 'dupa-amiaza',
      title,
      type: 'activitate',
      durationHours: 1.5,
      cost: 0,
      tip: 'Activitate adăugată de tine.',
    };
    updateItinerary({
      ...itinerary,
      days: itinerary.days.map((d) =>
        d.day === day ? { ...d, activities: [...d.activities, newAct] } : d,
      ),
    });
  };

  const regenDay = (day: number) => {
    if (!dest) return;
    updateItinerary(regenerateDay(itinerary, day, dest));
  };

  const setPace = (pace: Pace) => {
    if (!dest) return;
    const fresh = generateItinerary(dest, itinerary.totalDays, itinerary.people, pace);
    updateItinerary({ ...fresh, id: itinerary.id, createdAt: itinerary.createdAt });
  };

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Itinerar ${itinerary.destinationName}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMsg(true);
        setTimeout(() => setShareMsg(false), 2500);
      }
    } catch {
      /* utilizatorul a anulat */
    }
  };

  return (
    <div className="container-page py-8 print:py-0">
      {/* Top bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link to="/itinerariile-mele" className="btn-ghost px-3 py-2 text-sm">
          <ArrowLeft size={16} /> Itinerariile mele
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={share} className="btn-outline px-4 py-2 text-sm">
            <Share2 size={15} /> {shareMsg ? 'Link copiat!' : 'Distribuie'}
          </button>
          <button onClick={() => window.print()} className="btn-navy px-4 py-2 text-sm">
            <FileDown size={15} /> Exportă PDF
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative mb-6 overflow-hidden rounded-3xl">
        <img src={itinerary.image} alt={itinerary.destinationName} className="h-56 w-full object-cover sm:h-72" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="font-display text-3xl font-bold sm:text-4xl">{itinerary.destinationName}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-sand-100/90">
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {itinerary.country}
            </span>
            <span>{itinerary.totalDays} zile</span>
            <span>{itinerary.people} persoane</span>
            <span className="flex items-center gap-1">
              <Wallet size={14} /> {formatMoney(totalCost, currency)} total
            </span>
          </p>
        </div>
      </div>

      {/* Pace controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3 print:hidden">
        <span className="text-sm font-medium">Ritm:</span>
        <button
          onClick={() => setPace('relaxat')}
          className={`chip text-xs ${itinerary.pace === 'relaxat' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
        >
          <Coffee size={13} /> Relaxat
        </button>
        <button
          onClick={() => setPace('echilibrat')}
          className={`chip text-xs ${itinerary.pace === 'echilibrat' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
        >
          Echilibrat
        </button>
        <button
          onClick={() => setPace('foarte-activ')}
          className={`chip text-xs ${itinerary.pace === 'foarte-activ' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
        >
          <Zap size={13} /> Foarte activ
        </button>
        <span className="ml-auto flex items-center gap-1 text-xs text-navy-400">
          <Check size={13} className="text-turquoise-500" /> Modificările se salvează automat
        </span>
      </div>

      {/* Days */}
      <div className="space-y-6">
        {itinerary.days.map((day) => {
          const dayCost = day.activities.reduce((s, a) => s + a.cost, 0);
          const dayHours = day.activities.reduce((s, a) => s + a.durationHours, 0);
          return (
            <div key={day.day} className="card-surface overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy-100 bg-navy-50/60 px-5 py-4 dark:border-navy-800 dark:bg-navy-800/40">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-turquoise-500 font-bold text-navy-950">
                    {day.day}
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold">Ziua {day.day}</h2>
                    <p className="text-sm text-navy-500 dark:text-sand-200/70">{day.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-navy-500 dark:text-sand-200/70">
                    <Clock size={14} /> {formatDuration(dayHours)}
                  </span>
                  <span className="font-semibold text-turquoise-600 dark:text-turquoise-300">
                    {formatMoney(dayCost, currency)}
                  </span>
                  <button
                    onClick={() => regenDay(day.day)}
                    className="btn-outline px-3 py-1.5 text-xs print:hidden"
                    title="Cere AI-ului să refacă ziua"
                  >
                    <RefreshCw size={13} /> Refă ziua
                  </button>
                </div>
              </div>

              <ul className="divide-y divide-navy-100 dark:divide-navy-800">
                {day.activities.map((act, i) => (
                  <li key={act.id} className="group flex gap-4 px-5 py-4">
                    <div className="flex w-20 shrink-0 flex-col items-center pt-1 text-center">
                      <span className="text-xl">{slotLabels[act.slot]?.icon}</span>
                      <span className="text-[11px] font-medium text-navy-400">
                        {slotLabels[act.slot]?.label}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{act.title}</p>
                      {act.tip && (
                        <p className="mt-0.5 text-sm text-navy-500 dark:text-sand-200/70">{act.tip}</p>
                      )}
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-navy-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {formatDuration(act.durationHours)}
                        </span>
                        {act.cost > 0 && (
                          <span className="flex items-center gap-1">
                            <Wallet size={12} /> {formatMoney(act.cost, currency)}
                          </span>
                        )}
                        {act.distanceKm !== undefined && act.distanceKm > 0 && (
                          <span className="flex items-center gap-1">
                            <Route size={12} /> {act.distanceKm} km
                          </span>
                        )}
                      </div>
                    </div>
                    {/* Controls */}
                    <div className="flex flex-col items-center gap-1 opacity-60 transition group-hover:opacity-100 print:hidden">
                      <button
                        onClick={() => moveActivity(day.day, i, -1)}
                        disabled={i === 0}
                        className="grid h-7 w-7 place-items-center rounded-lg text-navy-500 hover:bg-navy-100 disabled:opacity-30 dark:hover:bg-navy-800"
                        aria-label="Mută sus"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => moveActivity(day.day, i, 1)}
                        disabled={i === day.activities.length - 1}
                        className="grid h-7 w-7 place-items-center rounded-lg text-navy-500 hover:bg-navy-100 disabled:opacity-30 dark:hover:bg-navy-800"
                        aria-label="Mută jos"
                      >
                        <ArrowDown size={14} />
                      </button>
                      <button
                        onClick={() => removeActivity(day.day, act.id)}
                        className="grid h-7 w-7 place-items-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        aria-label="Elimină"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-navy-100 p-3 dark:border-navy-800 print:hidden">
                <button
                  onClick={() => addActivity(day.day)}
                  className="btn-ghost w-full py-2 text-sm text-turquoise-600 dark:text-turquoise-300"
                >
                  <Plus size={16} /> Adaugă activitate
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      {dest && (
        <div className="mt-8 card-surface p-6 print:hidden">
          <h3 className="mb-3 font-semibold">💡 Sfaturi utile pentru {dest.name}</h3>
          <ul className="grid gap-2 sm:grid-cols-2">
            {dest.goodToKnow.map((tip, i) => (
              <li key={i} className="flex gap-2 text-sm text-navy-600 dark:text-sand-200/80">
                <span className="text-turquoise-500">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
