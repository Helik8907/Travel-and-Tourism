import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  UserRound,
  Heart,
  ThumbsDown,
  Share2,
  MapPin,
  Star,
  Plus,
} from "lucide-react";

import { getBlog, toggleLikeBlog, toggleDislikeBlog } from "../lib/blogs/blogs";
import { getBlogReviews, createBlogReview, toggleLikeReview, toggleDislikeReview } from "../lib/reviews/reviews";
import { getCurrentUser, refreshSession } from "../lib/auth/auth";
import AuthPromptModal from "../components/auth/AuthPromptModal";
import ReviewForm from "../components/reviews/reviewForm";
import ReviewCard from "../components/reviews/reviewCard";

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = getCurrentUser();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [disliked, setDisliked] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [reviewReactions, setReviewReactions] = useState({});

  const requireAuth = (action) => {
    if (!getCurrentUser()) {
      setShowAuthModal(true);
      return;
    }
    action();
  };

  const handleToggleLike = async () => {
    const prevLiked = liked;
    const prevCount = likeCount;
    const prevDisliked = disliked;
    const prevDislikeCount = dislikeCount;

    setLiked(!prevLiked);
    setLikeCount(prevCount + (prevLiked ? -1 : 1));
    if (!prevLiked && prevDisliked) {
      setDisliked(false);
      setDislikeCount((c) => Math.max(0, c - 1));
    }

    try {
      const data = await toggleLikeBlog(id);
      setLiked(data.liked);
      setLikeCount(data.like_count);
      setDislikeCount(data.dislike_count);
      if (data.liked) setDisliked(false);
      await refreshSession();
    } catch (err) {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      setDisliked(prevDisliked);
      setDislikeCount(prevDislikeCount);
    }
  };

  const handleToggleDislike = async () => {
    const prevDisliked = disliked;
    const prevDislikeCount = dislikeCount;
    const prevLiked = liked;
    const prevLikeCount = likeCount;

    setDisliked(!prevDisliked);
    setDislikeCount(prevDislikeCount + (prevDisliked ? -1 : 1));
    if (!prevDisliked && prevLiked) {
      setLiked(false);
      setLikeCount((c) => Math.max(0, c - 1));
    }

    try {
      const data = await toggleDislikeBlog(id);
      setDisliked(data.disliked);
      setDislikeCount(data.dislike_count);
      setLikeCount(data.like_count);
      if (data.disliked) setLiked(false);
      await refreshSession();
    } catch (err) {
      setDisliked(prevDisliked);
      setDislikeCount(prevDislikeCount);
      setLiked(prevLiked);
      setLikeCount(prevLikeCount);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await getBlogReviews(id);
      setReviews(data.reviews);

      const user = getCurrentUser();
      const likedIds = new Set(user?.reviews_liked ?? []);
      const dislikedIds = new Set(user?.reviews_disliked ?? []);
      const reactions = {};
      data.reviews.forEach((r) => {
        reactions[r._id] = { liked: likedIds.has(r._id), disliked: dislikedIds.has(r._id) };
      });
      setReviewReactions(reactions);
    } catch (err) {
      console.error(err);
    }
  };

  const updateReviewCounts = (reviewId, like_count, dislike_count) => {
    setReviews((prev) =>
      prev.map((r) => (r._id === reviewId ? { ...r, like_count, dislike_count } : r))
    );
  };

  const handleLikeReview = async (reviewId) => {
    const review = reviews.find((r) => r._id === reviewId);
    if (!review) return;
    const prevReaction = reviewReactions[reviewId] || { liked: false, disliked: false };
    const prevLikeCount = review.like_count ?? 0;
    const prevDislikeCount = review.dislike_count ?? 0;
    const nextLiked = !prevReaction.liked;

    setReviewReactions((prev) => ({
      ...prev,
      [reviewId]: { liked: nextLiked, disliked: nextLiked ? false : prevReaction.disliked },
    }));
    updateReviewCounts(
      reviewId,
      prevLikeCount + (prevReaction.liked ? -1 : 1),
      nextLiked && prevReaction.disliked ? Math.max(0, prevDislikeCount - 1) : prevDislikeCount
    );

    try {
      const data = await toggleLikeReview(reviewId);
      setReviewReactions((prev) => ({
        ...prev,
        [reviewId]: { liked: data.liked, disliked: data.liked ? false : prevReaction.disliked },
      }));
      updateReviewCounts(reviewId, data.like_count, data.dislike_count);
      await refreshSession();
    } catch (err) {
      console.error(err);
      setReviewReactions((prev) => ({ ...prev, [reviewId]: prevReaction }));
      updateReviewCounts(reviewId, prevLikeCount, prevDislikeCount);
    }
  };

  const handleDislikeReview = async (reviewId) => {
    const review = reviews.find((r) => r._id === reviewId);
    if (!review) return;
    const prevReaction = reviewReactions[reviewId] || { liked: false, disliked: false };
    const prevLikeCount = review.like_count ?? 0;
    const prevDislikeCount = review.dislike_count ?? 0;
    const nextDisliked = !prevReaction.disliked;

    setReviewReactions((prev) => ({
      ...prev,
      [reviewId]: { disliked: nextDisliked, liked: nextDisliked ? false : prevReaction.liked },
    }));
    updateReviewCounts(
      reviewId,
      nextDisliked && prevReaction.liked ? Math.max(0, prevLikeCount - 1) : prevLikeCount,
      prevDislikeCount + (prevReaction.disliked ? -1 : 1)
    );

    try {
      const data = await toggleDislikeReview(reviewId);
      setReviewReactions((prev) => ({
        ...prev,
        [reviewId]: { disliked: data.disliked, liked: data.disliked ? false : prevReaction.liked },
      }));
      updateReviewCounts(reviewId, data.like_count, data.dislike_count);
      await refreshSession();
    } catch (err) {
      console.error(err);
      setReviewReactions((prev) => ({ ...prev, [reviewId]: prevReaction }));
      updateReviewCounts(reviewId, prevLikeCount, prevDislikeCount);
    }
  };

  const handleReviewSubmit = async ({ rating, comment }) => {
    await createBlogReview(id, { rating, comment });
    await fetchReviews();
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlog(id);
        const b = data.blog;
        setBlog(b);
        setLikeCount(b.like_count ?? 0);
        setDislikeCount(b.dislike_count ?? 0);
        const user = getCurrentUser();
        setLiked(!!user?.blogs_liked?.includes(id));
        setDisliked(!!user?.blogs_disliked?.includes(id));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
    fetchReviews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <p className="text-white/60">{error || "Blog not found."}</p>
      </div>
    );
  }

  const isOwner = currentUser?.id === blog.author?._id || currentUser?.id === blog.author;

  return (
    <div className="min-h-screen bg-teal-950 pb-20 font-['Bricolage_Grotesque']">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-24">
        {/* Header banner */}
        <div className="relative h-64 lg:h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-500 to-teal-700 flex items-center justify-center">
          {blog.images?.[0] ? (
            <img src={blog.images[0]} alt={blog.title} className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <span className="text-8xl font-bold text-white/15">
              {blog.title?.[0]?.toUpperCase() ?? "?"}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          <div className="absolute top-4 left-4">
            <Link
              to="/blog"
              className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
              Back to blog
            </Link>
          </div>

          <div className="absolute top-4 right-4 flex items-center gap-2">
            {!isOwner && (
              <>
                <button
                  onClick={() => requireAuth(handleToggleLike)}
                  className={`h-10 px-3 rounded-full backdrop-blur-sm flex items-center gap-1.5 transition-colors ${
                    liked ? "bg-red-500/80 text-white" : "bg-black/20 text-white/80 hover:text-white"
                  }`}
                >
                  <Heart className="w-5 h-5" fill={liked} strokeWidth={1.75} />
                  <span className="text-sm font-semibold">{likeCount}</span>
                </button>
                <button
                  onClick={() => requireAuth(handleToggleDislike)}
                  className={`h-10 px-3 rounded-full backdrop-blur-sm flex items-center gap-1.5 transition-colors ${
                    disliked ? "bg-slate-500/80 text-white" : "bg-black/20 text-white/80 hover:text-white"
                  }`}
                >
                  <ThumbsDown className="w-5 h-5" fill={disliked} strokeWidth={1.75} />
                  <span className="text-sm font-semibold">{dislikeCount}</span>
                </button>
              </>
            )}
            <button className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm text-white/80 hover:text-white flex items-center justify-center transition-colors">
              <Share2 className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Main content grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Title & meta */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center gap-5 text-white/70 text-sm">
                <span className="flex items-center gap-1.5">
                  <UserRound className="w-4 h-4 text-orange-400" strokeWidth={1.75} />
                  {blog.author?.name ?? "Unknown author"}
                </span>
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-orange-400" strokeWidth={1.75} />
                  {formatDate(blog.createdAt)}
                </span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              <p className="text-white/80 leading-relaxed text-base italic">{blog.description}</p>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
            >
              {blog.content
                .split(/\n+/)
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i} className="text-white/70 leading-relaxed text-sm mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
            </motion.div>

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Reader Reviews</h2>
                <button
                  onClick={() => requireAuth(() => setShowReviewModal(true))}
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
                      liked={reviewReactions[review._id]?.liked}
                      disliked={reviewReactions[review._id]?.disliked}
                      onLike={() => requireAuth(() => handleLikeReview(review._id))}
                      onDislike={() => requireAuth(() => handleDislikeReview(review._id))}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-white/50 text-sm">No reviews yet.</p>
              )}
            </motion.div>
          </div>

          {/* Sidebar - mentioned destinations */}
          {blog.destinations?.length > 0 && (
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-full bg-white rounded-2xl p-6 shadow-xl"
                >
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                    Mentioned in this story
                  </h3>
                  <div className="space-y-4">
                    {blog.destinations.map((dest) => (
                      <Link
                        key={dest._id}
                        to={`/destinationDetail/${dest._id}`}
                        className="group flex gap-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors p-2"
                      >
                        <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={dest.images?.[0] || "/placeholder.jpg"}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-gray-900 font-semibold text-sm truncate">{dest.name}</h4>
                          <p className="text-gray-500 text-xs flex items-center gap-1 mt-1 truncate">
                            <MapPin className="w-3 h-3 shrink-0" /> {dest.city}, {dest.country}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
                            <span className="text-xs font-semibold text-gray-700">{dest.avg_rating}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          )}
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
        <ReviewForm onClose={() => setShowReviewModal(false)} onSubmit={handleReviewSubmit} />
      )}
    </div>
  );
}
