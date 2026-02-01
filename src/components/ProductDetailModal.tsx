import { Dialog, DialogContent, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product, useCart } from './CartContext';
import { Star, ShoppingCart, Check } from 'lucide-react';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

interface ProductDetailModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

// Mock screenshots for products
const getProductScreenshots = (productId: number) => {
  const screenshots = [
    'https://images.unsplash.com/photo-1698450998458-0bc1045788a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwc2NyZWVuc2hvdCUyMGZhbnRhc3l8ZW58MXx8fHwxNzYwMjc5NzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1731865283223-04f577b3e9b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwc2NyZWVuc2hvdCUyMGFjdGlvbnxlbnwxfHx8fDE3NjAyNzk3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1743649978995-c76212449e15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1lJTIwc2NyZWVuc2hvdCUyMHJhY2luZ3xlbnwxfHx8fDE3NjAyNzk3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
  ];
  return screenshots;
};

const getProductDescription = (product: Product) => {
  return product.description ||
    `Experience the ultimate ${product.genre.toLowerCase()} adventure with ${product.title}. This critically acclaimed title offers hours of immersive gameplay, stunning visuals, and an unforgettable story that will keep you on the edge of your seat.`;
};

// const getProductFeatures = (product: Product) => {
//   const features = [
//     'Single-player and multiplayer modes',
//     '4K Ultra HD graphics',
//     'Epic soundtrack by award-winning composers',
//     'Regular updates and DLC content',
//     'Cross-platform progression',
//     'Achievement system with 50+ unlockables',
//   ];
//   return features;
// };

export function ProductDetailModal ({
  product,
  open,
  onClose,
}: ProductDetailModalProps) {
  const { addToCart } = useCart();

  if (!product) return null;

  const screenshots = getProductScreenshots(product.id);
  const description = getProductDescription(product);
  // const features = getProductFeatures(product);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart!`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogDescription className="sr-only">
          View detailed information about {product.title}, including screenshots, features, and system requirements.
        </DialogDescription>
        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden">
          <ImageWithFallback
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"></div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <Badge className="mb-3 bg-primary">{product.genre}</Badge>
            <h2 className="text-4xl mb-2">{product.title}</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-primary text-primary" />
                <span>{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-2xl text-primary">
                €{product.price}
              </span>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Description */}
          <div className="mb-8">
            <h3 className="mb-3">About This Game</h3>
            <p className="text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>

          {/* Screenshots */}
          {/* <div className="mb-8">
            <h3 className="mb-4">Screenshots</h3>
            <div className="grid grid-cols-3 gap-4">
              {screenshots.map((screenshot, index) => (
                <div
                  key={index}
                  className="aspect-video rounded-lg overflow-hidden border border-border hover:border-primary transition-colors cursor-pointer"
                >
                  <ImageWithFallback
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div> */}

          {/* Features */}
          {/* <div className="mb-8">
            <h3 className="mb-4">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </div> */}

          {/* System Requirements */}
          {/* <div className="mb-8 p-6 bg-muted rounded-lg">
            <h3 className="mb-4">System Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="mb-2 text-sm">Minimum</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>OS: Windows 10 64-bit</li>
                  <li>Processor: Intel Core i5-6600K</li>
                  <li>Memory: 8 GB RAM</li>
                  <li>Graphics: NVIDIA GTX 1060</li>
                  <li>Storage: 50 GB available space</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 text-sm">Recommended</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>OS: Windows 11 64-bit</li>
                  <li>Processor: Intel Core i7-8700K</li>
                  <li>Memory: 16 GB RAM</li>
                  <li>Graphics: NVIDIA RTX 3070</li>
                  <li>Storage: 50 GB available space</li>
                </ul>
              </div>
            </div>
          </div> */}

          {/* Add to Cart Button */}
          <Button
            onClick={handleAddToCart}
            className="w-full bg-primary hover:bg-secondary py-6"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Ajouter au panier - €{product.price}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
