"use client";

import { useState } from "react";
import { useProperties } from "@/context/PropertyContext";
import { RatingStars } from "./RatingStars";
import { X } from "lucide-react";

interface ReviewFormProps {
  propertyId: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  propertyId,
  onClose,
  onSuccess,
}) => {
  const { addReview } = useProperties();
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter a review comment");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      addReview(propertyId, rating, comment, name);
      setName("");
      setComment("");
      setRating(5);

      // Show success message
      if (onSuccess) {
        onSuccess();
      }

      // Close after a short delay
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      setError("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">Write a Review</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Rating
            </label>
            <RatingStars
              rating={rating}
              interactive
              onRate={setRating}
              size="lg"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isSubmitting}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this property..."
              rows={4}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-slate-500 mt-1">
              {comment.length} characters (minimum 10)
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 font-semibold hover:bg-white transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-semibold hover:bg-slate-900 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
