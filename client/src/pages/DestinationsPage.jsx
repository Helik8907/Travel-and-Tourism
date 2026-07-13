import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MapPin, ArrowRight, Loader } from "lucide-react";
import { destinationLoader } from "../lib/destinations/destinations";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 200, damping: 20 },
  },
};

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

function StarRating({ rating, count }) {
  return (
    <div className="flex items-center gap-1">
      <Star className="w-3.5 h-3.5 text-yellow-400" fill />
      <span className="text-sm font-semibold text-white">{rating}</span>
      <span className="text-xs text-white/60">({count})</span>
    </div>
  );
}

function DestinationCard({ dest }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      variants={cardVariants}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden cursor-pointer bg-white shadow-lg font-['Bricolage_Grotesque']"
    >
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={dest.images[0] || "/placeholder.jpg"}
          alt={dest.name}
          className="w-full h-full object-cover"
          animate={{ scale: hovered ? 1.08 : 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {dest.type?.map((t) => (
            <span
              key={t}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider ${
                typeColors[t] || typeColors.Other
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        <div className="absolute top-3 right-3">
          <StarRating rating={dest.avg_rating} count={dest.review_count} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center gap-1 text-white/80 text-xs mb-1">
            <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>
              {dest.city}, {dest.country}
            </span>
          </div>
          <h3 className="text-lg font-bold text-white leading-tight">
            {dest.name}
          </h3>
        </div>
      </div>

      <div className="p-4 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">From</p>
            <p className="text-lg font-bold text-gray-900">
              ${dest.cost_range?.min?.toLocaleString() ?? 0}
              <span className="text-sm text-gray-400 font-normal">
                {" "}
                - ${dest.cost_range?.max?.toLocaleString() ?? 0}
              </span>
            </p>
          </div>

          <motion.div
            animate={{ x: hovered ? 4 : 0 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-300"
          >
            <ArrowRight className="w-4 h-4 text-orange-500 group-hover:text-white transition-colors duration-300" />
          </motion.div>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">
            Best time to visit
          </p>
          <div className="flex gap-1 flex-wrap">
            {dest.best_months?.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-[10px] font-medium"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationLoader();
        setDestinations(data.destinations);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen pt-32 lg:pt-40 bg-teal-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-orange-400 animate-spin" />
          <p className="text-white/60 text-sm">Loading destinations...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen pt-32 lg:pt-40 bg-teal-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-medium mb-2">Oops! Something went wrong.</p>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="destinations" className="min-h-screen pt-32 pb-16 lg:pt-40 lg:pb-24 bg-teal-950 font-['Bricolage_Grotesque']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest mb-4">
            Popular Destinations
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Where will you go next?
          </h2>
          <p className="text-white/60 text-base max-w-xl mx-auto">
            Hand-picked destinations loved by thousands of travelers.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {destinations.map((dest) => (
            <DestinationCard key={dest._id} dest={dest} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default DestinationsPage;
