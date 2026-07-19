import { useMemo, useState } from 'react';
import { Luggage, Check } from 'lucide-react';
import { destinations } from '@/data/destinations';
import { generatePackingList } from '@/lib/packing';

export function PackingListTool() {
  const [destId, setDestId] = useState(destinations[0].id);
  const [days, setDays] = useState(7);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const dest = destinations.find((d) => d.id === destId)!;
  const list = useMemo(() => generatePackingList(dest, days), [dest, days]);
  const total = list.reduce((n, c) => n + c.items.length, 0);
  const done = checked.size;

  const toggle = (item: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(item) ? next.delete(item) : next.add(item);
      return next;
    });
  };

  return (
    <div className="card-surface p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-turquoise-50 text-turquoise-600 dark:bg-navy-800">
          <Luggage size={22} />
        </span>
        <div>
          <h3 className="text-xl font-semibold">Listă de bagaje</h3>
          <p className="text-sm text-navy-500 dark:text-sand-200/70">
            {done}/{total} pregătite
          </p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Destinație</span>
          <select value={destId} onChange={(e) => setDestId(e.target.value)} className="input-field py-2">
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}, {d.country}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Număr de zile: {days}</span>
          <input
            type="range"
            min={1}
            max={21}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-3 w-full accent-turquoise-500"
          />
        </label>
      </div>

      {/* Progres */}
      <div className="mb-5 h-2 w-full overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800">
        <div
          className="h-full rounded-full bg-turquoise-500 transition-all"
          style={{ width: `${total ? (done / total) * 100 : 0}%` }}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {list.map((cat) => (
          <div key={cat.category}>
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
              <span>{cat.icon}</span> {cat.category}
            </h4>
            <ul className="space-y-1.5">
              {cat.items.map((item) => {
                const key = `${cat.category}:${item}`;
                const isChecked = checked.has(key);
                return (
                  <li key={key}>
                    <button
                      onClick={() => toggle(key)}
                      className="flex w-full items-center gap-2 text-left text-sm"
                    >
                      <span
                        className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition ${
                          isChecked
                            ? 'border-turquoise-500 bg-turquoise-500 text-navy-950'
                            : 'border-navy-300 dark:border-navy-600'
                        }`}
                      >
                        {isChecked && <Check size={13} strokeWidth={3} />}
                      </span>
                      <span
                        className={
                          isChecked ? 'text-navy-400 line-through' : 'text-navy-700 dark:text-sand-200'
                        }
                      >
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
