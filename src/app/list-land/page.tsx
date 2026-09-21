"use client";

import { Header } from "@/components/Header";
import { SellerForm } from "@/components/SellerForm";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function ListLandPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium mb-8 transition"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Search
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">List Your Land</h1>
          <p className="text-slate-600 mt-2 text-lg">
            Get your property verified and reach qualified buyers in Rohtas District
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-2xl mb-2">✓</div>
            <h3 className="font-semibold text-slate-900 mb-1">Zero Listing Fees</h3>
            <p className="text-sm text-slate-600">List your property for free</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="font-semibold text-slate-900 mb-1">Verified Buyers</h3>
            <p className="text-sm text-slate-600">Connect with serious property seekers</p>
          </div>
          <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="text-2xl mb-2">🛡️</div>
            <h3 className="font-semibold text-slate-900 mb-1">Identity Safe</h3>
            <p className="text-sm text-slate-600">Phone masked from public listings</p>
          </div>
        </div>

        {/* Form */}
        <SellerForm />

        {/* Footer Note */}
        <div className="mt-10 bg-slate-100 border border-slate-300 rounded-lg p-6 text-sm text-slate-800">
          <p className="font-semibold mb-2">📋 After Listing:</p>
          <ul className="space-y-1 text-sm">
            <li>• Our team will contact you within 24 hours</li>
            <li>• We'll schedule a physical verification visit</li>
            <li>• Your property will be assigned a verification tier</li>
            <li>• Buyers can reach you only through our WhatsApp bridge</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
