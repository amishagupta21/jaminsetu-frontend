"use client";

import { Property } from "@/types";
import { formatPrice } from "@/utils/converters";
import { RatingStars } from "./RatingStars";
import { Check, X } from "lucide-react";

interface ComparisonTableProps {
  properties: Property[];
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  properties,
}) => {
  if (properties.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">No properties to compare</p>
      </div>
    );
  }

  const rows = [
    { label: "Price", key: "totalPrice" },
    { label: "Area (Katha)", key: "areaKatha" },
    { label: "Area (Decimal)", key: "areaDecimal" },
    { label: "Road Width (ft)", key: "roadWidth" },
    { label: "Road Type", key: "roadType" },
    { label: "Land Type", key: "landType" },
    { label: "Facing", key: "facing" },
    { label: "Verification Tier", key: "verificationTier" },
    { label: "Rating", key: "rating" },
    { label: "Amenities", key: "amenities" },
  ];

  const getValue = (property: Property, key: string) => {
    switch (key) {
      case "totalPrice":
        return formatPrice(property.totalPrice);
      case "areaKatha":
        return `${property.areaKatha} Katha`;
      case "areaDecimal":
        return `${property.areaDecimal} Decimal`;
      case "roadWidth":
        return `${property.roadWidth} ft`;
      case "roadType":
        return property.roadType;
      case "landType":
        return property.landType;
      case "facing":
        return property.facing;
      case "verificationTier":
        return (
          <div className="flex items-center gap-2">
            <span className="font-semibold">Tier {property.verificationTier}</span>
            {property.verificationTier >= 3 && (
              <Check className="w-4 h-4 text-green-600" />
            )}
          </div>
        );
      case "rating":
        return property.rating ? (
          <RatingStars rating={property.rating.average} count={property.rating.count} size="sm" />
        ) : (
          <span className="text-slate-500">No ratings</span>
        );
      case "amenities":
        return property.amenities ? `${property.amenities.length} amenities` : "None";
      default:
        return "-";
    }
  };

  return (
    <div className="overflow-x-auto border border-slate-200 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-200">
            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900 bg-white sticky left-0">
              Specification
            </th>
            {properties.map((property) => (
              <th
                key={property.id}
                className="px-4 py-3 text-left text-sm font-semibold text-slate-900 min-w-[200px]"
              >
                <div className="line-clamp-2">{property.code}</div>
                <div className="text-xs text-slate-600 font-normal mt-1">
                  {property.mauza}, {property.anchal}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={row.key}
              className={`border-b border-slate-200 ${idx % 2 === 0 ? "bg-white" : "bg-slate-50"}`}
            >
              <td className="px-4 py-3 text-sm font-semibold text-slate-900 bg-white sticky left-0">
                {row.label}
              </td>
              {properties.map((property) => (
                <td
                  key={`${property.id}-${row.key}`}
                  className="px-4 py-3 text-sm text-slate-700"
                >
                  {getValue(property, row.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
