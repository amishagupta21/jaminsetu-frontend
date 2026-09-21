"use client";

import Link from "next/link";
import { MapPin, Plus, HelpCircle, Heart, Zap } from "lucide-react";
import { useProperties } from "@/context/PropertyContext";

export const Header = () => {
  const { favorites, comparisonList } = useProperties();

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
            <div className="bg-slate-800 p-2 rounded-lg">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">BiharLand</h1>
              <p className="text-xs text-slate-300">ZameenSetu - Rohtas District</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <Link
              href="/"
              className="text-slate-300 hover:text-white transition text-sm font-medium hidden sm:block"
            >
              Explore
            </Link>
            <Link
              href="/favorites"
              className="relative text-slate-300 hover:text-white transition flex items-center gap-1 hover:bg-slate-800 px-2 py-1 rounded transition"
              title="My Favorites"
            >
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Favorites</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/compare"
              className="relative text-slate-300 hover:text-white transition flex items-center gap-1 hover:bg-slate-800 px-2 py-1 rounded transition"
              title="Compare Properties"
            >
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium hidden sm:inline">Compare</span>
              {comparisonList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {comparisonList.length}
                </span>
              )}
            </Link>
            <Link
              href="/list-land"
              className="flex items-center gap-1 bg-black hover:bg-slate-900 text-white px-3 sm:px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Sell Land</span>
              <span className="inline sm:hidden">Sell</span>
            </Link>
            <button
              className="text-slate-300 hover:text-white transition hidden sm:block"
              title="Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
