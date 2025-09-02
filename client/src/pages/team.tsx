import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Mail, Phone, Linkedin, Users, Shield, Warehouse } from "lucide-react";

const teamMembers = [
  {
    id: "hajia-rekliyat-oseni",
    name: "Hajia Rekliyat Oseni",
    position: "Managing Director",
    bio: "Leading the company with over 15 years of experience in food distribution and retail management. Hajia Rekliyat has been instrumental in expanding our operations across Abuja FCT.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    achievements: [
      "15+ years in food distribution",
      "Led company to ₦2.7B annual revenue",
      "Expanded operations to 6 outlets"
    ]
  },
  {
    id: "fatai",
    name: "Fatai",
    position: "Operations Manager",
    bio: "Overseeing daily operations and ensuring efficient distribution across all outlets. Fatai brings exceptional organizational skills and deep understanding of supply chain management.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    achievements: [
      "Expert in supply chain management",
      "Optimized distribution efficiency",
      "Manages 6 store operations"
    ]
  },
  {
    id: "imran-ahmed",
    name: "Imran Ahmed",
    position: "Finance Manager",
    bio: "Managing financial operations and ensuring sustainable growth and competitive pricing. Imran's financial expertise has been crucial in maintaining our competitive edge in the market.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
    achievements: [
      "CPA certified financial expert",
      "Maintained competitive pricing strategy",
      "Ensured sustainable growth"
    ]
  }
];

export default function Team() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="team-header">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6" data-testid="team-title">
              Meet Our Leadership Team
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="team-subtitle">
              Experienced leaders driving excellence in food distribution and retail across Abuja FCT
            </p>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="py-20 bg-muted" data-testid="team-members-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {teamMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden text-center group hover:shadow-lg transition-shadow" data-testid={`team-member-${member.id}`}>
                <div className="relative">
                  <img 
                    src={member.image} 
                    alt={`${member.name} portrait`} 
                    className="w-full h-64 object-cover"
                    data-testid={`team-image-${member.id}`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-foreground mb-2" data-testid={`team-name-${member.id}`}>
                    {member.name}
                  </h3>
                  <p className="text-primary font-medium mb-3" data-testid={`team-position-${member.id}`}>
                    {member.position}
                  </p>
                  <p className="text-muted-foreground text-sm mb-4" data-testid={`team-bio-${member.id}`}>
                    {member.bio}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {member.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span data-testid={`team-achievement-${member.id}-${index}`}>{achievement}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-20 bg-card" data-testid="company-culture-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="culture-title">Our Company Culture</h2>
            <p className="text-xl text-muted-foreground mb-12" data-testid="culture-description">
              Built on values of integrity, excellence, and community service, our team is dedicated to serving customers with the highest standards.
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3" data-testid="culture-teamwork-title">Teamwork</h3>
                <p className="text-muted-foreground text-sm" data-testid="culture-teamwork-description">
                  Collaborative approach to solving challenges and delivering exceptional customer service
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="bg-secondary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3" data-testid="culture-integrity-title">Integrity</h3>
                <p className="text-muted-foreground text-sm" data-testid="culture-integrity-description">
                  Honest business practices and transparent relationships with all stakeholders
                </p>
              </Card>
              
              <Card className="p-6 text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Warehouse className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3" data-testid="culture-excellence-title">Excellence</h3>
                <p className="text-muted-foreground text-sm" data-testid="culture-excellence-description">
                  Continuous improvement in service delivery and operational efficiency
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-secondary/10" data-testid="team-cta-section">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-foreground mb-6" data-testid="team-cta-title">
              Work With Our Team
            </h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="team-cta-description">
              Ready to partner with Abuja's leading food distribution company? Our experienced team is here to help you succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg" data-testid="button-contact-team">
                  <Phone className="h-5 w-5 mr-2" />
                  Contact Our Team
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" data-testid="button-learn-services">
                  Learn About Our Services
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
