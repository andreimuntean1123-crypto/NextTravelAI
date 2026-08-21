import { Quote } from 'lucide-react';
import { reviews } from '@/data/content';
import { StarRating } from '@/components/ui/StarRating';
import { useApp } from '@/context/AppContext';
import type { TranslationKey } from '@/i18n/translations';

export function ReviewsSection() {
  const { t } = useApp();
  return (
    <section className="bg-navy-900 py-16 dark:bg-navy-900">
      <div className="container-page">
        <div className="mb-8 text-center text-white">
          <span className="text-sm font-semibold uppercase tracking-wider text-turquoise-400">
            {t('section.reviewsEyebrow')}
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
            {t('section.reviews')}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sand-100/70">
            {t('section.reviewsSubtitle')}
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <figure
              key={r.id}
              className="rounded-2.5xl bg-navy-800/80 p-6 text-sand-100 transition hover:-translate-y-1"
            >
              <Quote className="mb-3 text-turquoise-400" size={26} />
              <blockquote className="text-sm leading-relaxed text-sand-100/90">
                "{t(r.text as TranslationKey)}"
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <img src={r.avatar} alt={r.name} className="h-11 w-11 rounded-full object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-sand-100/60">
                    {r.location} • {r.trip}
                  </p>
                </div>
                <StarRating value={r.rating} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
