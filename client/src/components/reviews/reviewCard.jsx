import { motion } from "framer-motion";
import { Star, User, Pencil, Trash2 } from "lucide-react";

// Single review card
export default function ReviewCard({ review, index, isOwn, onEdit, onDelete }) {
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
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${i < review.rating ? "text-yellow-400" : "text-gray-200"}`}
              fill={i < review.rating}
            />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
      )}
      {isOwn && (
        <div className="flex items-center justify-end gap-3 mt-1.5">
          <button
            onClick={onEdit}
            aria-label="Edit review"
            className="text-gray-400 hover:text-orange-500 transition-colors"
          >
            <Pencil className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button
            onClick={onDelete}
            aria-label="Delete review"
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </motion.div>
  );
}
