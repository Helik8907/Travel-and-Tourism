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
  Hotel,
  Utensils,
  ExternalLink,
  Phone,
  Globe,
  Map as MapIcon,
} from "lucide-react";

// 👉 Leaflet Map Imports
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { destinationLoader, getDestination, toggleLikeDestination } from "../lib/destinations/destinations";
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

// Fix for default Leaflet marker icons in React
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// A green marker for the selected place
const activeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Helper component to auto-zoom map when a place is clicked
function MapController({ center, activePlace }) {
  const map = useMap();
  
  useEffect(() => {
    if (activePlace && center) {
      const bounds = L.latLngBounds([
        [center.lat, center.lng],
        [activePlace.lat, activePlace.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    } else if (center) {
      map.setView([center.lat, center.lng], 13, { animate: true });
    }
  }, [activePlace, center, map]);

  return null;
}

// Distance Calculation (Haversine Formula) - Now stricter with Number()
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  
  const l1 = Number(lat1);
  const ln1 = Number(lon1);
  const l2 = Number(lat2);
  const ln2 = Number(lon2);

  if (isNaN(l1) || isNaN(ln1) || isNaN(l2) || isNaN(ln2)) return 9999;

  const dLat = (l2 - l1) * (Math.PI / 180);
  const dLon = (ln2 - ln1) * (Math.PI / 180);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(l1 * (Math.PI / 180)) *
      Math.cos(l2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
      
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Returns a raw Number for sorting
}

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

function formatTimeTake(timeTake) {
  if (!timeTake) return "";
  const { min, max } = timeTake;
  const unit = (max && max !== min ? max : min) === 1 ? "hour" : "hours";
  return max && max !== min ? `${min}-${max} ${unit}` : `${min} ${unit}`;
}

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [destination, setDestination] = useState(null);
  
  const [relatedDestinations, setRelatedDestinations] = useState([]);
  const [relatedIndex, setRelatedIndex] = useState(0); 
  
  const [nearbyHotels, setNearbyHotels] = useState([]);
  const [nearbyRestaurants, setNearbyRestaurants] = useState([]);
  const [nearbyLoading, setNearbyLoading] = useState(false);
  const [placesTab, setPlacesTab] = useState("hotels");
  
  const [activePlace, setActivePlace] = useState(null);

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

  const handlePlanTrip = () =>
    navigate("/planner", { state: { destinationId: destination._id } });
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

  // 👉 1. Bulletproof OpenStreetMap Fetcher
  const fetchNearbyOSMPlaces = async (rawLat, rawLng) => {
    let lat = Number(rawLat);
    let lng = Number(rawLng);

    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      console.warn("⚠️ Invalid coordinates:", { rawLat, rawLng });
      return;
    }

    // Auto-detect and fix swapped Lat/Lng in the database
    if (lat > 50 && lng < 40) {
      console.warn("⚠️ Lat/Lng appear swapped. Auto-correcting...");
      [lat, lng] = [lng, lat];
    }

    setNearbyLoading(true);
    try {
      const query = `
        [out:json][timeout:15];
        (
          node["tourism"~"hotel|guest_house|hostel|resort|motel"](around:3000,${lat},${lng});
          way["tourism"~"hotel|guest_house|hostel|resort|motel"](around:3000,${lat},${lng});
          relation["tourism"~"hotel|guest_house|hostel|resort|motel"](around:3000,${lat},${lng});
          node["amenity"~"restaurant|cafe|fast_food|bar|food_court"](around:3000,${lat},${lng});
          way["amenity"~"restaurant|cafe|fast_food|bar|food_court"](around:3000,${lat},${lng});
          relation["amenity"~"restaurant|cafe|fast_food|bar|food_court"](around:3000,${lat},${lng});
        );
        out center 30;
      `;

      // Failover Server logic
      const servers = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
      ];

      let data = null;
      for (const server of servers) {
        try {
          const res = await fetch(`${server}?data=${encodeURIComponent(query)}`);
          if (res.ok) {
            data = await res.json();
            break;
          }
        } catch (e) {
          console.warn(`Server ${server} failed, trying backup mirror...`);
        }
      }

      if (!data || !data.elements) {
        console.error("❌ Failed to fetch from all OpenStreetMap servers.");
        return;
      }

      const hotels = [];
      const restaurants = [];

      data.elements.forEach((item) => {
        if (!item.tags || !item.tags.name) return;

        const placeLat = item.lat || item.center?.lat;
        const placeLng = item.lon || item.center?.lon;

        if (!placeLat || !placeLng) return;

        const dist = getDistance(lat, lng, placeLat, placeLng);
        if (dist > 5.0) return; // Discard outliers beyond 5km

        const place = {
          id: item.id,
          name: item.tags.name,
          type: item.tags.tourism || item.tags.amenity,
          cuisine: item.tags.cuisine,
          phone: item.tags.phone || item.tags["contact:phone"],
          website: item.tags.website || item.tags["contact:website"],
          street: item.tags["addr:street"]
            ? `${item.tags["addr:street"]} ${item.tags["addr:housenumber"] || ""}`
            : null,
          lat: placeLat,
          lng: placeLng,
          distance: dist,
        };

        if (item.tags.tourism) {
          hotels.push(place);
        } else if (item.tags.amenity) {
          restaurants.push(place);
        }
      });

      // Sort strictly by the numeric distance
      hotels.sort((a, b) => a.distance - b.distance);
      restaurants.sort((a, b) => a.distance - b.distance);

      setNearbyHotels(hotels.slice(0, 6));
      setNearbyRestaurants(restaurants.slice(0, 6));
    } catch (err) {
      console.error("OSM Fetch Error (Normal in Dev Mode):", err);
    } finally {
      setNearbyLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setRelatedIndex(0);
    setActivePlace(null);
    
    const fetchDestinationData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDestination(id);
        const dest = data.destination;
        setDestination(dest);
        setLikeCount(dest.like_count ?? 0);
        const user = getCurrentUser();
        setLiked(!!user?.destinations_liked?.includes(id));

        const lat = dest.cordinates?.lat || dest.coordinates?.lat;
        const lng = dest.cordinates?.lng || dest.coordinates?.lng;
        if (lat && lng) {
          fetchNearbyOSMPlaces(lat, lng);
        }

        if (dest.state) {
          try {
            const allRes = await destinationLoader(); 
            const allDestinations = Array.isArray(allRes) ? allRes : (allRes.destinations || []);
            
            const filtered = allDestinations
              .filter((d) => d.state === dest.state && d._id !== id)
              .slice(0, 20);
              
            setRelatedDestinations(filtered);
          } catch (relErr) {
            console.error("Failed to fetch related destinations", relErr);
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinationData();
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

  // 🛠️ Ensure the Leaflet Map also respects auto-corrected Lat/Lng!
  let mapLat = Number(destination.cordinates?.lat || destination.coordinates?.lat);
  let mapLng = Number(destination.cordinates?.lng || destination.coordinates?.lng);
  if (mapLat > 50 && mapLng < 40) {
    [mapLat, mapLng] = [mapLng, mapLat];
  }
  const correctedCenter = { lat: mapLat, lng: mapLng };

  const activePlaces = placesTab === "hotels" ? nearbyHotels : nearbyRestaurants;

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
                  {formatTimeTake(destination.time_take)}
                </p>
                <p className="text-xs text-white/50">To fully experience the area</p>
              </div>
            </motion.div>

            {/* 👉 OpenStreetMap Live Nearby Amenities with Interactive Map */}
            {correctedCenter.lat && correctedCenter.lng && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white">Explore the Area</h2>
                    <p className="text-xs text-white/50">Interactive map and nearby amenities</p>
                  </div>

                  <div className="flex bg-black/30 p-1 rounded-xl border border-white/10">
                    <button
                      onClick={() => {
                        setPlacesTab("hotels");
                        setActivePlace(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        placesTab === "hotels"
                          ? "bg-orange-500 text-white shadow-lg"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Hotel className="w-3.5 h-3.5" /> Hotels
                    </button>
                    <button
                      onClick={() => {
                        setPlacesTab("restaurants");
                        setActivePlace(null);
                      }}
                      className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        placesTab === "restaurants"
                          ? "bg-orange-500 text-white shadow-lg"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <Utensils className="w-3.5 h-3.5" /> Restaurants
                    </button>
                  </div>
                </div>

                {/* The Map Component */}
                <div className="w-full h-64 rounded-xl overflow-hidden mb-6 border border-white/10 relative z-0">
                  <MapContainer center={[correctedCenter.lat, correctedCenter.lng]} zoom={13} scrollWheelZoom={false} className="w-full h-full">
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    <Marker position={[correctedCenter.lat, correctedCenter.lng]} icon={customIcon}>
                      <Popup>
                        <strong>{destination.name}</strong> <br />
                        Destination Center
                      </Popup>
                    </Marker>

                    {activePlace && (
                      <>
                        <Marker position={[activePlace.lat, activePlace.lng]} icon={activeIcon}>
                          <Popup>
                            <strong>{activePlace.name}</strong> <br />
                            Distance: {activePlace.distance.toFixed(2)} km
                          </Popup>
                        </Marker>
                        <Polyline 
                          positions={[
                            [correctedCenter.lat, correctedCenter.lng],
                            [activePlace.lat, activePlace.lng]
                          ]} 
                          color="orange" 
                          dashArray="5, 10"
                        />
                      </>
                    )}
                    
                    <MapController center={correctedCenter} activePlace={activePlace} />
                  </MapContainer>
                </div>

                {nearbyLoading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-white/50">Finding closest places near {destination.name}...</p>
                  </div>
                ) : activePlaces.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activePlaces.map((place) => (
                      <div
                        key={place.id}
                        onClick={() => setActivePlace(place)}
                        className={`p-4 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                          activePlace?.id === place.id
                            ? "bg-orange-500/10 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <h3 className="text-white font-semibold text-base line-clamp-1 flex-grow">
                              {place.name}
                            </h3>
                            {/* 👉 Format raw cuisine tags like 'fast_food' to 'fast food' */}
                            <span className="text-[10px] px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 capitalize border border-orange-500/30 whitespace-nowrap">
                              {(place.cuisine || place.type).replace(/_/g, " ").replace(/;/g, ", ")}
                            </span>
                          </div>
                          
                          <p className="text-xs text-white/50 flex items-center gap-1.5 mb-3 line-clamp-1">
                            <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                            {place.street || "Location available on map"}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 text-white/60 text-sm mt-auto pt-3 border-t border-white/10">
                          {place.phone && (
                            <a href={`tel:${place.phone}`} title={place.phone} className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                          {place.website && (
                            <a href={place.website} target="_blank" rel="noreferrer" title="Website" className="hover:text-white transition-colors" onClick={(e) => e.stopPropagation()}>
                              <Globe className="w-4 h-4" />
                            </a>
                          )}
                          
                          <span className="flex items-center gap-1.5 text-xs font-semibold text-orange-400 ml-auto">
                            <MapIcon className="w-3.5 h-3.5" />
                            {/* Format safely to 2 decimal places */}
                            {place.distance.toFixed(2)} km
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-white/50 py-4 text-center">
                    No {placesTab} found directly in OpenStreetMap near these coordinates.
                  </p>
                )}
              </motion.div>
            )}

            {/* Entry requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
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
              transition={{ delay: 0.8 }}
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

            {/* Related Destinations Render WITH ARROWS */}
            {relatedDestinations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-12"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">
                    More to explore in {destination.state}
                  </h2>
                  
                  {relatedDestinations.length > 2 && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setRelatedIndex((prev) => Math.max(0, prev - 2))}
                        disabled={relatedIndex === 0}
                        className={`p-2 rounded-full transition-colors ${
                          relatedIndex === 0
                            ? "bg-white/5 text-white/20 cursor-not-allowed"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" strokeWidth={2} />
                      </button>
                      <button
                        onClick={() => setRelatedIndex((prev) => Math.min(relatedDestinations.length - 2, prev + 2))}
                        disabled={relatedIndex >= relatedDestinations.length - 2}
                        className={`p-2 rounded-full transition-colors ${
                          relatedIndex >= relatedDestinations.length - 2
                            ? "bg-white/5 text-white/20 cursor-not-allowed"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        <ChevronRight className="w-4 h-4" strokeWidth={2} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedDestinations.slice(relatedIndex, relatedIndex + 2).map((dest) => (
                    <motion.div
                      key={dest._id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="h-full"
                    >
                      <Link
                        to={`/destinationDetail/${dest._id}`}
                        className="group block bg-white/5 hover:bg-white/10 transition-colors rounded-2xl overflow-hidden border border-white/10 h-full"
                      >
                        <div className="h-40 w-full overflow-hidden relative">
                          <img
                            src={dest.images?.[0] || "/placeholder.jpg"}
                            alt={dest.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <StarRating rating={dest.avg_rating} />
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-white font-bold truncate text-lg">{dest.name}</h3>
                          <p className="text-white/60 text-sm flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5" /> {dest.city}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
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
                    {formatTimeTake(destination.time_take)}
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handlePlanTrip}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-500/20 mb-3"
              >
                Plan Trip
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