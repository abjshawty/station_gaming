import { ShoppingCart, Search, Gamepad2, X } from 'lucide-react';
import { useCart } from './CartContext';
import { Input } from './ui/input';
import { useState } from 'react';

interface HeaderProps {
  onCartOpen: () => void;
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Header ({ onCartOpen, onSearch, searchQuery }: HeaderProps) {
  const { getCartCount } = useCart();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Gamepad2 className="w-8 h-8 text-primary" /> */}
            <img src="https://ik.imagekit.io/abjshawty/logo.svg?updatedAt=1760845285737" alt="logo" className="w-8 h-8" />
            <h1 className="text-2xl">Soul Gaming</h1>
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un jeu..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 bg-muted/50 border-border focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            <a href="#standard" className="hover:text-primary transition-colors">Standard</a>
            <a href="#premium" className="hover:text-primary transition-colors">Premium</a>
            <a href="#deluxe" className="hover:text-primary transition-colors">Deluxe</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={onCartOpen}
              className="p-2 hover:bg-muted rounded-lg transition-colors relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {showSearch && (
          <div className="md:hidden mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un jeu..."
                value={searchQuery}
                onChange={(e) => onSearch(e.target.value)}
                className="pl-10 bg-muted/50 border-border focus:border-primary"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
