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
  MessageSquare,
  Star,
  Shield,
  Truck,
  Award
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Seo
        title="Standfit Premium — Leading Wholesale Distributor & Food Retail Store in Abuja"
        description="Quality Nigerian food commodities at wholesale and retail prices. Trusted by thousands of customers across FCT. Browse rice, noodles, beverages, detergents and more."
        url={typeof window !== 'undefined' ? window.location.href : 'https://standfit-e816d09b795a.herokuapp.com/'}
        image="/assets/standfit logo_1756828194925-CfQ7TYBl.jpg"
        keywords="wholesale food, Nigerian food commodities, rice, noodles, beverages, detergents, Abuja"
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-800 text-white" data-testid="hero-section">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center min-h-[500px] lg:min-h-[600px]">
            {/* Hero Content */}
            <div className="text-center lg:text-left space-y-6 lg:space-y-8 order-2 lg:order-1 animate-fade-in-up">
              <div className="space-y-4 lg:space-y-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  Leading <span className="bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">Wholesale</span> Distributor in Abuja
                </h1>
                <p className="text-base md:text-lg lg:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Quality Nigerian food commodities at wholesale and retail prices. Trusted by thousands of customers across FCT.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4 animate-fade-in-up animate-delay-200">
                <Link href="/products">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-xl hover:shadow-2xl magnetic-button px-8 py-4 text-lg font-semibold" data-testid="button-shop-now">
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Shop Now
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm shadow-xl hover:shadow-2xl magnetic-button px-8 py-4 text-lg font-semibold" data-testid="button-contact-us">
                    <Phone className="h-5 w-5 mr-3" />
                    Contact Us
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 pt-6 lg:pt-8 animate-fade-in-up animate-delay-300">
                <div className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent" data-testid="stat-products">77+</div>
                  <div className="text-blue-200 text-sm lg:text-base">Product Varieties</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent" data-testid="stat-years">7+</div>
                  <div className="text-blue-200 text-sm lg:text-base">Years of Excellence</div>
                </div>
              </div>
            </div>

            {/* Hero Carousel */}
            <div className="relative order-1 lg:order-2 mb-8 lg:mb-0 animate-fade-in-right animate-delay-100">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-3xl blur-2xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-3 lg:p-4 border border-white/20 max-w-lg mx-auto lg:max-w-none">
                <HeroCarousel />
              </div>
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-12 lg:h-20">
            <path fill="rgb(248 250 252)" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Latest News Flash */}
      <section className="py-10 sm:py-12 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
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
      <section className="py-8 sm:py-10 bg-gradient-to-br from-white via-gray-50 to-slate-50" data-testid="categories-section">
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
      <section className="py-10 bg-gradient-to-br from-gray-50 via-slate-50 to-blue-50" data-testid="featured-products-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
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
                <Card key={i} className="overflow-hidden animate-pulse">
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
              {products?.slice(0, 8).map((product: any, index: number) => (
                <div 
                  key={product.id} 
                  className="group animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white/90 backdrop-blur-sm border-0 shadow-lg group-hover:shadow-blue-200/50">
                    <div className="relative overflow-hidden">
                      <img
                        src={product.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"}
                        alt={product.name}
                        className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                          <Heart className="w-4 h-4 text-red-500" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <span className="bg-primary/90 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                          {product.unit}
                        </span>
                      </div>
                    </div>
                    <CardContent className="p-4 relative">
                      <div className="absolute -top-6 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-500 mr-1" />
                              4.8
                            </span>
                            <span className="flex items-center">
                              <Shield className="w-3 h-3 text-green-500 mr-1" />
                              Quality
                            </span>
                            <span className="flex items-center">
                              <Truck className="w-3 h-3 text-blue-500 mr-1" />
                              Fast
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                        {product.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-1">
                          <div className="text-2xl font-bold text-primary">
                            ₦{product.price?.toLocaleString()}
                          </div>
                          {product.wholesalePrice && (
                            <div className="text-sm text-green-600 font-medium">
                              Wholesale: ₦{product.wholesalePrice.toLocaleString()}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-muted-foreground">Min Order</div>
                          <div className="text-sm font-medium">{product.minOrderQuantity || 1}</div>
                        </div>
                      </div>
                      
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group-hover:animate-pulse"
                        size="sm"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      
                      {/* Floating particles effect */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
                        <div className="absolute top-4 left-4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute top-8 right-6 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute bottom-8 left-6 w-1 h-1 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute bottom-4 right-4 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 bg-gradient-to-br from-primary/5 via-blue-50 to-indigo-50" data-testid="why-choose-us-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">Why Choose Standfit Premium?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Discover what makes us the preferred choice for food wholesale and retail in Abuja</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center group animate-bounce-in" style={{ animationDelay: '0.1s' }}>
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-primary/10 to-blue-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-500 animate-float group-hover:animate-glow">
                <Sprout className="h-8 w-8 text-primary group-hover:scale-125 transition-transform duration-500" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-300" data-testid="feature-fresh-products">Fresh Products</h4>
              <p className="text-muted-foreground text-sm">Wholesale from large pool of Nigerian food products with guaranteed freshness</p>
            </div>
            
            <div className="text-center group animate-bounce-in" style={{ animationDelay: '0.2s' }}>
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-500 animate-float group-hover:animate-glow" style={{ animationDelay: '0.5s' }}>
                <Users className="h-8 w-8 text-purple-600 group-hover:scale-125 transition-transform duration-500" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-purple-600 transition-colors duration-300" data-testid="feature-trusted-partners">Trusted Partners</h4>
              <p className="text-muted-foreground text-sm">Trusted by major Nigerian manufacturers and thousands of customers</p>
            </div>
            
            <div className="text-center group animate-bounce-in" style={{ animationDelay: '0.3s' }}>
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-green-100 to-emerald-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-500 animate-float group-hover:animate-glow" style={{ animationDelay: '1s' }}>
                <Store className="h-8 w-8 text-green-600 group-hover:scale-125 transition-transform duration-500" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-green-600 transition-colors duration-300" data-testid="feature-extensive-network">Extensive Network</h4>
              <p className="text-muted-foreground text-sm">Extensive retail & distribution network across Abuja FCT</p>
            </div>
            
            <div className="text-center group animate-bounce-in" style={{ animationDelay: '0.4s' }}>
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-gradient-to-br from-orange-100 to-amber-100 border-0 shadow-lg group-hover:shadow-xl transition-all duration-500 animate-float group-hover:animate-glow" style={{ animationDelay: '1.5s' }}>
                <Package className="h-8 w-8 text-orange-600 group-hover:scale-125 transition-transform duration-500" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3 group-hover:text-orange-600 transition-colors duration-300" data-testid="feature-quality-assured">Quality Assured</h4>
              <p className="text-muted-foreground text-sm">SON/NAFDAC compliance with rigorous quality checks</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Impact */}
      <section className="py-12 bg-gradient-to-br from-white via-slate-50 to-gray-50" data-testid="social-impact-section">
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
      <section className="py-12 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50" data-testid="blog-preview-section">
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
