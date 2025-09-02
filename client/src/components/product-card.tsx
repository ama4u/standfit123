import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle } from "lucide-react";
import { openWhatsAppOrder } from "@/lib/whatsapp";
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
  const handleWhatsAppOrder = () => {
    openWhatsAppOrder({
      productName: product.name,
      productPrice: salePrice || product.price,
      productDescription: product.description || '',
      unit: product.unit,
    });
  };

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
      <CardContent className="p-4">
        <h3 className="font-semibold text-foreground mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        <p className="text-muted-foreground text-sm mb-3" data-testid={`product-description-${product.id}`}>
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary" data-testid={`product-price-${product.id}`}>
              ₦{salePrice || product.price}
            </span>
            {isWeeklyDeal && (
              <span className="text-muted-foreground line-through text-sm" data-testid={`product-original-price-${product.id}`}>
                ₦{product.price}
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground" data-testid={`product-unit-${product.id}`}>
            {product.unit}
          </span>
        </div>
        <Button 
          onClick={handleWhatsAppOrder}
          className="w-full"
          data-testid={`button-order-${product.id}`}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Order via WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
