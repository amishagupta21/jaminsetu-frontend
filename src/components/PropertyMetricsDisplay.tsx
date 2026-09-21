"use client";

import React from "react";
import { useProperties } from "@/context/PropertyContext";

interface PropertyMetricsDisplayProps {
  propertyId: string;
  compact?: boolean;
}

export const PropertyMetricsDisplay: React.FC<PropertyMetricsDisplayProps> = ({ propertyId, compact = false }) => {
  const { getPropertyMetrics, isFavorite } = useProperties();
  const metrics = getPropertyMetrics(propertyId);

  if (!metrics) {
    return null;
  }

  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          {metrics.views}
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          {metrics.favorites}
        </div>
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {metrics.comparisons}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">Property Metrics</h3>

      <div className="grid grid-cols-3 gap-3">
        {/* Views */}
        <div className="text-center">
          <div className="bg-blue-50 rounded-lg p-3 mb-2">
            <svg className="w-5 h-5 text-blue-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.views}</p>
          <p className="text-xs text-gray-600">Views</p>
        </div>

        {/* Favorites */}
        <div className="text-center">
          <div className="bg-red-50 rounded-lg p-3 mb-2">
            <svg className="w-5 h-5 text-red-600 mx-auto" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.favorites}</p>
          <p className="text-xs text-gray-600">Favorites</p>
        </div>

        {/* Comparisons */}
        <div className="text-center">
          <div className="bg-purple-50 rounded-lg p-3 mb-2">
            <svg className="w-5 h-5 text-purple-600 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-2xl font-bold text-gray-900">{metrics.comparisons}</p>
          <p className="text-xs text-gray-600">Comparisons</p>
        </div>
      </div>

      {/* Trending Indicator */}
      {metrics.views > 10 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Trending property - High engagement
          </p>
        </div>
      )}

      {/* Reviews */}
      {metrics.reviewCount > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>{metrics.reviewCount}</strong> review{metrics.reviewCount !== 1 ? "s" : ""} from users
          </p>
          {metrics.avgRating && (
            <p className="text-xs text-gray-600 mt-1">
              Average rating: <strong>★ {metrics.avgRating.toFixed(1)}</strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
};
