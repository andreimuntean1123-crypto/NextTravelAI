import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Wand2, SearchX, Filter } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useQuestionnaire } from '@/context/QuestionnaireContext';
import { getRecommendations } from '@/lib/recommend';
import { RecommendationCard } from '@/components/results/RecommendationCard';
import { tripTypeLabels } from '@/data/content';

export function Results() {
  const { preferences } = useApp();
  const { open } = useQuestionnaire();
  const [sortBy, setSortBy] = useState<'match' | 'price'>('match');

  const hasPrefs = Object.keys(preferences).length > 0;

  const recommendations = useMemo(() => {
    const recs = getRecommendations(preferences, 5);
    if (sortBy === 'price') return [...recs].sort((a, b) => a.estimatedPrice - b.estimatedPrice);
    return recs;
  }, [preferences, sortBy]);

  if (!hasPrefs) {
    return (
      <div className="container-page py-20">
        <div className="card-surface mx-auto max-w-lg p-10 text-center">
          <SearchX size={48} className="mx-auto mb-4 text-navy-300" />
          <h1 className="text-2xl font-bold">Încă nu ai preferințe salvate</h1>
          <p className="mt-2 text-navy-500 dark:text-sand-200/70">
            Completează chestionarul AI ca să îți generăm recomandări personalizate cu notă de
            compatibilitate.
          </p>
          <button onClick={open} className="btn-primary mx-auto mt-6 px-6 py-3 text-sm">
            <Wand2 size={16} /> Începe chestionarul
          </button>
        </div>
      </div>
    );
  }

  const summaryTypes = ((preferences.tripTypes as string[]) ?? [])
    .map((t) => tripTypeLabels[t])
    .filter(Boolean);

  return (
    <div className="container-page py-10">
      {/* Header */}
      <div className="mb-8 rounded-3xl bg-gradient-to-br from-navy-800 to-turquoise-800 p-6 text-white sm:p-8">
        <span className="chip mb-3 border border-white/20 bg-white/10 backdrop-blur">
          <Sparkles size={14} className="text-gold-400" /> Recomandările agentului AI
        </span>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          Am găsit {recommendations.length} destinații pentru tine
        </h1>
        <p className="mt-2 max-w-2xl text-sand-100/85">
          Pe baza preferințelor tale
          {preferences.budget ? ` (buget ~${preferences.budget}€` : ''}
          {preferences.days ? `, ${preferences.days} zile` : ''}
          {preferences.people ? `, ${preferences.people} persoane)` : preferences.budget ? ')' : ''}
          {summaryTypes.length ? `, cu accent pe ${summaryTypes.join(', ').toLowerCase()}` : ''}.
          Fiecare are o notă de compatibilitate și explicații.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button onClick={open} className="btn-primary px-4 py-2 text-sm">
            <Wand2 size={15} /> Refă chestionarul
          </button>
          <Link to="/descopera" className="btn border border-white/30 bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20">
            Vezi toate destinațiile
          </Link>
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-navy-500 dark:text-sand-200/70">
          Sortate după {sortBy === 'match' ? 'compatibilitate' : 'preț'}
        </p>
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-navy-400" />
          <button
            onClick={() => setSortBy('match')}
            className={`chip text-xs ${sortBy === 'match' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
          >
            Compatibilitate
          </button>
          <button
            onClick={() => setSortBy('price')}
            className={`chip text-xs ${sortBy === 'price' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-50 dark:bg-navy-800'}`}
          >
            Preț
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
