"use client";

import { Header } from "@/components/Header";
import { FilterSidebar } from "@/components/FilterSidebar";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/context/PropertyContext";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { filteredProperties, isLoading } = useProperties();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto px-4 py-8">
        {/* Sidebar */}
        <div className="md:w-72 flex-shrink-0">
          <div className="sticky top-8">
            <FilterSidebar />
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Land Listings - Rohtas District
            </h2>
            <p className="text-slate-600 mt-1">
              {filteredProperties.length} properties available
            </p>
          </div>

          {filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
              <p className="text-slate-600 text-lg">No properties match your filters.</p>
              <p className="text-slate-500 text-sm mt-2">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
