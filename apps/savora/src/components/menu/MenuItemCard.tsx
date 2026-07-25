import { Heart } from 'lucide-react';
import { DIETARY_LABELS, type MenuItem } from '@/data/menu';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export function MenuItemCard({
  item,
  onView,
}: {
  item: MenuItem;
  onView: (item: MenuItem) => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(item.id);
  const { toast } = useToast();

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(item.id);
    toast({
      description: favorited
        ? `Removed ${item.title} from favorites.`
        : `Saved ${item.title} to favorites.`,
    });
  };

  return (
    <div className="group text-left w-full">
      <button
        type="button"
        onClick={() => onView(item)}
        className="relative block w-full aspect-[4/5] overflow-hidden mb-4 bg-card"
        aria-label={`View details for ${item.title}`}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className={cn(
            'w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]',
            item.outOfStock && 'grayscale opacity-50',
          )}
        />
        {item.outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/40">
            <span className="text-xs uppercase tracking-[0.2em] border border-white/30 px-4 py-2 bg-background/80">
              Sold Out Tonight
            </span>
          </span>
        )}
        <span
          role="button"
          tabIndex={0}
          onClick={handleFavorite}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleFavorite(e as unknown as React.MouseEvent);
            }
          }}
          aria-pressed={favorited}
          aria-label={favorited ? `Remove ${item.title} from favorites` : `Save ${item.title} to favorites`}
          className="absolute top-3 right-3 h-11 w-11 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-sm hover:bg-background/80 transition-colors"
        >
          <Heart
            size={18}
            className={favorited ? 'fill-primary text-primary' : 'text-foreground'}
          />
        </span>
      </button>

      <button type="button" onClick={() => onView(item)} className="w-full text-left">
        <div className="flex justify-between items-baseline gap-3">
          <h4 className="font-serif text-xl text-foreground">{item.title}</h4>
          <span className="font-sans text-sm text-foreground/90 shrink-0">
            ₱{item.price.toLocaleString()}
          </span>
        </div>
        <p className="text-foreground/60 font-light text-sm mt-1">{item.desc}</p>
        {item.dietary.length > 0 && (
          <p className="text-[10px] uppercase tracking-widest text-primary/70 mt-2">
            {item.dietary.map((d) => DIETARY_LABELS[d]).join(' · ')}
          </p>
        )}
      </button>
    </div>
  );
}
