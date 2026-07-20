import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { offers } from '@/data/content';
import { getDestinationById } from '@/data/destinations';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/format';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function OffersSection() {
  const { currency } = useApp();

  return (
    <section className="container-page py-14">
      <SectionHeading
        eyebrow="Prețuri limitate"
        title="Oferte speciale"
        subtitle="Reduceri selectate de agentul nostru pentru cea mai bună valoare."
        linkTo="/orase"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {offers.map((offer) => {
          const dest = getDestinationById(offer.destinationId);
          if (!dest) return null;
          return (
            <Link
              key={offer.id}
              to={`/destinatie/${dest.id}`}
              className="group card-surface overflow-hidden transition hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <img
                  src={dest.image}
                  alt={dest.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-xs font-bold text-navy-950">
                  {offer.badge}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{offer.title}</h3>
                <p className="mt-1 flex items-center gap-1 text-xs text-navy-400">
                  <Clock size={12} /> {offer.nights} nopți
                </p>
                <div className="mt-3 flex items-end justify-between">
                  <div>
                    <span className="text-sm text-navy-400 line-through">
                      {formatMoney(offer.oldPrice, currency)}
                    </span>
                    <p className="text-lg font-bold text-turquoise-600 dark:text-turquoise-300">
                      {formatMoney(offer.newPrice, currency)}
                    </p>
                  </div>
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-turquoise-50 text-turquoise-600 transition group-hover:bg-turquoise-500 group-hover:text-navy-950 dark:bg-navy-800">
                    <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
