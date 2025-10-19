import { useState, useMemo, useEffect } from 'react';
import { CartProvider, Product } from './components/CartContext';
import { AuthProvider, useAuth } from './components/AuthContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductScroll } from './components/ProductScroll';
import { Footer } from './components/Footer';
import { ShoppingCartSheet } from './components/ShoppingCartSheet';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SearchFilter } from './components/SearchFilter';
import { LoginModal } from './components/LoginModal';
import { Toaster } from './components/ui/sonner';
import { authenticatedFetch } from './utils/api';
import { API_BASE_URL } from './utils/api';
function AppContent () {
  const { isAuthenticated } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    genres: string[];
    priceRange: string | null;
  }>({
    genres: [],
    priceRange: null,
  });

  // Load products after authentication
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoading(true);
      authenticatedFetch(`${API_BASE_URL}/product`)
        .then(res => res.json())
        .then(data => {
          setProducts(data.data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Failed to load products:', error);
          setIsLoading(false);
        });
    }
  }, [isAuthenticated]);

  const standardGames = products.filter((product: Product) => product.category === "Standard");
  const deluxeGames = products.filter((product: Product) => product.category === "Deluxe");
  const premiumGames = products.filter((product: Product) => product.category === "Premium");
  const allGames = [...standardGames, ...premiumGames, ...deluxeGames];

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
  }, [searchQuery, filters, allGames]);

  const filteredStandard = filteredGames.filter((g) => g.category === 'Standard');
  const filteredPremium = filteredGames.filter((g) => g.category === 'Premium');
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
    <>
      {/* Login Modal */}
      <LoginModal open={!isAuthenticated} />

      {/* Main Content with blur effect when not authenticated */}
      <div className={`min-h-screen bg-background text-foreground transition-all duration-300 ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
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

          {/* Loading State */}
          {isLoading && isAuthenticated ? (
            <div className="container mx-auto px-6 text-center py-20">
              <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            </div>
          ) : (
            <>
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
                      {filteredStandard.length > 0 && (
                        <ProductScroll
                          category="Standard"
                          products={filteredStandard}
                          id="standard"
                          onProductClick={setSelectedProduct}
                        />
                      )}
                      {filteredPremium.length > 0 && (
                        <ProductScroll
                          category="Premium"
                          products={filteredPremium}
                          id="premium"
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
                    category="Standard"
                    products={standardGames}
                    id="standard"
                    onProductClick={setSelectedProduct}
                  />
                  <ProductScroll
                    category="Premium"
                    products={premiumGames}
                    id="premium"
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
    </>
  );
}

export default function App () {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
