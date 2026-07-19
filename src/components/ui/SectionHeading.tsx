import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  linkTo?: string;
  linkLabel?: string;
  center?: boolean;
}

export function SectionHeading({ eyebrow, title, subtitle, linkTo, linkLabel, center }: Props) {
  return (
    <div className={`mb-8 flex flex-wrap items-end justify-between gap-4 ${center ? 'flex-col text-center' : ''}`}>
      <div className={center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && (
          <span className="text-sm font-semibold uppercase tracking-wider text-turquoise-600 dark:text-turquoise-400">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-1 text-2xl font-bold sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-navy-500 dark:text-sand-200/70">{subtitle}</p>}
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="group flex items-center gap-1 text-sm font-semibold text-turquoise-600 dark:text-turquoise-400"
        >
          {linkLabel ?? 'Vezi toate'}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  );
}
