import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Use direct URLs to attached_assets served statically by the server
const storeExterior = "/attached_assets/IMG-20230615-WA0008_1756830496565.jpg";
const coffeeProducts = "/attached_assets/IMG-20231023-WA0009_1_1756830496567.jpg";
const riceProducts = "/attached_assets/IMG-20231023-WA0011_1756830496568.jpg";
const sugarProducts = "/attached_assets/IMG-20231023-WA0013_1_1756830496569.jpg";
const storeFront = "/attached_assets/IMG-20231023-WA0022_1756830496569.jpg";
const seasoningProducts = "/attached_assets/IMG-20231023-WA0025_1756830496570.jpg";
const colorfulProducts = "/attached_assets/IMG-20231023-WA0036_1756830496572.jpg";
const brandsShowcase = "/attached_assets/brands_1756831510885.png";
const communitySupport = "/attached_assets/com support_1756831510887.jpg";
const peakStorage = "/attached_assets/peak large_1756831510888.jpg";

const carouselImages = [
  {
    src: '/attached_assets/new-store-happy-vendor.jpeg',
    alt: "Happy female vendor in striped shirt standing proudly in front of wholesale goods including TopCafe and Golden Penny products",
    title: "Our Friendly Team",
    description: "Dedicated staff providing excellent service with TopCafe, Golden Penny and quality wholesale products"
  },
  {
    src: '/attached_assets/new-store-interior-view.jpeg',
    alt: "Interior view of organized wholesale store with green covering and TopCafe product displays",
    title: "Organized Store Layout",
    description: "Well-organized store featuring TopCafe displays and systematic wholesale product arrangement"
  },
  {
    src: '/attached_assets/new-warehouse-storage.jpeg',
    alt: "Professional warehouse storage with ceiling tiles showing stacked rice bags and wholesale inventory",
    title: "Professional Warehouse Storage",
    description: "Large-scale warehouse with organized rice bags, TopCafe products and comprehensive wholesale inventory"
  },
  {
    src: '/attached_assets/market1.svg',
    alt: "Wholesale store entrance with stacked goods and vendor",
    title: "Wholesale Market Front",
    description: "Bulk packaged goods and everyday essentials for retailers and families"
  },
  {
    src: '/attached_assets/market2.svg',
    alt: "Stacks of rice, sugar and boxed goods in storage",
    title: "Bulk Storage",
    description: "Organized bulk storage of rice, sugar and packaged groceries"
  },
  {
    src: '/attached_assets/market3.svg',
    alt: "Vendor posing in front of stacked wholesale goods",
    title: "Community Retailers",
    description: "Local retailers and market vendors serving customers daily"
  },
  {
    src: storeExterior,
    alt: "Standfit Premium Concept store exterior showcasing product brands",
    title: "Our Flagship Store",
    description: "Featuring premium Nigerian food brands and wholesale distribution"
  },
  {
    src: storeFront,
    alt: "Standfit Premium Concept storefront with customers",
    title: "Serving Our Community",
    description: "Trusted by families and businesses across Abuja for quality products"
  },
  {
    src: coffeeProducts,
    alt: "Premium TopCafe coffee products in bulk",
    title: "Premium Coffee Selection",
    description: "Wholesale TopCafe and premium beverage mixes for your business"
  },
  {
    src: riceProducts,
    alt: "Quality Nigerian rice products",
    title: "Premium Nigerian Rice",
    description: "Fresh, quality rice products sourced from local Nigerian farms"
  },
  {
    src: seasoningProducts,
    alt: "Variety of seasoning cubes and cooking essentials",
    title: "Cooking Essentials",
    description: "Complete range of seasonings and cooking ingredients"
  },
  {
    src: sugarProducts,
    alt: "Bulk sugar and essential commodities",
    title: "Essential Commodities",
    description: "Bulk quantities of sugar, salt and basic food commodities"
  },
  {
    src: colorfulProducts,
    alt: "Diverse packaged food products",
    title: "Diverse Product Range",
    description: "Wide selection of packaged foods from trusted Nigerian brands"
  },
  {
    src: brandsShowcase,
    alt: "Nigerian food brands we distribute",
    title: "Premium Brand Partners",
    description: "Authorized distributor for top Nigerian food brands including Dangote, Peak, Indomie, and more"
  },
  {
    src: peakStorage,
    alt: "Peak milk products in wholesale storage",
    title: "Wholesale Distribution",
    description: "Large-scale storage and distribution of Peak milk and dairy products"
  },
  {
    src: communitySupport,
    alt: "Community support and local business advocacy",
    title: "Supporting Our Community",
    description: "Shop Local. Eat Local. Spend Local. Enjoy Local - Building stronger communities together"
  }
];

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides continuously
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 3000); // Scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="relative group">
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-xl shadow-2xl">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {carouselImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                data-testid={`carousel-image-${index}`}
              />
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Image title and description overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 lg:p-6 text-white">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2" data-testid={`carousel-title-${index}`}>
                  {image.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base opacity-90" data-testid={`carousel-description-${index}`}>
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation arrows */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={prevSlide}
          data-testid="carousel-prev-button"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={nextSlide}
          data-testid="carousel-next-button"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-primary scale-110" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => goToSlide(index)}
            data-testid={`carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}