import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Pencil,
  Trash2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  User,
  Newspaper,
} from "lucide-react";
import { getProfile } from "../lib/profile/profile";
import { deleteDestination, toggleLikeDestination, toggleDislikeDestination } from "../lib/destinations/destinations";
import { deleteBlog, toggleLikeBlog, toggleDislikeBlog } from "../lib/blogs/blogs";
import { refreshSession } from "../lib/auth/auth";
import {
  updateReview,
  deleteReview,
  toggleLikeReview,
  toggleDislikeReview,
} from "../lib/reviews/reviews";
import ReviewForm from "../components/reviews/reviewForm";
import EntityCard from "../components/profile/EntityCard";

const SECTIONS = {
  created: { title: "Destinations created", key: "destinations_created", kind: "destination" },
  reviews: { title: "Reviews created", key: "reviews_created", kind: "review", owner: true },
  blogs: { title: "Blogs created", key: "blogs_created", kind: "blog", owner: true },

  liked: { title: "Destinations liked", key: "destinations_liked", kind: "destination", reaction: "like" },
  "reviews-liked": { title: "Reviews liked", key: "reviews_liked", kind: "review", reaction: "like" },
  "blogs-liked": { title: "Blogs liked", key: "blogs_liked", kind: "blog", reaction: "like" },

  disliked: { title: "Destinations disliked", key: "destinations_disliked", kind: "destination", reaction: "dislike" },
  "reviews-disliked": { title: "Reviews disliked", key: "reviews_disliked", kind: "review", reaction: "dislike" },
  "blogs-disliked": { title: "Blogs disliked", key: "blogs_disliked", kind: "blog", reaction: "dislike" },
};

export default function ProfileListPage() {
  const { section } = useParams();
  const config = SECTIONS[section];
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [removedReactionIds, setRemovedReactionIds] = useState(new Set());
  const [reviewReactions, setReviewReactions] = useState({});

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setItems(data.user[config.key] ?? []);

      const likedIds = new Set((data.user.reviews_liked ?? []).map((r) => r._id));
      const dislikedIds = new Set((data.user.reviews_disliked ?? []).map((r) => r._id));
      const reactions = {};
      (data.user[config.key] ?? []).forEach((item) => {
        if (config.kind === "review") {
          reactions[item._id] = { liked: likedIds.has(item._id), disliked: dislikedIds.has(item._id) };
        }
      });
      setReviewReactions(reactions);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!config) return;
    setRemovedReactionIds(new Set());
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

  const updateReviewCounts = (reviewId, like_count, dislike_count) => {
    setItems((prev) =>
      prev.map((r) => (r._id === reviewId ? { ...r, like_count, dislike_count } : r))
    );
  };

  const handleLikeReview = async (review) => {
    const prevReaction = reviewReactions[review._id] || { liked: false, disliked: false };
    const prevLikeCount = review.like_count ?? 0;
    const prevDislikeCount = review.dislike_count ?? 0;
    const nextLiked = !prevReaction.liked;

    setReviewReactions((prev) => ({
      ...prev,
      [review._id]: { liked: nextLiked, disliked: nextLiked ? false : prevReaction.disliked },
    }));
    updateReviewCounts(
      review._id,
      prevLikeCount + (prevReaction.liked ? -1 : 1),
      nextLiked && prevReaction.disliked ? Math.max(0, prevDislikeCount - 1) : prevDislikeCount
    );

    try {
      const data = await toggleLikeReview(review._id);
      setReviewReactions((prev) => ({
        ...prev,
        [review._id]: { liked: data.liked, disliked: data.liked ? false : prevReaction.disliked },
      }));
      updateReviewCounts(review._id, data.like_count, data.dislike_count);
      await refreshSession();
    } catch (err) {
      console.error(err);
      setReviewReactions((prev) => ({ ...prev, [review._id]: prevReaction }));
      updateReviewCounts(review._id, prevLikeCount, prevDislikeCount);
    }
  };

  const handleDislikeReview = async (review) => {
    const prevReaction = reviewReactions[review._id] || { liked: false, disliked: false };
    const prevLikeCount = review.like_count ?? 0;
    const prevDislikeCount = review.dislike_count ?? 0;
    const nextDisliked = !prevReaction.disliked;

    setReviewReactions((prev) => ({
      ...prev,
      [review._id]: { disliked: nextDisliked, liked: nextDisliked ? false : prevReaction.liked },
    }));
    updateReviewCounts(
      review._id,
      nextDisliked && prevReaction.liked ? Math.max(0, prevLikeCount - 1) : prevLikeCount,
      prevDislikeCount + (prevReaction.disliked ? -1 : 1)
    );

    try {
      const data = await toggleDislikeReview(review._id);
      setReviewReactions((prev) => ({
        ...prev,
        [review._id]: { disliked: data.disliked, liked: data.disliked ? false : prevReaction.liked },
      }));
      updateReviewCounts(review._id, data.like_count, data.dislike_count);
      await refreshSession();
    } catch (err) {
      console.error(err);
      setReviewReactions((prev) => ({ ...prev, [review._id]: prevReaction }));
      updateReviewCounts(review._id, prevLikeCount, prevDislikeCount);
    }
  };

  const handleToggleReaction = async (item) => {
    const toggleFns =
      config.kind === "blog"
        ? { like: toggleLikeBlog, dislike: toggleDislikeBlog }
        : { like: toggleLikeDestination, dislike: toggleDislikeDestination };
    const toggleFn = toggleFns[config.reaction];
    const wasRemoved = removedReactionIds.has(item._id);
    setRemovedReactionIds((prev) => {
      const next = new Set(prev);
      wasRemoved ? next.delete(item._id) : next.add(item._id);
      return next;
    });
    try {
      await toggleFn(item._id);
      await refreshSession();
    } catch (err) {
      console.error(err);
      setRemovedReactionIds((prev) => {
        const next = new Set(prev);
        wasRemoved ? next.add(item._id) : next.delete(item._id);
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

  const handleDeleteBlog = async (blog) => {
    if (!window.confirm("Delete this blog? This cannot be undone.")) return;
    try {
      await deleteBlog(blog._id);
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
          <div className="space-y-3">
            {items.map((item, i) => {
              if (config.kind === "review") {
                const reaction = reviewReactions[item._id] || {};
                const isOwn = !!config.owner;
                return (
                  <EntityCard
                    key={item._id}
                    index={i}
                    to={`/destinationDetail/${item.destinationId?._id}`}
                    icon={User}
                    title={item.userId?.name || "Traveler"}
                    description={
                      item.comment || `Reviewed ${item.destinationId?.name || "a destination"}`
                    }
                    meta={
                      <>
                        <Star className="w-3.5 h-3.5 text-yellow-400" fill />
                        <span className="text-xs font-semibold text-gray-700">{item.rating}</span>
                      </>
                    }
                    actions={
                      isOwn ? (
                        <>
                          <button
                            onClick={() => setEditingReview(item)}
                            aria-label="Edit review"
                            className="text-gray-300 hover:text-orange-500 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(item)}
                            aria-label="Delete review"
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                        </>
                      ) : config.reaction === "like" ? (
                        <button
                          onClick={() => handleLikeReview(item)}
                          aria-label="Like review"
                          className={reaction.liked ? "text-orange-500" : "text-gray-300 hover:text-orange-500"}
                        >
                          <ThumbsUp className="w-4 h-4" fill={reaction.liked ? "currentColor" : "none"} strokeWidth={1.75} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleDislikeReview(item)}
                          aria-label="Dislike review"
                          className={reaction.disliked ? "text-slate-600" : "text-gray-300 hover:text-slate-600"}
                        >
                          <ThumbsDown className="w-4 h-4" fill={reaction.disliked ? "currentColor" : "none"} strokeWidth={1.75} />
                        </button>
                      )
                    }
                  />
                );
              }

              if (config.kind === "blog") {
                const date = item.createdAt
                  ? new Date(item.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : null;
                return (
                  <EntityCard
                    key={item._id}
                    index={i}
                    to={`/blog/${item._id}`}
                    icon={Newspaper}
                    title={item.title}
                    description={item.description}
                    meta={date && <span className="text-xs text-gray-400">{date}</span>}
                    actions={
                      config.owner ? (
                        <>
                          <Link
                            to={`/blog/${item._id}/edit`}
                            aria-label="Edit blog"
                            className="text-gray-300 hover:text-orange-500 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </Link>
                          <button
                            onClick={() => handleDeleteBlog(item)}
                            aria-label="Delete blog"
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                        </>
                      ) : config.reaction === "like" ? (
                        <button
                          onClick={() => handleToggleReaction(item)}
                          aria-label="Unlike blog"
                          className={!removedReactionIds.has(item._id) ? "text-red-500" : "text-gray-800"}
                        >
                          <Heart className="w-4 h-4" fill="currentColor" strokeWidth={1.75} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleToggleReaction(item)}
                          aria-label="Remove dislike"
                          className={!removedReactionIds.has(item._id) ? "text-slate-600" : "text-gray-800"}
                        >
                          <ThumbsDown className="w-4 h-4" fill="currentColor" strokeWidth={1.75} />
                        </button>
                      )
                    }
                  />
                );
              }

              return (
                <EntityCard
                  key={item._id}
                  index={i}
                  to={`/destinationDetail/${item._id}`}
                  image={item.images?.[0] || "/placeholder.jpg"}
                  title={item.name}
                  description={`${item.city}, ${item.country}`}
                  meta={
                    <>
                      <Star className="w-3.5 h-3.5 text-yellow-400" fill />
                      <span className="text-xs font-semibold text-gray-700">{item.avg_rating}</span>
                    </>
                  }
                  actions={
                    <>
                      {config.reaction && (
                        <button
                          onClick={() => handleToggleReaction(item)}
                          aria-label={config.reaction === "like" ? "Unlike destination" : "Remove dislike"}
                          className={
                            !removedReactionIds.has(item._id)
                              ? config.reaction === "like"
                                ? "text-red-500"
                                : "text-slate-600"
                              : "text-gray-800"
                          }
                        >
                          {config.reaction === "like" ? (
                            <Heart className="w-4 h-4" fill="currentColor" strokeWidth={1.75} />
                          ) : (
                            <ThumbsDown className="w-4 h-4" fill="currentColor" strokeWidth={1.75} />
                          )}
                        </button>
                      )}
                      {section === "created" && (
                        <>
                          <Link
                            to={`/destinations/${item._id}/edit`}
                            aria-label="Edit destination"
                            className="text-gray-300 hover:text-orange-500 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </Link>
                          <button
                            onClick={() => handleDeleteDestination(item)}
                            aria-label="Delete destination"
                            className="text-gray-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.75} />
                          </button>
                        </>
                      )}
                    </>
                  }
                />
              );
            })}
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
