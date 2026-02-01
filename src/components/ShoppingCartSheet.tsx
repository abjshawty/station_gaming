import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from './CartContext';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { authenticatedFetch } from '../utils/api';
import { API_BASE_URL } from '../utils/api';

interface ShoppingCartSheetProps {
  open: boolean;
  onClose: () => void;
}

export function ShoppingCartSheet ({ open, onClose }: ShoppingCartSheetProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const orderData = {
        customerName: formData.name,
        customerEmail: formData.email,
        items: cart.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: getCartTotal(),
      };
      console.log('🛒 [Order Debug] Submitting order:', orderData);

      // Make authenticated POST request
      const response = await authenticatedFetch(`${API_BASE_URL}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      console.log('📥 [Order Debug] Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ [Order Debug] Order failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
        });

        if (response.status === 401) {
          toast.error('Authentication failed. Please log in again.');
        } else {
          toast.error(`Order failed: ${response.status} ${response.statusText}`);
        }
        return;
      }

      const result = await response.json();
      console.log('✅ [Order Debug] Order successful:', result);

      toast.success('Commande passée avec succès! Vérifiez votre email pour la confirmation. 🎮');
      clearCart();
      setIsCheckout(false);
      onClose();
      setFormData({
        name: '',
        email: '',
      });
    } catch (error) {
      console.error('💥 [Order Debug] Exception during order submission:', error);
      toast.error('Failed to submit order. Please try again.');
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{isCheckout ? 'Caisse' : 'Panier'}</SheetTitle>
          <SheetDescription>
            {isCheckout
              ? 'Entrez vos informations pour recevoir la confirmation de commande par email'
              : 'Veuillez vérifier vos articles et passer à la caisse.'}
          </SheetDescription>
        </SheetHeader>

        {!isCheckout ? (
          <>
            <div className="flex-1 py-6">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Votre panier est vide
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 bg-card border border-border rounded-lg p-3"
                    >
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-20 h-28 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="mb-1 line-clamp-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.genre}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1 hover:bg-muted rounded"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1 hover:bg-muted rounded"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 hover:bg-destructive/10 hover:text-destructive rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 text-primary">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <SheetFooter className="flex-col gap-4">
                <div className="flex justify-between items-center py-4 border-t border-border">
                  <span>Total</span>
                  <span className="text-2xl text-primary">
                    ${getCartTotal().toFixed(2)}
                  </span>
                </div>
                <Button
                  onClick={() => setIsCheckout(true)}
                  className="w-full bg-primary hover:bg-secondary"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Passer à la caisse
                </Button>
              </SheetFooter>
            )}
          </>
        ) : (
          <form onSubmit={handleCheckout} className="py-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Pseudo</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
              />
            </div>

            <div className="bg-muted/50 border border-border rounded-lg p-4 text-sm">
              <p className="text-muted-foreground">
                Une confirmation de commande sera envoyée à votre email avec les détails de votre achat.
              </p>
            </div>

            <div className="py-4 border-t border-border">
              <div className="flex justify-between mb-4">
                <span>Total</span>
                <span className="text-2xl text-primary">
                  ${getCartTotal().toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCheckout(false)}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-secondary"
              >
                Confirmer la commande
              </Button>
            </div>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
}
