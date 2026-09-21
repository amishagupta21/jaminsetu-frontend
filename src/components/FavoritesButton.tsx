"use client";

import { useProperties } from "@/context/PropertyContext";
import { Heart } from "lucide-react";

interface FavoritesButtonProps {
  propertyId: string;
  size?: "sm" | "md" | "lg";
}

export const FavoritesButton: React.FC<FavoritesButtonProps> = ({ propertyId, size = "md" }) => {
  const { toggleFavorite, isFavorite } = useProperties();
  const liked = isFavorite(propertyId);

  const sizeClasses = {
    sm: "w-5 h-5 p-1",
    md: "w-6 h-6 p-1.5",
    lg: "w-8 h-8 p-2",
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(propertyId);
      }}
      className={`rounded-full transition-all ${
        liked ? "bg-red-50" : "bg-white"
      } hover:bg-red-50 border ${liked ? "border-red-200" : "border-slate-200"} hover:border-red-200`}
      title={liked ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${sizeClasses[size]} ${
          liked ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-500"
        } transition-colors`}
      />
    </button>
  );
};
