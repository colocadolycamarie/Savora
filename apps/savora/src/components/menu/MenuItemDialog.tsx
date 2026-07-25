import { Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { DIETARY_LABELS, type MenuItem } from '@/data/menu';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';

export function MenuItemDialog({
  item,
  onOpenChange,
}: {
  item: MenuItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <Dialog open={!!item} onOpenChange={onOpenChange}>
      {item && (
        <DialogContent className="max-w-2xl p-0 border-white/10 bg-card overflow-hidden rounded-none">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            <div className="relative aspect-[4/5] sm:aspect-auto">
              <img
                src={item.image}
                alt={item.title}
                className={cn(
                  'w-full h-full object-cover',
                  item.outOfStock && 'grayscale opacity-60',
                )}
              />
              {item.outOfStock && (
                <span className="absolute top-4 left-4 text-xs uppercase tracking-[0.2em] border border-white/30 px-3 py-1.5 bg-background/80">
                  Sold Out Tonight
                </span>
              )}
            </div>
            <div className="p-8 flex flex-col">
              <DialogTitle className="font-serif text-3xl font-normal tracking-tight mb-2">
                {item.title}
              </DialogTitle>
              <DialogDescription className="font-sans text-sm text-foreground/60 sr-only">
                {item.desc}
              </DialogDescription>
              <p className="font-sans text-lg text-foreground/90 mb-4">
                ₱{item.price.toLocaleString()}
              </p>
              {item.dietary.length > 0 && (
                <p className="text-[10px] uppercase tracking-widest text-primary/70 mb-4">
                  {item.dietary.map((d) => DIETARY_LABELS[d]).join(' · ')}
                </p>
              )}
              <p className="text-foreground/70 font-light leading-relaxed text-sm flex-1">
                {item.longDesc}
              </p>

              <button
                type="button"
                onClick={() => toggleFavorite(item.id)}
                aria-pressed={isFavorite(item.id)}
                className="mt-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] border border-white/20 px-5 py-3 hover:bg-white/5 transition-colors self-start"
              >
                <Heart
                  size={16}
                  className={isFavorite(item.id) ? 'fill-primary text-primary' : ''}
                />
                {isFavorite(item.id) ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>

              {item.outOfStock && (
                <p className="text-xs text-warning mt-4">
                  This dish has sold out for tonight's service — check back tomorrow.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
