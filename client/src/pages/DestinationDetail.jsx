import { useState, useEffect } from "react";
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
  User,
  ThumbsUp,
} from "lucide-react";

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
function ImageGallery({ images }) {
  const [current, setCurrent] = useState(0);
  const [liked, setLiked] = useState(false);

  const next = () => setCurrent((c) => (c + 1) % images.length);
  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

  return (
    <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt="Destination"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

      {/* Top controls */}
      <div className="absolute top-4 left-4">
        <a
          href="#destinations"
          className="flex items-center gap-2 text-white/90 hover:text-white text-sm font-medium transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.75} />
          Back to destinations
        </a>
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setLiked(!liked)}
          className={`w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-colors ${
            liked ? "bg-red-500/80 text-white" : "bg-black/20 text-white/80 hover:text-white"
          }`}
        >
          <Heart className="w-5 h-5" fill={liked} strokeWidth={1.75} />
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
            className={`h-2 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/50 w-2"}`}
          />
        ))}
      </div>
    </div>
  );
}

// Single review card
function ReviewCard({ review, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className="bg-white rounded-xl p-5 border border-gray-100"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <User className="w-5 h-5 text-orange-500" strokeWidth={1.75} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{review.user}</p>
            <p className="text-xs text-gray-400">{review.date}</p>
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
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.text}</p>
      <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-orange-500 transition-colors">
        <ThumbsUp className="w-3.5 h-3.5" strokeWidth={1.75} />
        Helpful ({review.likes})
      </button>
    </motion.div>
  );
}

export default function DestinationDetail() {
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        // Mock data for design Purpose
        setDestination({
          _id: "3",
          name: "Bali Retreat",
          city: "Ubud",
          country: "Indonesia",
          type: ["Nature", "Adventure"],
          description:
            "Discover the spiritual heart of Bali in Ubud, where lush rice terraces cascade down volcanic hillsides, ancient temples whisper centuries of stories, and the gentle rhythm of village life invites you to slow down. From sunrise yoga overlooking the jungle to exploring sacred monkey forests, Ubud offers a perfect blend of tranquility and adventure for the mindful traveler.",
          images: [
            "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&auto=format&fit=crop",
          ],
          cost_range: { min: 800, max: 1600 },
          best_months: ["Apr", "May", "Jun", "Sep"],
          weather: {
            min_temp: 22,
            max_temp: 31,
            condition: "Tropical humid with afternoon showers",
          },
          entry_req: [
            "Valid passport (6+ months)",
            "Visa on arrival (30 days)",
            "Return ticket required",
            "Vaccination certificate (if applicable)",
          ],
          avg_rating: 4.6,
          review_count: 891,
          time_take: "7-10 days recommended",
          reviews: [
            {
              _id: "r1",
              user: "Sarah M.",
              rating: 5,
              text: "Absolutely magical! The rice terraces at sunrise are unforgettable. Our guide was incredibly knowledgeable about Balinese culture.",
              date: "2024-11-15",
              likes: 24,
            },
            {
              _id: "r2",
              user: "James K.",
              rating: 4,
              text: "Beautiful place but very crowded in the central market area. Stay in a villa outside town for the best experience.",
              date: "2024-10-28",
              likes: 12,
            },
            {
              _id: "r3",
              user: "Elena R.",
              rating: 5,
              text: "The yoga retreat was life-changing. Food is amazing and the people are so warm. Already planning my return!",
              date: "2024-09-20",
              likes: 31,
            },
          ],
        });
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 600);
      }
    };

    fetchDestination();
  }, []);

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

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-950">
        <p className="text-white/60">Destination not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-950 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Image Gallery */}
        <ImageGallery images={destination.images} />

        {/* Main content grid */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3">
                {destination.type.map((t) => (
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
                  {destination.weather.min_temp}° - {destination.weather.max_temp}°C
                </p>
                <p className="text-xs text-white/50">{destination.weather.condition}</p>
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
                {destination.best_months.map((m) => (
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
                {destination.entry_req.map((req, i) => (
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
              <h2 className="text-xl font-bold text-white mb-4">
                Traveler Reviews
              </h2>
              <div className="space-y-4">
                {destination.reviews.map((review, i) => (
                  <ReviewCard key={review._id} review={review} index={i} />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right column - sticky booking card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="sticky top-6 bg-white rounded-2xl p-6 shadow-xl"
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
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-500/20 mb-3"
              >
                Book This Trip
              </motion.button>

              <button className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors">
                Save to Wishlist
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Free cancellation up to 48 hours before departure
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}