import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, Star, Pencil, Trash2, Heart } from "lucide-react";
import { getProfile } from "../lib/profile/profile";
import { deleteDestination, toggleLikeDestination } from "../lib/destinations/destinations";
import { refreshSession } from "../lib/auth/auth";
import { updateReview, deleteReview } from "../lib/reviews/reviews";
import ReviewForm from "../components/reviews/reviewForm";
import ReviewCard from "../components/reviews/reviewCard";

const SECTIONS = {
  liked: { title: "Liked destinations", key: "destinations_liked", kind: "destination" },
  created: { title: "Destinations added", key: "destinations_created", kind: "destination" },
  reviews: { title: "My reviews", key: "reviews_created", kind: "review" },
};

function DestinationRow({ dest, index, editable, onDelete, unlikeable, liked, onToggleLike }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group flex items-center gap-4 bg-white rounded-xl p-3 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      <Link to={`/destinationDetail/${dest._id}`} className="flex items-center gap-4 min-w-0 flex-1">
        <img
          src={dest.images?.[0] || "/placeholder.jpg"}
          alt={dest.name}
          className="w-16 h-16 rounded-lg object-cover shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-orange-500 transition-colors">
            {dest.name}
          </h4>
          <p className="flex items-center gap-1 text-xs text-gray-400 truncate">
            <MapPin className="w-3 h-3 shrink-0" strokeWidth={1.75} />
            {dest.city}, {dest.country}
          </p>
        </div>
      </Link>
      <div className="flex items-center gap-1 shrink-0">
        <Star className="w-3.5 h-3.5 text-yellow-400" fill />
        <span className="text-xs font-semibold text-gray-700">{dest.avg_rating}</span>
      </div>
      {unlikeable && (
        <button
          onClick={onToggleLike}
          aria-label={liked ? "Unlike destination" : "Like destination"}
          className={`shrink-0 pl-3 ml-1 border-l border-gray-100 transition-colors ${
            liked ? "text-red-500" : "text-gray-800"
          }`}
        >
          <Heart className="w-4 h-4" fill="currentColor" strokeWidth={1.75} />
        </button>
      )}
      {editable && (
        <div className="flex items-center gap-3 shrink-0 pl-3 ml-1 border-l border-gray-100">
          <Link
            to={`/destinations/${dest._id}/edit`}
            aria-label="Edit destination"
            className="text-gray-300 hover:text-orange-500 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
          </Link>
          <button
            onClick={onDelete}
            aria-label="Delete destination"
            className="text-gray-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
          </button>
        </div>
      )}
    </motion.div>
  );
}

export default function ProfileListPage() {
  const { section } = useParams();
  const config = SECTIONS[section];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [unlikedIds, setUnlikedIds] = useState(new Set());

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setItems(data.user[config.key] ?? []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!config) return;
    setUnlikedIds(new Set());
    fetchItems();
  }, [section]);

  const handleReviewSubmit = async ({ rating, comment }) => {
    await updateReview(editingReview._id, { rating, comment });
    await fetchItems();
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(review._id);
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLike = async (dest) => {
    const wasUnliked = unlikedIds.has(dest._id);
    setUnlikedIds((prev) => {
      const next = new Set(prev);
      wasUnliked ? next.delete(dest._id) : next.add(dest._id);
      return next;
    });
    try {
      await toggleLikeDestination(dest._id);
      await refreshSession();
    } catch (err) {
      console.error(err);
      setUnlikedIds((prev) => {
        const next = new Set(prev);
        wasUnliked ? next.add(dest._id) : next.delete(dest._id);
        return next;
      });
    }
  };

  const handleDeleteDestination = async (dest) => {
    if (!window.confirm("Delete this destination? This cannot be undone.")) return;
    try {
      await deleteDestination(dest._id);
      await fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <p className="text-white/60">Unknown profile section.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-950 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Back to profile
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">{config.title}</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-white/60">{error}</p>
        ) : items.length > 0 ? (
          <div className={config.kind === "review" ? "space-y-4" : "space-y-3"}>
            {items.map((item, i) =>
              config.kind === "review" ? (
                <div key={item._id}>
                  <Link
                    to={`/destinationDetail/${item.destinationId?._id}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-orange-300 transition-colors mb-2"
                  >
                    <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
                    {item.destinationId?.name || "Destination"}
                  </Link>
                  <ReviewCard
                    review={item}
                    index={i}
                    isOwn
                    onEdit={() => setEditingReview(item)}
                    onDelete={() => handleDeleteReview(item)}
                  />
                </div>
              ) : (
                <DestinationRow
                  key={item._id}
                  dest={item}
                  index={i}
                  editable={section === "created"}
                  onDelete={() => handleDeleteDestination(item)}
                  unlikeable={section === "liked"}
                  liked={!unlikedIds.has(item._id)}
                  onToggleLike={() => handleToggleLike(item)}
                />
              )
            )}
          </div>
        ) : (
          <p className="text-white/50 text-sm">Nothing here yet.</p>
        )}
      </div>

      {editingReview && (
        <ReviewForm
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}
