import { destinations } from '@/data/destinations';
import { DestinationCard } from '@/components/destinations/DestinationCard';
import { SectionHeading } from '@/components/ui/SectionHeading';
import type { TripType } from '@/types';

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  filterTag?: TripType;
  ids?: string[];
  limit?: number;
  tinted?: boolean;
}

export function CategorySection({
  eyebrow,
  title,
  subtitle,
  filterTag,
  ids,
  limit = 4,
  tinted,
}: Props) {
  let list = destinations;
  if (ids) list = destinations.filter((d) => ids.includes(d.id));
  else if (filterTag) list = destinations.filter((d) => d.tags.includes(filterTag));
  list = list.slice(0, limit);

  if (!list.length) return null;

  const linkTo = filterTag ? `/orase?type=${filterTag}` : '/orase';

  return (
    <section className={tinted ? 'bg-sand-100/60 py-14 dark:bg-navy-900/40' : 'container-page py-14'}>
      <div className={tinted ? 'container-page' : ''}>
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          linkTo={linkTo}
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {list.map((d) => (
            <DestinationCard key={d.id} destination={d} />
          ))}
        </div>
      </div>
    </section>
  );
}
