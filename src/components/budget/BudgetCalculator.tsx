import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Wallet, Save, Check } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatMoney } from '@/lib/format';
import type { BudgetBreakdown } from '@/types';
import type { TranslationKey } from '@/i18n/translations';

const CATEGORY_KEYS: { key: keyof BudgetBreakdown; labelKey: TranslationKey; color: string }[] = [
  { key: 'transport', labelKey: 'budget.category.transport', color: '#243a5e' },
  { key: 'accommodation', labelKey: 'budget.category.accommodation', color: '#06c3ae' },
  { key: 'food', labelKey: 'budget.category.food', color: '#d4a94a' },
  { key: 'activities', labelKey: 'budget.category.activities', color: '#4f6a99' },
  { key: 'localTransport', labelKey: 'budget.category.localTransport', color: '#52f5dc' },
  { key: 'shopping', labelKey: 'budget.category.shopping', color: '#e6c374' },
  { key: 'emergency', labelKey: 'budget.category.emergency', color: '#7d94ba' },
];

interface Props {
  initial?: BudgetBreakdown;
  days?: number;
  people?: number;
  label?: string;
}

const emptyBudget: BudgetBreakdown = {
  transport: 600,
  accommodation: 700,
  food: 400,
  activities: 300,
  localTransport: 120,
  shopping: 150,
  emergency: 180,
};

export function BudgetCalculator({ initial, days = 7, people = 2, label }: Props) {
  const { currency, saveBudget, t, tf } = useApp();
  const CATEGORIES = CATEGORY_KEYS.map((c) => ({ ...c, label: t(c.labelKey) }));
  const resolvedLabel = label ?? t('budget.defaultLabel');
  const [budget, setBudget] = useState<BudgetBreakdown>(initial ?? emptyBudget);
  const [totalBudget, setTotalBudget] = useState<number>(
    Object.values(initial ?? emptyBudget).reduce((a, b) => a + b, 0) + 500,
  );
  const [saved, setSaved] = useState(false);

  const total = useMemo(() => Object.values(budget).reduce((a, b) => a + b, 0), [budget]);
  const remaining = totalBudget - total;
  const perPerson = total / Math.max(people, 1);
  const perDay = total / Math.max(days, 1);

  const chartData = CATEGORIES.map((c) => ({
    name: c.label,
    value: budget[c.key],
    color: c.color,
  })).filter((d) => d.value > 0);

  const update = (key: keyof BudgetBreakdown, value: number) => {
    setBudget((prev) => ({ ...prev, [key]: Math.max(0, value) }));
    setSaved(false);
  };

  const handleSave = () => {
    saveBudget({
      id: `budget-${Date.now()}`,
      label: resolvedLabel,
      total,
      people,
      days,
      breakdown: budget,
      createdAt: Date.now(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="card-surface p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-turquoise-50 text-turquoise-600 dark:bg-navy-800">
          <Wallet size={22} />
        </span>
        <div>
          <h3 className="text-xl font-semibold">{t('budget.title')}</h3>
          <p className="text-sm text-navy-500 dark:text-sand-200/70">
            {tf('budget.subtitle', { days, people })}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Sliders */}
        <div className="space-y-4">
          <div className="rounded-xl bg-navy-50 p-4 dark:bg-navy-800">
            <label className="mb-2 flex items-center justify-between text-sm font-medium">
              <span>{t('budget.totalAvailable')}</span>
              <span className="text-turquoise-600 dark:text-turquoise-300">
                {formatMoney(totalBudget, currency)}
              </span>
            </label>
            <input
              type="range"
              min={500}
              max={15000}
              step={100}
              value={totalBudget}
              onChange={(e) => setTotalBudget(Number(e.target.value))}
              className="w-full accent-turquoise-500"
            />
          </div>

          {CATEGORIES.map((c) => (
            <div key={c.key}>
              <label className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </span>
                <span className="font-medium">{formatMoney(budget[c.key], currency)}</span>
              </label>
              <input
                type="range"
                min={0}
                max={5000}
                step={20}
                value={budget[c.key]}
                onChange={(e) => update(c.key, Number(e.target.value))}
                className="w-full accent-turquoise-500"
              />
            </div>
          ))}
        </div>

        {/* Chart + totals */}
        <div className="flex flex-col">
          <div className="relative h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={90}
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatMoney(value, currency)}
                  contentStyle={{ borderRadius: 12, border: 'none', fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs text-navy-400">{t('budget.total')}</span>
              <span className="text-xl font-bold">{formatMoney(total, currency)}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <Stat label={t('budget.costTotal')} value={formatMoney(total, currency)} />
            <Stat label={t('budget.perPerson')} value={formatMoney(perPerson, currency)} />
            <Stat label={t('budget.perDay')} value={formatMoney(perDay, currency)} />
            <Stat
              label={t('budget.remaining')}
              value={formatMoney(remaining, currency)}
              tone={remaining < 0 ? 'danger' : 'good'}
            />
          </div>

          <button onClick={handleSave} className="btn-navy mt-4 w-full py-2.5 text-sm">
            {saved ? (
              <>
                <Check size={16} /> {t('budget.saved')}
              </>
            ) : (
              <>
                <Save size={16} /> {t('budget.save')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  tone?: 'neutral' | 'good' | 'danger';
}) {
  const toneClass =
    tone === 'danger'
      ? 'text-red-500'
      : tone === 'good'
        ? 'text-turquoise-600 dark:text-turquoise-300'
        : 'text-navy-800 dark:text-sand-100';
  return (
    <div className="rounded-xl border border-navy-100 p-3 dark:border-navy-800">
      <p className="text-xs text-navy-400">{label}</p>
      <p className={`text-base font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}
