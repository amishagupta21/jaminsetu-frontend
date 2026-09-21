"use client";

import Link from "next/link";
import { Property } from "@/types";
import { MapPin, Check, Star } from "lucide-react";
import { formatPrice } from "@/utils/converters";
import { FavoritesButton } from "./FavoritesButton";
import { useProperties } from "@/context/PropertyContext";
import { RatingStars } from "./RatingStars";

interface PropertyCardProps {
  property: Property;
  showComparison?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, showComparison = false }) => {
  const { comparisonList, toggleComparison } = useProperties();
  const getTierBadge = (tier: number) => {
    const tiers = {
      1: { label: "Tier 1: Pending", color: "bg-slate-200 text-slate-800" },
      2: { label: "Tier 2: In Progress", color: "bg-slate-300 text-slate-900" },
      3: { label: "Tier 3: Verified", color: "bg-slate-400 text-slate-900" },
      4: { label: "Tier 4: Full Search", color: "bg-white0 text-white" },
    };
    return tiers[tier as keyof typeof tiers];
  };

  const tier = getTierBadge(property.verificationTier);

  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white rounded-lg overflow-hidden border border-slate-200 hover:border-slate-300 transition-all">
        {/* Image Container */}
        <div className="relative h-56 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden group">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
          {/* Favorites Button */}
          <div className="absolute top-3 left-3">
            <FavoritesButton propertyId={property.id} size="md" />
          </div>

          {/* Road Width Badge */}
          <div className="absolute top-3 right-3 bg-white shadow-lg rounded-full px-3 py-1.5 text-sm font-bold text-slate-900">
            {property.roadWidth}ft
          </div>

          {/* Verification Badge */}
          <div className={`absolute bottom-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold ${tier.color}`}>
            {property.verificationTier >= 3 ? (
              <span className="flex items-center gap-1">
                <Check className="w-3 h-3" /> TIER {property.verificationTier}
              </span>
            ) : (
              `TIER ${property.verificationTier}`
            )}
          </div>

          {/* Rating Badge */}
          {property.rating && property.rating.count > 0 && (
            <div className="absolute bottom-3 right-3 bg-white shadow-lg rounded-full px-3 py-1.5 text-sm font-bold text-slate-900 flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {property.rating.average}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 flex flex-col h-full">
          {/* Title & Location */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-slate-900 line-clamp-2 flex-1">{property.title}</h3>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">
                {property.landType}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <MapPin className="w-4 h-4" />
              {property.mauza}, {property.anchal}
            </div>
          </div>

          {/* Rating */}
          {property.rating && property.rating.count > 0 && (
            <div className="py-2 border-y border-slate-200">
              <RatingStars rating={property.rating.average} count={property.rating.count} size="sm" />
            </div>
          )}

          {/* Amenities Badge */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="flex gap-2">
              <span className="inline-block bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                {property.amenities.length} amenities
              </span>
            </div>
          )}

          {/* PHASE 2: Seller KYC Badge */}
          {property.sellerKYC && property.sellerKYC.status === "verified" && (
            <div className="flex gap-2">
              <span className="inline-block bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                <span>✓</span>
                Verified Seller
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="bg-slate-100 rounded-lg p-3 space-y-1 border border-slate-300">
            <div className="text-2xl font-bold text-slate-900">{formatPrice(property.totalPrice)}</div>
            <div className="text-sm text-slate-600">
              {formatPrice(property.pricePerKatha)} / Katha
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-white rounded p-2">
              <div className="text-xs text-slate-600">Area</div>
              <div className="font-semibold text-slate-900">{property.areaKatha} Katha</div>
              <div className="text-xs text-slate-600">({property.areaDecimal} Dec)</div>
            </div>
            <div className="bg-white rounded p-2">
              <div className="text-xs text-slate-600">Road Type</div>
              <div className="font-semibold text-slate-900">{property.roadType}</div>
            </div>
          </div>

          {/* Revenue IDs */}
          <div className="bg-white rounded p-3 text-xs space-y-1">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-slate-600">Khata:</span>
                <span className="font-semibold text-slate-900 ml-1">{property.khata}</span>
              </div>
              <div>
                <span className="text-slate-600">Khesra:</span>
                <span className="font-semibold text-slate-900 ml-1">{property.khesra}</span>
              </div>
              <div>
                <span className="text-slate-600">Jamabandi:</span>
                <span className="font-semibold text-slate-900 ml-1">{property.jamabandi}</span>
              </div>
            </div>
          </div>

          {/* Comparison Checkbox & CTA Buttons */}
          <div className="space-y-2 pt-2 mt-auto">
            <div
              onClick={(e) => {
                e.preventDefault();
                toggleComparison(property.id);
              }}
              className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
            >
              <input
                type="checkbox"
                checked={comparisonList.includes(property.id)}
                onChange={() => {}}
                className="w-4 h-4 cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              />
              <span className="text-sm font-medium text-slate-900">Compare ({comparisonList.length}/3)</span>
            </div>
            {showComparison ? (
              <button className="w-full bg-black hover:bg-slate-900 text-white font-semibold py-2 px-3 rounded-lg transition text-sm">
                Add to Comparison
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 px-3 rounded-lg transition text-sm">
                  View Passport
                </button>
                <button className="bg-black hover:bg-slate-900 text-white font-semibold py-2 px-3 rounded-lg transition text-sm">
                  WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
