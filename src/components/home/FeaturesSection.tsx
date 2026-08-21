import {
  MessageSquare,
  Map,
  Wallet,
  Sparkles,
  Globe2,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/i18n/translations';

const features: { icon: typeof MessageSquare; titleKey: TranslationKey; textKey: TranslationKey }[] = [
  { icon: MessageSquare, titleKey: 'features.chat.title', textKey: 'features.chat.text' },
  { icon: Map, titleKey: 'features.itinerary.title', textKey: 'features.itinerary.text' },
  { icon: Wallet, titleKey: 'features.budget.title', textKey: 'features.budget.text' },
  { icon: Sparkles, titleKey: 'features.personalized.title', textKey: 'features.personalized.text' },
  { icon: Globe2, titleKey: 'features.multilang.title', textKey: 'features.multilang.text' },
  { icon: ShieldCheck, titleKey: 'features.easy.title', textKey: 'features.easy.text' },
];

export function FeaturesSection() {
  const { t } = useApp();
  return (
    <section className="container-page py-16">
      <div className="mb-10 text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-turquoise-600 dark:text-turquoise-400">
          {t('features.eyebrow')}
        </span>
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{t('features.title')}</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <div
            key={f.titleKey}
            className="group card-surface p-6 transition hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-turquoise-50 text-turquoise-600 transition group-hover:bg-turquoise-500 group-hover:text-navy-950 dark:bg-navy-800">
              <f.icon size={24} />
            </span>
            <h3 className="text-lg font-semibold">{t(f.titleKey)}</h3>
            <p className="mt-2 text-sm text-navy-500 dark:text-sand-200/70">{t(f.textKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
