"use client";

import { Header } from "@/components/Header";
import { PropertyCard } from "@/components/PropertyCard";
import { useProperties } from "@/context/PropertyContext";
import { ChevronLeft, Heart } from "lucide-react";
import Link from "next/link";

export default function FavoritesPage() {
  const { properties, favorites } = useProperties();

  const favoriteProperties = properties.filter((p) => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-black hover:text-slate-800 font-medium mb-6 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 fill-red-500 text-red-500" />
            <h1 className="text-3xl font-bold text-slate-900">Your Favorites</h1>
          </div>
          <p className="text-slate-600">
            {favoriteProperties.length} property{favoriteProperties.length !== 1 ? "ies" : ""} saved
          </p>
        </div>

        {/* Content */}
        {favoriteProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Heart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No favorites yet
            </h2>
            <p className="text-slate-600 mb-6">
              Start exploring properties and add your favorites to this list.
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-900 transition"
            >
              Explore Properties
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
