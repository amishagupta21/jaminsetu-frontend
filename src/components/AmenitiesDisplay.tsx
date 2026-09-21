"use client";

import { Amenity } from "@/types";
import { BookOpen, Hospital, ShoppingCart, Bus, Building2 } from "lucide-react";

const getAmenityIcon = (type: string) => {
  switch (type) {
    case "School":
      return <BookOpen className="w-6 h-6" />;
    case "Hospital":
      return <Hospital className="w-6 h-6" />;
    case "Market":
      return <ShoppingCart className="w-6 h-6" />;
    case "BusStand":
      return <Bus className="w-6 h-6" />;
    case "GovernmentOffice":
      return <Building2 className="w-6 h-6" />;
    default:
      return <Building2 className="w-6 h-6" />;
  }
};

const getAmenityColor = (type: string) => {
  switch (type) {
    case "School":
      return "bg-blue-100 text-blue-700";
    case "Hospital":
      return "bg-red-100 text-red-700";
    case "Market":
      return "bg-purple-100 text-purple-700";
    case "BusStand":
      return "bg-yellow-100 text-yellow-700";
    case "GovernmentOffice":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

interface AmenitiesDisplayProps {
  amenities: Amenity[] | undefined;
}

export const AmenitiesDisplay: React.FC<AmenitiesDisplayProps> = ({
  amenities,
}) => {
  if (!amenities || amenities.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">No nearby amenities recorded</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {amenities.map((amenity) => (
        <div
          key={amenity.id}
          className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 hover:shadow-md transition"
        >
          {/* Icon & Type */}
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${getAmenityColor(amenity.type)}`}>
            {getAmenityIcon(amenity.type)}
          </div>

          {/* Name */}
          <h4 className="font-semibold text-slate-900 mb-1">{amenity.name}</h4>

          {/* Distance */}
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm font-medium text-slate-900">
              {amenity.distance} km away
            </span>
          </div>

          {/* Description */}
          {amenity.description && (
            <p className="text-xs text-slate-600">{amenity.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};
