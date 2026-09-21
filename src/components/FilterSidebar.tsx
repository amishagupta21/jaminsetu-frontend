"use client";

import { useProperties } from "@/context/PropertyContext";
import { FilterState } from "@/types";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const ANCHALS = ["Bikramganj", "Sasaram", "Dehri"];
const ROAD_SURFACES = ["Pakka", "Soling", "Kachha"];

export const FilterSidebar = () => {
  const { filters, setFilters, properties } = useProperties();

  const handleAnchalChange = (anchal: string | null) => {
    setFilters({
      ...filters,
      anchal: anchal === "all" ? null : anchal,
    });
  };

  const handleRoadWidthChange = (width: number) => {
    setFilters({
      ...filters,
      roadWidthMin: width,
    });
  };

  const handleVerifiedOnlyChange = (checked: boolean) => {
    setFilters({
      ...filters,
      verifiedOnly: checked,
    });
  };

  const handleRoadSurfaceChange = (surface: string, checked: boolean) => {
    const newSurfaces = checked
      ? [...filters.roadSurface, surface as "Pakka" | "Soling" | "Kachha"]
      : filters.roadSurface.filter((s) => s !== surface);

    setFilters({
      ...filters,
      roadSurface: newSurfaces,
    });
  };

  const handlePriceRangeChange = (min: string, max: string) => {
    setFilters({
      ...filters,
      priceRange: [parseInt(min) || 0, parseInt(max) || 15000000],
    });
  };

  return (
    <div className="w-full md:w-64 bg-white border-b md:border-r border-slate-200 p-4 space-y-6 rounded-lg">
      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Location (Anchal)</h3>
        <Select value={filters.anchal || "all"} onValueChange={handleAnchalChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            {ANCHALS.map((anchal) => (
              <SelectItem key={anchal} value={anchal}>
                {anchal}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Minimum Road Width</h3>
        <Select value={String(filters.roadWidthMin)} onValueChange={(v) => handleRoadWidthChange(parseInt(v))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select width" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Width</SelectItem>
            <SelectItem value="16">16ft+</SelectItem>
            <SelectItem value="20">20ft+</SelectItem>
            <SelectItem value="25">25ft+</SelectItem>
            <SelectItem value="30">30ft+</SelectItem>
            <SelectItem value="40">40ft+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold text-slate-900 mb-3">Price Range</h3>
        <div className="space-y-2 text-sm">
          <div>
            <Label className="text-xs text-slate-600">Min (₹)</Label>
            <input
              type="number"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(e.target.value, String(filters.priceRange[1]))}
              className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
              placeholder="0"
            />
          </div>
          <div>
            <Label className="text-xs text-slate-600">Max (₹)</Label>
            <input
              type="number"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(String(filters.priceRange[0]), e.target.value)}
              className="w-full px-2 py-1 border border-slate-300 rounded text-sm"
              placeholder="15000000"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900">Road Surface</h3>
        {ROAD_SURFACES.map((surface) => (
          <div key={surface} className="flex items-center gap-2">
            <Checkbox
              id={surface}
              checked={filters.roadSurface.includes(surface as any)}
              onCheckedChange={(checked) => handleRoadSurfaceChange(surface, checked as boolean)}
            />
            <Label htmlFor={surface} className="text-sm cursor-pointer">
              {surface}
            </Label>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
        <Checkbox
          id="verified-only"
          checked={filters.verifiedOnly}
          onCheckedChange={(checked) => handleVerifiedOnlyChange(checked as boolean)}
        />
        <Label htmlFor="verified-only" className="text-sm cursor-pointer font-medium text-emerald-700">
          ✓ Verified Only
        </Label>
      </div>

      <p className="text-xs text-slate-500 pt-2">
        Showing {properties.length} properties in database
      </p>
    </div>
  );
};
