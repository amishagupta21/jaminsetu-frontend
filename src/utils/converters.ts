// Rohtas district specific conversion: 1 Katha ≈ 3.2 Decimals
const ROHTAS_DECIMAL_PER_KATHA = 3.2;

export const convertDecimalToKatha = (decimal: number): number => {
  return Math.round((decimal / ROHTAS_DECIMAL_PER_KATHA) * 100) / 100;
};

export const convertKathaToDecimal = (katha: number): number => {
  return Math.round(katha * ROHTAS_DECIMAL_PER_KATHA * 100) / 100;
};

export const formatPrice = (price: number): string => {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(0)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
};

export const formatPriceDetailed = (price: number): string => {
  return `₹${price.toLocaleString("en-IN")}`;
};

export const generateWhatsAppLink = (
  property: {
    code: string;
    mauza: string;
    totalPrice: number;
    areaKatha: number;
    sellerPhoneRaw: string;
  },
  businessManagerPhone: string = "919876543210"
): string => {
  const message = encodeURIComponent(
    `Hi! I'm interested in property *${property.code}* at *${property.mauza}, Rohtas*.\n\n` +
    `Price: ${formatPrice(property.totalPrice)}\n` +
    `Area: ${property.areaKatha} Katha\n\n` +
    `Can you share more details?`
  );

  return `https://wa.me/${businessManagerPhone}?text=${message}`;
};

export const maskPhoneForDisplay = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const lastFour = cleaned.slice(-4);
  const firstFour = cleaned.slice(-10, -6);
  return `+91 ${firstFour}****${lastFour}`;
};
