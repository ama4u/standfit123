import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Warehouse, 
  Truck, 
  Utensils, 
  Check, 
  Clock, 
  Shield, 
  Users,
  Phone 
} from "lucide-react";

export default function Services() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="services-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="services-title">
              Our Services
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="services-subtitle">
              Comprehensive food distribution and retail services tailored to meet your specific needs
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 bg-card" data-testid="main-services-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="text-center group p-8 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Warehouse className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="service-wholesale-title">Wholesale Distribution</h3>
              <p className="text-muted-foreground mb-6" data-testid="service-wholesale-description">
                Large-scale distribution of food commodities to retailers, restaurants, and institutions across Abuja and surrounding areas.
              </p>
              <div className="space-y-2 text-left text-muted-foreground mb-6">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span data-testid="wholesale-feature-1">Bulk pricing available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span data-testid="wholesale-feature-2">Direct from manufacturers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span data-testid="wholesale-feature-3">Quality guaranteed</span>
                </div>
              </div>
              <Link href="/contact">
                <Button className="w-full" data-testid="button-wholesale-contact">
                  Get Wholesale Pricing
                </Button>
              </Link>
            </Card>
            
            <Card className="text-center group p-8 hover:shadow-lg transition-shadow">
              <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-secondary/20 transition-colors">
                <Truck className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="service-delivery-title">Store-to-Door Delivery</h3>
              <p className="text-muted-foreground mb-6" data-testid="service-delivery-description">
                Convenient delivery service bringing quality food products directly to your home or business location.
              </p>
              <div className="space-y-2 text-left text-muted-foreground mb-6">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-secondary" />
                  <span data-testid="delivery-feature-1">Same-day delivery available</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-secondary" />
                  <span data-testid="delivery-feature-2">Tracking system</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-secondary" />
                  <span data-testid="delivery-feature-3">Safe packaging</span>
                </div>
              </div>
              <Link href="/products">
                <Button variant="secondary" className="w-full" data-testid="button-order-delivery">
                  Order for Delivery
                </Button>
              </Link>
            </Card>
            
            <Card className="text-center group p-8 hover:shadow-lg transition-shadow">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors">
                <Utensils className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-4" data-testid="service-corporate-title">Corporate & School Meals</h3>
              <p className="text-muted-foreground mb-6" data-testid="service-corporate-description">
                Specialized meal distribution services for corporate offices, schools, and institutions with customized packages.
              </p>
              <div className="space-y-2 text-left text-muted-foreground mb-6">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span data-testid="corporate-feature-1">Bulk meal packages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span data-testid="corporate-feature-2">Nutritional planning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span data-testid="corporate-feature-3">Regular supply contracts</span>
                </div>
              </div>
              <Link href="/contact">
                <Button className="w-full" data-testid="button-corporate-contact">
                  Request Corporate Package
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Features */}
      <section className="py-20 bg-muted" data-testid="service-features-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Our Services Stand Out</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our customer-focused approach and comprehensive service offerings
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Clock className="h-8 w-8 text-primary" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="feature-reliability-title">Reliable Timing</h4>
              <p className="text-muted-foreground text-sm" data-testid="feature-reliability-description">
                Consistent delivery schedules and dependable supply chain management
              </p>
            </div>
            
            <div className="text-center">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-secondary" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="feature-quality-title">Quality Assurance</h4>
              <p className="text-muted-foreground text-sm" data-testid="feature-quality-description">
                Rigorous quality checks and SON/NAFDAC compliance for all products
              </p>
            </div>
            
            <div className="text-center">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="feature-support-title">Customer Support</h4>
              <p className="text-muted-foreground text-sm" data-testid="feature-support-description">
                Dedicated customer service team available to assist with all your needs
              </p>
            </div>
            
            <div className="text-center">
              <Card className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Truck className="h-8 w-8 text-secondary" />
              </Card>
              <h4 className="text-lg font-semibold text-foreground mb-3" data-testid="feature-coverage-title">Wide Coverage</h4>
              <p className="text-muted-foreground text-sm" data-testid="feature-coverage-description">
                Serving all areas across Abuja FCT with multiple store locations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="services-cta-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="cta-title">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="cta-description">
              Contact us today to discuss your food distribution and retail needs. Our team is ready to help you find the perfect solution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" data-testid="button-get-quote">
                  <Phone className="h-5 w-5 mr-2" />
                  Get a Quote
                </Button>
              </Link>
              <a href="https://wa.me/2348144672883?text=Hello%20Standfit%20Premium,%20I%20would%20like%20to%20discuss%20your%20services">
                <Button variant="secondary" size="lg" data-testid="button-whatsapp-services">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
