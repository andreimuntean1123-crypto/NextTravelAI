import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@/data/content';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/i18n/translations';

export function FaqSection() {
  const { t } = useApp();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="container-page py-16">
      <SectionHeading
        center
        eyebrow={t('section.faqEyebrow')}
        title={t('section.faq')}
        subtitle={t('section.faqSubtitle')}
      />
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          return (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border border-navy-100 bg-white transition dark:border-navy-800 dark:bg-navy-900"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="font-medium">{t(item.q as TranslationKey)}</span>
                <ChevronDown
                  size={20}
                  className={`shrink-0 text-turquoise-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <div
                className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-navy-600 dark:text-sand-200/80">
                    {t(item.a as TranslationKey)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
