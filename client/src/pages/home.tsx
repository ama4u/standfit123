import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WeeklyDeals from "@/components/weekly-deals";
import HeroCarousel from "@/components/hero-carousel";
import SocialImpactCarousel from "@/components/social-impact-carousel";
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
  Calendar,
  Play,
  Image as ImageIcon
} from "lucide-react";

export default function Home() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });

  const { data: blogPosts, isLoading: blogLoading } = useQuery<any[]>({
    queryKey: ["/api/blog-posts"],
  });

  const { data: storeLocations, isLoading: locationsLoading } = useQuery<any[]>({
    queryKey: ["/api/store-locations"],
  });

  // Fetch latest news flash items
  const { data: newsFlashItems, isLoading: newsFlashLoading } = useQuery<any[]>({
    queryKey: ["/api/newsflash"],
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
      <section className="relative bg-gradient-to-br from-primary/10 to-secondary/10 py-10 sm:py-16 lg:py-20" data-testid="hero-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-start">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight" data-testid="hero-title">
                  Leading Wholesale Distributor & 
                  <span className="text-primary"> Food Retail Store</span> 
                  in Abuja
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-lg" data-testid="hero-description">
                  Quality Nigerian food commodities at wholesale and retail prices. Trusted by thousands of customers across FCT.
                </p>
              </div>
              
              <Card className="p-4 sm:p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-primary" data-testid="stat-sales">77+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Products Choice</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-secondary" data-testid="stat-years">7+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Years Serving Abuja</div>
                  </div>
                </div>
              </Card>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto whitespace-nowrap" data-testid="button-shop-now">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Shop Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto whitespace-nowrap bg-green-600 hover:bg-green-700 text-white border-2 border-green-500" data-testid="button-contact-us">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Contact Us
                  </Button>
                </Link>
                <Button variant="secondary" size="lg" className="w-full sm:w-auto whitespace-nowrap" data-testid="button-order-wholesale">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Order Wholesale
                </Button>
              </div>
            </div>
            
            <div className="relative lg:mt-0">
              <HeroCarousel />
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Flash */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Latest News Flash</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Stay updated with our latest announcements, promotions, and updates</p>
          </div>

          {newsFlashLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              ))}
            </div>
          ) : newsFlashItems && newsFlashItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {newsFlashItems.slice(0, 3).map((item: any) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    {item.mediaType === 'video' ? (
                      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                        <video 
                          src={item.url} 
                          className="w-full h-full object-cover"
                          poster={item.thumbnail}
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-48 bg-gray-100 flex items-center justify-center">
                        <img 
                          src={item.url} 
                          alt={item.title || "News Flash"} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                        <div className="hidden absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    {item.title && (
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <ImageIcon className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-muted-foreground">No news flash items available yet.</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/news-flash">
              <Button className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-700 text-white">
                View All News Flash
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Shop Categories */}
      <section className="py-10 sm:py-16 bg-card" data-testid="categories-section">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Shop by Category</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">Browse our extensive collection of Nigerian food commodities and provisions</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 max-w-full">
            {categoriesLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-6 sm:p-8">
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
                    <Card className="group cursor-pointer p-4 sm:p-6 lg:p-8 text-center hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30 h-full" data-testid={`category-card-${category.slug}`}>
                      <div className="text-4xl text-primary mb-4">
                        <IconComponent className="h-10 w-10 mx-auto" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2" data-testid={`category-name-${category.id}`}>
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2" data-testid={`category-description-${category.id}`}>
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
              <SocialImpactCarousel />
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
