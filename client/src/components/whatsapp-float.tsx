import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  const handleWhatsAppClick = () => {
    const message = "Hello Standfit Premium, I would like to make an order.\n\n*Payment Details:*\nPlease provide your account details for payment processing:\n- Account Name\n- Bank Name\n- Account Number";
    const whatsappUrl = `https://wa.me/2348144672883?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="whatsapp-float"
      data-testid="whatsapp-float-button"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </button>
  );
}
