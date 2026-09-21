export type LandType = "Residential" | "Commercial" | "Agricultural";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Amenity {
  id: string;
  name: string;
  type: "School" | "Hospital" | "Market" | "BusStand" | "GovernmentOffice" | "Other";
  distance: number; // in km
  coordinates?: Coordinates;
  description?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string;
}

export interface Rating {
  average: number; // 1-5
  count: number;
  reviews: Review[];
}

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
  landType: LandType; // NEW: Residential, Commercial, Agricultural

  // Location Coordinates
  coordinates?: Coordinates; // NEW: For map integration

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

  // Ratings & Reviews
  rating?: Rating; // NEW: Ratings and reviews

  // Nearby Amenities
  amenities?: Amenity[]; // NEW: Schools, hospitals, markets, etc.

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
  landType: LandType[]; // NEW: Filter by land type
  areaRange: [number, number]; // NEW: Filter by area (in Decimal)
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
  landType: LandType; // NEW: Land type category

  // Step 3: Revenue IDs
  khata: string;
  khesra: string;
  jamabandi: string;

  // Step 4: Pricing
  totalPrice: number;
  sellerName: string;
  sellerPhone: string;
}

// NEW: Favorites/Wishlist
export interface FavoritesData {
  propertyIds: string[];
  addedAt: { [propertyId: string]: string };
}

// NEW: Comparison state
export interface ComparisonState {
  selectedProperties: string[]; // Max 3 property IDs
}
