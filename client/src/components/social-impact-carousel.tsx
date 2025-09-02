import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Import social impact images
import brandsPartnership from "@assets/brands_1756831686281.png";
import communitySupport from "@assets/com support_1756831686286.jpg";

const socialImpactImages = [
  {
    src: communitySupport,
    alt: "Community support and local business advocacy",
    title: "Supporting Our Community",
    description: "Shop Local. Eat Local. Spend Local. Enjoy Local - Building stronger communities together through local business support and community engagement."
  },
  {
    src: brandsPartnership,
    alt: "Nigerian food brands partnership showcase",
    title: "Empowering Nigerian Brands",
    description: "Proud partners with leading Nigerian food manufacturers, supporting local industry growth and promoting Nigerian-made products across Abuja."
  }
];

export default function SocialImpactCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % socialImpactImages.length);
    }, 4000); // Scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % socialImpactImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + socialImpactImages.length) % socialImpactImages.length);
  };

  return (
    <div className="relative group">
      {/* Main carousel container */}
      <div className="relative overflow-hidden rounded-xl shadow-lg">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {socialImpactImages.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover"
                data-testid={`social-impact-image-${index}`}
              />
              {/* Gradient overlay for better text visibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Image title and description overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2" data-testid={`social-impact-title-${index}`}>
                  {image.title}
                </h3>
                <p className="text-xs sm:text-sm lg:text-base opacity-90 max-w-2xl" data-testid={`social-impact-description-${index}`}>
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
          data-testid="social-impact-prev-button"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onClick={nextSlide}
          data-testid="social-impact-next-button"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center space-x-2 mt-4">
        {socialImpactImages.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? "bg-primary scale-110" 
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            onClick={() => goToSlide(index)}
            data-testid={`social-impact-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}