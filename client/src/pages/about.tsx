import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, Truck, Award, Users } from "lucide-react";

export default function About() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="about-hero-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="about-title">
              About Standfit Premium Concept
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="about-subtitle">
              Your trusted partner in wholesale food distribution and retail since 2010, serving Abuja with quality, reliability, and exceptional customer service.
            </p>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-background" data-testid="company-story-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div>
                <Badge variant="secondary" className="mb-4">Est. 2010</Badge>
                <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="story-title">Our Story</h2>
                <p className="text-lg text-muted-foreground mb-6" data-testid="story-paragraph-1">
                  Since 2010, Standfit Premium Concept has been Abuja's trusted partner in wholesale food distribution and retail. We pride ourselves on quality, reliability, and exceptional customer service that has earned us the trust of thousands of customers across the Federal Capital Territory.
                </p>
                <p className="text-muted-foreground mb-8" data-testid="story-paragraph-2">
                  Our commitment to quality is demonstrated through our SON/NAFDAC compliance and rigorous quality checks. We work directly with Nigerian manufacturers to ensure the freshest products reach our customers at competitive prices.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <Card className="bg-primary/10 border-primary/20">
                  <CardContent className="p-6">
                    <Tag className="h-8 w-8 text-primary mb-3" />
                    <h4 className="font-semibold text-foreground mb-2" data-testid="quality-certified-title">Quality Certified</h4>
                    <p className="text-sm text-muted-foreground" data-testid="quality-certified-description">SON/NAFDAC compliant with strict quality standards</p>
                  </CardContent>
                </Card>
                <Card className="bg-secondary/10 border-secondary/20">
                  <CardContent className="p-6">
                    <Truck className="h-8 w-8 text-secondary mb-3" />
                    <h4 className="font-semibold text-foreground mb-2" data-testid="fast-delivery-title">Fast Delivery</h4>
                    <p className="text-sm text-muted-foreground" data-testid="fast-delivery-description">Store-to-door delivery across Abuja</p>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern food warehouse" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="warehouse-image"
              />
              <div className="absolute top-6 right-6 bg-card px-4 py-2 rounded-lg shadow-sm border border-border">
                <span className="text-sm font-medium text-primary" data-testid="established-badge">Est. 2010</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-card" data-testid="mission-values-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="mission-title">Our Mission & Values</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We are committed to providing quality food products while maintaining the highest standards of integrity and customer service.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="value-quality-title">Quality First</h3>
                <p className="text-muted-foreground" data-testid="value-quality-description">
                  Every product we distribute meets the highest quality standards with full SON/NAFDAC compliance and regular quality assurance checks.
                </p>
              </Card>
              
              <Card className="text-center p-8">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="value-trust-title">Customer Trust</h3>
                <p className="text-muted-foreground" data-testid="value-trust-description">
                  Building lasting relationships through transparent business practices, fair pricing, and reliable service delivery across all our outlets.
                </p>
              </Card>
              
              <Card className="text-center p-8">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Tag className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4" data-testid="value-innovation-title">Innovation</h3>
                <p className="text-muted-foreground" data-testid="value-innovation-description">
                  Continuously improving our distribution network and customer experience through technology and strategic partnerships.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="py-20 bg-muted" data-testid="company-stats-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">By The Numbers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our growth and impact in the Nigerian food distribution industry
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-revenue">₦2.7B+</div>
              <div className="text-muted-foreground">Annual Sales Revenue</div>
            </Card>
            
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-secondary mb-2" data-testid="stat-years">14+</div>
              <div className="text-muted-foreground">Years in Business</div>
            </Card>
            
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-outlets">6</div>
              <div className="text-muted-foreground">Store Outlets</div>
            </Card>
            
            <Card className="text-center p-8">
              <div className="text-4xl font-bold text-secondary mb-2" data-testid="stat-customers">10K+</div>
              <div className="text-muted-foreground">Happy Customers</div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
