import { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle } from 'lucide-react';

export default function CartDrawer() {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleWhatsAppOrder = () => {
    if (items.length === 0) return;
    
    const orderDetails = items.map(item => 
      `${item.name} (${item.unit}) - Qty: ${item.quantity} - ₦${item.price} each`
    ).join('\n');
    
    const totalAmount = formatPrice(getTotalPrice());
    const message = `Hello! I'd like to place an order:\n\n${orderDetails}\n\nTotal: ${totalAmount}\n\nPlease confirm availability and delivery details.`;
    
    const whatsappUrl = `https://wa.me/2348143082181?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" data-testid="cart-button">
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              data-testid="cart-badge"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({getTotalItems()} items)
          </SheetTitle>
        </SheetHeader>
        
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground">Your cart is empty</h3>
            <p className="text-muted-foreground">Add some products to get started</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <ScrollArea className="flex-1 pr-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg" data-testid={`cart-item-${item.id}`}>
                    <img 
                      src={item.image_url} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1 space-y-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.unit}</p>
                      <p className="font-semibold text-primary">₦{item.price}</p>
                      {item.is_locally_made && (
                        <Badge variant="secondary" className="text-xs">Nigerian Made</Badge>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                        className="text-destructive hover:text-destructive"
                        data-testid={`remove-item-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold text-primary" data-testid="cart-total">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Button 
                  onClick={handleWhatsAppOrder}
                  className="w-full"
                  size="lg"
                  data-testid="order-whatsapp-button"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Order via WhatsApp
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={clearCart}
                  className="w-full"
                  data-testid="clear-cart-button"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}