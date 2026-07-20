import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export function NotFound() {
  return (
    <div className="container-page flex flex-col items-center justify-center py-28 text-center">
      <span className="font-display text-7xl font-bold text-gradient">404</span>
      <h1 className="mt-4 text-2xl font-bold">Ne-am rătăcit puțin…</h1>
      <p className="mt-2 max-w-md text-navy-500 dark:text-sand-200/70">
        Pagina pe care o cauți nu există sau a fost mutată. Hai să te ducem înapoi pe drumul cel bun.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary px-5 py-2.5 text-sm">
          <Home size={16} /> Acasă
        </Link>
        <Link to="/orase" className="btn-outline px-5 py-2.5 text-sm">
          <Compass size={16} /> Descoperă destinații
        </Link>
      </div>
    </div>
  );
}
