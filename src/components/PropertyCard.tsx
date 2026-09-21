"use client";

import Link from "next/link";
import { Property } from "@/types";
import { MapPin, Ruler, Check, Zap } from "lucide-react";
import { formatPrice } from "@/utils/converters";

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const getTierBadge = (tier: number) => {
    const tiers = {
      1: { label: "Tier 1: Pending", color: "bg-amber-100 text-amber-800" },
      2: { label: "Tier 2: In Progress", color: "bg-blue-100 text-blue-800" },
      3: { label: "Tier 3: Verified", color: "bg-emerald-100 text-emerald-800" },
      4: { label: "Tier 4: Full Search", color: "bg-indigo-100 text-indigo-800" },
    };
    return tiers[tier as keyof typeof tiers];
  };

  const tier = getTierBadge(property.verificationTier);

  return (
    <Link href={`/property/${property.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-slate-200">
        {/* Image Container */}
        <div className="relative h-56 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden group">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
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
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Title & Location */}
          <div>
            <h3 className="font-semibold text-slate-900 line-clamp-2">{property.title}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
              <MapPin className="w-4 h-4" />
              {property.mauza}, {property.anchal}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-emerald-50 rounded-lg p-3 space-y-1">
            <div className="text-2xl font-bold text-slate-900">{formatPrice(property.totalPrice)}</div>
            <div className="text-sm text-slate-600">
              {formatPrice(property.pricePerKatha)} / Katha
            </div>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded p-2">
              <div className="text-xs text-slate-600">Area</div>
              <div className="font-semibold text-slate-900">{property.areaKatha} Katha</div>
              <div className="text-xs text-slate-600">({property.areaDecimal} Dec)</div>
            </div>
            <div className="bg-slate-50 rounded p-2">
              <div className="text-xs text-slate-600">Road Type</div>
              <div className="font-semibold text-slate-900">{property.roadType}</div>
            </div>
          </div>

          {/* Revenue IDs */}
          <div className="bg-slate-50 rounded p-3 text-xs space-y-1">
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

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold py-2 px-3 rounded-lg transition text-sm">
              View Passport
            </button>
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-3 rounded-lg transition text-sm">
              WhatsApp
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};
