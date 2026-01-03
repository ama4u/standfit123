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

  return (
    <nav className="bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 shadow-xl border-b border-slate-700 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 items-center h-20 gap-4">
          {/* Logo Section - Takes 3 columns */}
          <div className="col-span-6 md:col-span-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="bg-white p-2 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 border-2 border-white/20">
                <img src={logoUrl} alt="Standfit" className="h-10 sm:h-12 w-auto" />
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-bold text-white drop-shadow-lg tracking-wide">
                  Standfit
                </span>
                <div className="text-xs text-blue-100 font-medium tracking-wider uppercase">
                  Premium Quality
                </div>
              </div>
            </Link>
          </div>
          
          {/* Navigation Links - Scattered across middle columns */}
          <div className="hidden md:flex col-span-6 justify-center items-center">
            <div className="flex items-center justify-between w-full max-w-2xl px-8">
              <Link 
                href="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location === "/" 
                    ? 'bg-white text-slate-900 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/10 hover:backdrop-blur-md border border-transparent hover:border-white/20'
                }`}
                data-testid="nav-link-home"
              >
                Home
              </Link>
              
              <Link 
                href="/products"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location === "/products" 
                    ? 'bg-white text-slate-900 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/10 hover:backdrop-blur-md border border-transparent hover:border-white/20'
                }`}
                data-testid="nav-link-products"
              >
                Products
              </Link>
              
              <Link 
                href="/news-flash"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location === "/news-flash" 
                    ? 'bg-white text-slate-900 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/10 hover:backdrop-blur-md border border-transparent hover:border-white/20'
                }`}
                data-testid="nav-link-news-flash"
              >
                News Flash
              </Link>
              
              <Link 
                href="/contact"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  location === "/contact" 
                    ? 'bg-white text-slate-900 shadow-lg transform scale-105' 
                    : 'text-white hover:bg-white/10 hover:backdrop-blur-md border border-transparent hover:border-white/20'
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
                    className="hidden sm:flex bg-white text-slate-900 hover:bg-slate-100 shadow-lg border border-slate-200 font-semibold" 
                    data-testid="button-user-menu"
                  >
                    <User className="h-4 w-4 mr-2" />
                    {isAdmin ? admin?.email?.split('@')[0] : user?.firstName || user?.email?.split('@')[0]}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="border border-slate-200 shadow-xl">
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
                <Button asChild variant="outline" className="bg-white text-slate-900 hover:bg-slate-100 border border-slate-200 shadow-md" data-testid="button-login">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md border border-blue-500" data-testid="button-register">
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
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-gradient-to-b from-slate-50 to-slate-100 border-l border-slate-200">
                <nav className="flex flex-col space-y-6 mt-8">
                  {navigation.map((item) => (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      className={`text-lg px-6 py-4 rounded-xl transition-all duration-300 ${
                        location === item.href 
                          ? 'bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold shadow-lg transform scale-105' 
                          : 'text-slate-700 hover:bg-slate-200 border border-transparent hover:border-slate-300 hover:shadow-md'
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
                        className="mt-6 w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 shadow-lg border border-slate-600 py-4" 
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
                        className="w-full border border-red-300 text-red-600 hover:bg-red-50 py-4" 
                        onClick={() => { logout(); setIsOpen(false); }}
                        data-testid="mobile-button-logout"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="mt-6 w-full bg-white text-slate-900 hover:bg-slate-100 border border-slate-300 shadow-lg py-4" data-testid="mobile-button-login">
                        <Link href="/login" onClick={() => setIsOpen(false)}>Login</Link>
                      </Button>
                      <Button asChild className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg border border-blue-500 py-4" data-testid="mobile-button-register">
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
