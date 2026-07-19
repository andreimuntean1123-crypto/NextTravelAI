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
  const { preferences } = useApp();

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
        eyebrow="Cele mai căutate"
        title="Destinații populare"
        subtitle="Locurile care cuceresc inimile călătorilor din toată lumea."
        ids={popularIds}
      />

      <FeaturesSection />

      <CategorySection
        eyebrow={hasPrefs ? 'Pe baza preferințelor tale' : 'Selecția noastră'}
        title="Recomandări pentru tine"
        subtitle={
          hasPrefs
            ? 'Sugestii adaptate profilului tău de călător.'
            : 'Completează chestionarul AI pentru recomandări cu adevărat personalizate.'
        }
        ids={forYouIds}
        tinted
      />

      <OffersSection />

      <CategorySection
        eyebrow="Distracție pentru toți"
        title="Vacanțe pentru familii"
        subtitle="Destinații sigure și pline de activități pentru cei mici și mari."
        filterTag="familie"
      />

      <CategorySection
        eyebrow="Doar voi doi"
        title="Escapade romantice"
        subtitle="Locuri de vis pentru momente de neuitat în doi."
        filterTag="romantica"
        tinted
      />

      <CategorySection
        eyebrow="Adrenalină & natură"
        title="Aventuri în natură"
        subtitle="Munți, jungle și peisaje care îți taie respirația."
        filterTag="natura"
      />

      <CategorySection
        eyebrow="Weekenduri urbane"
        title="City-break-uri"
        subtitle="Orașe vibrante, cultură, gastronomie și viață de noapte."
        filterTag="city-break"
        tinted
      />

      <ReviewsSection />
      <FaqSection />
      <NewsletterSection />
    </>
  );
}
