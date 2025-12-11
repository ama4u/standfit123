import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, LayoutDashboard } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoUrl from "@assets/standfit logo_1756828194925.jpg";
import CartDrawer from "@/components/cart/cart-drawer";
import { useAuth } from "@/contexts/AuthContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "News Flash", href: "/news-flash" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, admin, logout, isAuthenticated, isAdmin } = useAuth();

  // Debug logging to check auth state
  console.log('Navbar Auth State:', { 
    user: !!user, 
    admin: !!admin, 
    isAuthenticated, 
    isAdmin,
    userEmail: user?.email,
    adminEmail: admin?.email 
  });

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 shadow-lg border-b-4 border-blue-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 items-center h-20 gap-4">
          {/* Logo Section - Takes 3 columns */}
          <div className="col-span-6 md:col-span-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-white p-2 rounded-lg shadow-md group-hover:shadow-xl transition-all duration-300 border-2 border-blue-200">
                <img src={logoUrl} alt="Standfit Premium Concept" className="h-10 sm:h-12 w-auto" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white hidden xs:block sm:block drop-shadow-lg">
                Standfit Premium Concept
              </span>
              <span className="text-sm font-bold text-white block xs:hidden sm:hidden drop-shadow-lg">Standfit</span>
            </Link>
          </div>
          
          {/* Navigation Links - Scattered across middle columns */}
          <div className="hidden md:flex col-span-6 justify-center items-center">
            <div className="flex items-center justify-between w-full max-w-2xl px-8">
              <Link 
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location === "/" 
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30'
                }`}
                data-testid="nav-link-home"
              >
                Home
              </Link>
              
              <Link 
                href="/products"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location === "/products" 
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30'
                }`}
                data-testid="nav-link-products"
              >
                Products
              </Link>
              
              <Link 
                href="/news-flash"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location === "/news-flash" 
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30'
                }`}
                data-testid="nav-link-news-flash"
              >
                News Flash
              </Link>
              
              <Link 
                href="/contact"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location === "/contact" 
                    ? 'bg-white text-blue-600 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/20 hover:backdrop-blur-md border border-transparent hover:border-white/30'
                }`}
                data-testid="nav-link-contact"
              >
                Contact
              </Link>
            </div>
          </div>
          
          {/* Right Section - Cart and Auth - Takes 3 columns */}
          <div className="col-span-6 md:col-span-3 flex items-center justify-end space-x-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-1 border border-white/20">
              <CartDrawer />
            </div>
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="hidden sm:flex bg-white text-blue-600 hover:bg-blue-50 shadow-lg border-2 border-blue-200 font-semibold" 
                    data-testid="button-user-menu"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {isAdmin ? admin?.email?.split('@')[0] : user?.firstName || user?.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border-2 border-blue-200">
                  <DropdownMenuItem asChild>
                    <Link href={isAdmin ? "/admin" : "/dashboard"} className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Button asChild variant="outline" className="bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-200 shadow-md" data-testid="button-login">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-green-600 hover:bg-green-700 text-white shadow-md border-2 border-green-300" data-testid="button-register">
                  <Link href="/register">Register</Link>
                </Button>
              </div>
            )}
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden bg-white/10 hover:bg-white/20 text-white border border-white/30" 
                  data-testid="button-menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-b from-blue-50 to-indigo-50 border-l-4 border-blue-600">
                <nav className="flex flex-col space-y-6 mt-8">
                  {navigation.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      className={`text-lg px-6 py-4 rounded-xl transition-all duration-300 ${
                        location === item.href 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg transform scale-105' 
                          : 'text-gray-700 hover:bg-blue-100 border border-transparent hover:border-blue-300 hover:shadow-md'
                      }`}
                      onClick={() => setIsOpen(false)}
                      data-testid={`mobile-nav-link-${item.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                  
                  {isAuthenticated ? (
                    <>
                      <Button 
                        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg border-2 border-blue-300 py-4" 
                        asChild 
                        data-testid="mobile-button-dashboard"
                      >
                        <Link href={isAdmin ? "/admin" : "/dashboard"}>
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-2 border-red-300 text-red-600 hover:bg-red-50 py-4" 
                        onClick={() => { logout(); setIsOpen(false); }}
                        data-testid="mobile-button-logout"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="mt-6 w-full bg-white text-blue-600 hover:bg-blue-50 border-2 border-blue-300 shadow-lg py-4" data-testid="mobile-button-login">
                        <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg border-2 border-green-300 py-4" data-testid="mobile-button-register">
                        <Link href="/register" onClick={() => setIsOpen(false)}>Register</Link>
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
