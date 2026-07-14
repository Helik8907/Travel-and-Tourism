import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import countries from "../../lib/countries";
import LocationPicker from "./LocationPicker";

const TYPE_OPTIONS = [
  "Beach", "Mountain", "City", "Historical", "History", "Adventure", "Cultural",
  "Culture", "Nature", "Romance", "Relaxation", "Photography", "Spirituality",
  "Wildlife", "City Life", "Architecture", "Arts", "Archaeology", "Phenomenon",
  "Cruise", "Nightlife", "Other",
];

const MONTH_OPTIONS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const inputClass =
  "w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400";
const labelClass =
  "block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5";

function ListInput({ label, placeholder, values, onChange }) {
  const setAt = (i, value) => {
    const next = [...values];
    next[i] = value;
    onChange(next);
  };
  const remove = (i) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, ""]);

  return (
    <div className="mb-4">
      <label className={labelClass}>{label}</label>
      <div className="space-y-2">
        {values.map((value, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => setAt(i, e.target.value)}
              placeholder={placeholder}
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Remove ${label} entry`}
              className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={add}
        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
      >
        <Plus className="w-3.5 h-3.5" /> Add {label.toLowerCase()}
      </button>
    </div>
  );
}

function MultiSelect({ label, options, selected, onChange }) {
  const toggle = (option) => {
    onChange(
      selected.includes(option)
        ? selected.filter((o) => o !== option)
        : [...selected, option]
    );
  };

  return (
    <div className="mb-4">
      <label className={labelClass}>{label}</label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const active = selected.includes(option);
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Page form for creating (or editing) a destination
export default function DestinationForm({ destination, onSubmit, submitLabel }) {
  const [name, setName] = useState(destination?.name ?? "");
  const [city, setCity] = useState(destination?.city ?? "");
  const [country, setCountry] = useState(destination?.country ?? "");
  const [type, setType] = useState(destination?.type ?? []);
  const [description, setDescription] = useState(destination?.description ?? "");
  const [images, setImages] = useState(destination?.images?.length ? destination.images : [""]);
  const [costMin, setCostMin] = useState(destination?.cost_range?.min ?? "");
  const [costMax, setCostMax] = useState(destination?.cost_range?.max ?? "");
  const [bestMonths, setBestMonths] = useState(destination?.best_months ?? []);
  const [minTemp, setMinTemp] = useState(destination?.weather?.min_temp ?? "");
  const [maxTemp, setMaxTemp] = useState(destination?.weather?.max_temp ?? "");
  const [condition, setCondition] = useState(destination?.weather?.condition ?? "");
  const [entryReq, setEntryReq] = useState(destination?.entry_req?.length ? destination.entry_req : [""]);
  const [timeTake, setTimeTake] = useState(destination?.time_take ?? "");
  const [coordinates, setCoordinates] = useState(
    destination?.cordinates?.lat != null && destination?.cordinates?.lng != null
      ? destination.cordinates
      : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({
        name,
        city,
        country,
        type,
        description,
        images: images.map((i) => i.trim()).filter(Boolean),
        cost_range: { min: Number(costMin), max: Number(costMax) },
        best_months: bestMonths,
        weather: {
          min_temp: minTemp === "" ? undefined : Number(minTemp),
          max_temp: maxTemp === "" ? undefined : Number(maxTemp),
          condition: condition || undefined,
        },
        entry_req: entryReq.map((r) => r.trim()).filter(Boolean),
        time_take: timeTake,
        cordinates: coordinates ?? undefined,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8"
    >
      <h2 className="text-xl font-bold text-gray-900 mb-1">
        {destination ? "Edit destination" : "Add a new destination"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Fill in the details travelers need to know.
      </p>

      <form onSubmit={handleSubmit}>
        <label className={labelClass}>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Santorini"
          required
          className={`${inputClass} mb-4`}
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Oia"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className={`${inputClass} bg-white`}
            >
              <option value="" disabled>
                Select a country
              </option>
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <LocationPicker
          name={name}
          city={city}
          country={country}
          coordinates={coordinates}
          onChange={setCoordinates}
        />

        <MultiSelect label="Type" options={TYPE_OPTIONS} selected={type} onChange={setType} />

        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What makes this destination special?"
          rows={4}
          className={`${inputClass} mb-4 resize-none`}
        />

        <ListInput
          label="Images"
          placeholder="https://..."
          values={images}
          onChange={setImages}
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Cost min ($)</label>
            <input
              type="number"
              min="0"
              value={costMin}
              onChange={(e) => setCostMin(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Cost max ($)</label>
            <input
              type="number"
              min="0"
              value={costMax}
              onChange={(e) => setCostMax(e.target.value)}
              required
              className={inputClass}
            />
          </div>
        </div>

        <MultiSelect
          label="Best months to visit"
          options={MONTH_OPTIONS}
          selected={bestMonths}
          onChange={setBestMonths}
        />

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className={labelClass}>Min temp (°C)</label>
            <input
              type="number"
              value={minTemp}
              onChange={(e) => setMinTemp(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Max temp (°C)</label>
            <input
              type="number"
              value={maxTemp}
              onChange={(e) => setMaxTemp(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Condition</label>
            <input
              type="text"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              placeholder="e.g. Sunny"
              className={inputClass}
            />
          </div>
        </div>

        <ListInput
          label="Entry requirements"
          placeholder="e.g. Valid passport"
          values={entryReq}
          onChange={setEntryReq}
        />

        <label className={labelClass}>Recommended time to take</label>
        <input
          type="text"
          value={timeTake}
          onChange={(e) => setTimeTake(e.target.value)}
          placeholder="e.g. 5 days"
          className={`${inputClass} mb-4`}
        />

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
        >
          {submitting ? "Saving..." : submitLabel ?? (destination ? "Save changes" : "Create destination")}
        </button>
      </form>
    </motion.div>
  );
}
