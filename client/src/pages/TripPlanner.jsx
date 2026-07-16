import { useState } from "react";
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

export default function TripPlanner() {
  // TRIP INFO hook setUp
  const [tripTitle, setTripTitle] = useState("My Summer Adventure");
  const [startDate, setStartDate] = useState("2026-08-01");
  const [endDate, setEndDate] = useState("2026-08-07");
  const [budgetMin, setBudgetMin] = useState(2000);
  const [budgetMax, setBudgetMax] = useState(4000);

  // DAYS & STOPS (matches daySchema + stopSchema) 
  const [days, setDays] = useState([
    {
      dayNumber: 1,
      entries: [
        {
          destinationId: "d3",
          notes: "Arrive at airport, transfer to villa",
          time: "14:00",
          cost: 45,
          order: 1,
        },
        {
          destinationId: "d3",
          notes: "Evening walk through rice terraces",
          time: "17:30",
          cost: 0,
          order: 2,
        },
      ],
    },
    {
      dayNumber: 2,
      entries: [
        {
          destinationId: "d3",
          notes: "Morning yoga session",
          time: "07:00",
          cost: 15,
          order: 1,
        },
        {
          destinationId: "d3",
          notes: "Monkey forest visit",
          time: "10:00",
          cost: 8,
          order: 2,
        },
      ],
    },
  ]);

  //  UI STATE 
  const [activeDay, setActiveDay] = useState(1);
  const [showAddStop, setShowAddStop] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for new stop
  const [newStopDest, setNewStopDest] = useState("");
  const [newStopTime, setNewStopTime] = useState("09:00");
  const [newStopCost, setNewStopCost] = useState("");
  const [newStopNotes, setNewStopNotes] = useState("");

  // MOCK DESTINATIONS as backend not working(proxy error)
  const destinations = [
    { _id: "d1", name: "Santorini Sunset", city: "Santorini", country: "Greece" },
    { _id: "d2", name: "Kyoto Temples", city: "Kyoto", country: "Japan" },
    { _id: "d3", name: "Bali Retreat", city: "Ubud", country: "Indonesia" },
    { _id: "d4", name: "Swiss Alps", city: "Zermatt", country: "Switzerland" },
    { _id: "d5", name: "Maldives Escape", city: "Malé", country: "Maldives" },
    { _id: "d6", name: "Machu Picchu", city: "Cusco", country: "Peru" },
  ];

  // calculations
  const totalCost = days.reduce(
    (sum, day) =>
      sum + day.entries.reduce((s, e) => s + (Number(e.cost) || 0), 0),
    0
  );
  const totalStops = days.reduce((sum, day) => sum + day.entries.length, 0);
  const activeDayData = days.find((d) => d.dayNumber === activeDay);

  
  const getDestName = (id) => {
    const d = destinations.find((dest) => dest._id === id);
    return d ? d.name : "Unknown";
  };

  const getDestCity = (id) => {
    const d = destinations.find((dest) => dest._id === id);
    return d ? `${d.city}, ${d.country}` : "";
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

    setDays((prev) =>
      prev.map((d) =>
        d.dayNumber === activeDay
          ? {
              ...d,
              entries: [
                ...d.entries,
                {
                  destinationId: newStopDest,
                  notes: newStopNotes,
                  time: newStopTime,
                  cost: Number(newStopCost) || 0,
                  order: d.entries.length + 1,
                },
              ],
            }
          : d
      )
    );

    // Reset form
    setNewStopDest("");
    setNewStopTime("09:00");
    setNewStopCost("");
    setNewStopNotes("");
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
    setSaving(true);

    // Build payload matching your Mongoose model exactly
    const payload = {
      title: tripTitle,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      avg_cost: totalCost,
      cost_range: { min: budgetMin, max: budgetMax },
      days: days,
    };

    //from here you can do backend stuff
  };

  return (
    <div className="min-h-screen bg-teal-950 pt-20">
      {/* Top bar */}
      <div className="border-b border-t border-white/10 bg-teal-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              
              <div>
                <h1 className="text-lg font-bold text-white">Trip Planner</h1>
                <p className="text-xs text-white/50">
                  Plan your perfect journey
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-white/50">Estimated Cost</p>
                <p className="text-lg font-bold text-orange-400">
                  ${totalCost.toLocaleString()}
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
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Budget Min ($)
              </label>
              <input
                type="number"
                value={budgetMin}
                onChange={(e) => setBudgetMin(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/10 text-white text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">
                Budget Max ($)
              </label>
              <input
                type="number"
                value={budgetMax}
                onChange={(e) => setBudgetMax(Number(e.target.value))}
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
                      totalCost > budgetMax
                        ? "text-red-400"
                        : "text-emerald-400"
                    }`}
                  >
                    ${(budgetMax - totalCost).toLocaleString()}
                  </span>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-orange-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${Math.min(
                      (totalCost / budgetMax) * 100,
                      100
                    )}%`,
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
                    onClick={() => setShowAddStop(!showAddStop)}
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
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">
                            Destination
                          </label>
                          <select
                            value={newStopDest}
                            onChange={(e) =>
                              setNewStopDest(e.target.value)
                            }
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
                        <div>
                          <label className="block text-xs text-gray-500 mb-1.5">
                            Cost ($)
                          </label>
                          <input
                            type="number"
                            value={newStopCost}
                            onChange={(e) =>
                              setNewStopCost(e.target.value)
                            }
                            placeholder="0"
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 text-sm outline-none focus:border-orange-400 placeholder-gray-400"
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
                                  {entry.time}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <DollarSign
                                    className="w-3.5 h-3.5"
                                    strokeWidth={1.75}
                                  />
                                  ${entry.cost}
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
    </div>
  );
}