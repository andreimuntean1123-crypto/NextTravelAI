import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  Globe,
  User,
  Heart,
  Bell,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Currency, Language } from '@/types';

const navKeys = [
  { to: '/', key: 'nav.home' as const },
  { to: '/orase', key: 'nav.cities' as const },
  { to: '/hoteluri', key: 'nav.hotels' as const },
  { to: '/planifica', key: 'nav.plan' as const },
  { to: '/itinerariile-mele', key: 'nav.itineraries' as const },
  { to: '/favorite', key: 'nav.favorites' as const },
  { to: '/despre', key: 'nav.about' as const },
  { to: '/contact', key: 'nav.contact' as const },
];

export function Navbar() {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    currency,
    setCurrency,
    t,
    favorites,
    notifications,
  } = useApp();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-50 border-b border-navy-100/60 dark:border-navy-800 glass">
      <nav className="container-page flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-turquoise-400 to-navy-700 text-white">
            <Sparkles size={18} />
          </span>
          <span className="font-display text-lg font-bold">
            Next<span className="text-turquoise-500">Travel</span>AI
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 xl:flex">
          {navKeys.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-turquoise-50 text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300'
                      : 'text-navy-600 hover:text-turquoise-600 dark:text-sand-200 dark:hover:text-turquoise-300'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Language */}
          <div className="hidden items-center rounded-full border border-navy-200 dark:border-navy-700 sm:flex">
            <button
              onClick={() => setLanguage((language === 'ro' ? 'en' : 'ro') as Language)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-navy-600 dark:text-sand-200"
              aria-label="Schimbă limba"
            >
              <Globe size={14} /> {language.toUpperCase()}
            </button>
          </div>

          {/* Currency */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            aria-label="Schimbă moneda"
            className="hidden rounded-full border border-navy-200 bg-transparent px-2 py-1.5 text-xs font-semibold text-navy-600 dark:border-navy-700 dark:text-sand-200 sm:block"
          >
            <option value="EUR">EUR</option>
            <option value="RON">RON</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
          </select>

          <button
            onClick={toggleTheme}
            aria-label={t('theme.toggle')}
            className="grid h-9 w-9 place-items-center rounded-full text-navy-600 hover:bg-navy-100 dark:text-sand-200 dark:hover:bg-navy-800"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <Link
            to="/favorite"
            aria-label="Favorite"
            className="relative hidden h-9 w-9 place-items-center rounded-full text-navy-600 hover:bg-navy-100 dark:text-sand-200 dark:hover:bg-navy-800 sm:grid"
          >
            <Heart size={18} />
            {favorites.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-turquoise-500 px-1 text-[10px] font-bold text-navy-950">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            to="/cont"
            aria-label="Contul meu"
            className="relative hidden h-9 w-9 place-items-center rounded-full text-navy-600 hover:bg-navy-100 dark:text-sand-200 dark:hover:bg-navy-800 sm:grid"
          >
            <User size={18} />
            {unread > 0 && (
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500" />
            )}
          </Link>

          <button
            onClick={() => navigate('/planifica')}
            className="btn-primary hidden px-4 py-2 text-sm md:inline-flex"
          >
            <Sparkles size={16} /> {t('cta.planAi')}
          </button>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-full text-navy-700 hover:bg-navy-100 dark:text-sand-100 dark:hover:bg-navy-800 xl:hidden"
            aria-label="Meniu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-navy-100 dark:border-navy-800 xl:hidden animate-fade-in-fast">
          <div className="container-page space-y-1 py-4">
            {navKeys.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block rounded-xl px-4 py-2.5 text-sm font-medium ${
                    isActive
                      ? 'bg-turquoise-50 text-turquoise-700 dark:bg-navy-800 dark:text-turquoise-300'
                      : 'text-navy-700 dark:text-sand-200'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            ))}
            <div className="flex items-center gap-3 px-4 pt-2">
              <Link to="/cont" onClick={() => setOpen(false)} className="btn-outline flex-1 px-3 py-2 text-sm">
                <User size={16} /> {t('nav.account')}
              </Link>
              <Link to="/favorite" onClick={() => setOpen(false)} className="btn-outline px-3 py-2 text-sm">
                <Heart size={16} /> {favorites.length}
              </Link>
              <Link to="/cont" onClick={() => setOpen(false)} className="btn-outline px-3 py-2 text-sm">
                <Bell size={16} /> {unread}
              </Link>
            </div>
            <button
              onClick={() => {
                setOpen(false);
                navigate('/planifica');
              }}
              className="btn-primary mt-2 w-full px-4 py-2.5 text-sm"
            >
              <Sparkles size={16} /> {t('cta.planAi')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
