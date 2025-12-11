import { Link } from "wouter";
import { Facebook, Instagram, Twitter, MessageCircle, Phone, Globe, MapPin } from "lucide-react";
import logoUrl from "@assets/standfit logo_1756828194925.jpg";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-12 border-t-4 border-blue-400 shadow-2xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-white/10 backdrop-blur-sm p-2.5 rounded-lg border-2 border-white/20 shadow-lg hover:bg-white/15 transition-all">
              <img src={logoUrl} alt="Standfit Premium Concept" className="h-8 sm:h-10 w-auto filter brightness-0 invert" />
              <span className="text-base sm:text-lg font-bold drop-shadow-lg leading-tight">Standfit Premium Concept</span>
            </div>
            <p className="text-white/90 leading-relaxed text-xs sm:text-sm">
              Leading wholesale distributor and food retail store serving Abuja since 2010.
            </p>
            <div className="flex gap-2 flex-wrap">
              <a href="#" className="bg-white/10 hover:bg-blue-500 p-2 rounded-full transition-all transform hover:scale-110 border-2 border-white/20 shadow-lg" data-testid="social-facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-pink-500 p-2 rounded-full transition-all transform hover:scale-110 border-2 border-white/20 shadow-lg" data-testid="social-instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-sky-500 p-2 rounded-full transition-all transform hover:scale-110 border-2 border-white/20 shadow-lg" data-testid="social-twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a 
                href="https://wa.me/2348144672883" 
                className="bg-white/10 hover:bg-green-500 p-2 rounded-full transition-all transform hover:scale-110 border-2 border-white/20 shadow-lg"
                data-testid="social-whatsapp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border-2 border-white/10 shadow-lg h-fit">
            <h4 className="font-bold mb-3 text-base border-b-2 border-blue-400 pb-2 inline-block">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-white/90 hover:text-blue-300 transition-all hover:translate-x-1 inline-block text-sm" data-testid="footer-link-home">→ Home</Link></li>
              <li><Link href="/products" className="text-white/90 hover:text-blue-300 transition-all hover:translate-x-1 inline-block text-sm" data-testid="footer-link-products">→ Products</Link></li>
              <li><Link href="/contact" className="text-white/90 hover:text-blue-300 transition-all hover:translate-x-1 inline-block text-sm" data-testid="footer-link-contact">→ Contact</Link></li>
            </ul>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border-2 border-white/10 shadow-lg h-fit">
            <h4 className="font-bold mb-3 text-base border-b-2 border-blue-400 pb-2 inline-block">Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white/90 hover:text-blue-300 transition-all hover:translate-x-1 inline-block text-sm" data-testid="footer-service-wholesale">→ Wholesale</a></li>
              <li><a href="#" className="text-white/90 hover:text-blue-300 transition-all hover:translate-x-1 inline-block text-sm" data-testid="footer-service-retail">→ Retail Sales</a></li>
              <li><a href="#" className="text-white/90 hover:text-blue-300 transition-all hover:translate-x-1 inline-block text-sm" data-testid="footer-service-delivery">→ Delivery</a></li>
              <li><a href="#" className="text-white/90 hover:text-blue-300 transition-all hover:translate-x-1 inline-block text-sm" data-testid="footer-service-corporate">→ Corporate Catering</a></li>
              <li><a href="#" className="text-white/90 hover:text-blue-300 transition-all hover:translate-x-1 inline-block text-sm" data-testid="footer-service-school">→ School Meals</a></li>
            </ul>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border-2 border-white/10 shadow-lg h-fit">
            <h4 className="font-bold mb-3 text-base border-b-2 border-blue-400 pb-2 inline-block">Contact Info</h4>
            <ul className="space-y-2 text-white/90">
              <li className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0 bg-blue-500/30 p-0.5 rounded-full" />
                <span data-testid="footer-phone-1" className="text-xs sm:text-sm">08144672883</span>
              </li>
              <li className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0 bg-blue-500/30 p-0.5 rounded-full" />
                <span data-testid="footer-phone-2" className="text-xs sm:text-sm">08179919419</span>
              </li>
              <li className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors">
                <Globe className="h-4 w-4 flex-shrink-0 bg-blue-500/30 p-0.5 rounded-full" />
                <span data-testid="footer-website" className="break-all text-xs sm:text-sm">standfitpremiumc.com</span>
              </li>
              <li className="flex items-center gap-2 text-sm hover:text-blue-300 transition-colors">
                <MapPin className="h-4 w-4 flex-shrink-0 bg-blue-500/30 p-0.5 rounded-full" />
                <span data-testid="footer-location" className="text-xs sm:text-sm">Abuja FCT, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t-2 border-blue-400/30 pt-4 text-center bg-white/5 backdrop-blur-sm rounded-lg p-4 shadow-lg">
          <p className="text-white/80 font-medium text-xs sm:text-sm" data-testid="footer-copyright">
            © 2024 Standfit Premium Concept. All rights reserved. | Food Wholesale Abuja | Retail Food Distribution FCT
          </p>
        </div>
      </div>
    </footer>
  );
}
