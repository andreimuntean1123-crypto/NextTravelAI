import { Star } from 'lucide-react';

export function StarRating({ value, size = 14 }: { value: number; size?: number }) {
  const full = Math.round(value);
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${value} din 5 stele`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < full ? 'fill-gold-400 text-gold-400' : 'text-navy-300 dark:text-navy-600'}
        />
      ))}
    </span>
  );
}
