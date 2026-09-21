export interface Property {
  id: string;
  code: string; // e.g., "ZS-RHT-0101"
  title: string;
  description: string;
  images: string[];

  // Location & Bihar Revenue IDs
  mauza: string;
  anchal: string;
  thanaNumber: string;
  khata: string;
  khesra: string;
  jamabandi: string;

  // Land Specifications
  areaDecimal: number; // in decimal units
  areaKatha: number; // converted to Katha (1 Katha ≈ 3.2 Decimals in Rohtas)
  roadWidth: number; // in feet
  roadType: "Pakka" | "Soling" | "Kachha";
  facing: "North" | "South" | "East" | "West" | "Northeast" | "Northwest" | "Southeast" | "Southwest";

  // Pricing
  totalPrice: number; // in INR
  pricePerKatha: number; // calculated

  // Verification Status
  verificationTier: 1 | 2 | 3 | 4;
  verificationChecks: {
    kycCompleted: boolean;
    biharBhumiMatch: boolean;
    physicalVerified: boolean;
    thirtyYearSearch: boolean;
  };

  // Seller Information (Masked)
  sellerName: string;
  sellerPhoneRaw: string; // hidden from UI
  sellerPhoneMasked: string; // displayed (e.g., "+91 98****3210")
  sellerCategory: "Individual" | "Broker" | "Developer";

  // Status
  status: "Available" | "Reserved" | "Sold";

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface VerificationCheck {
  level: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  completed: boolean;
  icon: string;
}

export interface FilterState {
  anchal: string | null;
  roadWidthMin: number;
  landCategory: ("Residential" | "Commercial" | "Agricultural")[];
  priceRange: [number, number];
  verifiedOnly: boolean;
  roadSurface: ("Pakka" | "Soling" | "Kachha")[];
}

export interface SellerFormData {
  // Step 1: Location
  anchal: string;
  mauza: string;
  thanaNumber: string;

  // Step 2: Dimensions
  areaDecimal: number;
  roadWidth: number;
  roadType: "Pakka" | "Soling" | "Kachha";
  facing: string;

  // Step 3: Revenue IDs
  khata: string;
  khesra: string;
  jamabandi: string;

  // Step 4: Pricing
  totalPrice: number;
  sellerName: string;
  sellerPhone: string;
}
