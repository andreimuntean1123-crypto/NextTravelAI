import { Link } from 'react-router-dom';
import { Sparkles, Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { externalApisStatus } from '@/lib/aiService';
import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/i18n/translations';

export function Footer() {
  const { t } = useApp();
  const apis = externalApisStatus();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-navy-100 bg-white dark:border-navy-800 dark:bg-navy-950">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-turquoise-400 to-navy-700 text-white">
              <Sparkles size={18} />
            </span>
            <span className="font-display text-lg font-bold">
              Next<span className="text-turquoise-500">Travel</span>AI
            </span>
          </Link>
          <p className="mt-4 max-w-xs text-sm text-navy-500 dark:text-sand-200/70">
            {t('footer.tagline')}
          </p>
          <div className="mt-5 flex gap-2">
            {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                onClick={(e) => e.preventDefault()}
                aria-label={t('footer.socialLabel')}
                className="grid h-9 w-9 place-items-center rounded-full bg-navy-50 text-navy-600 transition hover:bg-turquoise-500 hover:text-navy-950 dark:bg-navy-800 dark:text-sand-200"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title={t('footer.explore')}
          links={[
            { label: t('footer.exploreCities'), to: '/orase' },
            { label: t('footer.exploreHotels'), to: '/hoteluri' },
            { label: t('footer.explorePlan'), to: '/planifica' },
            { label: t('footer.exploreItineraries'), to: '/itinerariile-mele' },
            { label: t('footer.exploreFavorites'), to: '/favorite' },
            { label: t('footer.exploreCompare'), to: '/compara' },
          ]}
        />
        <FooterCol
          title={t('footer.company')}
          links={[
            { label: t('footer.companyAbout'), to: '/despre' },
            { label: t('footer.companyContact'), to: '/contact' },
            { label: t('footer.companyAccount'), to: '/cont' },
          ]}
        />

        <div>
          <h4 className="font-display text-base font-semibold">{t('footer.newsletterTitle')}</h4>
          <p className="mt-3 text-sm text-navy-500 dark:text-sand-200/70">
            {t('footer.newsletterText')}
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-4 flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-400" />
              <input
                type="email"
                required
                placeholder={t('newsletter.placeholder' as TranslationKey)}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
            <button className="btn-primary px-4 py-2 text-sm">OK</button>
          </form>
        </div>
      </div>

      <div className="border-t border-navy-100 dark:border-navy-800">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-navy-400 sm:flex-row">
          <p>© {year} NextTravelAI. {t('footer.rights')}</p>
          <p className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${apis.ai ? 'bg-turquoise-500' : 'bg-gold-400'}`}
            />
            {apis.ai ? t('footer.aiConnected') : t('footer.aiDemo')}
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className="font-display text-base font-semibold">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.to}>
            <Link
              to={l.to}
              className="text-navy-500 transition-colors hover:text-turquoise-600 dark:text-sand-200/70 dark:hover:text-turquoise-300"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
