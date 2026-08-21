import { Link } from 'react-router-dom';
import { Sparkles, Target, Heart, ShieldCheck, Globe2, Users } from 'lucide-react';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/i18n/translations';

const values: { icon: typeof Target; titleKey: TranslationKey; textKey: TranslationKey }[] = [
  { icon: Target, titleKey: 'about.value1.title', textKey: 'about.value1.text' },
  { icon: Heart, titleKey: 'about.value2.title', textKey: 'about.value2.text' },
  { icon: ShieldCheck, titleKey: 'about.value3.title', textKey: 'about.value3.text' },
  { icon: Globe2, titleKey: 'about.value4.title', textKey: 'about.value4.text' },
];

const stats: { value: string; labelKey: TranslationKey }[] = [
  { value: '10+', labelKey: 'about.stat.destinations' },
  { value: '30', labelKey: 'about.stat.questions' },
  { value: '5', labelKey: 'about.stat.recommendations' },
  { value: '100%', labelKey: 'about.stat.free' },
];

export function About() {
  const { open } = useQuestionnaire();
  const { t } = useApp();
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-navy-800 to-turquoise-800 py-16 text-white">
        <div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-turquoise-400/20 blur-3xl" />
        <div className="container-page relative max-w-3xl text-center">
          <span className="chip mx-auto mb-4 border border-white/20 bg-white/10 backdrop-blur">
            <Sparkles size={14} className="text-gold-400" /> {t('about.badge')}
          </span>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            {t('about.title')}
          </h1>
          <p className="mt-4 text-sand-100/85">
            {t('about.intro')}
          </p>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-4 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.labelKey} className="card-surface p-6 text-center">
              <p className="font-display text-3xl font-bold text-turquoise-600 dark:text-turquoise-300">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-navy-500 dark:text-sand-200/70">{t(s.labelKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-14">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">{t('about.valuesTitle')}</h2>
          <p className="mx-auto mt-2 max-w-xl text-navy-500 dark:text-sand-200/70">
            {t('about.valuesSubtitle')}
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.titleKey} className="card-surface flex gap-4 p-6">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-turquoise-50 text-turquoise-600 dark:bg-navy-800">
                <v.icon size={24} />
              </span>
              <div>
                <h3 className="text-lg font-semibold">{t(v.titleKey)}</h3>
                <p className="mt-1 text-sm text-navy-500 dark:text-sand-200/70">{t(v.textKey)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="card-surface flex flex-col items-center gap-4 p-10 text-center">
          <Users size={40} className="text-turquoise-500" />
          <h2 className="text-2xl font-bold">{t('about.ctaTitle')}</h2>
          <p className="max-w-lg text-navy-500 dark:text-sand-200/70">
            {t('about.ctaText')}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={open} className="btn-primary px-6 py-3 text-sm">
              <Sparkles size={16} /> {t('about.ctaButton')}
            </button>
            <Link to="/orase" className="btn-outline px-6 py-3 text-sm">
              {t('about.ctaExplore')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
