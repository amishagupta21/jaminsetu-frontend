"use client";

import { Header } from "@/components/Header";
import { ComparisonTable } from "@/components/ComparisonTable";
import { useProperties } from "@/context/PropertyContext";
import { ChevronLeft, Maximize2, Printer } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const { properties, comparisonList, clearComparison } = useProperties();

  const selectedProperties = properties.filter((p) =>
    comparisonList.includes(p.id)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
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
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Maximize2 className="w-8 h-8 text-black" />
                <h1 className="text-3xl font-bold text-slate-900">Compare Properties</h1>
              </div>
              <p className="text-slate-600">
                {selectedProperties.length} property{selectedProperties.length !== 1 ? "ies" : ""} selected
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={clearComparison}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {selectedProperties.length > 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            <ComparisonTable properties={selectedProperties} />
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
            <Maximize2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              No properties to compare
            </h2>
            <p className="text-slate-600 mb-6">
              Select up to 3 properties to compare their features side by side.
            </p>
            <Link
              href="/"
              className="inline-block bg-black text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-900 transition"
            >
              Browse Properties
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
