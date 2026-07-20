import { Link } from 'react-router-dom';
import { Sparkles, Target, Heart, ShieldCheck, Globe2, Users } from 'lucide-react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';

const values = [
  { icon: Target, title: 'Personalizare reală', text: 'Fiecare recomandare pornește de la preferințele tale, nu de la reclame.' },
  { icon: Heart, title: 'Pasiune pentru călătorii', text: 'Iubim să descoperim locuri noi și vrem să împărtășim asta cu tine.' },
  { icon: ShieldCheck, title: 'Transparență', text: 'Îți explicăm de ce alegem fiecare destinație, hotel sau activitate.' },
  { icon: Globe2, title: 'Acces pentru toți', text: 'Unelte gratuite, în limba ta, adaptate oricărui buget.' },
];

const stats = [
  { value: '10+', label: 'destinații demonstrative' },
  { value: '30', label: 'întrebări de personalizare' },
  { value: '5', label: 'recomandări per profil' },
  { value: '100%', label: 'gratuit de folosit' },
];

export function About() {
  const { open } = useQuestionnaire();
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 to-turquoise-800 py-16 text-white">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-turquoise-400/20 blur-3xl" />
        <div className="container-page relative max-w-3xl text-center">
          <span className="chip mx-auto mb-4 border border-white/20 bg-white/10 backdrop-blur">
            <Sparkles size={14} className="text-gold-400" /> Despre noi
          </span>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Reinventăm modul în care planifici vacanțele
          </h1>
          <p className="mt-4 text-sand-100/85">
            NextTravelAI a pornit dintr-o idee simplă: planificarea unei călătorii ar trebui să fie
            la fel de plăcută ca vacanța însăși. Am creat un agent inteligent care te ascultă, îți
            înțelege dorințele și îți construiește experiențe pe măsură — de la prima idee până la
            ultima zi din itinerar.
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="card-surface p-6 text-center">
              <p className="font-display text-3xl font-bold text-turquoise-600 dark:text-turquoise-300">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-navy-500 dark:text-sand-200/70">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">Valorile noastre</h2>
          <p className="mx-auto mt-2 max-w-xl text-navy-500 dark:text-sand-200/70">
            Principiile care ne ghidează în tot ce construim.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.title} className="card-surface flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-turquoise-50 text-turquoise-600 dark:bg-navy-800">
                <v.icon size={24} />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{v.title}</h3>
                <p className="mt-1 text-sm text-navy-500 dark:text-sand-200/70">{v.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="card-surface flex flex-col items-center gap-4 p-10 text-center">
          <Users size={40} className="text-turquoise-500" />
          <h2 className="text-2xl font-bold">Gata să îți planifici următoarea aventură?</h2>
          <p className="max-w-lg text-navy-500 dark:text-sand-200/70">
            Lasă agentul AI să te cunoască și primește recomandări personalizate în câteva minute.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={open} className="btn-primary px-6 py-3 text-sm">
              <Sparkles size={16} /> Planifică vacanța cu AI
            </button>
            <Link to="/orase" className="btn-outline px-6 py-3 text-sm">
              Explorează destinații
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
