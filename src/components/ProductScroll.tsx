import { ImageWithFallback } from './figma/ImageWithFallback';
import { Star, ShoppingCart } from 'lucide-react';
import { Product, useCart } from './CartContext';
import { toast } from 'sonner';

interface ProductScrollProps {
  category: string;
  products: Product[];
  id?: string;
  onProductClick: (product: Product) => void;
}

export function ProductScroll ({ category, products, id, onProductClick }: ProductScrollProps) {
  const { addToCart } = useCart();
  return products.length > 0 ? (
    <section className="py-12 px-6" id={id}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-4xl">{category}</h2>
          {/* <button className="text-primary hover:underline">
            Voir tous →
          </button> */}
        </div>

        {/* Horizontal Scrollable Container */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-6 pb-4" style={{ width: 'max-content' }}>
            {products.map((product) => (
              <div
                key={product.id}
                className="group w-72 bg-card rounded-lg overflow-hidden border border-border hover:border-primary transition-all duration-300 hover:-translate-y-2 cursor-pointer"
              >
                {/* Product Image */}
                <div
                  className="relative overflow-hidden aspect-[3/4]"
                  onClick={() => onProductClick(product)}
                >
                  <ImageWithFallback
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                      toast.success(`${product.title} added to cart!`);
                    }}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au panier
                  </button>
                </div>

                {/* Product Info */}
                <div
                  className="p-4"
                  onClick={() => onProductClick(product)}
                >
                  <div className="text-sm text-muted-foreground mb-1">{product.genre}</div>
                  <h3 className="mb-2 line-clamp-1">{product.title}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-primary text-primary" />
                      <span className="text-sm">{product.rating.toFixed(1)}</span>
                    </div>
                    <div className="text-xl text-primary">
                      €{product.price}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  ) : null;
}
