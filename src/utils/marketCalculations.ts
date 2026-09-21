import { Property, LandType, MarketRate, PriceTrend, SimilarProperty } from "@/types";

/**
 * Calculate the average price per Katha for a specific mauza and land type
 */
export const getAveragePricePerKatha = (
  properties: Property[],
  mauza: string,
  landType: LandType,
  roadType?: string
): { avgPrice: number; sampleSize: number } => {
  const filtered = properties.filter((p) => {
    if (p.mauza !== mauza || p.landType !== landType) return false;
    if (roadType && p.roadType !== roadType) return false;
    return true;
  });

  if (filtered.length === 0) {
    return { avgPrice: 0, sampleSize: 0 };
  }

  const total = filtered.reduce((sum, p) => sum + p.pricePerKatha, 0);
  return {
    avgPrice: Math.round(total / filtered.length),
    sampleSize: filtered.length,
  };
};

/**
 * Get market rate for a specific property specification
 */
export const getMarketRate = (
  properties: Property[],
  mauza: string,
  landType: LandType,
  roadType: string
): MarketRate => {
  const { avgPrice, sampleSize } = getAveragePricePerKatha(properties, mauza, landType, roadType);

  let confidence: "high" | "medium" | "low" = "low";
  if (sampleSize >= 10) confidence = "high";
  else if (sampleSize >= 5) confidence = "medium";

  return {
    mauza,
    landType,
    roadType,
    pricePerKatha: avgPrice || 0,
    confidence,
    sampleSize,
  };
};

/**
 * Calculate fair price based on property specifications
 */
interface PriceCalculationSpecs {
  mauza: string;
  landType: LandType;
  areaKatha: number;
  roadWidth: number;
  roadType: "Pakka" | "Soling" | "Kachha";
}

export const calculateFairPrice = (
  properties: Property[],
  specs: PriceCalculationSpecs
): {
  lowEnd: number;
  fairValue: number;
  highEnd: number;
  confidence: "high" | "medium" | "low";
  sampleSize: number;
} => {
  const baseRate = getMarketRate(properties, specs.mauza, specs.landType, specs.roadType);

  // Start with base price
  let pricePerKatha = baseRate.pricePerKatha;

  // Apply road width multiplier (16ft baseline = 1.0x)
  const roadWidthMultiplier = getRoadWidthMultiplier(specs.roadWidth);

  // Apply road surface multiplier
  const roadSurfaceMultiplier = getRoadSurfaceMultiplier(specs.roadType);

  // Calculate final price per Katha
  const adjustedPricePerKatha = pricePerKatha * roadWidthMultiplier * roadSurfaceMultiplier;

  // Calculate total price based on area
  const fairPrice = Math.round(adjustedPricePerKatha * specs.areaKatha);

  // Add 15% buffer for range
  const buffer = Math.round(fairPrice * 0.15);
  const lowEnd = Math.round(fairPrice - buffer);
  const highEnd = Math.round(fairPrice + buffer);

  return {
    lowEnd,
    fairValue: fairPrice,
    highEnd,
    confidence: baseRate.confidence,
    sampleSize: baseRate.sampleSize,
  };
};

/**
 * Get road width multiplier (16ft = 1.0x baseline)
 */
const getRoadWidthMultiplier = (width: number): number => {
  if (width <= 10) return 0.7;
  if (width <= 16) return 1.0;
  if (width <= 24) return 1.1;
  if (width <= 32) return 1.3;
  if (width <= 40) return 1.5;
  return 1.6;
};

/**
 * Get road surface multiplier
 */
const getRoadSurfaceMultiplier = (roadType: "Pakka" | "Soling" | "Kachha"): number => {
  switch (roadType) {
    case "Kachha":
      return 0.8;
    case "Soling":
      return 1.0;
    case "Pakka":
      return 1.2;
    default:
      return 1.0;
  }
};

/**
 * Calculate price trends over months for a mauza
 */
export const calculatePriceTrends = (
  properties: Property[],
  mauza: string,
  landType: LandType,
  months: number = 6
): PriceTrend[] => {
  const trends: PriceTrend[] = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    const yearMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    // For MVP, we'll distribute properties across months based on creation date
    const monthProperties = properties.filter((p) => {
      if (p.mauza !== mauza || p.landType !== landType) return false;
      const propDate = p.createdAt.substring(0, 7); // YYYY-MM
      // For demo purposes, assign older properties to older months
      return propDate <= yearMonth;
    });

    if (monthProperties.length >= 3) {
      const prices = monthProperties.map((p) => p.totalPrice);
      const pricePerKathas = monthProperties.map((p) => p.pricePerKatha);

      trends.push({
        mauza,
        landType,
        date: yearMonth,
        avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
        avgPricePerKatha: Math.round(pricePerKathas.reduce((a, b) => a + b, 0) / pricePerKathas.length),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        count: monthProperties.length,
      });
    }
  }

  return trends;
};

/**
 * Find similar properties based on multiple criteria
 */
export const getSimilarProperties = (
  properties: Property[],
  targetProperty: Property,
  limit: number = 5
): SimilarProperty[] => {
  const similar = properties
    .filter((p) => p.id !== targetProperty.id)
    .map((property) => {
      let similarityScore = 0;
      const reasons: string[] = [];

      // Same mauza (40 points)
      if (property.mauza === targetProperty.mauza) {
        similarityScore += 40;
        reasons.push("Same location");
      }

      // Similar area (within ±50%) (20 points)
      const areaMin = targetProperty.areaKatha * 0.5;
      const areaMax = targetProperty.areaKatha * 1.5;
      if (property.areaKatha >= areaMin && property.areaKatha <= areaMax) {
        similarityScore += 20;
        reasons.push("Similar size");
      }

      // Same land type (20 points)
      if (property.landType === targetProperty.landType) {
        similarityScore += 20;
        reasons.push("Same land type");
      }

      // Similar price (within ±20%) (15 points)
      const priceMin = targetProperty.totalPrice * 0.8;
      const priceMax = targetProperty.totalPrice * 1.2;
      if (property.totalPrice >= priceMin && property.totalPrice <= priceMax) {
        similarityScore += 15;
        reasons.push("Similar price");
      }

      // Good rating (5 points)
      if (property.rating && property.rating.average >= 4.0) {
        similarityScore += 5;
        reasons.push("Good reviews");
      }

      return {
        propertyId: property.id,
        title: property.title,
        price: property.totalPrice,
        pricePerKatha: property.pricePerKatha,
        similarity: similarityScore,
        reasons,
      };
    })
    .filter((p) => p.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similar;
};

/**
 * Get properties for a specific mauza with minimum sample size
 */
export const getPropertiesForMauza = (
  properties: Property[],
  mauza: string,
  minSampleSize: number = 3
): Property[] => {
  const filtered = properties.filter((p) => p.mauza === mauza);
  return filtered.length >= minSampleSize ? filtered : [];
};

/**
 * Calculate price comparison vs market rate
 */
export const comparePriceToMarket = (
  marketRate: number,
  actualPrice: number
): {
  comparison: "underpriced" | "fair" | "overpriced";
  percentDifference: number;
} => {
  const diff = ((actualPrice - marketRate) / marketRate) * 100;

  let comparison: "underpriced" | "fair" | "overpriced" = "fair";
  if (diff < -10) comparison = "underpriced";
  else if (diff > 10) comparison = "overpriced";

  return {
    comparison,
    percentDifference: Math.round(diff),
  };
};
