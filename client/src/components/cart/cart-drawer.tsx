import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShoppingCart, Plus, Minus, Trash2, MessageCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CartDrawer() {
  const { items, updateQuantity, removeFromCart, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'delivery' | 'pickup'>('delivery');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [notes, setNotes] = useState('');
  
  // Customer information for guest orders
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Fetch user profile to pre-fill address
  const { data: userProfile } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      if (!user) return null; // Only fetch if there's a user (not admin)
      const res = await fetch('/api/user/profile', { credentials: 'include' });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: !!user, // Only enable when there's a user
  });

  // Pre-fill address when checkout dialog opens
  useEffect(() => {
    if (
      showCheckout &&
      fulfillmentMethod === 'delivery' &&
      userProfile?.contactAddress &&
      !shippingAddress
    ) {
      setShippingAddress(userProfile.contactAddress);
    }
  }, [showCheckout, fulfillmentMethod, userProfile, shippingAddress]);

  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      // Use guest orders endpoint since customers don't need to be logged in
      const response = await fetch('/api/guest/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
        credentials: 'include',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to place order');
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Order Saved Successfully!",
        description: "Your order has been saved to our system and sent via WhatsApp.",
      });
      // Don't clear cart here - let handleWhatsAppCheckout do it
      queryClient.invalidateQueries({ queryKey: ['/api/user/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Order Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePlaceOrder = () => {
    // Validate customer information
    if (!customerName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return;
    }

    if (!customerEmail.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!customerPhone.trim()) {
      toast({
        title: "Phone Required",
        description: "Please enter your phone number",
        variant: "destructive",
      });
      return;
    }

    if (fulfillmentMethod === 'delivery' && !shippingAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a shipping address",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      items: items.map(item => ({
        productId: item.id,
        quantity: item.quantity,
      })),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      fulfillmentMethod,
      shippingAddress: fulfillmentMethod === 'delivery' ? shippingAddress.trim() : null,
      paymentMethod,
      notes: notes.trim() || null,
    };

    // Save to database first
    placeOrderMutation.mutate(orderData);
    
    // Also send via WhatsApp for communication
    handleWhatsAppCheckout();
  };

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
      `${item.name} (${item.unit}) - Qty: ${item.quantity} - ${formatPrice(parseFloat(item.price))} each`
    ).join('\n');
    
    const totalAmount = formatPrice(getTotalPrice());
    const message = `Hello! I'd like to place an order:\n\n${orderDetails}\n\nTotal: ${totalAmount}\n\nFulfillment Method: Delivery or Pickup (please confirm)`;
    
    const whatsappUrl = `https://wa.me/2348144672883?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
  };

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;
    if (fulfillmentMethod === 'delivery' && !shippingAddress.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a shipping address",
        variant: "destructive",
      });
      return;
    }

    const orderDetails = items.map(item => 
      `${item.name} (${item.unit}) - Qty: ${item.quantity} - ${formatPrice(parseFloat(item.price))} each`
    ).join('\n');

    const totalAmount = formatPrice(getTotalPrice());
    const paymentLabel = paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash on Delivery';
    const methodLabel = fulfillmentMethod === 'delivery' ? 'Delivery' : 'Pickup';

    const lines: string[] = [];
    lines.push("Hello! I'd like to place an order:");
    lines.push("");
    lines.push(orderDetails);
    lines.push("");
    lines.push(`Total: ${totalAmount}`);
    lines.push(`Fulfillment Method: ${methodLabel}`);
    if (fulfillmentMethod === 'delivery') {
      lines.push(`Delivery Address: ${shippingAddress.trim()}`);
    }
    lines.push(`Payment Method: ${paymentLabel}`);
    if (notes.trim()) {
      lines.push(`Notes: ${notes.trim()}`);
    }

    const message = lines.join('\n');
    const whatsappUrl = `https://wa.me/2348144672883?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after sending WhatsApp message
    clearCart();
    setShowCheckout(false);
    setIsOpen(false);
    setShippingAddress('');
    setNotes('');
    setCustomerName('');
    setCustomerEmail('');
    setCustomerPhone('');
    
    toast({
      title: "Order Sent via WhatsApp",
      description: "Your order has been sent via WhatsApp. Please wait for confirmation.",
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20" data-testid="cart-button">
          <ShoppingCart className="h-5 w-5" />
          {getTotalItems() > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 border-2 border-white shadow-lg animate-pulse"
              data-testid="cart-badge"
            >
              {getTotalItems()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg border-l-4 border-blue-600 bg-gradient-to-b from-white to-blue-50">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-blue-600">
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
                      <p className="font-semibold text-primary">{formatPrice(parseFloat(item.price))}</p>
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
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg border-2 border-blue-300"
                  size="lg"
                  data-testid="checkout-button"
                >
                  <Package className="h-5 w-5 mr-2" />
                  Checkout
                </Button>

                <Button 
                  onClick={handleWhatsAppOrder}
                  variant="outline"
                  className="w-full border-2 border-green-300 text-green-600 hover:bg-green-50"
                  size="lg"
                  data-testid="order-whatsapp-button"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Order via WhatsApp
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={clearCart}
                  className="w-full text-red-600 hover:bg-red-50"
                  data-testid="clear-cart-button"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </SheetContent>

      {/* Checkout Dialog */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="sm:max-w-[500px] border-4 border-blue-600">
          <DialogHeader>
            <DialogTitle className="text-blue-600">Checkout</DialogTitle>
            <DialogDescription>
              Complete your order details to proceed
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-4 border-b pb-4">
              <h3 className="font-semibold text-sm text-blue-600">Customer Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                  id="customerName"
                  placeholder="Enter your full name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email Address *</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter your email address"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                  id="customerPhone"
                  placeholder="Enter your phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Fulfillment Method</Label>
              <RadioGroup value={fulfillmentMethod} onValueChange={(v) => setFulfillmentMethod(v as 'delivery' | 'pickup')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="delivery" id="delivery" />
                  <Label htmlFor="delivery" className="font-normal cursor-pointer">Delivery</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pickup" id="pickup" />
                  <Label htmlFor="pickup" className="font-normal cursor-pointer">Pickup</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">{fulfillmentMethod === 'delivery' ? 'Shipping Address *' : 'Pickup (no address required)'}</Label>
              {fulfillmentMethod === 'delivery' ? (
                <Textarea
                  id="address"
                  placeholder="Enter your full delivery address"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                />
              ) : (
                <div className="text-sm text-muted-foreground border rounded-md p-3">
                  You selected pickup. We will share pickup time and location after order confirmation.
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="font-normal cursor-pointer">
                    Bank Transfer
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cash_on_delivery" id="cash_on_delivery" />
                  <Label htmlFor="cash_on_delivery" className="font-normal cursor-pointer">
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or requests"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
              />
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-blue-600">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowCheckout(false);
              setCustomerName('');
              setCustomerEmail('');
              setCustomerPhone('');
              setShippingAddress('');
              setNotes('');
            }} className="border-2 border-gray-300">
              Cancel
            </Button>
            <Button 
              onClick={handlePlaceOrder} 
              disabled={placeOrderMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white border-2 border-blue-500"
            >
              {placeOrderMutation.isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
            <Button 
              onClick={handleWhatsAppCheckout}
              variant="outline"
              className="border-2 border-green-300 text-green-600 hover:bg-green-50"
            >
              WhatsApp Only
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}