"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useProperties } from "@/context/PropertyContext";

export default function SellerDashboardPage() {
  const { properties, getPropertyMetrics, currentUserKYC } = useProperties();
  const [sortBy, setSortBy] = useState<"views" | "favorites" | "comparisons" | "price">("views");

  // Get current user's properties (in real app, would filter by sellerId)
  // For MVP, we'll show all properties with metrics
  const listedProperties = useMemo(() => {
    return properties
      .map((prop) => {
        const metrics = getPropertyMetrics(prop.id);
        return {
          ...prop,
          metrics: metrics || {
            propertyId: prop.id,
            views: 0,
            favorites: 0,
            comparisons: 0,
            reviewCount: 0,
            trending: false,
          },
        };
      })
      .filter((p) => p.metrics)
      .sort((a, b) => {
        switch (sortBy) {
          case "views":
            return b.metrics.views - a.metrics.views;
          case "favorites":
            return b.metrics.favorites - a.metrics.favorites;
          case "comparisons":
            return b.metrics.comparisons - a.metrics.comparisons;
          case "price":
            return b.totalPrice - a.totalPrice;
          default:
            return 0;
        }
      });
  }, [properties, getPropertyMetrics, sortBy]);

  const stats = useMemo(() => {
    const totalViews = listedProperties.reduce((sum, p) => sum + p.metrics.views, 0);
    const totalFavorites = listedProperties.reduce((sum, p) => sum + p.metrics.favorites, 0);
    const totalComparisons = listedProperties.reduce((sum, p) => sum + p.metrics.comparisons, 0);
    const avgViews = listedProperties.length > 0 ? Math.round(totalViews / listedProperties.length) : 0;

    return {
      totalListings: listedProperties.length,
      totalViews,
      totalFavorites,
      totalComparisons,
      avgViews,
      trendingCount: listedProperties.filter((p) => p.metrics.views > 10).length,
    };
  }, [listedProperties]);

  const formatCurrency = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    }
    if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${value.toLocaleString()}`;
  };

  const formatArea = (areaKatha: number) => {
    if (areaKatha < 1) {
      return `${(areaKatha * 3.2).toFixed(1)} Decimal`;
    }
    return `${areaKatha.toFixed(2)} Katha`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-black hover:text-slate-800 mb-4 font-medium transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5m7 7l-7-7 7-7" />
            </svg>
            Back to Home
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Seller Dashboard</h1>
              <p className="text-slate-600 mt-2">Manage your listings and track performance</p>
            </div>
            <Link
              href="/list-land"
              className="bg-black hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              + List New Property
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-2">Total Listings</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalListings}</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-2">Total Views</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalViews}</p>
            <p className="text-xs text-slate-500 mt-2">Avg {stats.avgViews}/listing</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-2">Total Favorites</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalFavorites}</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-2">Total Comparisons</p>
            <p className="text-3xl font-bold text-slate-900">{stats.totalComparisons}</p>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-6">
            <p className="text-sm text-slate-600 mb-2">Trending</p>
            <p className="text-3xl font-bold text-slate-900">{stats.trendingCount}</p>
            <p className="text-xs text-slate-500 mt-2">High engagement</p>
          </div>
        </div>

        {/* Listings Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900">Your Listings</h2>
            <div>
              <label className="text-sm text-slate-600 mr-2">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-black focus:border-transparent"
              >
                <option value="views">Most Viewed</option>
                <option value="favorites">Most Favorited</option>
                <option value="comparisons">Most Compared</option>
                <option value="price">Highest Price</option>
              </select>
            </div>
          </div>

          {listedProperties.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600 mb-4">You haven't listed any properties yet</p>
              <Link
                href="/list-land"
                className="inline-block bg-black hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-medium"
              >
                List Your First Property
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Property</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Area</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Views</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Favorites</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-slate-700 uppercase">Compared</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {listedProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/property/${property.id}`} className="text-black hover:text-slate-800 font-medium">
                          {property.code}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {property.mauza}, {property.anchal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-slate-900">
                        {formatCurrency(property.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatArea(property.areaKatha)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold border border-slate-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {property.metrics.views}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold border border-slate-300">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          {property.metrics.favorites}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-900 px-3 py-1 rounded-full text-sm font-semibold border border-slate-300">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {property.metrics.comparisons}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${
                            property.status === "Available"
                              ? "bg-white text-slate-900 border-slate-300"
                              : property.status === "Reserved"
                              ? "bg-white text-slate-900 border-slate-300"
                              : "bg-white text-slate-900 border-slate-300"
                          }`}
                        >
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/property/${property.id}`}
                          className="text-black hover:text-slate-800 font-medium"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tips Section */}
        {listedProperties.length > 0 && (
          <div className="mt-8 bg-white border border-slate-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tips to Improve Your Listings</h3>
            <ul className="space-y-2 text-slate-700">
              <li className="flex gap-3">
                <span className="text-black font-bold">1.</span>
                <span>Add high-quality images to increase views by up to 50%</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">2.</span>
                <span>Complete KYC verification to boost buyer confidence</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">3.</span>
                <span>Properties with 40+ views are more likely to sell</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">4.</span>
                <span>Check market rates to price competitively</span>
              </li>
              <li className="flex gap-3">
                <span className="text-black font-bold">5.</span>
                <span>Respond quickly to buyer inquiries to maintain interest</span>
              </li>
            </ul>
            <Link href="/market-rates" className="inline-block mt-4 text-black hover:text-slate-800 font-medium">
              Check Market Rates →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
