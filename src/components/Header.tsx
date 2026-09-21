"use client";

import Link from "next/link";
import { MapPin, Plus, HelpCircle, Heart, Zap, Shield, FileCheck, BookOpen, Menu, X } from "lucide-react";
import { useProperties } from "@/context/PropertyContext";
import { useState } from "react";

export const Header = () => {
  const { favorites, comparisonList, currentUserKYC, userBookings, userNegotiations } = useProperties();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition flex-shrink-0">
            <div className="bg-slate-800 p-2 rounded-lg">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl sm:text-2xl font-bold">BiharLand</h1>
              <p className="text-xs text-slate-300">ZameenSetu - Rohtas District</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4">
            <Link href="/" className="text-slate-300 hover:text-white transition text-sm font-medium">
              Explore
            </Link>
            <Link
              href="/favorites"
              className="relative text-slate-300 hover:text-white transition flex items-center gap-1 hover:bg-slate-800 px-2 py-1 rounded"
              title="My Favorites"
            >
              <Heart className="w-5 h-5" />
              <span className="text-sm font-medium">Favorites</span>
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/compare"
              className="relative text-slate-300 hover:text-white transition flex items-center gap-1 hover:bg-slate-800 px-2 py-1 rounded"
              title="Compare Properties"
            >
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">Compare</span>
              {comparisonList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {comparisonList.length}
                </span>
              )}
            </Link>
            <Link
              href="/kyc"
              className={`relative text-slate-300 hover:text-white transition flex items-center gap-1 hover:bg-slate-800 px-2 py-1 rounded ${
                currentUserKYC?.status === "verified" ? "text-green-400" : ""
              }`}
              title="KYC Verification"
            >
              <Shield className="w-5 h-5" />
              <span className="text-sm font-medium">KYC</span>
              {currentUserKYC?.status === "verified" && <span className="text-xs font-bold text-green-400">✓</span>}
            </Link>
            <Link
              href="/bookings"
              className="relative text-slate-300 hover:text-white transition flex items-center gap-1 hover:bg-slate-800 px-2 py-1 rounded"
              title="My Bookings"
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">Bookings</span>
              {userBookings.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {userBookings.length}
                </span>
              )}
            </Link>
            <Link
              href="/negotiations"
              className="relative text-slate-300 hover:text-white transition flex items-center gap-1 hover:bg-slate-800 px-2 py-1 rounded"
              title="My Offers"
            >
              <FileCheck className="w-5 h-5" />
              <span className="text-sm font-medium">Offers</span>
              {userNegotiations.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {userNegotiations.length}
                </span>
              )}
            </Link>
            <Link href="/market-rates" className="text-slate-300 hover:text-white transition text-sm font-medium">
              📊 Market
            </Link>
            <Link href="/seller-dashboard" className="text-slate-300 hover:text-white transition text-sm font-medium">
              📈 Dashboard
            </Link>
            <Link
              href="/list-land"
              className="flex items-center gap-1 bg-black hover:bg-slate-900 text-white px-4 py-2 rounded-lg transition text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Sell Land
            </Link>
            <button className="text-slate-300 hover:text-white transition">
              <HelpCircle className="w-5 h-5" />
            </button>
          </nav>

          {/* Mobile/Tablet Navigation Icons */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/favorites" className="relative text-slate-300 hover:text-white transition" title="Favorites">
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/compare" className="relative text-slate-300 hover:text-white transition" title="Compare">
              <Zap className="w-5 h-5" />
              {comparisonList.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {comparisonList.length}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white transition p-1"
              title="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-700">
            <div className="space-y-2">
              <Link href="/" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded">
                Explore
              </Link>
              <Link href="/kyc" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded flex items-center gap-2">
                <Shield className="w-4 h-4" />
                KYC Verification
                {currentUserKYC?.status === "verified" && <span className="text-xs text-green-400">✓</span>}
              </Link>
              <Link href="/bookings" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Bookings
                {userBookings.length > 0 && <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">{userBookings.length}</span>}
              </Link>
              <Link href="/negotiations" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                My Offers
                {userNegotiations.length > 0 && <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">{userNegotiations.length}</span>}
              </Link>
              <Link href="/market-rates" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded">
                📊 Market Rates
              </Link>
              <Link href="/seller-dashboard" className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded">
                📈 Seller Dashboard
              </Link>
              <Link href="/list-land" className="block px-4 py-2 bg-black hover:bg-slate-900 text-white rounded flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Sell Land
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
