import { useQuery } from "@tanstack/react-query";
import ProductCard from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Flame } from "lucide-react";

export default function WeeklyDeals() {
  const { data: deals, isLoading } = useQuery<any[]>({
    queryKey: ["/api/weekly-deals"],
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Flame className="h-4 w-4 mr-2" />
              Weekly Deals
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Special Discounts This Week</h2>
            <p className="text-muted-foreground">Limited time offers on premium food commodities</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <Skeleton className="w-full h-48" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!deals || deals.length === 0) {
    return (
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Flame className="h-4 w-4 mr-2" />
              Weekly Deals
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">Special Discounts This Week</h2>
            <p className="text-muted-foreground">No active deals at the moment. Check back soon!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted" data-testid="weekly-deals-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Flame className="h-4 w-4 mr-2" />
            Weekly Deals
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Special Discounts This Week</h2>
          <p className="text-muted-foreground">Limited time offers on premium food commodities</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal: any) => (
            <ProductCard
              key={deal.id}
              product={deal.product}
              isWeeklyDeal={true}
              discountPercentage={deal.discountPercentage}
              salePrice={deal.salePrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
