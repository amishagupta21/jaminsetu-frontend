"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property, FilterState, SellerFormData, FavoritesData, Review, Rating, KYCData, Booking, Negotiation, Document, LandType, PropertyMetrics, MarketRate, SimilarProperty, PriceTrend } from "@/types";
import { storageAdapter } from "@/lib/storage";
import { calculateFairPrice, getMarketRate, getSimilarProperties, calculatePriceTrends, getPropertiesForMauza, comparePriceToMarket } from "@/utils/marketCalculations";

interface PropertyContextType {
  properties: Property[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filteredProperties: Property[];
  addProperty: (data: SellerFormData) => void;
  isLoading: boolean;
  // Favorites
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  // Ratings
  addReview: (propertyId: string, rating: number, comment: string, userName: string) => void;
  getPropertyRating: (propertyId: string) => Rating | undefined;
  // Comparison
  comparisonList: string[];
  toggleComparison: (propertyId: string) => void;
  clearComparison: () => void;
  // PHASE 2: KYC
  currentUserKYC: KYCData | null;
  submitKYC: (data: KYCData) => void;
  getKYCStatus: (userId: string) => KYCData | null;
  canProceedToBooking: (userId: string) => boolean;
  // PHASE 2: Bookings
  userBookings: Booking[];
  addBooking: (booking: Booking) => void;
  getPropertyBookings: (propertyId: string) => Booking[];
  cancelBooking: (bookingId: string) => void;
  // PHASE 2: Negotiations
  userNegotiations: Negotiation[];
  addNegotiation: (negotiation: Negotiation) => void;
  updateNegotiation: (negotiationId: string, updates: Partial<Negotiation>) => void;
  getPropertyNegotiations: (propertyId: string) => Negotiation[];
  // PHASE 2: Documents
  submitDocument: (propertyId: string, document: Document) => void;
  getPropertyDocuments: (propertyId: string) => Document[];
  // PHASE 3: Market Intelligence
  getMarketRate: (mauza: string, landType: LandType, roadType: string) => MarketRate;
  calculateFairPrice: (specs: { mauza: string; landType: LandType; areaKatha: number; roadWidth: number; roadType: "Pakka" | "Soling" | "Kachha" }) => { lowEnd: number; fairValue: number; highEnd: number; confidence: "high" | "medium" | "low"; sampleSize: number };
  getPropertyMetrics: (propertyId: string) => PropertyMetrics | undefined;
  getSimilarProperties: (propertyId: string) => SimilarProperty[];
  recordPropertyView: (propertyId: string) => void;
  getPriceTrends: (mauza: string, landType: LandType) => PriceTrend[];
  comparePriceToMarket: (marketRate: number, actualPrice: number) => { comparison: "underpriced" | "fair" | "overpriced"; percentDifference: number };
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "jaminsetu_favorites";
const COMPARISON_STORAGE_KEY = "jaminsetu_comparison";
const KYC_STORAGE_KEY = "jaminsetu_kyc";
const BOOKINGS_STORAGE_KEY = "jaminsetu_bookings";
const NEGOTIATIONS_STORAGE_KEY = "jaminsetu_negotiations";
const DOCUMENTS_STORAGE_KEY = "jaminsetu_documents";
const PROPERTY_METRICS_STORAGE_KEY = "jaminsetu_property_metrics";

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({
    anchal: null,
    roadWidthMin: 0,
    landType: [],
    areaRange: [0, 100],
    priceRange: [0, 15000000],
    verifiedOnly: false,
    roadSurface: [],
  });
  // PHASE 2 State
  const [currentUserKYC, setCurrentUserKYC] = useState<KYCData | null>(null);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [userNegotiations, setUserNegotiations] = useState<Negotiation[]>([]);
  const [propertyDocuments, setPropertyDocuments] = useState<{ [key: string]: Document[] }>({});
  // PHASE 3 State
  const [propertyMetrics, setPropertyMetrics] = useState<{ [key: string]: PropertyMetrics }>({});

  useEffect(() => {
    storageAdapter.initialize();
    const data = storageAdapter.getAll();
    setProperties(data);

    // Load favorites from localStorage
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } catch (e) {
      console.error("Failed to load favorites:", e);
    }

    // Load comparison list from localStorage
    try {
      const savedComparison = localStorage.getItem(COMPARISON_STORAGE_KEY);
      if (savedComparison) {
        setComparisonList(JSON.parse(savedComparison));
      }
    } catch (e) {
      console.error("Failed to load comparison list:", e);
    }

    // PHASE 2: Load KYC data
    try {
      const savedKYC = localStorage.getItem(KYC_STORAGE_KEY);
      if (savedKYC) {
        setCurrentUserKYC(JSON.parse(savedKYC));
      }
    } catch (e) {
      console.error("Failed to load KYC data:", e);
    }

    // PHASE 2: Load bookings
    try {
      const savedBookings = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      if (savedBookings) {
        setUserBookings(JSON.parse(savedBookings));
      }
    } catch (e) {
      console.error("Failed to load bookings:", e);
    }

    // PHASE 2: Load negotiations
    try {
      const savedNegotiations = localStorage.getItem(NEGOTIATIONS_STORAGE_KEY);
      if (savedNegotiations) {
        setUserNegotiations(JSON.parse(savedNegotiations));
      }
    } catch (e) {
      console.error("Failed to load negotiations:", e);
    }

    // PHASE 2: Load documents
    try {
      const savedDocuments = localStorage.getItem(DOCUMENTS_STORAGE_KEY);
      if (savedDocuments) {
        setPropertyDocuments(JSON.parse(savedDocuments));
      }
    } catch (e) {
      console.error("Failed to load documents:", e);
    }

    // PHASE 3: Load property metrics
    try {
      const savedMetrics = localStorage.getItem(PROPERTY_METRICS_STORAGE_KEY);
      if (savedMetrics) {
        setPropertyMetrics(JSON.parse(savedMetrics));
      }
    } catch (e) {
      console.error("Failed to load property metrics:", e);
    }

    setIsLoading(false);
  }, []);

  const filteredProperties = properties.filter((property) => {
    // Filter by Anchal
    if (filters.anchal && property.anchal !== filters.anchal) {
      return false;
    }

    // Filter by minimum road width
    if (property.roadWidth < filters.roadWidthMin) {
      return false;
    }

    // Filter by land type
    if (filters.landType.length > 0 && !filters.landType.includes(property.landType)) {
      return false;
    }

    // Filter by area range
    if (property.areaDecimal < filters.areaRange[0] || property.areaDecimal > filters.areaRange[1]) {
      return false;
    }

    // Filter by price range
    if (property.totalPrice < filters.priceRange[0] || property.totalPrice > filters.priceRange[1]) {
      return false;
    }

    // Filter by verification tier if strict mode
    if (filters.verifiedOnly && property.verificationTier < 2) {
      return false;
    }

    // Filter by road surface
    if (filters.roadSurface.length > 0 && !filters.roadSurface.includes(property.roadType)) {
      return false;
    }

    return true;
  });

  const addProperty = (data: SellerFormData) => {
    const id = `prop-${Date.now()}`;
    const areaKatha = Math.round((data.areaDecimal / 3.2) * 100) / 100;
    const pricePerKatha = Math.round(data.totalPrice / areaKatha);

    const newProperty: Property = {
      id,
      code: `ZS-RHT-${String(properties.length + 1).padStart(4, "0")}`,
      title: `${data.landType} - ${data.facing} Facing Plot - ${data.mauza}, ${data.anchal}`,
      description: `Newly listed ${data.landType.toLowerCase()} property with ${data.roadWidth}ft ${data.roadType} road access.`,
      images: [
        "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1494145904049-0dca7b0589b0?w=800&h=600&fit=crop",
      ],

      mauza: data.mauza,
      anchal: data.anchal,
      thanaNumber: data.thanaNumber,
      khata: data.khata,
      khesra: data.khesra,
      jamabandi: data.jamabandi,

      areaDecimal: data.areaDecimal,
      areaKatha,
      roadWidth: data.roadWidth,
      roadType: data.roadType,
      facing: data.facing as any,
      landType: data.landType,

      totalPrice: data.totalPrice,
      pricePerKatha,

      verificationTier: 1,
      verificationChecks: {
        kycCompleted: true,
        biharBhumiMatch: false,
        physicalVerified: false,
        thirtyYearSearch: false,
      },

      sellerName: data.sellerName,
      sellerPhoneRaw: data.sellerPhone,
      sellerPhoneMasked: maskPhoneNumber(data.sellerPhone),
      sellerCategory: "Individual",

      status: "Available",
      rating: {
        average: 0,
        count: 0,
        reviews: [],
      },
      amenities: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageAdapter.add(newProperty);
    setProperties([...properties, newProperty]);
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId];
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));

      // Update metrics
      setPropertyMetrics((prevMetrics) => {
        const metrics = prevMetrics[propertyId] || {
          propertyId,
          views: 0,
          favorites: 0,
          comparisons: 0,
          reviewCount: 0,
          trending: false,
        };

        const isFav = newFavorites.includes(propertyId);
        const updatedMetrics = {
          ...metrics,
          favorites: isFav ? metrics.favorites + 1 : Math.max(0, metrics.favorites - 1),
        };

        const newMetricsState = { ...prevMetrics, [propertyId]: updatedMetrics };
        localStorage.setItem(PROPERTY_METRICS_STORAGE_KEY, JSON.stringify(newMetricsState));
        return newMetricsState;
      });

      return newFavorites;
    });
  };

  const isFavorite = (propertyId: string) => {
    return favorites.includes(propertyId);
  };

  const toggleComparison = (propertyId: string) => {
    setComparisonList((prev) => {
      let newList: string[];
      if (prev.includes(propertyId)) {
        newList = prev.filter((id) => id !== propertyId);
      } else if (prev.length < 3) {
        newList = [...prev, propertyId];
      } else {
        newList = prev;
      }
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(newList));

      // Update metrics
      setPropertyMetrics((prevMetrics) => {
        const metrics = prevMetrics[propertyId] || {
          propertyId,
          views: 0,
          favorites: 0,
          comparisons: 0,
          reviewCount: 0,
          trending: false,
        };

        const isCompared = newList.includes(propertyId);
        const updatedMetrics = {
          ...metrics,
          comparisons: isCompared ? metrics.comparisons + 1 : Math.max(0, metrics.comparisons - 1),
        };

        const newMetricsState = { ...prevMetrics, [propertyId]: updatedMetrics };
        localStorage.setItem(PROPERTY_METRICS_STORAGE_KEY, JSON.stringify(newMetricsState));
        return newMetricsState;
      });

      return newList;
    });
  };

  const clearComparison = () => {
    setComparisonList([]);
    localStorage.removeItem(COMPARISON_STORAGE_KEY);
  };

  const addReview = (propertyId: string, rating: number, comment: string, userName: string) => {
    setProperties((prev) =>
      prev.map((prop) => {
        if (prop.id === propertyId) {
          const reviews = prop.rating?.reviews || [];
          const newReview: Review = {
            id: `review-${Date.now()}`,
            userId: `user-${Date.now()}`,
            userName,
            rating,
            comment,
            createdAt: new Date().toISOString(),
          };
          const allReviews = [...reviews, newReview];
          const averageRating =
            allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

          // Update metrics
          setPropertyMetrics((prevMetrics) => {
            const metrics = prevMetrics[propertyId] || {
              propertyId,
              views: 0,
              favorites: 0,
              comparisons: 0,
              reviewCount: 0,
              trending: false,
            };

            const updatedMetrics = {
              ...metrics,
              reviewCount: allReviews.length,
              avgRating: Math.round(averageRating * 10) / 10,
            };

            const newMetricsState = { ...prevMetrics, [propertyId]: updatedMetrics };
            localStorage.setItem(PROPERTY_METRICS_STORAGE_KEY, JSON.stringify(newMetricsState));
            return newMetricsState;
          });

          return {
            ...prop,
            rating: {
              average: Math.round(averageRating * 10) / 10,
              count: allReviews.length,
              reviews: allReviews,
            },
          };
        }
        return prop;
      })
    );
  };

  const getPropertyRating = (propertyId: string) => {
    return properties.find((p) => p.id === propertyId)?.rating;
  };

  // PHASE 2: KYC Methods
  const submitKYC = (data: KYCData) => {
    setCurrentUserKYC(data);
    localStorage.setItem(KYC_STORAGE_KEY, JSON.stringify(data));
  };

  const getKYCStatus = (userId: string) => {
    if (currentUserKYC?.userId === userId) {
      return currentUserKYC;
    }
    return null;
  };

  const canProceedToBooking = (userId: string) => {
    if (!currentUserKYC || currentUserKYC.userId !== userId) {
      return false;
    }
    return currentUserKYC.status === "verified" && currentUserKYC.tier === "complete";
  };

  // PHASE 2: Booking Methods
  const addBooking = (booking: Booking) => {
    const newBookings = [...userBookings, booking];
    setUserBookings(newBookings);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(newBookings));

    // Add booking ID to property's bookings array
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === booking.propertyId) {
          return {
            ...p,
            bookings: [...(p.bookings || []), booking.id],
          };
        }
        return p;
      })
    );
  };

  const getPropertyBookings = (propertyId: string) => {
    return userBookings.filter((b) => b.propertyId === propertyId);
  };

  const cancelBooking = (bookingId: string) => {
    const updatedBookings = userBookings.map((b) =>
      b.id === bookingId ? { ...b, status: "cancelled" as const } : b
    );
    setUserBookings(updatedBookings);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(updatedBookings));
  };

  // PHASE 2: Negotiation Methods
  const addNegotiation = (negotiation: Negotiation) => {
    const newNegotiations = [...userNegotiations, negotiation];
    setUserNegotiations(newNegotiations);
    localStorage.setItem(NEGOTIATIONS_STORAGE_KEY, JSON.stringify(newNegotiations));
  };

  const updateNegotiation = (negotiationId: string, updates: Partial<Negotiation>) => {
    const updatedNegotiations = userNegotiations.map((n) =>
      n.id === negotiationId ? { ...n, ...updates } : n
    );
    setUserNegotiations(updatedNegotiations);
    localStorage.setItem(NEGOTIATIONS_STORAGE_KEY, JSON.stringify(updatedNegotiations));
  };

  const getPropertyNegotiations = (propertyId: string) => {
    return userNegotiations.filter((n) => n.propertyId === propertyId);
  };

  // PHASE 2: Document Methods
  const submitDocument = (propertyId: string, document: Document) => {
    const docs = propertyDocuments[propertyId] || [];
    const updatedDocs = { ...propertyDocuments, [propertyId]: [...docs, document] };
    setPropertyDocuments(updatedDocs);
    localStorage.setItem(DOCUMENTS_STORAGE_KEY, JSON.stringify(updatedDocs));

    // Add document to property
    setProperties((prev) =>
      prev.map((p) => {
        if (p.id === propertyId) {
          return {
            ...p,
            documents: [...(p.documents || []), document],
          };
        }
        return p;
      })
    );
  };

  const getPropertyDocuments = (propertyId: string) => {
    return propertyDocuments[propertyId] || [];
  };

  // PHASE 3: Market Intelligence Methods
  const marketGetMarketRate = (mauza: string, landType: LandType, roadType: string): MarketRate => {
    return getMarketRate(properties, mauza, landType, roadType);
  };

  const marketCalculateFairPrice = (specs: { mauza: string; landType: LandType; areaKatha: number; roadWidth: number; roadType: "Pakka" | "Soling" | "Kachha" }) => {
    return calculateFairPrice(properties, specs);
  };

  const getPropertyMetricsData = (propertyId: string): PropertyMetrics | undefined => {
    return propertyMetrics[propertyId];
  };

  const getSimilarPropertiesData = (propertyId: string): SimilarProperty[] => {
    const property = properties.find((p) => p.id === propertyId);
    if (!property) return [];
    return getSimilarProperties(properties, property);
  };

  const recordPropertyView = (propertyId: string) => {
    setPropertyMetrics((prev) => {
      const metrics = prev[propertyId] || {
        propertyId,
        views: 0,
        favorites: 0,
        comparisons: 0,
        reviewCount: 0,
        trending: false,
      };

      const updatedMetrics = {
        ...metrics,
        views: metrics.views + 1,
        lastViewed: new Date().toISOString(),
      };

      const newMetricsState = { ...prev, [propertyId]: updatedMetrics };
      localStorage.setItem(PROPERTY_METRICS_STORAGE_KEY, JSON.stringify(newMetricsState));
      return newMetricsState;
    });
  };

  const getPriceTrendsData = (mauza: string, landType: LandType): PriceTrend[] => {
    return calculatePriceTrends(properties, mauza, landType);
  };

  const comparePriceToMarketData = (marketRate: number, actualPrice: number) => {
    return comparePriceToMarket(marketRate, actualPrice);
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        filters,
        setFilters,
        filteredProperties,
        addProperty,
        isLoading,
        favorites,
        toggleFavorite,
        isFavorite,
        addReview,
        getPropertyRating,
        comparisonList,
        toggleComparison,
        clearComparison,
        // PHASE 2
        currentUserKYC,
        submitKYC,
        getKYCStatus,
        canProceedToBooking,
        userBookings,
        addBooking,
        getPropertyBookings,
        cancelBooking,
        userNegotiations,
        addNegotiation,
        updateNegotiation,
        getPropertyNegotiations,
        submitDocument,
        getPropertyDocuments,
        // PHASE 3
        getMarketRate: marketGetMarketRate,
        calculateFairPrice: marketCalculateFairPrice,
        getPropertyMetrics: getPropertyMetricsData,
        getSimilarProperties: getSimilarPropertiesData,
        recordPropertyView,
        getPriceTrends: getPriceTrendsData,
        comparePriceToMarket: comparePriceToMarketData,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error("useProperties must be used within PropertyProvider");
  }
  return context;
};

const maskPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const lastFour = cleaned.slice(-4);
  return `+91 ${cleaned.slice(0, 4)}****${lastFour}`;
};
