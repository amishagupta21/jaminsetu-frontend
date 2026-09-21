"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useProperties } from "@/context/PropertyContext";
import { Property } from "@/types";

interface SimilarPropertiesWidgetProps {
  propertyId: string;
  limit?: number;
}

export const SimilarPropertiesWidget: React.FC<SimilarPropertiesWidgetProps> = ({ propertyId, limit = 4 }) => {
  const { properties, getSimilarProperties, toggleComparison, comparisonList } = useProperties();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const similarProps = getSimilarProperties(propertyId).slice(0, limit);
  const currentProperty = properties.find((p) => p.id === propertyId);

  if (!currentProperty || similarProps.length === 0) {
    return null;
  }

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value}`;
  };

  const formatArea = (areaKatha: number) => {
    if (areaKatha < 1) {
      return `${(areaKatha * 3.2).toFixed(1)} Decimal`;
    }
    return `${areaKatha.toFixed(2)} Katha`;
  };

  const getSimilarityLabel = (score: number) => {
    if (score >= 80) return "Highly Similar";
    if (score >= 60) return "Very Similar";
    if (score >= 40) return "Similar";
    return "Somewhat Similar";
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Similar Properties</h3>

      <div className="grid md:grid-cols-2 gap-4">
        {similarProps.map((sim) => {
          const property = properties.find((p) => p.id === sim.propertyId);
          if (!property) return null;

          const isComparing = comparisonList.includes(sim.propertyId);

          return (
            <div
              key={sim.propertyId}
              className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              onMouseEnter={() => setHoveredId(sim.propertyId)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Image */}
              <div className="relative h-40 bg-gray-100 overflow-hidden">
                {property.images && property.images[0] ? (
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Similarity Badge */}
                <div className="absolute top-2 right-2 bg-black text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {sim.similarity}% Match
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Title */}
                <Link href={`/property/${sim.propertyId}`} className="block group">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 line-clamp-2">
                    {sim.title}
                  </h4>
                </Link>

                {/* Location */}
                <p className="text-sm text-gray-500 mt-1">{property.mauza}, {property.anchal}</p>

                {/* Similarity Reasons */}
                {sim.reasons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {sim.reasons.map((reason, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {reason}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(sim.price)}</p>
                  <p className="text-xs text-gray-500">{formatCurrency(sim.pricePerKatha)}/Katha</p>
                </div>

                {/* Area & Road */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Area</p>
                    <p className="font-semibold text-gray-900 text-xs">{formatArea(property.areaKatha)}</p>
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">Road</p>
                    <p className="font-semibold text-gray-900 text-xs">{property.roadWidth}ft {property.roadType}</p>
                  </div>
                </div>

                {/* Rating */}
                {property.rating && property.rating.count > 0 && (
                  <div className="mt-3 flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(property.rating!.average) ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-600">
                      {property.rating.average.toFixed(1)} ({property.rating.count})
                    </span>
                  </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <Link
                    href={`/property/${sim.propertyId}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm font-medium text-center transition"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => toggleComparison(sim.propertyId)}
                    className={`flex-1 border py-2 rounded text-sm font-medium transition ${
                      isComparing
                        ? "bg-gray-900 text-white border-gray-900"
                        : "border-gray-300 text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {isComparing ? "✓ Compare" : "Compare"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Link */}
      {similarProps.length >= limit && (
        <div className="mt-4 text-center">
          <Link href={`/property/${propertyId}/similar`} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View all similar properties →
          </Link>
        </div>
      )}
    </div>
  );
};
