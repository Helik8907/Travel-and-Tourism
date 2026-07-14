import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import countries from "../../lib/countries";

// Modal for editing the current user's profile
export default function ProfileEditForm({ user, onClose, onSubmit }) {
  const [name, setName] = useState(user?.name ?? "");
  const [resident, setResident] = useState(user?.resident ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit({ name, resident });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Edit profile</h2>
        <p className="text-gray-500 text-sm mb-6">Update your account details.</p>

        <form onSubmit={handleSubmit}>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4"
          />

          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Country of residence
          </label>
          <select
            value={resident}
            onChange={(e) => setResident(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-200 p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 mb-4 bg-white"
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

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
          >
            {submitting ? "Saving..." : "Save changes"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
