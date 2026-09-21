"use client";

import React from "react";
import { PriceTrend, LandType } from "@/types";

interface PriceTrendChartProps {
  trends: PriceTrend[];
  mauza: string;
  landType: LandType;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ trends, mauza, landType }) => {
  if (trends.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">Insufficient data for {mauza}</p>
        <p className="text-sm text-gray-400 mt-2">Need at least 3 properties to show trends</p>
      </div>
    );
  }

  // Calculate dimensions
  const width = 600;
  const height = 300;
  const padding = 40;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  // Get data
  const pricePerKathas = trends.map((t) => t.avgPricePerKatha);
  const minPrice = Math.min(...pricePerKathas);
  const maxPrice = Math.max(...pricePerKathas);
  const priceRange = maxPrice - minPrice;

  // Calculate trend (is it going up or down)
  const firstPrice = trends[0]?.avgPricePerKatha || 0;
  const lastPrice = trends[trends.length - 1]?.avgPricePerKatha || 0;
  const trendUp = lastPrice > firstPrice;
  const trendPercent = firstPrice ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;

  // Generate SVG points
  const points = trends
    .map((trend, index) => {
      const x = padding + (index / (trends.length - 1 || 1)) * plotWidth;
      const y = padding + plotHeight - ((trend.avgPricePerKatha - minPrice) / (priceRange || 1)) * plotHeight;
      return `${x},${y}`;
    })
    .join(" ");

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)} L`;
    }
    return `₹${value}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Price Trends - {mauza}</h3>
          <p className="text-sm text-gray-500 mt-1">Last 6 months average price per Katha</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${trendUp ? "bg-green-50" : "bg-red-50"}`}>
          {trendUp ? (
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m0 0h4m10 0v8m0 0l4-4m0 0h-4" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m0 0v-4h-4m0 0L3 8m0 0l4-4m0 0v4h4" />
            </svg>
          )}
          <span className={`text-sm font-semibold ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trendUp ? "+" : ""}{trendPercent.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg width={width} height={height} className="mb-6 border border-gray-200 rounded bg-gray-50">
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent) => (
          <g key={percent}>
            <line
              x1={padding}
              y1={padding + (percent / 100) * plotHeight}
              x2={width - padding}
              y2={padding + (percent / 100) * plotHeight}
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="4,4"
            />
            <text
              x={padding - 10}
              y={padding + (percent / 100) * plotHeight + 4}
              textAnchor="end"
              className="text-xs fill-gray-500"
            >
              {formatCurrency(minPrice + ((100 - percent) / 100) * priceRange)}
            </text>
          </g>
        ))}

        {/* X-axis labels */}
        {trends.map((trend, index) => (
          <g key={index}>
            <text
              x={padding + (index / (trends.length - 1 || 1)) * plotWidth}
              y={height - 10}
              textAnchor="middle"
              className="text-xs fill-gray-500"
            >
              {trend.date.split("-")[1]}/{trend.date.split("-")[0].slice(-2)}
            </text>
          </g>
        ))}

        {/* Axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#9ca3af" strokeWidth="2" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#9ca3af" strokeWidth="2" />

        {/* Line chart */}
        <polyline
          points={points}
          fill="none"
          stroke="#000000"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
        />

        {/* Data points */}
        {trends.map((trend, index) => {
          const x = padding + (index / (trends.length - 1 || 1)) * plotWidth;
          const y = padding + plotHeight - ((trend.avgPricePerKatha - minPrice) / (priceRange || 1)) * plotHeight;
          return (
            <circle key={index} cx={x} cy={y} r="4" fill="#000000" stroke="white" strokeWidth="2" />
          );
        })}
      </svg>

      {/* Statistics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-600">Current Avg</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(lastPrice)}</p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-600">Min - Max</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {formatCurrency(minPrice)} - {formatCurrency(maxPrice)}
          </p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-600">Trend</p>
          <p className="text-lg font-bold text-gray-900 mt-1">
            {trendUp ? "📈 Up" : "📉 Down"} {Math.abs(trendPercent).toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 rounded p-3">
          <p className="text-xs text-gray-600">Properties</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{trends[trends.length - 1]?.count || 0}+</p>
        </div>
      </div>
    </div>
  );
};
