import { Link } from 'react-router-dom';
import { Heart, Compass, Scale } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { destinations } from '@/data/destinations';
import { DestinationCard } from '@/components/destinations/DestinationCard';

export function Favorites() {
  const { favorites, compareList } = useApp();
  const favDestinations = destinations.filter((d) => favorites.includes(d.id));

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Favorite</h1>
          <p className="mt-1 text-navy-500 dark:text-sand-200/70">
            {favDestinations.length
              ? `${favDestinations.length} destinații salvate.`
              : 'Salvează destinațiile care îți plac pentru a le regăsi ușor.'}
          </p>
        </div>
        {compareList.length > 0 && (
          <Link to="/compara" className="btn-outline px-4 py-2.5 text-sm">
            <Scale size={16} /> Compară ({compareList.length})
          </Link>
        )}
      </div>

      {favDestinations.length === 0 ? (
        <div className="card-surface flex flex-col items-center justify-center py-20 text-center">
          <Heart size={48} className="mb-4 text-navy-300" />
          <h3 className="text-xl font-semibold">Nicio destinație la favorite</h3>
          <p className="mt-2 max-w-sm text-navy-500 dark:text-sand-200/70">
            Apasă pe inima de pe orice destinație ca să o adaugi aici.
          </p>
          <Link to="/orase" className="btn-primary mt-6 px-5 py-2.5 text-sm">
            <Compass size={16} /> Descoperă destinații
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favDestinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      )}
    </div>
  );
}
