import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MessageCircle, Phone, Globe, MapPin } from "lucide-react";
import logoUrl from "@assets/standfit logo_1756828194925.jpg";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img src={logoUrl} alt="Standfit Premium Concept" className="h-10 sm:h-12 w-auto filter brightness-0 invert" />
              <span className="text-lg sm:text-xl lg:text-2xl font-bold">Standfit Premium Concept</span>
            </div>
            <p className="text-background/80 max-w-sm">
              Leading wholesale distributor and food retail store serving Abuja since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-background/80 hover:text-background transition-colors" data-testid="social-facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/80 hover:text-background transition-colors" data-testid="social-instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-background/80 hover:text-background transition-colors" data-testid="social-twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://wa.me/2348144672883" 
                className="text-background/80 hover:text-background transition-colors"
                data-testid="social-whatsapp"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/about"><a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-about">About Us</a></Link></li>
              <li><Link href="/products"><a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-products">Products</a></Link></li>
              <li><Link href="/services"><a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-services">Services</a></Link></li>
              <li><Link href="/team"><a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-team">Our Team</a></Link></li>
              <li><Link href="/contact"><a className="text-background/80 hover:text-background transition-colors" data-testid="footer-link-contact">Contact</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors" data-testid="footer-service-wholesale">Wholesale Distribution</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors" data-testid="footer-service-retail">Retail Sales</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors" data-testid="footer-service-delivery">Store-to-Door Delivery</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors" data-testid="footer-service-corporate">Corporate Catering</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors" data-testid="footer-service-school">School Meals</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-2 text-background/80">
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span data-testid="footer-phone-1">08144672883</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span data-testid="footer-phone-2">08179919419</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <Globe className="h-4 w-4 flex-shrink-0" />
                <span data-testid="footer-website" className="break-all">www.standfitpremiumc.com</span>
              </li>
              <li className="flex items-center space-x-2 text-sm sm:text-base">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span data-testid="footer-location">Abuja FCT, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-background/20 pt-8 text-center">
          <p className="text-background/60" data-testid="footer-copyright">
            © 2024 Standfit Premium Concept. All rights reserved. | Food Wholesale Abuja | Retail Food Distribution FCT
          </p>
        </div>
      </div>
    </footer>
  );
}
