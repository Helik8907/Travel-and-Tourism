import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, DollarSign, MapPin, Trash2 } from "lucide-react";
import { myItinerariesLoader, deleteItinerary } from "../lib/itineraries/itineraries";

function formatDate(date) {
  return new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function ItineraryCard({ itinerary, index, onDelete }) {
  const navigate = useNavigate();
  const stopCount = itinerary.days?.reduce((sum, d) => sum + (d.entries?.length || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      onClick={() => navigate(`/planner/${itinerary._id}`)}
      className="group cursor-pointer bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg hover:border-orange-200 transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-orange-500 transition-colors">
            {itinerary.title}
          </h3>
          <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
            <Calendar className="w-3.5 h-3.5 shrink-0" strokeWidth={1.75} />
            {formatDate(itinerary.startDate)} - {formatDate(itinerary.endDate)}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(itinerary);
          }}
          aria-label="Delete itinerary"
          className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin className="w-3.5 h-3.5" strokeWidth={1.75} />
          {itinerary.days?.length || 0} days &middot; {stopCount} stops
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-500">
          <DollarSign className="w-3.5 h-3.5" strokeWidth={1.75} />
          {itinerary.avg_cost?.toLocaleString()}
        </span>
      </div>
    </motion.div>
  );
}

export default function MyItinerariesPage() {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItineraries = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await myItinerariesLoader();
      setItineraries(data.itineraries ?? []);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraries();
  }, []);

  const handleDelete = async (itinerary) => {
    if (!window.confirm(`Delete "${itinerary.title}"? This cannot be undone.`)) return;
    try {
      await deleteItinerary(itinerary._id);
      await fetchItineraries();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-teal-950 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 lg:pt-24">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">My Itineraries</h1>
          <p className="text-sm text-white/50 mt-1">Trips you've planned</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <p className="text-white/60">{error}</p>
        ) : itineraries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {itineraries.map((itinerary, i) => (
              <ItineraryCard
                key={itinerary._id}
                itinerary={itinerary}
                index={i}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-white/40 text-sm mb-1">No itineraries yet</p>
            <p className="text-white/30 text-xs">Plan your first trip to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
