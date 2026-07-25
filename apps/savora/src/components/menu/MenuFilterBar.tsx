import { X } from 'lucide-react';
import { DIETARY_LABELS, PRICE_RANGES, type Dietary } from '@/data/menu';
import { cn } from '@/lib/utils';

export type MenuFilters = {
  dietary: Dietary[];
  priceRange: string | null;
  category: string | null;
};

const chipClasses = (active: boolean) =>
  cn(
    'text-xs uppercase tracking-widest px-3 py-1.5 border transition-colors whitespace-nowrap',
    active
      ? 'border-primary text-primary bg-primary/10'
      : 'border-white/10 text-foreground/60 hover:border-white/30 hover:text-foreground',
  );

export function MenuFilterBar({
  categories,
  filters,
  onChange,
}: {
  categories: string[];
  filters: MenuFilters;
  onChange: (filters: MenuFilters) => void;
}) {
  const toggleDietary = (d: Dietary) => {
    onChange({
      ...filters,
      dietary: filters.dietary.includes(d)
        ? filters.dietary.filter((x) => x !== d)
        : [...filters.dietary, d],
    });
  };

  const activeCount =
    filters.dietary.length + (filters.priceRange ? 1 : 0) + (filters.category ? 1 : 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            aria-pressed={filters.category === cat}
            className={chipClasses(filters.category === cat)}
            onClick={() =>
              onChange({ ...filters, category: filters.category === cat ? null : cat })
            }
          >
            {cat}
          </button>
        ))}
        <span className="w-px bg-white/10 mx-1" aria-hidden="true" />
        {(Object.keys(DIETARY_LABELS) as Dietary[]).map((d) => (
          <button
            key={d}
            type="button"
            aria-pressed={filters.dietary.includes(d)}
            className={chipClasses(filters.dietary.includes(d))}
            onClick={() => toggleDietary(d)}
          >
            {DIETARY_LABELS[d]}
          </button>
        ))}
        <span className="w-px bg-white/10 mx-1" aria-hidden="true" />
        {PRICE_RANGES.map((range) => (
          <button
            key={range.id}
            type="button"
            aria-pressed={filters.priceRange === range.id}
            className={chipClasses(filters.priceRange === range.id)}
            onClick={() =>
              onChange({
                ...filters,
                priceRange: filters.priceRange === range.id ? null : range.id,
              })
            }
          >
            {range.label}
          </button>
        ))}
      </div>

      {activeCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {filters.category && (
            <FilterChip
              label={filters.category}
              onRemove={() => onChange({ ...filters, category: null })}
            />
          )}
          {filters.dietary.map((d) => (
            <FilterChip
              key={d}
              label={DIETARY_LABELS[d]}
              onRemove={() => toggleDietary(d)}
            />
          ))}
          {filters.priceRange && (
            <FilterChip
              label={PRICE_RANGES.find((r) => r.id === filters.priceRange)?.label ?? ''}
              onRemove={() => onChange({ ...filters, priceRange: null })}
            />
          )}
          <button
            type="button"
            onClick={() => onChange({ dietary: [], priceRange: null, category: null })}
            className="text-xs uppercase tracking-widest text-foreground/40 hover:text-foreground transition-colors ml-1"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-2.5 py-1 border border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 transition-colors"
    >
      {label}
      <X size={12} aria-hidden="true" />
      <span className="sr-only">Remove {label} filter</span>
    </button>
  );
}
