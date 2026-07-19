import {
  MessageSquare,
  Map,
  Wallet,
  Sparkles,
  Globe2,
  ShieldCheck,
} from 'lucide-react';

const features = [
  {
    icon: MessageSquare,
    title: 'Agent AI conversațional',
    text: 'Discută natural cu agentul, primește recomandări și modifică planul oricând.',
  },
  {
    icon: Map,
    title: 'Itinerare pe zile',
    text: 'Program detaliat dimineața–seara, cu obiective, restaurante, timpi și costuri.',
  },
  {
    icon: Wallet,
    title: 'Calculator de buget',
    text: 'Împarte bugetul pe categorii și vezi costul pe persoană, pe zi și suma rămasă.',
  },
  {
    icon: Sparkles,
    title: 'Recomandări personalizate',
    text: 'Notă de compatibilitate calculată din preferințele tale, cu explicații clare.',
  },
  {
    icon: Globe2,
    title: 'Multilingv & multi-valută',
    text: 'Comută limba și moneda; preferințele se salvează pe dispozitivul tău.',
  },
  {
    icon: ShieldCheck,
    title: 'Fără bătăi de cap',
    text: 'Listă de bagaje, informații despre vreme și export PDF al itinerarului.',
  },
];

export function FeaturesSection() {
  return (
    <section className="container-page py-16">
      <div className="mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-turquoise-600 dark:text-turquoise-400">
          De ce NextTravelAI
        </span>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">Tot ce ai nevoie pentru vacanța perfectă</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.title}
            className="group card-surface p-6 transition hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-turquoise-50 text-turquoise-600 transition group-hover:bg-turquoise-500 group-hover:text-navy-950 dark:bg-navy-800">
              <f.icon size={24} />
            </span>
            <h3 className="text-lg font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-navy-500 dark:text-sand-200/70">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
