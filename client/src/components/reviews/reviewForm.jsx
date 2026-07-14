import { useState } from "react";
import { motion } from "framer-motion";
import { Star, X } from "lucide-react";

// Modal for submitting or editing a review
export default function ReviewForm({ review, onClose, onSubmit }) {
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(review?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = Boolean(review);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ rating, comment });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">
          {isEditing ? "Edit your review" : "Write a review"}
        </h2>
        <p className="text-gray-500 text-sm mb-6">Share your experience with other travelers.</p>

        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-center gap-1.5 mb-5">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              const filled = value <= (hoverRating || rating);
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      filled ? "text-yellow-400" : "text-gray-200"
                    }`}
                    fill={filled}
                  />
                </button>
              );
            })}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us about your trip..."
            rows={4}
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 resize-none"
          />

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
          >
            {submitting ? "Saving..." : isEditing ? "Save changes" : "Submit review"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
