import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, Phone } from "lucide-react";
import logoUrl from "@assets/standfit logo_1756828194925.jpg";
import CartDrawer from "@/components/cart/cart-drawer";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Products", href: "/products" },
  { name: "Services", href: "/services" },
  { name: "Our Team", href: "/team" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <img src={logoUrl} alt="Standfit Premium Concept" className="h-12 w-auto" />
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <a 
                  className={`text-foreground hover:text-primary transition-colors ${
                    location === item.href ? 'text-primary font-medium' : ''
                  }`}
                  data-testid={`nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                >
                  {item.name}
                </a>
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <CartDrawer />
            <Button 
              className="hidden sm:flex"
              data-testid="button-login"
            >
              <User className="h-4 w-4 mr-2" />
              Login
            </Button>
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href}>
                      <a
                        className={`text-lg ${
                          location === item.href ? 'text-primary font-medium' : 'text-foreground'
                        }`}
                        onClick={() => setIsOpen(false)}
                        data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                      >
                        {item.name}
                      </a>
                    </Link>
                  ))}
                  <Button className="mt-4" data-testid="mobile-button-login">
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
