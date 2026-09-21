"use client";

import React, { useState, useMemo } from "react";
import { LandType } from "@/types";
import { useProperties } from "@/context/PropertyContext";
import { getPropertiesForMauza } from "@/utils/marketCalculations";

export const MarketRatesCalculator: React.FC = () => {
  const { properties, calculateFairPrice, getMarketRate, comparePriceToMarket } = useProperties();

  const [formData, setFormData] = useState({
    mauza: "",
    landType: "Residential" as LandType,
    areaDecimal: 1,
    roadWidth: 16,
    roadType: "Pakka" as "Pakka" | "Soling" | "Kachha",
    askingPrice: 0,
  });

  // Get unique mouzas from properties
  const mouzas = useMemo(() => {
    const uniqueMouzas = new Set(properties.map((p) => p.mauza));
    return Array.from(uniqueMouzas).sort();
  }, [properties]);

  // Convert decimal to katha (1 Katha ≈ 3.2 Decimals)
  const areaKatha = parseFloat((formData.areaDecimal / 3.2).toFixed(2));

  // Calculate fair price
  const priceCalc = useMemo(() => {
    if (!formData.mauza || areaKatha <= 0) return null;

    const result = calculateFairPrice({
      mauza: formData.mauza,
      landType: formData.landType,
      areaKatha,
      roadWidth: formData.roadWidth,
      roadType: formData.roadType,
    });

    return result;
  }, [formData.mauza, formData.landType, areaKatha, formData.roadWidth, formData.roadType, calculateFairPrice]);

  // Get market rate for display
  const marketRate = useMemo(() => {
    if (!formData.mauza) return null;
    return getMarketRate(formData.mauza, formData.landType, formData.roadType);
  }, [formData.mauza, formData.landType, formData.roadType, getMarketRate]);

  // Compare asking price to market if provided
  const priceComparison = useMemo(() => {
    if (!priceCalc || formData.askingPrice <= 0) return null;
    return comparePriceToMarket(priceCalc.fairValue, formData.askingPrice);
  }, [priceCalc, formData.askingPrice, comparePriceToMarket]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("price") || name === "areaDecimal" || name === "roadWidth" ? parseFloat(value) : value,
    }));
  };

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "bg-green-50 border-green-200";
      case "medium":
        return "bg-yellow-50 border-yellow-200";
      case "low":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50";
    }
  };

  const getConfidenceText = (confidence: string) => {
    switch (confidence) {
      case "high":
        return "High (10+ properties)";
      case "medium":
        return "Medium (5-9 properties)";
      case "low":
        return "Low (<5 properties)";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Market Rates Calculator</h2>
        <p className="text-gray-600 mt-1">Get fair price estimates based on market data</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <div>
          <div className="space-y-4">
            {/* Mauza */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Village (Mauza)</label>
              <select
                name="mauza"
                value={formData.mauza}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="">Select a village...</option>
                {mouzas.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Land Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Land Type</label>
              <select
                name="landType"
                value={formData.landType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Agricultural">Agricultural</option>
              </select>
            </div>

            {/* Area in Decimal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area (Decimal) ≈ {areaKatha.toFixed(2)} Katha
              </label>
              <input
                type="number"
                name="areaDecimal"
                value={formData.areaDecimal}
                onChange={handleChange}
                min="0.1"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter area in decimal"
              />
            </div>

            {/* Road Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Road Width (feet)</label>
              <select
                name="roadWidth"
                value={formData.roadWidth}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="8">8 feet</option>
                <option value="12">12 feet</option>
                <option value="16">16 feet (standard)</option>
                <option value="24">24 feet</option>
                <option value="32">32 feet</option>
                <option value="40">40 feet</option>
              </select>
            </div>

            {/* Road Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Road Type</label>
              <select
                name="roadType"
                value={formData.roadType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="Kachha">Kachha (Unpaved)</option>
                <option value="Soling">Soling (Partially Paved)</option>
                <option value="Pakka">Pakka (Fully Paved)</option>
              </select>
            </div>

            {/* Asking Price (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Asking Price (Optional)</label>
              <input
                type="number"
                name="askingPrice"
                value={formData.askingPrice}
                onChange={handleChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                placeholder="Enter asking price to compare"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          {!formData.mauza ? (
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <p className="text-gray-600">Select a village to see market rates</p>
            </div>
          ) : priceCalc ? (
            <div className="space-y-4">
              {/* Market Rate Card */}
              <div className={`rounded-lg border-2 p-4 ${getConfidenceColor(priceCalc.confidence)}`}>
                <p className="text-sm text-gray-600 mb-2">Confidence Level</p>
                <p className="font-semibold text-gray-900">{getConfidenceText(priceCalc.confidence)}</p>
              </div>

              {/* Fair Price */}
              <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Fair Market Value</p>
                <p className="text-3xl font-bold text-blue-600">{formatCurrency(priceCalc.fairValue)}</p>
              </div>

              {/* Price Range */}
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-3">Price Range (±15% buffer)</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Low End:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(priceCalc.lowEnd)}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-gray-900 h-2 rounded-full"
                      style={{
                        width: "50%",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">High End:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(priceCalc.highEnd)}</span>
                  </div>
                </div>
              </div>

              {/* Price Comparison */}
              {priceComparison && formData.askingPrice > 0 && (
                <div className="rounded-lg border-2 p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-amber-200">
                  <p className="text-sm text-gray-600 mb-2">Your Asking Price vs Market</p>
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-2xl font-bold">{formatCurrency(formData.askingPrice)}</p>
                      <p className={`text-sm font-semibold mt-1 ${priceComparison.comparison === "underpriced" ? "text-green-600" : priceComparison.comparison === "overpriced" ? "text-red-600" : "text-yellow-600"}`}>
                        {priceComparison.comparison === "underpriced" ? "✓ Underpriced" : priceComparison.comparison === "overpriced" ? "⚠ Overpriced" : "~ Fair Price"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${priceComparison.percentDifference < 0 ? "text-green-600" : priceComparison.percentDifference > 0 ? "text-red-600" : "text-yellow-600"}`}>
                        {priceComparison.percentDifference > 0 ? "+" : ""}{priceComparison.percentDifference}%
                      </p>
                      <p className="text-xs text-gray-500">vs fair value</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Market Context */}
              {marketRate && (
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Market Context</p>
                  <p className="text-sm text-gray-600">
                    Avg price: <strong>{formatCurrency(marketRate.pricePerKatha)}</strong> per Katha in {formData.mauza}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Based on {marketRate.sampleSize} properties in area</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 rounded-lg border border-red-200 p-6 text-center">
              <p className="text-red-600">Not enough data for this location</p>
              <p className="text-sm text-red-500 mt-2">Please add more properties first</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
