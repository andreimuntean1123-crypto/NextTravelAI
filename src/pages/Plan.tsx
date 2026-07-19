import { useState } from 'react';
import { Sparkles, MessageCircle, Wand2 } from 'lucide-react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { BudgetCalculator } from '@/components/budget/BudgetCalculator';
import { PackingListTool } from '@/components/tools/PackingListTool';
import { MapDemo } from '@/components/tools/MapDemo';
import { WeatherWidget } from '@/components/tools/WeatherWidget';
import { destinations } from '@/data/destinations';

const steps = [
  { n: 1, title: 'Răspunde la câteva întrebări', text: 'Un chestionar rapid despre stilul tău de călătorie.' },
  { n: 2, title: 'Primește recomandări', text: 'Până la 5 destinații cu notă de compatibilitate.' },
  { n: 3, title: 'Construiește itinerarul', text: 'Program zi-cu-zi, editabil oricând.' },
  { n: 4, title: 'Pleacă în vacanță', text: 'Buget, bagaje și vreme — totul pregătit.' },
];

export function Plan() {
  const { open } = useQuestionnaire();
  const [weatherDest, setWeatherDest] = useState(destinations[0].id);
  const dest = destinations.find((d) => d.id === weatherDest)!;

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 via-navy-700 to-turquoise-800 py-16 text-white">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-turquoise-400/20 blur-3xl" />
        <div className="container-page relative text-center">
          <span className="chip mx-auto mb-4 border border-white/20 bg-white/10 backdrop-blur">
            <Sparkles size={14} className="text-gold-400" /> Planificare cu AI
          </span>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">Planifică o călătorie</h1>
          <p className="mx-auto mt-3 max-w-2xl text-sand-100/85">
            Lasă agentul AI să te cunoască și îți construiește o vacanță personalizată — de la
            destinație și itinerar, până la buget și lista de bagaje.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={open} className="btn-primary px-7 py-3.5 text-base">
              <Wand2 size={18} /> Începe chestionarul AI
            </button>
            <span className="text-sm text-sand-100/70">30 de întrebări • ~3 minute</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container-page py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s) => (
            <div key={s.n} className="card-surface p-6">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-turquoise-500 font-bold text-navy-950">
                {s.n}
              </span>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-1 text-sm text-navy-500 dark:text-sand-200/70">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="container-page space-y-10 pb-8">
        <div>
          <h2 className="mb-1 text-2xl font-bold">Unelte de planificare</h2>
          <p className="text-navy-500 dark:text-sand-200/70">
            Toate instrumentele de care ai nevoie, într-un singur loc.
          </p>
        </div>

        <BudgetCalculator />

        <div className="grid gap-6 lg:grid-cols-2">
          <PackingListTool />
          <div className="space-y-6">
            <div className="card-surface p-5">
              <label className="mb-3 block text-sm font-medium">Alege o destinație pentru vreme</label>
              <select
                value={weatherDest}
                onChange={(e) => setWeatherDest(e.target.value)}
                className="input-field py-2"
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.country}
                  </option>
                ))}
              </select>
            </div>
            <WeatherWidget destination={dest} />
          </div>
        </div>

        <MapDemo />

        {/* CTA chat */}
        <div className="card-surface flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:text-left">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-turquoise-500 text-navy-950">
            <MessageCircle size={26} />
          </span>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">Preferi să discuți direct cu agentul?</h3>
            <p className="text-sm text-navy-500 dark:text-sand-200/70">
              Deschide chat-ul din colțul din dreapta jos și spune-i ce vacanță visezi.
            </p>
          </div>
          <button onClick={open} className="btn-navy px-5 py-2.5 text-sm">
            Sau completează chestionarul
          </button>
        </div>
      </section>
    </div>
  );
}
