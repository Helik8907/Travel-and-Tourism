import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X, Loader } from "lucide-react";
import { destinationLoader } from "../../lib/destinations/destinations";

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

function DestinationMultiSelect({ selected, onChange }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const data = await destinationLoader();
        setDestinations(data.destinations || []);
      } catch {
        setDestinations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  const toggle = (id) => {
    onChange(selected.includes(id) ? selected.filter((d) => d !== id) : [...selected, id]);
  };

  return (
    <div className="mb-4">
      <label className={labelClass}>Mentioned destinations</label>
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Loader className="w-3.5 h-3.5 animate-spin" /> Loading destinations...
        </div>
      ) : destinations.length === 0 ? (
        <p className="text-xs text-gray-400">No destinations available yet.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
          {destinations.map((dest) => {
            const active = selected.includes(dest._id);
            return (
              <button
                key={dest._id}
                type="button"
                onClick={() => toggle(dest._id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? "bg-orange-500 border-orange-500 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-orange-300"
                }`}
              >
                {dest.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Page form for creating (or editing) a blog
export default function BlogForm({ blog, onSubmit, submitLabel }) {
  const [title, setTitle] = useState(blog?.title ?? "");
  const [description, setDescription] = useState(blog?.description ?? "");
  const [content, setContent] = useState(blog?.content ?? "");
  const [images, setImages] = useState(blog?.images?.length ? blog.images : [""]);
  const [destinations, setDestinations] = useState(
    blog?.destinations?.map((d) => (typeof d === "string" ? d : d._id)) ?? []
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        content,
        images: images.map((i) => i.trim()).filter(Boolean),
        destinations,
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
        {blog ? "Edit blog" : "Write a new blog"}
      </h2>
      <p className="text-gray-500 text-sm mb-6">Share a story with fellow travelers.</p>

      <form onSubmit={handleSubmit}>
        <label className={labelClass}>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. A Timeless Morning at the Taj Mahal"
          required
          className={`${inputClass} mb-4`}
        />

        <label className={labelClass}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A short teaser shown on the blog list"
          rows={2}
          required
          className={`${inputClass} mb-4 resize-none`}
        />

        <label className={labelClass}>Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tell the full story..."
          rows={8}
          required
          className={`${inputClass} mb-4 resize-none`}
        />

        <ListInput
          label="Images"
          placeholder="https://..."
          values={images}
          onChange={setImages}
        />

        <DestinationMultiSelect selected={destinations} onChange={setDestinations} />

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold text-sm transition-colors"
        >
          {submitting ? "Saving..." : submitLabel ?? (blog ? "Save changes" : "Publish blog")}
        </button>
      </form>
    </motion.div>
  );
}
