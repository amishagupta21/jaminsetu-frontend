"use client";

import { useProperties } from "@/context/PropertyContext";
import { Star } from "lucide-react";
import { useState } from "react";

interface RatingFormProps {
  propertyId: string;
  onSubmit?: () => void;
}

export const RatingForm: React.FC<RatingFormProps> = ({ propertyId, onSubmit }) => {
  const { addReview } = useProperties();
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName.trim() || !comment.trim()) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      addReview(propertyId, rating, comment, userName);
      setComment("");
      setUserName("");
      setRating(5);
      setSubmitted(true);

      // Show success message
      setTimeout(() => setSubmitted(false), 3000);
      onSubmit?.();
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-slate-200">
      <h4 className="font-semibold text-slate-900 mb-4">Share Your Experience</h4>

      {submitted && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✓ Thank you! Your review has been posted.
        </div>
      )}

      <div className="space-y-4">
        {/* Name Input */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Your Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-500"
            disabled={isSubmitting}
          />
        </div>

        {/* Rating Input */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                disabled={isSubmitting}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-slate-300 hover:text-yellow-200"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Comment Input */}
        <div>
          <label className="block text-sm font-medium text-slate-900 mb-1">Your Review</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your thoughts about this property..."
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-slate-500 resize-none"
            disabled={isSubmitting}
          />
          <p className="text-xs text-slate-500 mt-1">{comment.length}/500 characters</p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-black hover:bg-slate-900 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Posting..." : "Post Review"}
        </button>
      </div>
    </form>
  );
};
