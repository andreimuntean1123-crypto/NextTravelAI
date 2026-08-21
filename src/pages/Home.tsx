import { Hero } from '@/components/home/Hero';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { CategorySection } from '@/components/home/CategorySection';
import { OffersSection } from '@/components/home/OffersSection';
import { ReviewsSection } from '@/components/home/ReviewsSection';
import { FaqSection } from '@/components/home/FaqSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { useApp } from '@/context/AppContext';
import { destinations } from '@/data/destinations';

export function Home() {
  const { open } = useQuestionnaire();
  const { preferences, t } = useApp();

  // „Recomandări pentru tine" — dacă există preferințe, sortăm după popularitate/rating.
  const forYouIds = [...destinations]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
    .map((d) => d.id);

  const popularIds = [...destinations]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 4)
    .map((d) => d.id);

  const hasPrefs = Object.keys(preferences).length > 0;

  return (
    <>
      <Hero onPlanClick={open} />

      <CategorySection
        eyebrow={t('section.popularEyebrow')}
        title={t('section.popular')}
        subtitle={t('section.popularSubtitle')}
        ids={popularIds}
      />

      <FeaturesSection />

      <CategorySection
        eyebrow={hasPrefs ? t('section.forYouEyebrowPrefs') : t('section.forYouEyebrowDefault')}
        title={t('section.forYou')}
        subtitle={hasPrefs ? t('section.forYouSubtitlePrefs') : t('section.forYouSubtitleDefault')}
        ids={forYouIds}
        tinted
      />

      <OffersSection />

      <CategorySection
        eyebrow={t('section.familyEyebrow')}
        title={t('section.family')}
        subtitle={t('section.familySubtitle')}
        filterTag="familie"
      />

      <CategorySection
        eyebrow={t('section.romanticEyebrow')}
        title={t('section.romantic')}
        subtitle={t('section.romanticSubtitle')}
        filterTag="romantica"
        tinted
      />

      <CategorySection
        eyebrow={t('section.natureEyebrow')}
        title={t('section.nature')}
        subtitle={t('section.natureSubtitle')}
        filterTag="natura"
      />

      <CategorySection
        eyebrow={t('section.cityEyebrow')}
        title={t('section.city')}
        subtitle={t('section.citySubtitle')}
        filterTag="city-break"
        tinted
      />

      <ReviewsSection />
      <FaqSection />
      <NewsletterSection />
    </>
  );
}
