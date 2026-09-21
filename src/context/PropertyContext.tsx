"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Property, FilterState, SellerFormData } from "@/types";
import { storageAdapter } from "@/lib/storage";

interface PropertyContextType {
  properties: Property[];
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  filteredProperties: Property[];
  addProperty: (data: SellerFormData) => void;
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    anchal: null,
    roadWidthMin: 0,
    landCategory: [],
    priceRange: [0, 15000000],
    verifiedOnly: false,
    roadSurface: [],
  });

  useEffect(() => {
    storageAdapter.initialize();
    const data = storageAdapter.getAll();
    setProperties(data);
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
      title: `${data.facing} Facing Plot - ${data.mauza}, ${data.anchal}`,
      description: `Newly listed property with ${data.roadWidth}ft ${data.roadType} road access.`,
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storageAdapter.add(newProperty);
    setProperties([...properties, newProperty]);
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
