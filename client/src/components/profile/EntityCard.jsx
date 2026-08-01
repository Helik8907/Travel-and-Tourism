import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react";

// Shared row card for the profile's created/liked/disliked lists —
// destinations and blogs show an image, reviews show the author's icon instead.
export default function EntityCard({
  to,
  image,
  icon: Icon = ImageIcon,
  title,
  description,
  meta,
  actions,
  index = 0,
}) {
  const content = (
    <div className="flex items-center gap-4 min-w-0 flex-1">
      {image ? (
        <img src={image} alt={title} className="w-14 h-14 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-orange-500" strokeWidth={1.75} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-orange-500 transition-colors">
          {title}
        </h4>
        {description && (
          <p className="text-xs text-gray-500 truncate mt-0.5">{description}</p>
        )}
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group flex items-center gap-4 bg-white rounded-xl p-3 border border-gray-100 hover:shadow-lg transition-shadow"
    >
      {to ? (
        <Link to={to} className="flex items-center gap-4 min-w-0 flex-1">
          {content}
        </Link>
      ) : (
        content
      )}
      {meta && <div className="flex items-center gap-1 shrink-0">{meta}</div>}
      {actions && (
        <div className="flex items-center gap-3 shrink-0 pl-3 ml-1 border-l border-gray-100">
          {actions}
        </div>
      )}
    </motion.div>
  );
}
