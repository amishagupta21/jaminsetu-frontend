"use client";

import { Amenity } from "@/types";
import { MapPin, Building2, Pill, ShoppingCart, Bus, FileText } from "lucide-react";

interface AmenitiesSectionProps {
  amenities?: Amenity[];
}

const getAmenityIcon = (type: string) => {
  switch (type) {
    case "School":
      return <Building2 className="w-5 h-5" />;
    case "Hospital":
      return <Pill className="w-5 h-5" />;
    case "Market":
      return <ShoppingCart className="w-5 h-5" />;
    case "BusStand":
      return <Bus className="w-5 h-5" />;
    case "GovernmentOffice":
      return <FileText className="w-5 h-5" />;
    default:
      return <MapPin className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "School":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Hospital":
      return "bg-red-50 text-red-700 border-red-200";
    case "Market":
      return "bg-green-50 text-green-700 border-green-200";
    case "BusStand":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "GovernmentOffice":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export const AmenitiesSection: React.FC<AmenitiesSectionProps> = ({ amenities }) => {
  if (!amenities || amenities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600 text-sm">No nearby amenities data available</p>
      </div>
    );
  }

  // Group amenities by type
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    if (!acc[amenity.type]) {
      acc[amenity.type] = [];
    }
    acc[amenity.type].push(amenity);
    return acc;
  }, {} as Record<string, Amenity[]>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(groupedAmenities).map(([type, items]) => (
        <div
          key={type}
          className={`border rounded-lg p-4 ${getTypeColor(type)}`}
        >
          <div className="flex items-center gap-2 mb-3">
            {getAmenityIcon(type)}
            <h4 className="font-semibold">{type}</h4>
          </div>
          <div className="space-y-2">
            {items.map((amenity) => (
              <div key={amenity.id} className="text-sm">
                <p className="font-medium">{amenity.name}</p>
                <p className="text-xs opacity-75">{amenity.distance} km away</p>
                {amenity.description && (
                  <p className="text-xs opacity-60">{amenity.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
