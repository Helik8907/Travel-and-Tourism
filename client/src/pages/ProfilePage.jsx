import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Pencil, Calendar, Heart, ThumbsDown, Compass, MessageSquare, Newspaper, Plus } from "lucide-react";
import { getProfile, updateProfile } from "../lib/profile/profile";
import { refreshSession } from "../lib/auth/auth";
import ProfileEditForm from "../components/profile/ProfileEditForm";

const TONES = {
  orange: "bg-orange-500/20 text-orange-400",
  red: "bg-red-500/20 text-red-400",
  slate: "bg-slate-500/20 text-slate-300",
};

function StatCard({ icon: Icon, label, value, to, tone = "orange" }) {
  return (
    <Link
      to={to}
      className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 flex items-center gap-4 hover:bg-white/10 hover:border-white/20 transition-colors"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${TONES[tone]}`}>
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
        <p className="text-xs text-white/50">{label}</p>
      </div>
    </Link>
  );
}

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProfile();
      setUser(data.user);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async ({ name, resident }) => {
    await updateProfile({ name, resident });
    await Promise.all([fetchProfile(), refreshSession()]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/60 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <p className="text-white/60">{error || "Profile not found."}</p>
      </div>
    );
  }

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      })
    : null;

  return (
    <div className="min-h-screen bg-teal-950 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center gap-6"
        >
          <div className="w-20 h-20 rounded-full bg-orange-500/20 border border-orange-400/60 flex items-center justify-center text-3xl font-bold text-orange-300 shrink-0">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white truncate">{user.name}</h1>
            <p className="text-white/60 text-sm truncate">{user.email}</p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-white/50">
              {user.resident && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
                  {user.resident}
                </span>
              )}
              {memberSince && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" strokeWidth={1.75} />
                  Member since {memberSince}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/destinations/new"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-orange-400/60 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 font-semibold text-sm transition-all duration-300"
              >
                <Plus className="w-4 h-4" strokeWidth={1.75} />
                Add destination
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/blog/new"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-orange-400/60 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 font-semibold text-sm transition-all duration-300"
              >
                <Newspaper className="w-4 h-4" strokeWidth={1.75} />
                Write blog
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowEditModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
            >
              <Pencil className="w-4 h-4" strokeWidth={1.75} />
              Edit profile
            </motion.button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
        >
          <StatCard icon={Compass} label="Destinations created" value={user.destinations_created?.length ?? 0} to="/profile/created" />
          <StatCard icon={MessageSquare} label="Reviews created" value={user.reviews_created?.length ?? 0} to="/profile/reviews" />
          <StatCard icon={Newspaper} label="Blogs created" value={user.blogs_created?.length ?? 0} to="/profile/blogs" />

          <StatCard icon={Heart} label="Destinations liked" value={user.destinations_liked?.length ?? 0} to="/profile/liked" tone="red" />
          <StatCard icon={Heart} label="Reviews liked" value={user.reviews_liked?.length ?? 0} to="/profile/reviews-liked" tone="red" />
          <StatCard icon={Heart} label="Blogs liked" value={user.blogs_liked?.length ?? 0} to="/profile/blogs-liked" tone="red" />

          <StatCard icon={ThumbsDown} label="Destinations disliked" value={user.destinations_disliked?.length ?? 0} to="/profile/disliked" tone="slate" />
          <StatCard icon={ThumbsDown} label="Reviews disliked" value={user.reviews_disliked?.length ?? 0} to="/profile/reviews-disliked" tone="slate" />
          <StatCard icon={ThumbsDown} label="Blogs disliked" value={user.blogs_disliked?.length ?? 0} to="/profile/blogs-disliked" tone="slate" />
        </motion.div>
      </div>

      {showEditModal && (
        <ProfileEditForm
          user={user}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateProfile}
        />
      )}
    </div>
  );
}
