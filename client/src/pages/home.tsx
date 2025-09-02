import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WeeklyDeals from "@/components/weekly-deals";
import ProductCard from "@/components/product-card";
import { Link } from "wouter";
import { 
  Store, 
  ShoppingCart, 
  Package, 
  Phone, 
  Sprout, 
  Box, 
  Archive, 
  Flag,
  ArrowRight,
  Heart,
  GraduationCap,
  Users,
  Calendar
} from "lucide-react";

export default function Home() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const { data: featuredProducts, isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["/api/products?featured=true"],
  });

  const { data: blogPosts, isLoading: blogLoading } = useQuery<any[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: storeLocations, isLoading: locationsLoading } = useQuery<any[]>({
    queryKey: ["/api/store-locations"],
  });

  const categoryIcons = {
    grains: Sprout,
    provisions: Box,
    'packaged-foods': Archive,
    'nigerian-made': Flag,
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-20" data-testid="hero-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight" data-testid="hero-title">
                  Leading Wholesale Distributor & 
                  <span className="text-primary"> Food Retail Store</span> 
                  in Abuja
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg" data-testid="hero-description">
                  Quality Nigerian food commodities at wholesale and retail prices. Trusted by thousands of customers across FCT.
                </p>
              </div>
              
              <Card className="p-6">
                <div className="grid sm:grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-primary" data-testid="stat-sales">77+</div>
                    <div className="text-sm text-muted-foreground">Products Choice</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-secondary" data-testid="stat-years">7+</div>
                    <div className="text-sm text-muted-foreground">Years Serving Abuja</div>
                  </div>
                </div>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/products">
                  <Button size="lg" data-testid="button-shop-now">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Shop Now
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" data-testid="button-order-wholesale">
                  <Package className="h-5 w-5 mr-2" />
                  Order Wholesale
                </Button>
                <Link href="/contact">
                  <Button variant="outline" size="lg" data-testid="button-contact-us">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Nigerian food commodities and grains" 
                className="rounded-xl shadow-2xl w-full h-auto"
                data-testid="hero-image"
              />
              <div className="absolute -bottom-6 -left-6 bg-card p-4 rounded-lg shadow-lg border border-border">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary" data-testid="store-count">6</div>
                  <div className="text-sm text-muted-foreground">Store Locations</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Shop Categories */}
      <section className="py-16 bg-card" data-testid="categories-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Browse our extensive collection of Nigerian food commodities and provisions</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-8">
                  <Skeleton className="h-8 w-8 mx-auto mb-4" />
                  <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-full mx-auto" />
                </Card>
              ))
            ) : (
              categories?.map((category: any) => {
                const IconComponent = categoryIcons[category.slug as keyof typeof categoryIcons] || Box;
                return (
                  <Link key={category.id} href={`/products?category=${category.id}`}>
                    <Card className="group cursor-pointer p-8 text-center hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30" data-testid={`category-card-${category.slug}`}>
                      <div className="text-4xl text-primary mb-4">
                        <IconComponent className="h-10 w-10 mx-auto" />
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`category-name-${category.id}`}>
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm" data-testid={`category-description-${category.id}`}>
                        {category.description}
                      </p>
                      <div className="mt-4">
                        <span className="text-primary font-medium group-hover:underline">Explore →</span>
                      </div>
                    </Card>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Weekly Deals */}
      <WeeklyDeals />

      {/* Featured Products */}
      <section className="py-20 bg-muted" data-testid="featured-products-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover our premium selection of Nigerian food commodities available for wholesale and retail</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {productsLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-4 space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              featuredProducts?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="secondary" size="lg" data-testid="button-view-all-products">
                View All Products
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5" data-testid="why-choose-us-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose Standfit Premium?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover what makes us the preferred choice for food wholesale and retail in Abuja</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Sprout className="h-8 w-8 text-primary" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="feature-fresh-products">Fresh Products</h4>
              <p className="text-muted-foreground text-sm">Wholesale from large pool of Nigerian food products with guaranteed freshness</p>
            </div>
            
            <div className="text-center">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-secondary" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="feature-trusted-partners">Trusted Partners</h4>
              <p className="text-muted-foreground text-sm">Trusted by major Nigerian manufacturers and thousands of customers</p>
            </div>
            
            <div className="text-center">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Store className="h-8 w-8 text-primary" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="feature-extensive-network">Extensive Network</h4>
              <p className="text-muted-foreground text-sm">Extensive retail & distribution network across Abuja FCT</p>
            </div>
            
            <div className="text-center">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-secondary" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="feature-quality-assured">Quality Assured</h4>
              <p className="text-muted-foreground text-sm">SON/NAFDAC compliance with rigorous quality checks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-20 bg-card" data-testid="social-impact-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold text-foreground">Our Social Impact</h2>
              <p className="text-lg text-muted-foreground">
                Beyond business, we're committed to supporting our community through food distribution programs and partnerships that make quality nutrition accessible to all.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Card className="p-3">
                    <Heart className="h-6 w-6 text-primary" />
                  </Card>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1" data-testid="impact-community-programs">Community Food Programs</h4>
                    <p className="text-muted-foreground text-sm">Regular food distribution initiatives for underserved communities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Card className="p-3">
                    <GraduationCap className="h-6 w-6 text-secondary" />
                  </Card>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1" data-testid="impact-school-nutrition">School Nutrition Support</h4>
                    <p className="text-muted-foreground text-sm">Partnering with schools to provide nutritious meals for students</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Card className="p-3">
                    <Users className="h-6 w-6 text-primary" />
                  </Card>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1" data-testid="impact-farmer-support">Local Farmer Support</h4>
                    <p className="text-muted-foreground text-sm">Direct partnerships with local farmers to support agricultural growth</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Community food distribution program" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="social-impact-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog/News Preview */}
      <section className="py-20 bg-muted" data-testid="blog-preview-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Latest News & Updates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Stay updated with our latest promotions, distribution updates, and food programs</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))
            ) : (
              blogPosts?.slice(0, 3).map((post: any) => (
                <article key={post.id} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow" data-testid={`blog-post-${post.id}`}>
                  <img 
                    src={post.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"} 
                    alt={post.title} 
                    className="w-full h-48 object-cover"
                    data-testid={`blog-image-${post.id}`}
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span data-testid={`blog-date-${post.id}`}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-colors cursor-pointer" data-testid={`blog-title-${post.id}`}>
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4" data-testid={`blog-excerpt-${post.id}`}>
                      {post.excerpt}
                    </p>
                    <Link href={`/blog/${post.slug}`}>
                      <a className="text-primary font-medium hover:underline" data-testid={`blog-read-more-${post.id}`}>
                        Read More →
                      </a>
                    </Link>
                  </div>
                </article>
              ))
            )}
          </div>
          
          {blogPosts && blogPosts.length > 3 && (
            <div className="text-center mt-12">
              <Link href="/blog">
                <Button variant="outline" size="lg" data-testid="button-view-all-blog">
                  View All Posts
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
