"use client";

import { Rating } from "@/types";
import { Star } from "lucide-react";

interface RatingDisplayProps {
  rating?: Rating;
  showReviews?: boolean;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({ rating, showReviews = false }) => {
  if (!rating || rating.count === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-slate-600 text-sm">No ratings yet</p>
        <p className="text-slate-500 text-xs">Be the first to rate this property</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Rating Summary */}
      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-slate-900">{rating.average}</span>
            <span className="text-sm text-slate-600">/5</span>
          </div>
          <div className="flex-1">
            <div className="flex gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rating.average)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-600">{rating.count} review{rating.count !== 1 ? "s" : ""}</p>
          </div>
        </div>
      </div>

      {/* Reviews */}
      {showReviews && rating.reviews.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-semibold text-slate-900">Recent Reviews</h4>
          {rating.reviews.slice(-3).map((review) => (
            <div key={review.id} className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-sm text-slate-900">{review.userName}</p>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700">{review.comment}</p>
              <p className="text-xs text-slate-500 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
