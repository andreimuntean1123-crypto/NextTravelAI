import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Wallet, Compass, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { destinations } from '@/data/destinations';

interface HeroProps {
  onPlanClick: () => void;
}

export function Hero({ onPlanClick }: HeroProps) {
  const { t } = useApp();
  const navigate = useNavigate();
  const [dest, setDest] = useState('');
  const [depart, setDepart] = useState('');
  const [ret, setRet] = useState('');
  const [people, setPeople] = useState(2);
  const [budget, setBudget] = useState('');
  const [type, setType] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (dest) params.set('q', dest);
    if (type) params.set('type', type);
    if (budget) params.set('budget', budget);
    if (people) params.set('people', String(people));
    navigate(`/descopera?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2000&q=80"
          alt="Plajă tropicală spectaculoasă"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-900/60 to-navy-950/85" />
      </div>

      <div className="container-page relative py-20 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-3xl text-center text-white animate-slide-up">
          <span className="chip mx-auto mb-6 border border-white/20 bg-white/10 text-sand-100 backdrop-blur">
            <Sparkles size={14} className="text-gold-400" /> Planificare inteligentă cu AI
          </span>
          <h1 className="font-display text-4xl font-bold leading-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
            {t('hero.title')}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-sand-100/90">{t('hero.subtitle')}</p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={onPlanClick} className="btn-primary px-7 py-3.5 text-base">
              <Sparkles size={18} /> {t('cta.planAi')}
            </button>
            <button
              onClick={() => navigate('/descopera')}
              className="btn px-7 py-3.5 text-base border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20"
            >
              <Compass size={18} /> {t('nav.discover')}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <form
          onSubmit={submit}
          className="mx-auto mt-12 max-w-5xl rounded-3xl bg-white/95 p-3 shadow-soft-lg backdrop-blur dark:bg-navy-900/95 animate-fade-in"
        >
          <div className="grid gap-2 md:grid-cols-6">
            <Field icon={<MapPin size={16} />} label={t('search.destination')}>
              <input
                list="dest-list"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                placeholder="Oriunde..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-navy-400"
              />
              <datalist id="dest-list">
                {destinations.map((d) => (
                  <option key={d.id} value={d.name} />
                ))}
              </datalist>
            </Field>
            <Field icon={<Calendar size={16} />} label={t('search.depart')}>
              <input
                type="date"
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </Field>
            <Field icon={<Calendar size={16} />} label={t('search.return')}>
              <input
                type="date"
                value={ret}
                onChange={(e) => setRet(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />
            </Field>
            <Field icon={<Users size={16} />} label={t('search.people')}>
              <input
                type="number"
                min={1}
                max={20}
                value={people}
                onChange={(e) => setPeople(Number(e.target.value))}
                className="w-full bg-transparent text-sm outline-none"
              />
            </Field>
            <Field icon={<Wallet size={16} />} label={t('search.budget')}>
              <input
                type="number"
                min={0}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="€"
                className="w-full bg-transparent text-sm outline-none placeholder:text-navy-400"
              />
            </Field>
            <Field icon={<Compass size={16} />} label={t('search.type')}>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-transparent text-sm outline-none dark:[&>option]:bg-navy-900"
              >
                <option value="">Toate</option>
                <option value="plaja">Plajă</option>
                <option value="munte">Munte</option>
                <option value="city-break">City-break</option>
                <option value="natura">Natură</option>
                <option value="romantica">Romantică</option>
                <option value="familie">Familie</option>
              </select>
            </Field>
          </div>
          <button type="submit" className="btn-primary mt-2 w-full py-3 text-sm md:text-base">
            <Search size={18} /> {t('search.cta')}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-0.5 rounded-2xl border border-navy-100 px-3 py-2 text-left transition focus-within:border-turquoise-400 dark:border-navy-800">
      <span className="flex items-center gap-1.5 text-xs font-medium text-navy-400">
        {icon} {label}
      </span>
      {children}
    </label>
  );
}
