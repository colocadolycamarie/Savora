import { useMemo, useState } from 'react';
import { Search, X, Heart } from 'lucide-react';
import { Reveal } from '@/components/common/Reveal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MenuItemCard } from '@/components/menu/MenuItemCard';
import { MenuItemDialog } from '@/components/menu/MenuItemDialog';
import { MenuFilterBar, type MenuFilters } from '@/components/menu/MenuFilterBar';
import {
  BEVERAGE_MENU,
  MENU_CATEGORIES,
  MENU_ITEMS,
  PRICE_RANGES,
  TASTING_MENU,
  type MenuItem,
} from '@/data/menu';
import { closestMatch } from '@/lib/fuzzy';
import { usePageTitle } from '@/hooks/use-page-title';
import { useFavorites } from '@/context/FavoritesContext';
import { cn } from '@/lib/utils';

const EMPTY_FILTERS: MenuFilters = { dietary: [], priceRange: null, category: null };

export default function MenuPage() {
  usePageTitle('Menu');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<MenuFilters>(EMPTY_FILTERS);
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const { favorites, isFavorite } = useFavorites();

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MENU_ITEMS.filter((item) => {
      const matchesQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.desc.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      const matchesCategory = !filters.category || item.category === filters.category;
      const matchesDietary =
        filters.dietary.length === 0 ||
        filters.dietary.every((d) => item.dietary.includes(d));
      const matchesPrice =
        !filters.priceRange ||
        PRICE_RANGES.find((r) => r.id === filters.priceRange)?.test(item.price);
      const matchesFavorites = !favoritesOnly || isFavorite(item.id);
      return matchesQuery && matchesCategory && matchesDietary && matchesPrice && matchesFavorites;
    });
  }, [query, filters, favoritesOnly, isFavorite]);

  const groupedByCategory = useMemo(() => {
    const groups = new Map<string, MenuItem[]>();
    for (const item of filteredItems) {
      const list = groups.get(item.category) ?? [];
      list.push(item);
      groups.set(item.category, list);
    }
    return groups;
  }, [filteredItems]);

  const suggestion = useMemo(() => {
    if (filteredItems.length > 0 || !query.trim()) return undefined;
    return closestMatch(
      query,
      MENU_ITEMS.map((i) => i.title),
    );
  }, [filteredItems, query]);

  const hasActiveRefinement =
    query.trim().length > 0 ||
    !!filters.category ||
    filters.dietary.length > 0 ||
    !!filters.priceRange ||
    favoritesOnly;

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="container mx-auto px-6 md:px-12 max-w-5xl">
        <Reveal>
          <div className="text-center mb-16">
            <h1 className="font-serif text-5xl md:text-7xl mb-6">The Menu</h1>
            <p className="text-foreground/60 font-light max-w-lg mx-auto">
              Rooted in tradition, refined by technique. Our menu evolves with the
              micro-seasons of the Philippines.
            </p>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <Tabs defaultValue="tasting" className="w-full">
            <div className="flex justify-center mb-16 border-b border-white/10 pb-4">
              <TabsList className="bg-transparent border-none gap-8 h-auto p-0">
                <TabsTrigger
                  value="tasting"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-sm uppercase tracking-widest px-0 pb-2 border-b-2 border-transparent data-[state=active]:border-primary rounded-none font-sans text-foreground/50"
                >
                  Tasting Menu
                </TabsTrigger>
                <TabsTrigger
                  value="alacarte"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-sm uppercase tracking-widest px-0 pb-2 border-b-2 border-transparent data-[state=active]:border-primary rounded-none font-sans text-foreground/50"
                >
                  A La Carte
                </TabsTrigger>
                <TabsTrigger
                  value="beverage"
                  className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary text-sm uppercase tracking-widest px-0 pb-2 border-b-2 border-transparent data-[state=active]:border-primary rounded-none font-sans text-foreground/50"
                >
                  Beverage
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tasting Menu */}
            <TabsContent value="tasting" className="animate-in fade-in duration-700">
              <div className="text-center mb-16">
                <p className="text-sm uppercase tracking-[0.2em] text-primary mb-2">
                  10 Courses
                </p>
                <p className="font-serif text-2xl">₱6,500 per guest</p>
              </div>

              <div className="space-y-16">
                {TASTING_MENU.map((section) => (
                  <div key={section.name} className="relative">
                    <h3 className="text-xs uppercase tracking-[0.3em] text-foreground/40 mb-8 text-center">
                      {section.name}
                    </h3>
                    <div className="space-y-8">
                      {section.items.map((item) => (
                        <div key={item.title} className="text-center group">
                          <h4 className="font-serif text-2xl text-foreground mb-2">
                            {item.title}
                          </h4>
                          <p className="text-foreground/60 font-light text-sm italic">
                            {item.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* A La Carte */}
            <TabsContent value="alacarte" className="animate-in fade-in duration-700">
              <div className="mb-8 max-w-md mx-auto relative">
                <Search
                  size={16}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-foreground/40"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the menu…"
                  aria-label="Search the menu"
                  className="w-full bg-transparent border-b border-white/20 pl-6 pb-2 text-base font-sans focus:outline-none focus:border-primary transition-colors placeholder:text-foreground/30"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear search"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-foreground p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="mb-12 flex items-center justify-center gap-3">
                <MenuFilterBar
                  categories={MENU_CATEGORIES}
                  filters={filters}
                  onChange={setFilters}
                />
                <button
                  type="button"
                  onClick={() => setFavoritesOnly((v) => !v)}
                  aria-pressed={favoritesOnly}
                  title={favoritesOnly ? 'Showing favorites only' : 'Show favorites only'}
                  className={cn(
                    'relative inline-flex items-center justify-center h-9 w-9 border shrink-0 transition-colors',
                    favoritesOnly
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-white/20 text-foreground/70 hover:bg-white/5',
                  )}
                >
                  <Heart size={16} className={favoritesOnly ? 'fill-primary text-primary' : ''} />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center h-4 min-w-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] leading-none">
                      {favorites.length}
                    </span>
                  )}
                </button>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-20 max-w-md mx-auto">
                  {favoritesOnly && favorites.length === 0 ? (
                    <>
                      <p className="font-serif text-2xl mb-3">No favorites yet</p>
                      <p className="text-foreground/60 font-light mb-4">
                        Tap the heart on any dish to save it here.
                      </p>
                    </>
                  ) : (
                    <p className="font-serif text-2xl mb-3">No dishes match these filters</p>
                  )}
                  {suggestion && (
                    <p className="text-foreground/60 font-light mb-4">
                      Did you mean{' '}
                      <button
                        type="button"
                        onClick={() => setQuery(suggestion)}
                        className="text-primary underline underline-offset-4 hover:no-underline"
                      >
                        {suggestion}
                      </button>
                      ?
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setFilters(EMPTY_FILTERS);
                      setFavoritesOnly(false);
                    }}
                    className="text-xs uppercase tracking-widest border border-white/20 px-6 py-3 hover:bg-white/5 transition-colors"
                  >
                    {hasActiveRefinement ? 'Clear search & filters' : 'Browse the menu'}
                  </button>
                </div>
              ) : (
                <div className="space-y-20">
                  {Array.from(groupedByCategory.entries()).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-serif text-3xl mb-8 border-b border-white/5 pb-4">
                        {category}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-12">
                        {items.map((item) => (
                          <MenuItemCard key={item.id} item={item} onView={setActiveItem} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Beverages */}
            <TabsContent value="beverage" className="animate-in fade-in duration-700">
              <div className="space-y-20">
                {BEVERAGE_MENU.map((category) => (
                  <div key={category.category}>
                    <h3 className="font-serif text-3xl mb-8 border-b border-white/5 pb-4">
                      {category.category}
                    </h3>
                    <div className="space-y-8">
                      {category.items.map((item) => (
                        <div
                          key={item.title}
                          className="flex justify-between items-baseline group"
                        >
                          <div className="max-w-[70%]">
                            <h4 className="font-serif text-xl text-foreground mb-1">
                              {item.title}
                            </h4>
                            <p className="text-foreground/60 font-light text-sm">
                              {item.desc}
                            </p>
                          </div>
                          <span className="font-serif text-lg text-foreground/90">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </Reveal>
      </div>

      <MenuItemDialog item={activeItem} onOpenChange={(open) => !open && setActiveItem(null)} />
    </div>
  );
}
