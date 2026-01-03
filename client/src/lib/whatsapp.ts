export interface WhatsAppOrderDetails {
  productName?: string;
  productPrice?: string;
  productDescription?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  quantity?: number;
  unit?: string;
}

export function createWhatsAppOrderMessage(details: WhatsAppOrderDetails): string {
  let message = "Hello Standfit Premium Concept! I would like to place an order.\n\n";
  // Lazy import to avoid circular deps in some bundlers
  const fmt = (value?: string) => {
    try {
      if (value === undefined) return undefined;
      const num = typeof value === 'string' ? Number(value) : (value as unknown as number);
      if (!Number.isFinite(num)) return value;
      return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(num);
    } catch {
      return value;
    }
  };
  
  if (details.productName) {
    message += `Product: ${details.productName}\n`;
    if (details.productPrice) {
      message += `Price: ${fmt(details.productPrice)}\n`;
    }
    if (details.unit) {
      message += `Unit: ${details.unit}\n`;
    }
    if (details.quantity) {
      message += `Quantity: ${details.quantity}\n`;
    }
    if (details.productDescription) {
      message += `Description: ${details.productDescription}\n`;
    }
    message += "\n";
  }
  
  if (details.customerName || details.customerPhone || details.customerAddress) {
    message += "Customer Details:\n";
    if (details.customerName) {
      message += `Name: ${details.customerName}\n`;
    }
    if (details.customerPhone) {
      message += `Phone: ${details.customerPhone}\n`;
    }
    if (details.customerAddress) {
      message += `Address: ${details.customerAddress}\n`;
    }
    message += "\n";
  }
  
   message += "Please confirm availability, delivery time and total cost including delivery.\n\nThank you!";
  
  return message;
}

export function openWhatsAppOrder(details: WhatsAppOrderDetails = {}): void {
  const message = createWhatsAppOrderMessage(details);
  const whatsappUrl = `https://wa.me/2348144672883?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}
