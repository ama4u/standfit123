import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertContactMessageSchema } from "@shared/schema";
import { 
  Phone, 
  Globe, 
  MapPin, 
  Send, 
  MessageCircle,
  Clock,
  Mail,
  Car
} from "lucide-react";

const contactFormSchema = insertContactMessageSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const storeLocations = [
  {
    id: "dakwa",
    name: "Dakwa Outlet",
    address: "Dakwa Market, Abuja FCT",
    phone: "08144672883",
    hours: "8:00 AM - 6:00 PM"
  },
  {
    id: "dutse-alhaji",
    name: "Dutse Alhaji Market",
    address: "Dutse Alhaji Market, Abuja FCT",
    phone: "08179919419",
    hours: "8:00 AM - 6:00 PM"
  },
  {
    id: "wuse",
    name: "Wuse Modern Market",
    address: "Wuse Modern Market, Abuja FCT",
    phone: "08144672883",
    hours: "8:00 AM - 6:00 PM"
  },
  {
    id: "suleja",
    name: "Suleja Modern Market",
    address: "Suleja Modern Market, Niger State",
    phone: "08179919419",
    hours: "8:00 AM - 6:00 PM"
  },
  {
    id: "bwari",
    name: "Bwari Ultra-Modern Market",
    address: "Bwari Ultra-Modern Market, Abuja FCT",
    phone: "08144672883",
    hours: "8:00 AM - 6:00 PM"
  },
  {
    id: "warehouse",
    name: "Main Warehouse",
    address: "Central Distribution Center, Abuja FCT",
    phone: "08144672883",
    hours: "24/7 Operations"
  }
];

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "We've received your message and will get back to you soon!",
      });
      form.reset();
      setIsSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again or contact us directly.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormData) => {
    contactMutation.mutate(data);
  };

  const handleWhatsAppOrder = () => {
     const message = "Hello Standfit Premium Concept! I would like to place an order. Please send me your product catalog and pricing.\n\nPlease confirm availability, delivery time and delivery details.\n\n*Payment Details:*\nPlease provide your account details for payment processing:\n- Account Name\n- Bank Name\n- Account Number";
    const whatsappUrl = `https://wa.me/2348144672883?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="contact-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="contact-title">
              Get In Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="contact-subtitle">
              Ready to place an order or have questions? We're here to help with all your food distribution and retail needs.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="py-20 bg-background" data-testid="contact-main-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-6" data-testid="contact-info-title">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Card className="p-3">
                      <Phone className="h-6 w-6 text-primary" />
                    </Card>
                    <div>
                      <p className="font-medium text-foreground" data-testid="contact-phone-label">Customer Service</p>
                      <div className="space-y-1">
                        <p className="text-muted-foreground" data-testid="contact-phone-1">08144672883</p>
                        <p className="text-muted-foreground" data-testid="contact-phone-2">08179919419</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Card className="p-3">
                      <Globe className="h-6 w-6 text-secondary" />
                    </Card>
                    <div>
                      <p className="font-medium text-foreground" data-testid="contact-website-label">Website</p>
                      <p className="text-muted-foreground" data-testid="contact-website">www.standfitpremiumc.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Card className="p-3">
                      <MapPin className="h-6 w-6 text-primary" />
                    </Card>
                    <div>
                      <p className="font-medium text-foreground" data-testid="contact-headquarters-label">Headquarters</p>
                      <p className="text-muted-foreground" data-testid="contact-headquarters">Abuja FCT, Nigeria</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-4" data-testid="quick-order-title">Quick Order via WhatsApp</h4>
                <div className="flex space-x-4">
                  <Button 
                    onClick={handleWhatsAppOrder}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    data-testid="button-whatsapp-order"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    WhatsApp Order
                  </Button>
                  <Button 
                    onClick={() => handleCall("08144672883")}
                    className="flex-1"
                    data-testid="button-call-now"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </Button>
                </div>
              </div>

              {/* Business Hours */}
              <Card>
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-primary" />
                    Business Hours
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between" data-testid="hours-weekdays">
                      <span className="text-muted-foreground">Monday - Friday:</span>
                      <span className="font-medium">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between" data-testid="hours-saturday">
                      <span className="text-muted-foreground">Saturday:</span>
                      <span className="font-medium">8:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between" data-testid="hours-sunday">
                      <span className="text-muted-foreground">Sunday:</span>
                      <span className="font-medium">10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border" data-testid="hours-warehouse">
                      <span className="text-muted-foreground">Warehouse Operations:</span>
                      <span className="font-medium">24/7</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Form */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-foreground mb-6" data-testid="contact-form-title">Send Us a Message</h3>
                
                {isSubmitted ? (
                  <div className="text-center py-8" data-testid="contact-success-message">
                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="h-8 w-8 text-primary" />
                    </div>
                    <h4 className="text-xl font-semibold text-foreground mb-2">Message Sent Successfully!</h4>
                    <p className="text-muted-foreground mb-6">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                      data-testid="button-send-another"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="contact-form">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">Full Name *</Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="Enter your full name"
                        className="w-full"
                        data-testid="input-contact-name"
                      />
                      {form.formState.errors.name && (
                        <p className="text-destructive text-sm mt-1" data-testid="error-contact-name">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground mb-2 block">Phone Number *</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        {...form.register("phoneNumber")}
                        placeholder="Enter your phone number"
                        className="w-full"
                        data-testid="input-contact-phone"
                      />
                      {form.formState.errors.phoneNumber && (
                        <p className="text-destructive text-sm mt-1" data-testid="error-contact-phone">
                          {form.formState.errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="Enter your email address"
                        className="w-full"
                        data-testid="input-contact-email"
                      />
                      {form.formState.errors.email && (
                        <p className="text-destructive text-sm mt-1" data-testid="error-contact-email">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="text-sm font-medium text-foreground mb-2 block">Message *</Label>
                      <Textarea
                        id="message"
                        {...form.register("message")}
                        rows={4}
                        placeholder="Tell us about your requirements..."
                        className="w-full"
                        data-testid="input-contact-message"
                      />
                      {form.formState.errors.message && (
                        <p className="text-destructive text-sm mt-1" data-testid="error-contact-message">
                          {form.formState.errors.message.message}
                        </p>
                      )}
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={contactMutation.isPending}
                      data-testid="button-send-message"
                    >
                      <Send className="h-5 w-5 mr-2" />
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Store Locations */}
      <section className="py-20 bg-card" data-testid="store-locations-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="locations-title">Our Store Locations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" data-testid="locations-subtitle">
              Visit any of our 6 conveniently located outlets across Abuja FCT
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {storeLocations.map((location) => (
              <Card key={location.id} className="hover:shadow-md transition-shadow" data-testid={`location-card-${location.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2" data-testid={`location-name-${location.id}`}>
                        {location.name}
                      </h4>
                      <p className="text-muted-foreground text-sm mb-3" data-testid={`location-address-${location.id}`}>
                        {location.address}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-primary" />
                          <span className="text-muted-foreground" data-testid={`location-phone-${location.id}`}>{location.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-secondary" />
                          <span className="text-muted-foreground" data-testid={`location-hours-${location.id}`}>{location.hours}</span>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleCall(location.phone)}
                          data-testid={`button-call-${location.id}`}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            const query = encodeURIComponent(location.address);
                            window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                          }}
                          data-testid={`button-directions-${location.id}`}
                        >
                          <Car className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Google Maps Integration */}
      <section className="py-16 bg-muted" data-testid="maps-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4" data-testid="maps-title">Find Us on the Map</h2>
            <p className="text-muted-foreground" data-testid="maps-description">
              Locate our stores and plan your visit
            </p>
          </div>
          
          <Card className="overflow-hidden">
            <div className="h-96 bg-muted flex items-center justify-center" data-testid="maps-placeholder">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground" data-testid="maps-placeholder-text">
                  Interactive map will be loaded here
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    const query = encodeURIComponent("Standfit Premium Concept Abuja FCT Nigeria");
                    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                  }}
                  data-testid="button-open-maps"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Open in Google Maps
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background" data-testid="faq-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="faq-title">Frequently Asked Questions</h2>
              <p className="text-muted-foreground" data-testid="faq-subtitle">
                Quick answers to common questions about our services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-3" data-testid="faq-delivery-title">
                    Do you offer delivery services?
                  </h4>
                  <p className="text-muted-foreground text-sm" data-testid="faq-delivery-answer">
                    Yes, we provide store-to-door delivery across Abuja FCT. Same-day delivery is available for orders placed before 2 PM.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-3" data-testid="faq-wholesale-title">
                    What is the minimum order for wholesale pricing?
                  </h4>
                  <p className="text-muted-foreground text-sm" data-testid="faq-wholesale-answer">
                    Wholesale pricing typically applies to bulk orders. Contact us for specific minimum quantities per product category.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-3" data-testid="faq-payment-title">
                    What payment methods do you accept?
                  </h4>
                  <p className="text-muted-foreground text-sm" data-testid="faq-payment-answer">
                    We accept cash, bank transfers, and mobile money payments. Payment terms can be arranged for regular wholesale customers.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h4 className="font-semibold text-foreground mb-3" data-testid="faq-quality-title">
                    How do you ensure product quality?
                  </h4>
                  <p className="text-muted-foreground text-sm" data-testid="faq-quality-answer">
                    All our products are SON/NAFDAC certified and undergo rigorous quality checks before distribution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
