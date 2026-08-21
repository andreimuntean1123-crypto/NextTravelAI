import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, Sparkles, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { questions, totalSteps } from '@/data/questionnaire';
import type { TranslationKey } from '@/i18n/translations';
import type { AnswerValue, Question, TravelPreferences } from '@/types';

interface Props {
  onClose: () => void;
}

export function Questionnaire({ onClose }: Props) {
  const { preferences, savePreferences, t, tf } = useApp();
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<TravelPreferences>({ ...preferences });

  const question = questions[index];
  const progress = ((index + 1) / totalSteps) * 100;
  const isLast = index === totalSteps - 1;

  const current = answers[question.id];

  const setAnswer = (value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const toggleMulti = (value: string) => {
    const arr = Array.isArray(current) ? [...(current as string[])] : [];
    setAnswer(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const canContinue = (): boolean => {
    if (question.optional) return true;
    if (question.type === 'multi') return Array.isArray(current) && current.length > 0;
    if (question.type === 'number') return current !== undefined && Number(current) > 0;
    return current !== undefined && String(current).trim().length > 0;
  };

  const next = () => {
    if (isLast) {
      savePreferences(answers);
      onClose();
      navigate('/rezultate');
      return;
    }
    setIndex((i) => Math.min(i + 1, totalSteps - 1));
  };

  const prev = () => {
    if (index === 0) onClose();
    else setIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-sand-50 dark:bg-navy-950">
      {/* Header + progress */}
      <div className="border-b border-navy-100 bg-white dark:border-navy-800 dark:bg-navy-900">
        <div className="container-page flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-turquoise-400 to-navy-700 text-white">
              <Sparkles size={16} />
            </span>
            <span className="font-display font-semibold">{t('questionnaire.header')}</span>
          </div>
          <div className="text-sm font-medium text-navy-500 dark:text-sand-200/70">
            {tf('questionnaire.step', { current: index + 1, total: totalSteps })}
          </div>
          <button
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full text-navy-500 hover:bg-navy-100 dark:hover:bg-navy-800"
            aria-label={t('questionnaire.close')}
          >
            <X size={20} />
          </button>
        </div>
        <div className="h-1.5 w-full bg-navy-100 dark:bg-navy-800">
          <div
            className="h-full rounded-r-full bg-gradient-to-r from-turquoise-400 to-turquoise-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto">
        <div className="container-page max-w-3xl py-10">
          <div key={question.id} className="animate-fade-in">
            <h2 className="text-2xl font-semibold sm:text-3xl">{t(question.title as TranslationKey)}</h2>
            {question.subtitle && (
              <p className="mt-2 text-navy-500 dark:text-sand-200/70">{t(question.subtitle as TranslationKey)}</p>
            )}
            {question.optional && (
              <p className="mt-1 text-sm text-navy-400">{t('questionnaire.optional')}</p>
            )}

            <div className="mt-8">
              <QuestionInput
                question={question}
                current={current}
                onSet={setAnswer}
                onToggleMulti={toggleMulti}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="border-t border-navy-100 bg-white dark:border-navy-800 dark:bg-navy-900">
        <div className="container-page flex items-center justify-between gap-4 py-4">
          <button onClick={prev} className="btn-ghost px-4 py-2.5 text-sm">
            <ArrowLeft size={16} /> {t('questionnaire.back')}
          </button>
          <div className="flex items-center gap-3">
            {question.optional && !canContinueValue(current) && (
              <button onClick={next} className="btn-outline px-4 py-2.5 text-sm">
                {t('questionnaire.skip')}
              </button>
            )}
            <button
              onClick={next}
              disabled={!canContinue()}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              {isLast ? (
                <>
                  {t('questionnaire.seeRecommendations')} <Check size={16} />
                </>
              ) : (
                <>
                  {t('questionnaire.continueBtn')} <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function canContinueValue(v: AnswerValue | undefined): boolean {
  if (v === undefined) return false;
  if (Array.isArray(v)) return v.length > 0;
  return String(v).trim().length > 0;
}

function QuestionInput({
  question,
  current,
  onSet,
  onToggleMulti,
}: {
  question: Question;
  current: AnswerValue | undefined;
  onSet: (v: AnswerValue) => void;
  onToggleMulti: (v: string) => void;
}) {
  const { t } = useApp();

  if (question.type === 'text') {
    return (
      <input
        autoFocus
        value={(current as string) ?? ''}
        onChange={(e) => onSet(e.target.value)}
        placeholder={question.placeholder ? t(question.placeholder as TranslationKey) : undefined}
        className="input-field text-lg"
      />
    );
  }

  if (question.type === 'number') {
    return (
      <div className="flex items-center gap-3">
        <input
          autoFocus
          type="number"
          min={question.min}
          max={question.max}
          value={(current as number) ?? ''}
          onChange={(e) => onSet(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder={question.placeholder ? t(question.placeholder as TranslationKey) : undefined}
          className="input-field max-w-xs text-lg"
        />
        {question.unit && (
          <span className="text-lg font-medium text-navy-500 dark:text-sand-200/70">
            {t(question.unit as TranslationKey)}
          </span>
        )}
      </div>
    );
  }

  // single / multi → carduri
  const isMulti = question.type === 'multi';
  const selected = (v: string) =>
    isMulti
      ? Array.isArray(current) && (current as string[]).includes(v)
      : current === v;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {question.options?.map((opt) => (
        <button
          key={opt.value}
          onClick={() => (isMulti ? onToggleMulti(opt.value) : onSet(opt.value))}
          className={`group relative flex flex-col items-start gap-2 rounded-2xl border-2 p-4 text-left transition-all ${
            selected(opt.value)
              ? 'border-turquoise-500 bg-turquoise-50 shadow-glow dark:bg-navy-800'
              : 'border-navy-100 bg-white hover:border-turquoise-300 dark:border-navy-800 dark:bg-navy-900'
          }`}
        >
          {opt.icon && <span className="text-2xl">{opt.icon}</span>}
          <span className="text-sm font-medium">{t(opt.label as TranslationKey)}</span>
          {opt.description && (
            <span className="text-xs text-navy-400">{t(opt.description as TranslationKey)}</span>
          )}
          {selected(opt.value) && (
            <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-turquoise-500 text-navy-950">
              <Check size={12} strokeWidth={3} />
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
