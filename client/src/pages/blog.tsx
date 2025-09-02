import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, ArrowRight, User, Clock, MessageCircle } from "lucide-react";

export default function Blog() {
  const { data: blogPosts, isLoading } = useQuery<any[]>({
    queryKey: ["/api/blog-posts"],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="blog-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="blog-title">
              News & Updates
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="blog-subtitle">
              Stay updated with our latest promotions, distribution updates, and food programs
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-20 bg-background" data-testid="blog-posts-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="w-full h-48" />
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : blogPosts?.length === 0 ? (
            <div className="text-center py-16" data-testid="no-blog-posts">
              <div className="max-w-md mx-auto">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="no-posts-title">
                  No Posts Yet
                </h3>
                <p className="text-muted-foreground mb-6" data-testid="no-posts-description">
                  We're working on bringing you the latest updates and news. Check back soon!
                </p>
                <Link href="/contact">
                  <Button data-testid="button-contact-for-updates">
                    Contact Us for Updates
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts?.map((post: any) => (
                <article 
                  key={post.id} 
                  className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-shadow group"
                  data-testid={`blog-post-card-${post.id}`}
                >
                  <div className="relative">
                    <img 
                      src={post.imageUrl || "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=250"} 
                      alt={post.title} 
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      data-testid={`blog-post-image-${post.id}`}
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" data-testid={`blog-post-date-badge-${post.id}`}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span data-testid={`blog-post-full-date-${post.id}`}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3 hover:text-primary transition-colors cursor-pointer line-clamp-2" data-testid={`blog-post-title-${post.id}`}>
                      {post.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-3" data-testid={`blog-post-excerpt-${post.id}`}>
                      {post.excerpt || "Read this latest update from Standfit Premium Concept..."}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span data-testid={`blog-post-read-time-${post.id}`}>3 min read</span>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        asChild
                        data-testid={`button-read-post-${post.id}`}
                      >
                        <Link href={`/blog/${post.slug}`}>
                          <span className="text-primary font-medium hover:underline">
                            Read More
                            <ArrowRight className="h-4 w-4 ml-1 inline" />
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="newsletter-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="newsletter-title">
              Stay Updated
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="newsletter-description">
              Get the latest news about our products, special offers, and distribution updates delivered to your phone via WhatsApp.
            </p>
            
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="whatsapp-updates-title">
                  Subscribe to WhatsApp Updates
                </h3>
                <p className="text-muted-foreground mb-6" data-testid="whatsapp-updates-description">
                  Join our WhatsApp broadcast list to receive weekly deals, new product announcements, and important updates.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => {
                      const message = "Hello Standfit Premium! I would like to subscribe to your WhatsApp updates for weekly deals and new product announcements.";
                      const whatsappUrl = `https://wa.me/2348144672883?text=${encodeURIComponent(message)}`;
                      window.open(whatsappUrl, '_blank');
                    }}
                    data-testid="button-subscribe-whatsapp"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Subscribe on WhatsApp
                  </Button>
                  
                  <Link href="/contact">
                    <Button variant="outline" className="flex-1" data-testid="button-contact-us">
                      <User className="h-5 w-5 mr-2" />
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="py-20 bg-card" data-testid="blog-categories-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="blog-topics-title">Popular Topics</h2>
            <p className="text-muted-foreground" data-testid="blog-topics-description">
              Explore content by topic area
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="topic-promotions">
              Promotions & Deals
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="topic-products">
              New Products
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="topic-community">
              Community Programs
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="topic-industry">
              Industry News
            </Badge>
            <Badge variant="outline" className="px-4 py-2 text-sm cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" data-testid="topic-recipes">
              Recipes & Tips
            </Badge>
          </div>
        </div>
      </section>
    </div>
  );
}
