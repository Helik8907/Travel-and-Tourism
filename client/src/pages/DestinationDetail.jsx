import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MapPin,
  ArrowLeft,
  Thermometer,
  Clock,
  Calendar,
  FileText,
  ChevronLeft,
  ChevronRight,
  Heart,
  Share2,
  Plus,
} from "lucide-react";
import { getDestination, toggleLikeDestination } from "../lib/destinations/destinations";
import {
  getDestinationReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../lib/reviews/reviews";
import { getCurrentUser, refreshSession } from "../lib/auth/auth";
import AuthPromptModal from "../components/auth/AuthPromptModal";
import ReviewForm from "../components/reviews/reviewForm";
import ReviewCard from "../components/reviews/reviewCard";

const typeColors = {
  Beach: "bg-sky-500/90",
  Mountain: "bg-emerald-500/90",
  City: "bg-violet-500/90",
  Historical: "bg-amber-600/90",
  Adventure: "bg-orange-500/90",
  Cultural: "bg-rose-500/90",
  Nature: "bg-teal-500/90",
  Other: "bg-gray-500/90",
};

function StarRating({ rating, count, size = "sm" }) {
  const s = size === "lg" ? "w-5 h-5" : "w-3.5 h-3.5";
  return (
    <div className="flex items-center gap-1">
      <Star className={`${s} text-yellow-400`} fill />
      <span className={`font-semibold text-white ${size === "lg" ? "text-lg" : "text-sm"}`}>
        {rating}
      </span>
      {count !== undefined && (
        <span className={`text-white/60 ${size === "lg" ? "text-sm" : "text-xs"}`}>
          ({count} reviews)
        </span>
      )}
    </div>
  );
}

// Image gallery with animated transitions
const SLIDE_INTERVAL = 4000;

function ImageGallery({ images, requireAuth, liked, likeCount, onToggleLike }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  useEffect(() => {
    if (paused || images.length <= 1) return;
    const timer = setInterval(next, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [current, paused, images.length]);

  return (
    <div
      className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt="Destination"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Top controls */}
      <div className="absolute top-4 left-4">
        <Link
          to="/destinations"
          className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Back to destinations
        </Link>
      </div>

      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={() => requireAuth(onToggleLike)}
          className={`h-10 px-3 rounded-full backdrop-blur-sm flex items-center gap-1.5 transition-colors ${
            liked ? "bg-red-500/80 text-white" : "bg-black/20 text-white/80 hover:text-white"
          }`}
        >
          <Heart className="w-5 h-5" fill={liked} strokeWidth={1.75} />
          <span className="text-sm font-semibold">{likeCount}</span>
        </button>
        <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm text-white/80 hover:text-white flex items-center justify-center transition-colors">
          <Share2 className="w-5 h-5" strokeWidth={1.75} />
        </button>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" strokeWidth={1.75} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-colors"
      >
        <ChevronRight className="w-5 h-5" strokeWidth={1.75} />
      </button>

      {/* Dots indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative h-2 w-6 rounded-full bg-white/40 overflow-hidden"
          >
            {i === current && (
              <motion.div
                key={`${current}-${paused}`}
                className="absolute inset-y-0 left-0 bg-white rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: paused ? "0%" : "100%" }}
                transition={{ duration: paused ? 0 : SLIDE_INTERVAL / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const currentUser = getCurrentUser();

  const requireAuth = (action) => {
    if (!getCurrentUser()) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const handleBookTrip = () => requireAuth(() => navigate("/bookNow"));
  const handleSaveToWishlist = () => requireAuth(() => setSaved((s) => !s));

  const handleToggleLike = async () => {
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevCount + (prevLiked ? -1 : 1));
    try {
      const data = await toggleLikeDestination(id);
      setLiked(data.liked);
      setLikeCount(data.like_count);
      await refreshSession();
    } catch (err) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getDestinationReviews(id);
      setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    if (editingReview) {
      await updateReview(editingReview._id, { rating, comment });
    } else {
      await createReview(id, { rating, comment });
    }
    await Promise.all([fetchReviews(), refetchDestination()]);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewModal(true);
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(review._id);
      await Promise.all([fetchReviews(), refetchDestination()]);
    } catch (err) {
      console.error(err);
    }
  };

  const refetchDestination = async () => {
    const data = await getDestination(id);
    setDestination(data.destination);
  };

  useEffect(() => {
    const fetchDestination = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDestination(id);
        setDestination(data.destination);
        setLikeCount(data.destination.like_count ?? 0);
        const user = getCurrentUser();
        setLiked(!!user?.destinations_liked?.includes(id));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestination();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading destination...</p>
        </div>
      </div>
    );
  }

  if (error || !destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <p className="text-white/60">{error || "Destination not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-950 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-25">
        {/* Image Gallery */}
        <ImageGallery
          images={destination.images?.length ? destination.images : ["/placeholder.jpg"]}
          requireAuth={requireAuth}
          liked={liked}
          likeCount={likeCount}
          onToggleLike={handleToggleLike}
        />

        {/* Main content grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                {destination.type?.map((t) => (
                  <span
                    key={t}
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider ${
                      typeColors[t] || typeColors.Other
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {destination.name}
              </h1>
              <div className="flex items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" strokeWidth={1.75} />
                  {destination.city}, {destination.country}
                </span>
                <StarRating
                  rating={destination.avg_rating}
                  count={destination.review_count}
                  size="lg"
                />
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <h2 className="text-lg font-bold text-white mb-3">
                About this destination
              </h2>
              <p className="text-white/70 leading-relaxed text-sm">
                {destination.description}
              </p>
            </motion.div>

            {/* Weather & Duration cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Weather</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {destination.weather?.min_temp}° - {destination.weather?.max_temp}°C
                </p>
                <p className="text-xs text-white/50">{destination.weather?.condition}</p>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                  </div>
                  <h3 className="text-sm font-bold text-white">Recommended Stay</h3>
                </div>
                <p className="text-2xl font-bold text-white mb-1">
                  {destination.time_take}
                </p>
                <p className="text-xs text-white/50">To fully experience the area</p>
              </div>
            </motion.div>

            {/* Best months */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-white">Best Time to Visit</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {destination.best_months?.map((m) => (
                  <span
                    key={m}
                    className="px-4 py-2 rounded-xl bg-orange-500/10 text-orange-300 text-sm font-medium border border-orange-500/20"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Entry requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-400" strokeWidth={1.75} />
                </div>
                <h3 className="text-sm font-bold text-white">Entry Requirements</h3>
              </div>
              <ul className="space-y-2">
                {destination.entry_req?.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Traveler Reviews</h2>
                <button
                  onClick={() =>
                    requireAuth(() => {
                      setEditingReview(null);
                      setShowReviewModal(true);
                    })
                  }
                  className="flex items-center gap-1.5 text-sm font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  Add Review
                </button>
              </div>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      index={i}
                      isOwn={currentUser?.id === review.userId?._id}
                      onEdit={() => handleEditReview(review)}
                      onDelete={() => handleDeleteReview(review)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-sm">No reviews yet.</p>
              )}
            </motion.div>
          </div>

          {/* Right column - sticky booking card, vertically centered below the navbar while scrolling */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:flex lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full bg-white rounded-2xl p-6 shadow-xl"
            >
              <div className="mb-4">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Starting from
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ${destination.cost_range.min.toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">per person</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Price Range</p>
                  <p className="text-sm font-semibold text-gray-700">
                    ${destination.cost_range.min.toLocaleString()} - $
                    {destination.cost_range.max.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="text-xs text-gray-400 mb-1">Duration</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {destination.time_take}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookTrip}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-500/20 mb-3"
              >
                Book This Trip
              </motion.button>

              <button
                onClick={handleSaveToWishlist}
                className={`w-full py-3 rounded-xl border font-medium text-sm transition-colors ${
                  saved
                    ? "border-orange-200 bg-orange-50 text-orange-600"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {saved ? "Saved to Wishlist" : "Save to Wishlist"}
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Free cancellation up to 48 hours before departure
              </p>
            </motion.div>
            </div>
          </div>
        </div>
      </div>

      {showAuthModal && (
        <AuthPromptModal
          onClose={() => setShowAuthModal(false)}
          onLogin={() => navigate("/login", { state: { from: location } })}
          onSignup={() => navigate("/signup", { state: { from: location } })}
        />
      )}

      {showReviewModal && (
        <ReviewForm
          review={editingReview}
          onClose={() => {
            setShowReviewModal(false);
            setEditingReview(null);
          }}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
}