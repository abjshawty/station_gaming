import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useCart } from './CartContext';
import { Minus, Plus, Trash2, CreditCard, Smartphone, Wallet } from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { toast } from 'sonner';
import { authenticatedFetch } from '../utils/api';
type PaymentMethod = 'card' | 'wave' | 'orange';

interface ShoppingCartSheetProps {
  open: boolean;
  onClose: () => void;
}

export function ShoppingCartSheet ({ open, onClose }: ShoppingCartSheetProps) {
  const { cart, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isCheckout, setIsCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    phoneNumber: '',
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        cardNumber: formData.cardNumber,
        expiry: formData.expiry,
        cvv: formData.cvv,
        phoneNumber: formData.phoneNumber,
        paymentMethod,
        cart,
      };
      console.log('🛒 [Order Debug] Submitting order:', data);
      
      // Make authenticated POST request
      const response = await authenticatedFetch('http://localhost:3001/v0/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
      
      const methodNames = {
        card: 'Card',
        wave: 'Wave',
        orange: 'Orange Money'
      };
      toast.success(`Commande passée avec succès via ${methodNames[paymentMethod]}! 🎮`);
      clearCart();
      setIsCheckout(false);
      setPaymentMethod('card');
      onClose();
      setFormData({
        name: '',
        email: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        phoneNumber: '',
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
              ? 'Prière d\'entrer vos informations de paiement'
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
                  <CreditCard className="w-4 h-4 mr-2" />
                  Passer à la caisse
                </Button>
              </SheetFooter>
            )}
          </>
        ) : (
          <form onSubmit={handleCheckout} className="py-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
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

            {/* Payment Method Selection */}
            <div className="space-y-3 pt-2">
              <Label>Méthode de paiement</Label>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                    <CreditCard className="w-5 h-5" />
                    <span>Credit/Debit Card</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="wave" id="wave" />
                  <Label htmlFor="wave" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Smartphone className="w-5 h-5" />
                    <span>Wave</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                  <RadioGroupItem value="orange" id="orange" />
                  <Label htmlFor="orange" className="flex items-center gap-2 cursor-pointer flex-1">
                    <Wallet className="w-5 h-5" />
                    <span>Orange Money</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Payment Details based on selected method */}
            {paymentMethod === 'card' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input
                    id="cardNumber"
                    required
                    value={formData.cardNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cardNumber: e.target.value })
                    }
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Date d'expiration</Label>
                    <Input
                      id="expiry"
                      required
                      value={formData.expiry}
                      onChange={(e) =>
                        setFormData({ ...formData, expiry: e.target.value })
                      }
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      required
                      value={formData.cvv}
                      onChange={(e) =>
                        setFormData({ ...formData, cvv: e.target.value })
                      }
                      placeholder="123"
                      maxLength={3}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                <Input
                  id="phoneNumber"
                  required
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+221 XX XXX XX XX"
                />
              </div>
            )}

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
