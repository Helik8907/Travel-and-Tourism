import { motion } from "framer-motion";
import { Star, User, ThumbsUp, ThumbsDown } from "lucide-react";

// Single review card
export default function ReviewCard({ review, index, isOwn, liked, disliked, onLike, onDislike }) {
  const date = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-xl py-3 pl-3 pr-6 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <User className="w-5 h-5 text-orange-500" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {review.userId?.name || "Traveler"}
            </p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
                fill={i < review.rating}
              />
            ))}
          </div>
          {!isOwn && (
            <div className="flex items-center gap-2">
              <button
                onClick={onLike}
                aria-label="Like review"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                  liked
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "border-gray-200 text-gray-400 hover:border-orange-300 hover:text-orange-500"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} fill={liked ? "currentColor" : "none"} />
                {review.like_count > 0 && review.like_count}
              </button>
              <button
                onClick={onDislike}
                aria-label="Dislike review"
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
                  disliked
                    ? "bg-slate-600 border-slate-600 text-white"
                    : "border-gray-200 text-gray-400 hover:border-slate-400 hover:text-slate-600"
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" strokeWidth={1.75} fill={disliked ? "currentColor" : "none"} />
                {review.dislike_count > 0 && review.dislike_count}
              </button>
            </div>
          )}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
    </motion.div>
  );
}
