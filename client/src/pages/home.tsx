import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import WeeklyDeals from "@/components/weekly-deals";
import HeroCarousel from "@/components/hero-carousel";
import SocialImpactCarousel from "@/components/social-impact-carousel";
import { Link } from "wouter";
import ProductCard from "@/components/product-card";
import Seo from "@/components/seo";
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
  Image as ImageIcon,
  MessageSquare
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

  const { data: products, isLoading: productsLoading } = useQuery<any[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },
  });

  const categoryIcons = {
    grains: Sprout,
    provisions: Box,
    'packaged-foods': Archive,
    'nigerian-made': Flag,
  };

  return (
    <div>
      <Seo
        title="Standfit Premium — Leading Wholesale Distributor & Food Retail Store in Abuja"
        description="Quality Nigerian food commodities at wholesale and retail prices. Trusted by thousands of customers across FCT. Browse rice, noodles, beverages, detergents and more."
        url={typeof window !== 'undefined' ? window.location.href : 'https://standfit-e816d09b795a.herokuapp.com/'}
        image="/assets/standfit logo_1756828194925-CfQ7TYBl.jpg"
        keywords="wholesale food, Nigerian food commodities, rice, noodles, beverages, detergents, Abuja"
      />

      {/* Hero Section with Carousel */}
      <section className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-16 sm:py-20 lg:py-24" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6" data-testid="hero-title">
                Leading Wholesale Distributor & <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">Food Retail Store</span> in Abuja
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-8" data-testid="hero-description">
                Quality Nigerian food commodities at wholesale and retail prices. Trusted by thousands of customers across FCT.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto whitespace-nowrap bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg" data-testid="button-shop-now">
                    <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Shop Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" className="w-full sm:w-auto whitespace-nowrap bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg" data-testid="button-contact-us">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Contact Us
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto whitespace-nowrap border-2 border-purple-200 hover:bg-purple-50" data-testid="button-order-wholesale">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Order Wholesale
                </Button>
              </div>

              <div className="inline-block">
                <Card className="p-4 sm:p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent" data-testid="stat-sales">77+</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Products Choice</div>
                    </div>
                    <div>
                      <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" data-testid="stat-years">7+</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Years Serving Abuja</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Hero Carousel */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
              <div className="relative">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Flash */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">Latest News Flash</h2>
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
                <Link key={item.id} href="/news-flash">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative">
                      {item.mediaType === 'text' ? (
                        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <div className="text-center text-white p-4">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm font-medium">Text Message</p>
                            {item.content && (
                              <p className="text-xs mt-2 line-clamp-3 opacity-90">
                                {item.content}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : item.mediaType === 'video' ? (
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
                      ) : item.url ? (
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
                      ) : (
                        <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <div className="text-center text-white p-4">
                            <MessageSquare className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">Text Message</p>
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
                </Link>
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
              <Button className="bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 hover:from-purple-700 hover:via-pink-600 hover:to-indigo-700 text-white shadow-lg">
                View All News Flash
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Shop Categories */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-white via-gray-50 to-slate-100" data-testid="categories-section">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-slate-700 to-gray-900 bg-clip-text text-transparent mb-4">Shop by Category</h2>
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
                    <Card className="group cursor-pointer p-4 sm:p-6 lg:p-8 text-center hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30 h-full bg-white/80 backdrop-blur-sm hover:bg-gradient-to-br hover:from-primary/5 hover:to-blue-50" data-testid={`category-card-${category.slug}`}>
                      <div className="text-4xl text-primary mb-4">
                        <IconComponent className="h-10 w-10 mx-auto group-hover:scale-110 transition-transform duration-300" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors" data-testid={`category-name-${category.id}`}>
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

      {/* Featured Products Preview */}
      <section className="py-16 bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50" data-testid="featured-products-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-slate-800 bg-clip-text text-transparent">Featured Products</h2>
              <p className="text-muted-foreground">A selection of our popular products. Click more to view the full catalog.</p>
            </div>
            <div>
              <Link href="/products">
                <Button className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 hover:from-primary/90 hover:via-blue-600/90 hover:to-indigo-600/90 text-white shadow-lg">
                  View All Products
                  <span className="sr-only"> - go to products page</span>
                </Button>
              </Link>
            </div>
          </div>

          {productsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-4 space-y-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.slice(0, 8).map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-blue-50 to-indigo-100" data-testid="why-choose-us-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-6">Why Choose Standfit Premium?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Discover what makes us the preferred choice for food wholesale and retail in Abuja</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-primary/10 to-blue-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Sprout className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors" data-testid="feature-fresh-products">Fresh Products</h4>
              <p className="text-muted-foreground text-sm">Wholesale from large pool of Nigerian food products with guaranteed freshness</p>
            </div>
            
            <div className="text-center group">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Users className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-purple-600 transition-colors" data-testid="feature-trusted-partners">Trusted Partners</h4>
              <p className="text-muted-foreground text-sm">Trusted by major Nigerian manufacturers and thousands of customers</p>
            </div>
            
            <div className="text-center group">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Store className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform duration-300" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-green-600 transition-colors" data-testid="feature-extensive-network">Extensive Network</h4>
              <p className="text-muted-foreground text-sm">Extensive retail & distribution network across Abuja FCT</p>
            </div>
            
            <div className="text-center group">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Package className="h-8 w-8 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-orange-600 transition-colors" data-testid="feature-quality-assured">Quality Assured</h4>
              <p className="text-muted-foreground text-sm">SON/NAFDAC compliance with rigorous quality checks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-20 bg-gradient-to-br from-white via-slate-50 to-gray-100" data-testid="social-impact-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-800 via-slate-700 to-gray-900 bg-clip-text text-transparent">Our Social Impact</h2>
              <p className="text-lg text-muted-foreground">
                Beyond business, we're committed to supporting our community through food distribution programs and partnerships that make quality nutrition accessible to all.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 group">
                  <Card className="p-3 bg-gradient-to-br from-red-100 to-pink-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Heart className="h-6 w-6 text-red-600 group-hover:scale-110 transition-transform duration-300" />
                  </Card>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 group-hover:text-red-600 transition-colors" data-testid="impact-community-programs">Community Food Programs</h4>
                    <p className="text-muted-foreground text-sm">Regular food distribution initiatives for underserved communities</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <Card className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <GraduationCap className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                  </Card>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 group-hover:text-blue-600 transition-colors" data-testid="impact-school-nutrition">School Nutrition Support</h4>
                    <p className="text-muted-foreground text-sm">Partnering with schools to provide nutritious meals for students</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 group">
                  <Card className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-300">
                    <Users className="h-6 w-6 text-green-600 group-hover:scale-110 transition-transform duration-300" />
                  </Card>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1 group-hover:text-green-600 transition-colors" data-testid="impact-farmer-support">Local Farmer Support</h4>
                    <p className="text-muted-foreground text-sm">Direct partnerships with local farmers to support agricultural growth</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-2xl blur-xl"></div>
              <div className="relative">
                <SocialImpactCarousel />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog/News Preview */}
      <section className="py-20 bg-gradient-to-br from-slate-100 via-gray-50 to-blue-50" data-testid="blog-preview-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 via-gray-700 to-blue-800 bg-clip-text text-transparent mb-6">Latest News & Updates</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Stay updated with our latest promotions, distribution updates, and food programs</p>
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
                <article key={post.id} className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 group" data-testid={`blog-post-${post.id}`}>
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
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors cursor-pointer" data-testid={`blog-title-${post.id}`}>
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
                <Button variant="outline" size="lg" className="border-2 border-slate-200 hover:bg-slate-50 shadow-lg" data-testid="button-view-all-blog">
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
