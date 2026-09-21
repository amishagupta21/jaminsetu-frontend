"use client";

import { Header } from "@/components/Header";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/context/PropertyContext";
import { Loader2, Grid3x3, Map, X, Sliders } from "lucide-react";
import { useState } from "react";
import { MapComponent } from "@/components/MapComponent";
import Link from "next/link";

export default function Home() {
  const { filteredProperties, isLoading, comparisonList } = useProperties();
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
        {/* Desktop Sidebar - Hidden on Mobile */}
        <div className="hidden md:block md:w-72 flex-shrink-0">
          <div className="sticky top-8">
            <FilterSidebar />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header with View Toggle & Filter Button */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Land Listings - Rohtas District
              </h2>
              <p className="text-slate-600 mt-1">
                {filteredProperties.length} properties available
              </p>
            </div>

            {/* View Toggle & Mobile Filter Button */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setFilterModalOpen(true)}
                className="md:hidden flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition font-medium"
              >
                <Sliders className="w-4 h-4" />
                Filters
              </button>

              <div className="flex gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium transition ${
                    viewMode === "grid"
                      ? "bg-black text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Grid3x3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md font-medium transition ${
                    viewMode === "map"
                      ? "bg-black text-white"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Map</span>
                </button>
              </div>

              {/* Compare Button */}
              {comparisonList.length > 0 && (
                <Link
                  href="/compare"
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white font-semibold rounded-lg hover:bg-slate-900 transition"
                >
                  <span>Compare ({comparisonList.length})</span>
                </Link>
              )}
            </div>
          </div>

          {/* Content */}
          {filteredProperties.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
                  <MapComponent
                    coordinates={filteredProperties[0]?.coordinates}
                    amenities={filteredProperties[0]?.amenities}
                    height="h-screen"
                  />
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600 text-lg">No properties match your filters.</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {filterModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden">
          <div className="fixed inset-x-0 bottom-0 bg-white rounded-t-2xl z-50 max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-4 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-bold text-slate-900">Filters</h3>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Filters Content */}
            <div className="px-4 py-6">
              <FilterSidebar />
            </div>

            {/* Close Button */}
            <div className="sticky bottom-0 bg-white border-t border-slate-200 p-4">
              <button
                onClick={() => setFilterModalOpen(false)}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-slate-900 transition"
              >
                View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
