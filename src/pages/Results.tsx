import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Wand2, SearchX, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { getRecommendations } from '@/lib/recommend';
import { RecommendationCard } from '@/components/results/RecommendationCard';
import { tripTypeLabel } from '@/i18n/labels';

export function Results() {
  const { preferences, t, tf, language } = useApp();
  const { open } = useQuestionnaire();
  const [sortBy, setSortBy] = useState<'match' | 'price'>('match');

  const hasPrefs = Object.keys(preferences).length > 0;

  const recommendations = useMemo(() => {
    const recs = getRecommendations(preferences, 5, language);
    if (sortBy === 'price') return [...recs].sort((a, b) => a.estimatedPrice - b.estimatedPrice);
    return recs;
  }, [preferences, sortBy, language]);

  if (!hasPrefs) {
    return (
      <div className="container-page py-20">
        <div className="card-surface mx-auto max-w-lg p-10 text-center">
          <SearchX size={48} className="mx-auto mb-4 text-navy-300" />
          <h1 className="text-2xl font-bold">{t('results.noPrefs.title')}</h1>
          <p className="mt-2 text-navy-500 dark:text-sand-200/70">
            {t('results.noPrefs.text')}
          </p>
          <button onClick={open} className="btn-primary mx-auto mt-6 px-6 py-3 text-sm">
            <Wand2 size={16} /> {t('results.noPrefs.cta')}
          </button>
        </div>
      </div>
    );
  }

  const summaryTypes = ((preferences.tripTypes as string[]) ?? [])
    .map((ty) => tripTypeLabel(language, ty))
    .filter(Boolean);

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-navy-800 to-turquoise-800 p-6 text-white sm:p-8">
        <span className="chip mb-3 border border-white/20 bg-white/10 backdrop-blur">
          <Sparkles size={14} className="text-gold-400" /> {t('results.badge')}
        </span>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          {tf('results.foundTitle', { n: recommendations.length })}
        </h1>
        <p className="mt-2 max-w-2xl text-sand-100/85">
          {t('results.summaryBasedOn')}
          {preferences.budget ? ` (${tf('results.summaryBudget', { budget: preferences.budget as number })}` : ''}
          {preferences.days ? `, ${tf('results.summaryDays', { days: preferences.days as number })}` : ''}
          {preferences.people ? `, ${tf('results.summaryPeople', { people: preferences.people as number })})` : preferences.budget ? ')' : ''}
          {summaryTypes.length ? `, ${t('results.summaryFocus')} ${summaryTypes.join(', ').toLowerCase()}` : ''}.
          {' '}{t('results.summaryEnd')}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={open} className="btn-primary px-4 py-2 text-sm">
            <Wand2 size={15} /> {t('results.retakeQuestionnaire')}
          </button>
          <Link to="/orase" className="btn border border-white/30 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
            {t('results.seeAllDestinations')}
          </Link>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-navy-500 dark:text-sand-200/70">
          {t('results.sortedBy')} {sortBy === 'match' ? t('results.sortMatch') : t('results.sortPrice')}
        </p>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-navy-400" />
          <button
            onClick={() => setSortBy('match')}
            className={`chip text-xs ${sortBy === 'match' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
          >
            {t('results.byMatch')}
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`chip text-xs ${sortBy === 'price' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
          >
            {t('results.byPrice')}
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-6">
        {recommendations.map((rec, i) => (
          <RecommendationCard key={rec.destination.id} rec={rec} rank={i + 1} />
        ))}
      </div>
    </div>
  );
}
