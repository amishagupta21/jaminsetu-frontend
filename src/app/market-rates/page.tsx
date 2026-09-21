"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useProperties } from "@/context/PropertyContext";
import { MarketRatesCalculator } from "@/components/MarketRatesCalculator";
import { PriceTrendChart } from "@/components/PriceTrendChart";
import { LandType } from "@/types";
import { getPropertiesForMauza } from "@/utils/marketCalculations";

export default function MarketRatesPage() {
  const { properties, getPriceTrends } = useProperties();
  const [selectedMauza, setSelectedMauza] = useState<string>("");
  const [selectedLandType, setSelectedLandType] = useState<LandType>("Residential");

  // Get unique mouzas from properties
  const mouzas = useMemo(() => {
    const uniqueMouzas = new Set(properties.map((p) => p.mauza));
    return Array.from(uniqueMouzas).sort();
  }, [properties]);

  // Get mouzas with enough data (3+ properties)
  const availableMouzas = useMemo(() => {
    return mouzas.filter((m) => getPropertiesForMauza(properties, m, 3).length >= 3);
  }, [mouzas, properties]);

  // Get trends for selected mauza
  const trends = useMemo(() => {
    if (!selectedMauza) return [];
    return getPriceTrends(selectedMauza, selectedLandType);
  }, [selectedMauza, selectedLandType, getPriceTrends]);

  // Get property statistics by mauza
  const mauzaStats = useMemo(() => {
    return mouzas.map((m) => {
      const mauzaProps = properties.filter((p) => p.mauza === m);
      const avgPrice = Math.round(mauzaProps.reduce((sum, p) => sum + p.totalPrice, 0) / mauzaProps.length);
      const avgPricePerKatha = Math.round(mauzaProps.reduce((sum, p) => sum + p.pricePerKatha, 0) / mauzaProps.length);
      return {
        mauza: m,
        count: mauzaProps.length,
        avgPrice,
        avgPricePerKatha,
      };
    });
  }, [mouzas, properties]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7 7l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Market Rates</h1>
          <p className="text-gray-600 mt-2">Get fair market prices based on real property data</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Market Calculator */}
        <div className="mb-8">
          <MarketRatesCalculator />
        </div>

        {/* Price Trends Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Trends by Village</h2>

          {availableMouzas.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600 mb-4">No villages with enough data yet</p>
              <p className="text-sm text-gray-500">Add more properties to see market trends</p>
              <Link href="/list-land" className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium">
                Add Property
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Mauza Selection */}
              <div className="bg-white rounded-lg shadow p-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Village</label>
                    <select
                      value={selectedMauza}
                      onChange={(e) => setSelectedMauza(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="">Choose a village...</option>
                      {availableMouzas.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Land Type</label>
                    <select
                      value={selectedLandType}
                      onChange={(e) => setSelectedLandType(e.target.value as LandType)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    >
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Agricultural">Agricultural</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Trends Chart */}
              {selectedMauza && <PriceTrendChart trends={trends} mauza={selectedMauza} landType={selectedLandType} />}
            </div>
          )}
        </div>

        {/* Market Overview Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Overview by Village</h2>

          {mauzaStats.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">No properties listed yet</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Village</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Properties</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Avg Total Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Avg Per Katha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mauzaStats
                    .filter((stat) => stat.count >= 3)
                    .sort((a, b) => b.count - a.count)
                    .map((stat) => (
                      <tr key={stat.mauza} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-semibold text-gray-900">{stat.mauza}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                            {stat.count} properties
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-semibold">
                          {formatCurrency(stat.avgPrice)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                          {formatCurrency(stat.avgPricePerKatha)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => setSelectedMauza(stat.mauza)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View Trends →
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
