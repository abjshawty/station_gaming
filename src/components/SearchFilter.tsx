import { Badge } from './ui/badge';
import { X } from 'lucide-react';

interface SearchFilterProps {
  activeFilters: {
    genres: string[];
    priceRange: string | null;
  };
  onGenreToggle: (genre: string) => void;
  onPriceRangeChange: (range: string | null) => void;
  onClearFilters: () => void;
}

const GENRES = ['RPG', 'Action', 'Racing', 'Puzzle', 'Fighting', 'Adventure', 'Arcade', 'Platformer', 'Shooter', 'Strategy'];
const PRICE_RANGES = [
  { label: 'Under $15', value: 'under-15' },
  { label: '$15 - $30', value: '15-30' },
  { label: '$30 - $50', value: '30-50' },
  { label: 'Over $50', value: 'over-50' },
];

export function SearchFilter({
  activeFilters,
  onGenreToggle,
  onPriceRangeChange,
  onClearFilters,
}: SearchFilterProps) {
  const hasActiveFilters = activeFilters.genres.length > 0 || activeFilters.priceRange !== null;

  return (
    <div className="py-8 px-6 border-b border-border">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h3>Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear All
            </button>
          )}
        </div>

        {/* Genre Filters */}
        <div className="mb-6">
          <h4 className="text-sm mb-3 text-muted-foreground">Genre</h4>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <Badge
                key={genre}
                onClick={() => onGenreToggle(genre)}
                className={`cursor-pointer transition-colors ${
                  activeFilters.genres.includes(genre)
                    ? 'bg-primary hover:bg-secondary'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {genre}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price Range Filters */}
        <div>
          <h4 className="text-sm mb-3 text-muted-foreground">Price Range</h4>
          <div className="flex flex-wrap gap-2">
            {PRICE_RANGES.map((range) => (
              <Badge
                key={range.value}
                onClick={() =>
                  onPriceRangeChange(
                    activeFilters.priceRange === range.value ? null : range.value
                  )
                }
                className={`cursor-pointer transition-colors ${
                  activeFilters.priceRange === range.value
                    ? 'bg-primary hover:bg-secondary'
                    : 'bg-muted hover:bg-muted/80 text-foreground'
                }`}
              >
                {range.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
