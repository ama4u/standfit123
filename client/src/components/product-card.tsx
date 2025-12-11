import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, ShoppingCart, Plus, Minus } from "lucide-react";
import { openWhatsAppOrder } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  isWeeklyDeal?: boolean;
  discountPercentage?: number;
  salePrice?: string;
}

export default function ProductCard({ 
  product, 
  isWeeklyDeal = false, 
  discountPercentage = 0,
  salePrice 
}: ProductCardProps) {
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  
  const handleWhatsAppOrder = () => {
    openWhatsAppOrder({
      productName: product.name,
      productPrice: String(salePrice || product.price),
      productDescription: product.description || '',
      unit: product.unit,
    });
  };
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: String(salePrice || product.price),
      unit: product.unit,
      image_url: product.imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250",
      is_locally_made: product.isLocallyMade || false,
    });
  };
  
  const itemQuantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow group" data-testid={`product-card-${product.id}`}>
      <div className="relative">
        <img 
          src={product.imageUrl || "https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`product-image-${product.id}`}
        />
        {isWeeklyDeal && (
          <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground px-2 py-1 rounded text-sm font-medium" data-testid="discount-badge">
            {discountPercentage}% OFF
          </div>
        )}
        {product.isLocallyMade && (
          <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-2 py-1 rounded text-sm font-medium" data-testid="locally-made-badge">
            Nigerian-Made
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-4">
        <h3 className="font-semibold text-foreground mb-2 text-sm sm:text-base" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-3 line-clamp-2" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <span className="text-base sm:text-lg font-bold text-primary" data-testid={`product-price-${product.id}`}>
              {formatPrice(salePrice || product.price)}
            </span>
            {isWeeklyDeal && (
              <span className="text-muted-foreground line-through text-xs sm:text-sm" data-testid={`product-original-price-${product.id}`}>
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground" data-testid={`product-unit-${product.id}`}>
            {product.unit}
          </span>
        </div>
        <div className="space-y-2">
          {inCart ? (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(product.id, itemQuantity - 1)}
                data-testid={`decrease-${product.id}`}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="font-semibold px-2 sm:px-4 text-xs sm:text-sm" data-testid={`cart-quantity-${product.id}`}>
                {itemQuantity} in cart
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateQuantity(product.id, itemQuantity + 1)}
                data-testid={`increase-${product.id}`}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleAddToCart}
              className="w-full text-xs sm:text-sm h-8 sm:h-10"
              data-testid={`add-to-cart-${product.id}`}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add to Cart
            </Button>
          )}
          <Button 
            onClick={handleWhatsAppOrder}
            variant="outline"
            className="w-full text-xs sm:text-sm h-8 sm:h-10"
            data-testid={`button-order-${product.id}`}
          >
            <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            Order via WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
