"use client";

import { Header } from "@/components/Header";
import { LandPassportDossier } from "@/components/LandPassportDossier";
import { SimilarPropertiesWidget } from "@/components/SimilarPropertiesWidget";
import { useProperties } from "@/context/PropertyContext";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PropertyPage() {
  const params = useParams();
  const { properties, recordPropertyView } = useProperties();
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (properties.length > 0) {
      const found = properties.find((p) => p.id === params.id);
      setProperty(found);

      // PHASE 3: Record property view
      if (found) {
        recordPropertyView(found.id);
      }

      setIsLoading(false);
    }
  }, [properties, params.id, recordPropertyView]);

  if (isLoading || !property) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600">Loading property details...</p>
        </div>
      </div>
    );
  }

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

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Property Dossier: {property.code}</h1>
          <p className="text-slate-600 mt-1">{property.title}</p>
        </div>

        {/* Content */}
        <LandPassportDossier property={property} />
      </main>
    </div>
  );
}
