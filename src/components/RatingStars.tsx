"use client";

import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = "md",
  interactive = false,
  onRate,
}) => {
  const sizeMap = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const textSizeMap = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const handleStarClick = (star: number) => {
    if (interactive && onRate) {
      onRate(star);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => handleStarClick(star)}
            disabled={!interactive}
            className={`${sizeMap[size]} transition-all ${
              interactive ? "cursor-pointer hover:scale-110" : "cursor-default"
            }`}
          >
            <Star
              className={`fill-current transition-colors ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-slate-300 fill-slate-300"
              }`}
            />
          </button>
        ))}
      </div>
      <div className={`flex items-center gap-1 ${textSizeMap[size]}`}>
        <span className="font-semibold text-slate-900">{rating.toFixed(1)}</span>
        {count !== undefined && (
          <span className="text-slate-600">({count} reviews)</span>
        )}
      </div>
    </div>
  );
};
