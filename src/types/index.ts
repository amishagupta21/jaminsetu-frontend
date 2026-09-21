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
  sellerKYC?: KYCData; // PHASE 2: Seller's KYC data

  // Status
  status: "Available" | "Reserved" | "Sold";

  // Ratings & Reviews
  rating?: Rating; // NEW: Ratings and reviews

  // Nearby Amenities
  amenities?: Amenity[]; // NEW: Schools, hospitals, markets, etc.

  // PHASE 2: Document Verification
  documents?: Document[];

  // PHASE 2: Bookings
  bookings?: string[]; // Array of booking IDs

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

  // PHASE 2: KYC Consent
  kycConsent?: boolean;
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

// PHASE 2: Document Verification
export interface Document {
  id: string;
  name: string;
  type:
    | "DeedCertificate"
    | "KhataCertificate"
    | "JamabandExtract"
    | "TaxReceipts"
    | "EncumbranceCertificate"
    | "NOCFromAuthorities";
  status: "pending" | "verified" | "rejected";
  uploadedAt: string;
  verifiedAt?: string;
  feedback?: string;
  documentUrl?: string; // base64 or file URL
}

// PHASE 2: KYC Data
export interface IdentityProof {
  type: "aadhar" | "pan" | "passport";
  value: string;
  documentUrl?: string; // base64 or URL
}

export interface AddressProof {
  type: "bank_statement" | "utility_bill" | "passport";
  documentUrl?: string; // base64 or URL
}

export interface KYCData {
  userId: string;
  tier: "basic" | "intermediate" | "complete";
  basicInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  identityProof?: IdentityProof;
  addressProof?: AddressProof;
  verifiedAt?: string;
  status: "pending" | "verified" | "rejected";
  rejectionReason?: string;
}

// PHASE 2: Booking
export interface Booking {
  id: string;
  propertyId: string;
  buyerId: string;
  amount: number;
  holdingDeposit: number;
  depositStatus: "pending" | "paid" | "refunded";
  depositPaidAt?: string;
  paymentMethod?: "bank_transfer" | "upi" | "check";
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  possessionDate?: string;
  termsAccepted: boolean;
}

// PHASE 2: Negotiation
export interface Negotiation {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  askingPrice: number;
  offeredPrice: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "expired" | "counter_offered";
  validUntil: string;
  createdAt: string;
  respondedAt?: string;
  response?: string;
  counterOfferPrice?: number;
}

// PHASE 3: Market Intelligence
export interface PriceTrend {
  mauza: string;
  landType: LandType;
  date: string; // YYYY-MM
  avgPrice: number;
  avgPricePerKatha: number;
  minPrice: number;
  maxPrice: number;
  count: number; // number of properties in calculation
}

export interface MarketRate {
  mauza: string;
  landType: LandType;
  roadType: string;
  pricePerKatha: number;
  confidence: "high" | "medium" | "low"; // based on count of properties
  sampleSize: number;
}

export interface PropertyMetrics {
  propertyId: string;
  views: number;
  favorites: number;
  comparisons: number;
  avgRating?: number;
  reviewCount: number;
  lastViewed?: string;
  trending: boolean; // if views increased last 7 days
}

export interface SimilarProperty {
  propertyId: string;
  title: string;
  price: number;
  pricePerKatha: number;
  similarity: number; // 0-100 score
  reasons: string[]; // why it's similar
}
