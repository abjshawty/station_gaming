import { useState, useMemo } from 'react';
import { CartProvider, Product } from './components/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductScroll } from './components/ProductScroll';
import { Footer } from './components/Footer';
import { ShoppingCartSheet } from './components/ShoppingCartSheet';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchFilter } from './components/SearchFilter';
import { Toaster } from './components/ui/sonner';

// Mock product data with category tags
const classicGames: Product[] = [
  {
    id: 1,
    title: "Legend Quest: Origins",
    price: 19.99,
    rating: 4.8,
    genre: "RPG",
    category: "Classic",
    image: "https://images.unsplash.com/photo-1592509314528-afd0c8241a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjbGFzc2ljfGVufDF8fHx8MTc2MDI3OTUxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Embark on an epic journey through mystical lands in this groundbreaking RPG that redefined the genre."
  },
  {
    id: 2,
    title: "Space Warriors Classic",
    price: 14.99,
    rating: 4.6,
    genre: "Action",
    category: "Classic",
    image: "https://images.unsplash.com/photo-1611138290962-2c550ffd4002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyfGVufDF8fHx8MTc2MDE4Nzg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Battle alien forces across the galaxy in this intense sci-fi action adventure."
  },
  {
    id: 3,
    title: "Puzzle Master Pro",
    price: 9.99,
    rating: 4.4,
    genre: "Puzzle",
    category: "Classic",
    image: "https://images.unsplash.com/photo-1709587797209-7f3015fc8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb25zb2xlfGVufDF8fHx8MTc2MDE2MDUyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Challenge your mind with hundreds of intricate puzzles that will test your logic and creativity."
  },
  {
    id: 4,
    title: "Racing Legends",
    price: 24.99,
    rating: 4.9,
    genre: "Racing",
    category: "Classic",
    image: "https://images.unsplash.com/photo-1759701547036-bf7d7b05cc52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nfGVufDF8fHx8MTc2MDE2MDUyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Feel the adrenaline rush as you race through iconic tracks in the most realistic racing simulator."
  },
  {
    id: 5,
    title: "Fighter's Glory",
    price: 29.99,
    rating: 4.7,
    genre: "Fighting",
    category: "Classic",
    image: "https://images.unsplash.com/photo-1592509314528-afd0c8241a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjbGFzc2ljfGVufDF8fHx8MTc2MDI3OTUxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Master legendary fighters and unleash devastating combos in the ultimate fighting game."
  },
  {
    id: 6,
    title: "Adventure Chronicles",
    price: 34.99,
    rating: 4.8,
    genre: "Adventure",
    category: "Classic",
    image: "https://images.unsplash.com/photo-1611138290962-2c550ffd4002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyfGVufDF8fHx8MTc2MDE4Nzg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Explore vast open worlds filled with mystery, danger, and untold treasures."
  }
];

const retroGames: Product[] = [
  {
    id: 7,
    title: "Pixel Warriors",
    price: 12.99,
    rating: 4.5,
    genre: "Arcade",
    category: "Retro",
    image: "https://images.unsplash.com/photo-1698273300787-f698a50bb250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWluZyUyMGFyY2FkZXxlbnwxfHx8fDE3NjAyMjcxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Relive the golden age of arcade gaming with this pixel-perfect retro masterpiece."
  },
  {
    id: 8,
    title: "8-Bit Adventure",
    price: 8.99,
    rating: 4.3,
    genre: "Platformer",
    category: "Retro",
    image: "https://images.unsplash.com/photo-1592509314528-afd0c8241a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjbGFzc2ljfGVufDF8fHx8MTc2MDI3OTUxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Jump, run, and explore in this nostalgic platformer that captures the spirit of the 8-bit era."
  },
  {
    id: 9,
    title: "Neon Racer",
    price: 15.99,
    rating: 4.7,
    genre: "Racing",
    category: "Retro",
    image: "https://images.unsplash.com/photo-1709587797209-7f3015fc8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb25zb2xlfGVufDF8fHx8MTc2MDE2MDUyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Speed through neon-lit cityscapes in this synthwave-inspired retro racing experience."
  },
  {
    id: 10,
    title: "Retro Blast",
    price: 10.99,
    rating: 4.6,
    genre: "Shooter",
    category: "Retro",
    image: "https://images.unsplash.com/photo-1611138290962-2c550ffd4002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyfGVufDF8fHx8MTc2MDE4Nzg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Blast through waves of enemies in this classic shoot 'em up that defines the genre."
  },
  {
    id: 11,
    title: "Arcade Mania",
    price: 11.99,
    rating: 4.4,
    genre: "Arcade",
    category: "Retro",
    image: "https://images.unsplash.com/photo-1698273300787-f698a50bb250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWluZyUyMGFyY2FkZXxlbnwxfHx8fDE3NjAyMjcxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "A collection of beloved arcade classics remastered for modern gaming."
  },
  {
    id: 12,
    title: "Classic Combat",
    price: 13.99,
    rating: 4.5,
    genre: "Fighting",
    category: "Retro",
    image: "https://images.unsplash.com/photo-1759701547036-bf7d7b05cc52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nfGVufDF8fHx8MTc2MDE2MDUyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Experience the fighting game that started it all with enhanced graphics and new modes."
  }
];

const deluxeGames: Product[] = [
  {
    id: 13,
    title: "Ultimate Edition: Legends",
    price: 59.99,
    rating: 4.9,
    genre: "RPG",
    category: "Deluxe",
    image: "https://images.unsplash.com/photo-1759701547036-bf7d7b05cc52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nfGVufDF8fHx8MTc2MDE2MDUyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "The complete RPG experience with all DLCs, expansions, and exclusive digital content."
  },
  {
    id: 14,
    title: "Premium War Collection",
    price: 79.99,
    rating: 4.8,
    genre: "Strategy",
    category: "Deluxe",
    image: "https://images.unsplash.com/photo-1592509314528-afd0c8241a04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjbGFzc2ljfGVufDF8fHx8MTc2MDI3OTUxOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Command armies and conquer nations in this comprehensive strategy collection."
  },
  {
    id: 15,
    title: "Elite Racing Bundle",
    price: 49.99,
    rating: 4.7,
    genre: "Racing",
    category: "Deluxe",
    image: "https://images.unsplash.com/photo-1709587797209-7f3015fc8d35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGdhbWUlMjBjb25zb2xlfGVufDF8fHx8MTc2MDE2MDUyNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "The ultimate racing package with premium cars, tracks, and season pass content."
  },
  {
    id: 16,
    title: "Deluxe Adventure Pack",
    price: 69.99,
    rating: 4.9,
    genre: "Adventure",
    category: "Deluxe",
    image: "https://images.unsplash.com/photo-1611138290962-2c550ffd4002?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyfGVufDF8fHx8MTc2MDE4Nzg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "An adventure bundle packed with extra content, soundtrack, and artbook."
  },
  {
    id: 17,
    title: "Collector's Edition: Heroes",
    price: 89.99,
    rating: 5.0,
    genre: "Action",
    category: "Deluxe",
    image: "https://images.unsplash.com/photo-1698273300787-f698a50bb250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRybyUyMGdhbWluZyUyMGFyY2FkZXxlbnwxfHx8fDE3NjAyMjcxMjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "The definitive collector's edition featuring exclusive heroes and premium bonuses."
  },
  {
    id: 18,
    title: "Platinum Fighter Bundle",
    price: 54.99,
    rating: 4.8,
    genre: "Fighting",
    category: "Deluxe",
    image: "https://images.unsplash.com/photo-1759701547036-bf7d7b05cc52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nfGVufDF8fHx8MTc2MDE2MDUyNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    description: "Premium fighting game bundle with all characters, stages, and cosmetic items."
  }
];

const allGames = [...classicGames, ...retroGames, ...deluxeGames];

function AppContent() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{
    genres: string[];
    priceRange: string | null;
  }>({
    genres: [],
    priceRange: null,
  });

  // Filter products based on search and filters
  const filteredGames = useMemo(() => {
    let filtered = allGames;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Genre filter
    if (filters.genres.length > 0) {
      filtered = filtered.filter((game) =>
        filters.genres.includes(game.genre)
      );
    }

    // Price filter
    if (filters.priceRange) {
      filtered = filtered.filter((game) => {
        switch (filters.priceRange) {
          case 'under-15':
            return game.price < 15;
          case '15-30':
            return game.price >= 15 && game.price <= 30;
          case '30-50':
            return game.price > 30 && game.price <= 50;
          case 'over-50':
            return game.price > 50;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [searchQuery, filters]);

  const filteredClassic = filteredGames.filter((g) => g.category === 'Classic');
  const filteredRetro = filteredGames.filter((g) => g.category === 'Retro');
  const filteredDeluxe = filteredGames.filter((g) => g.category === 'Deluxe');

  const handleGenreToggle = (genre: string) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const handlePriceRangeChange = (range: string | null) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: range,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      genres: [],
      priceRange: null,
    });
    setSearchQuery('');
  };

  const hasActiveFilters = searchQuery || filters.genres.length > 0 || filters.priceRange !== null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        onCartOpen={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        searchQuery={searchQuery}
      />
      <main>
        <Hero />
        
        {/* Search and Filter Section */}
        <SearchFilter
          activeFilters={filters}
          onGenreToggle={handleGenreToggle}
          onPriceRangeChange={handlePriceRangeChange}
          onClearFilters={handleClearFilters}
        />

        {/* Product Sections */}
        {hasActiveFilters ? (
          <div className="py-12">
            {filteredGames.length === 0 ? (
              <div className="container mx-auto px-6 text-center py-20">
                <h3 className="mb-2">No games found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters or search query
                </p>
                <button
                  onClick={handleClearFilters}
                  className="text-[#0072CE] hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <>
                {filteredClassic.length > 0 && (
                  <ProductScroll
                    category="Classic"
                    products={filteredClassic}
                    id="classic"
                    onProductClick={setSelectedProduct}
                  />
                )}
                {filteredRetro.length > 0 && (
                  <ProductScroll
                    category="Retro"
                    products={filteredRetro}
                    id="retro"
                    onProductClick={setSelectedProduct}
                  />
                )}
                {filteredDeluxe.length > 0 && (
                  <ProductScroll
                    category="Deluxe"
                    products={filteredDeluxe}
                    id="deluxe"
                    onProductClick={setSelectedProduct}
                  />
                )}
              </>
            )}
          </div>
        ) : (
          <>
            <ProductScroll
              category="Classic"
              products={classicGames}
              id="classic"
              onProductClick={setSelectedProduct}
            />
            <ProductScroll
              category="Retro"
              products={retroGames}
              id="retro"
              onProductClick={setSelectedProduct}
            />
            <ProductScroll
              category="Deluxe"
              products={deluxeGames}
              id="deluxe"
              onProductClick={setSelectedProduct}
            />
          </>
        )}
      </main>
      <Footer />
      
      {/* Shopping Cart Sheet */}
      <ShoppingCartSheet
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
      
      {/* Toast Notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
