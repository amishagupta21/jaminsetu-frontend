"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property, FilterState, SellerFormData, FavoritesData, Review, Rating } from "@/types";
import { storageAdapter } from "@/lib/storage";

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
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = "jaminsetu_favorites";
const COMPARISON_STORAGE_KEY = "jaminsetu_comparison";

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
