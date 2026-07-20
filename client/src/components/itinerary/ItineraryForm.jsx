import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash,
  MapPin,
  Clock,
  DollarSign,
  Compass,
  ChevronRight,
  Save,
} from "lucide-react";
import { destinationLoader } from "../../lib/destinations/destinations";
import {
  getItinerary,
  createItinerary,
  editItinerary,
  myItinerariesLoader,
} from "../../lib/itineraries/itineraries";
import { getCurrentUser } from "../../lib/auth/auth";
import AuthPromptModal from "../auth/AuthPromptModal";

const toDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : "");

const addDays = (dateStr, amount) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  d.setDate(d.getDate() + amount);
  return toDateInput(d);
};

const formatTime12h = (time) => {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

export default function ItineraryForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // TRIP INFO hook setUp
  const [tripTitle, setTripTitle] = useState("Itinerary 1");
  const [startDate, setStartDate] = useState(toDateInput(new Date()));

  const [budget, setBudget] = useState(1000);

  // DAYS & STOPS (matches daySchema + stopSchema)
  // If arriving from a destination's "Plan Trip" button, pre-fill it as Day 1's first stop.
  const [days, setDays] = useState(() => {
    const destinationId = location.state?.destinationId;
    return [
      {
        dayNumber: 1,
        entries: destinationId
          ? [{ destinationId, notes: "", time: "09:00", cost: 0, order: 1 }]
          : [],
      },
    ];
  });

  //  UI STATE
  const [activeDay, setActiveDay] = useState(1);
  const [showAddStop, setShowAddStop] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);

  // Form state for new stop
  const [newStopDest, setNewStopDest] = useState("");
  const [newStopTime, setNewStopTime] = useState("09:00");
  const [newStopNotes, setNewStopNotes] = useState("");
  // True when this stop is transferring in from a full previous day, meaning
  // it should take the day's first slot and push that day's existing stops later.
  const [insertAtFront, setInsertAtFront] = useState(false);

  // Real destinations, fetched from the backend
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    destinationLoader()
      .then((data) => {
        const list = data.destinations ?? [];
        setDestinations(list);

        // Backfill the cost of a stop pre-filled before destinations loaded
        // (e.g. arriving via a destination's "Plan Trip" button).
        const prefillId = location.state?.destinationId;
        if (!id && prefillId) {
          const dest = list.find((d) => d._id === prefillId);
          if (dest) {
            const cost = (dest.cost_range.min + dest.cost_range.max) / 2;
            setDays((prev) =>
              prev.map((d) => ({
                ...d,
                entries: d.entries.map((e) =>
                  e.destinationId === prefillId ? { ...e, cost } : e
                ),
              }))
            );
          }
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Default a new itinerary's name to the next free "Itinerary N" slot
  useEffect(() => {
    if (id) return;
    if (!getCurrentUser()) return;
    myItinerariesLoader()
      .then((data) => {
        const numbers = (data.itineraries ?? [])
          .map((it) => /^Itinerary (\d+)$/.exec(it.title))
          .filter(Boolean)
          .map((match) => Number(match[1]));
        const nextNumber = numbers.length ? Math.max(...numbers) + 1 : 1;
        setTripTitle(`Itinerary ${nextNumber}`);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // Load an existing itinerary when editing
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getItinerary(id)
      .then((data) => {
        const itinerary = data.itinerary;
        setTripTitle(itinerary.title);
        setStartDate(toDateInput(itinerary.startDate));
        setDays(itinerary.days?.length ? itinerary.days : [{ dayNumber: 1, entries: [] }]);
        setActiveDay(itinerary.days?.[0]?.dayNumber ?? 1);
      })
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // calculations
  const endDate = addDays(startDate, days.length - 1);
  const totalCost = Math.ceil(
    days.reduce(
      (sum, day) =>
        sum + day.entries.reduce((s, e) => s + (Number(e.cost) || 0), 0),
      0
    )
  );
  const totalStops = days.reduce((sum, day) => sum + day.entries.length, 0);
  const activeDayData = days.find((d) => d.dayNumber === activeDay);

  // Budget range is derived from the cost_range of every selected destination
  const getDestCostRange = (destId) =>
    destinations.find((dest) => dest._id === destId)?.cost_range;
  const budgetMin = days.reduce(
    (sum, day) =>
      sum +
      day.entries.reduce(
        (s, e) => s + (getDestCostRange(e.destinationId)?.min ?? 0),
        0
      ),
    0
  );
  const budgetMax = days.reduce(
    (sum, day) =>
      sum +
      day.entries.reduce(
        (s, e) => s + (getDestCostRange(e.destinationId)?.max ?? 0),
        0
      ),
    0
  );
  const estimatedCost = Math.ceil((budgetMin + budgetMax) / 2);

  const getDestName = (destId) => {
    const d = destinations.find((dest) => dest._id === destId);
    return d ? d.name : "Unknown";
  };

  const getDestCity = (destId) => {
    const d = destinations.find((dest) => dest._id === destId);
    return d ? `${d.city}, ${d.country}` : "";
  };

  // Default slot for a new stop: 09:00 if it's the day's first, otherwise the
  // previous stop's time plus how long that destination takes to tour (always in hours).
  // `overflow` is true when that pushes past the end of the day, meaning the
  // stop belongs on the next day instead.
  const getNextSlot = (entries) => {
    if (!entries.length) return { time: "09:00", overflow: false, daysToSkip: 0 };
    const last = entries[entries.length - 1];
    const duration = destinations.find((d) => d._id === last.destinationId)?.time_take;

    const addHours = duration ? (duration.min + duration.max) / 2 : 1;
    const [h, m] = last.time.split(":").map(Number);
    const rawMinutes = h * 60 + m + Math.round(addHours * 60);
    const overflow = rawMinutes >= 24 * 60;
    const totalMinutes = Math.min(rawMinutes, 23 * 60 + 45);
    const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const mm = String(totalMinutes % 60).padStart(2, "0");
    return { time: `${hh}:${mm}`, overflow, daysToSkip: overflow ? 1 : 0 };
  };

  // addDay
  const addDay = () => {
    const newDayNum = days.length + 1;
    setDays([...days, { dayNumber: newDayNum, entries: [] }]);
    setActiveDay(newDayNum);
  };

  // Remove a day and renumber the rest
  const removeDay = (dayNum) => {
    if (days.length <= 1) return;
    const filtered = days.filter((d) => d.dayNumber !== dayNum);
    const renumbered = filtered.map((d, i) => ({
      ...d,
      dayNumber: i + 1,
    }));
    setDays(renumbered);
    setActiveDay(Math.min(activeDay, renumbered.length));
  };

  // Add a stop to the active day
  const addStop = () => {
    if (!newStopDest) return;

    const costRange = getDestCostRange(newStopDest);
    const cost = costRange ? (costRange.min + costRange.max) / 2 : 0;
    const newEntry = {
      destinationId: newStopDest,
      notes: newStopNotes,
      time: newStopTime,
      cost,
    };

    setDays((prev) =>
      prev.map((d) => {
        if (d.dayNumber !== activeDay) return d;

        if (!insertAtFront) {
          return {
            ...d,
            entries: [...d.entries, { ...newEntry, order: d.entries.length + 1 }],
          };
        }

        // Transferred in from a full previous day: take the first slot and
        // push this day's existing stops later, cascading off each other's duration.
        const shifted = [{ ...newEntry, order: 1 }];
        d.entries.forEach((entry) => {
          const slot = getNextSlot(shifted);
          shifted.push({ ...entry, time: slot.time, order: shifted.length + 1 });
        });

        return { ...d, entries: shifted };
      })
    );

    // Reset form
    setNewStopDest("");
    setNewStopTime("09:00");
    setNewStopNotes("");
    setInsertAtFront(false);
    setShowAddStop(false);
  };

  // Remove a stop and reorder remaining
  const removeStop = (dayNum, order) => {
    setDays((prev) =>
      prev.map((d) =>
        d.dayNumber === dayNum
          ? {
              ...d,
              entries: d.entries
                .filter((e) => e.order !== order)
                .map((e, i) => ({ ...e, order: i + 1 })),
            }
          : d
      )
    );
  };

  // save to the backend
  const saveItinerary = async () => {
    if (!getCurrentUser()) {
      setShowAuthModal(true);
      return;
    }

    setSaving(true);
    setError(null);

    // Build payload matching the Mongoose model exactly
    const payload = {
      title: tripTitle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      avg_cost: estimatedCost,
      cost_range: { min: budgetMin, max: budgetMax },
      days: days,
    };

    try {
      if (id) {
        await editItinerary(id, payload);
      } else {
        await createItinerary(payload);
      }
      navigate("/itineraries", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-teal-950 pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-950 pt-20">
      {/* Top bar */}
      <div className="border-b border-t border-white/10 bg-teal-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-lg font-bold text-white">
                  {id ? "Edit Itinerary" : "Add Itinerary"}
                </h1>
                <p className="text-xs text-white/50">
                  Plan your perfect journey
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-white/50">Expected Budget</p>
                <p className="text-lg font-bold text-orange-400">
                  ${estimatedCost.toLocaleString()}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={saveItinerary}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors shadow-lg shadow-orange-500/20"
              >
                <Save className="w-4 h-4" strokeWidth={1.75} />
                {saving ? "Saving..." : "Save Itinerary"}
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Trip info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10 mb-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Trip Name
              </label>
              <input
                type="text"
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors placeholder-white/30"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                End Date
              </label>
              <div className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm">
                {endDate}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Budget Range
              </label>
              <div className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm">
                ${budgetMin.toLocaleString()} - ${budgetMax.toLocaleString()}
              </div>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Budget ($)
              </label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar - Days */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white">Days</h3>
                <span className="text-xs text-white/40">
                  {days.length} total
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {days.map((day) => (
                  <motion.button
                    key={day.dayNumber}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveDay(day.dayNumber)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                      activeDay === day.dayNumber
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                        : "bg-white/5 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          activeDay === day.dayNumber
                            ? "bg-white/20 text-white"
                            : "bg-white/10 text-white/60"
                        }`}
                      >
                        {day.dayNumber}
                      </div>
                      <div>
                        <p
                          className={`text-sm font-medium ${
                            activeDay === day.dayNumber
                              ? "text-white"
                              : "text-white/80"
                          }`}
                        >
                          Day {day.dayNumber}
                        </p>
                        <p className="text-[10px] text-white/50">
                          {day.entries.length} stops
                        </p>
                      </div>
                    </div>
                    {activeDay === day.dayNumber && (
                      <ChevronRight
                        className="w-4 h-4"
                        strokeWidth={1.75}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={addDay}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-white/20 text-white/60 hover:text-white hover:border-white/40 transition-all text-sm"
              >
                <Plus className="w-4 h-4" strokeWidth={1.75} />
                Add Day
              </motion.button>
            </div>

            {/* Cost summary */}
            <div className="mt-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-bold text-white mb-3">
                Cost Breakdown
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Total Stops</span>
                  <span className="text-white font-medium">{totalStops}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Current Cost</span>
                  <span className="text-orange-400 font-bold">
                    ${totalCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Budget Range</span>
                  <span className="text-white font-medium">
                    ${budgetMin.toLocaleString()} - $
                    {budgetMax.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-white/10 my-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Remaining</span>
                  <span
                    className={`font-bold ${
                      totalCost > budget
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    ${(budget - totalCost).toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Remaining budget progress bar */}
              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      budget > 0
                        ? Math.max(
                            Math.min(((budget - totalCost) / budget) * 100, 100),
                            0
                          )
                        : 0
                    }%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>

          {/* Main - Timeline */}
          <div className="lg:col-span-9">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-5 min-h-[500px]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Day {activeDay}
                  </h2>
                  <p className="text-sm text-white/50 mt-0.5">
                    {activeDayData?.entries.length || 0} stops planned
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {days.length > 1 && (
                    <button
                      onClick={() => removeDay(activeDay)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-xs font-medium"
                    >
                      <Trash
                        className="w-3.5 h-3.5"
                        strokeWidth={1.75}
                      />
                      Remove Day
                    </button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      const opening = !showAddStop;
                      if (opening) {
                        const slot = getNextSlot(activeDayData?.entries ?? []);
                        if (slot.overflow) {
                          // Previous stop's tour runs past the end of the day (or is a
                          // multi-day/night stay) — skip ahead by however many days it needs.
                          const nextDayNum = activeDay + slot.daysToSkip;
                          if (nextDayNum > days.length) {
                            const newDays = [];
                            for (let n = days.length + 1; n <= nextDayNum; n++) {
                              newDays.push({ dayNumber: n, entries: [] });
                            }
                            setDays((prev) => [...prev, ...newDays]);
                          }
                          const nextDay = days.find((d) => d.dayNumber === nextDayNum);
                          setActiveDay(nextDayNum);
                          // If that day already has stops planned, the transferred stop
                          // takes the first slot and the existing stops shift later.
                          setInsertAtFront(Boolean(nextDay?.entries.length));
                          setNewStopTime("09:00");
                        } else {
                          setInsertAtFront(false);
                          setNewStopTime(slot.time);
                        }
                      }
                      setShowAddStop(opening);
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
                  >
                    <Plus className="w-4 h-4" strokeWidth={1.75} />
                    Add Stop
                  </motion.button>
                </div>
              </div>

              {/* Add stop form */}
              <AnimatePresence>
                {showAddStop && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mb-6"
                  >
                    <div className="bg-white rounded-xl p-5 border border-gray-100">
                      <h3 className="text-sm font-bold text-gray-900 mb-4">
                        Add New Stop
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">
                            Destination
                          </label>
                          <select
                            value={newStopDest}
                            onChange={(e) => setNewStopDest(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:border-orange-400"
                          >
                            <option value="">Select...</option>
                            {destinations.map((d) => (
                              <option key={d._id} value={d._id}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">
                            Time
                          </label>
                          <input
                            type="time"
                            value={newStopTime}
                            onChange={(e) =>
                              setNewStopTime(e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:border-orange-400"
                          />
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <label className="block text-xs text-gray-500 mb-1.5">
                            Notes
                          </label>
                          <input
                            type="text"
                            value={newStopNotes}
                            onChange={(e) =>
                              setNewStopNotes(e.target.value)
                            }
                            placeholder="Activity details..."
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:border-orange-400 placeholder-gray-400"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.97 }}
                          onClick={addStop}
                          className="px-5 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
                        >
                          Add to Day {activeDay}
                        </motion.button>
                        <button
                          onClick={() => setShowAddStop(false)}
                          className="px-5 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Timeline */}
              {activeDayData?.entries.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <MapPin
                      className="w-7 h-7 text-white/20"
                      strokeWidth={1.75}
                    />
                  </div>
                  <p className="text-white/40 text-sm mb-1">
                    No stops planned yet
                  </p>
                  <p className="text-white/30 text-xs">
                    Click "Add Stop" to start building your day
                  </p>
                </div>
              ) : (
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-2 bottom-2 w-px bg-white/10" />

                  <div className="space-y-4">
                    {activeDayData.entries.map((entry, index) => (
                      <motion.div
                        key={`${entry.order}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.08 }}
                        className="relative flex gap-4 group"
                      >
                        {/* Timeline dot */}
                        <div className="relative z-10 w-10 h-10 rounded-full bg-orange-500/20 border-2 border-orange-500/40 flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-orange-400">
                            {entry.order}
                          </span>
                        </div>

                        {/* Card */}
                        <div className="flex-1 bg-white rounded-xl p-4 border border-gray-100 group-hover:border-orange-200 transition-colors shadow-sm">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-sm font-bold text-gray-900">
                                  {getDestName(entry.destinationId)}
                                </h4>
                                <span className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                  <MapPin
                                    className="w-3 h-3"
                                    strokeWidth={1.75}
                                  />
                                  {getDestCity(entry.destinationId)}
                                </span>
                              </div>
                              {entry.notes && (
                                <p className="text-xs text-gray-500 mb-2">
                                  {entry.notes}
                                </p>
                              )}
                              <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock
                                    className="w-3.5 h-3.5"
                                    strokeWidth={1.75}
                                  />
                                  {formatTime12h(entry.time)}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <DollarSign
                                    className="w-3.5 h-3.5"
                                    strokeWidth={1.75}
                                  />
                                  {Math.ceil(entry.cost)}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                removeStop(activeDay, entry.order)
                              }
                              className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            >
                              <Trash
                                className="w-4 h-4"
                                strokeWidth={1.75}
                              />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
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
    </div>
  );
}