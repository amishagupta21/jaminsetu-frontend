"use client";

import { Review } from "@/types";
import { RatingStars } from "./RatingStars";
import { formatDistanceToNow } from "@/utils/dateFormatter";

interface ReviewListProps {
  reviews: Review[];
  sortBy?: "newest" | "highest" | "lowest";
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  sortBy = "newest",
}) => {
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-600">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedReviews.map((review) => (
        <div
          key={review.id}
          className="border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-slate-900">{review.userName}</h4>
              <p className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(review.createdAt))} ago
              </p>
            </div>
            <RatingStars rating={review.rating} size="sm" />
          </div>

          {/* Comment */}
          <p className="text-slate-700 text-sm leading-relaxed">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  );
};
