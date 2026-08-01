import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CalendarDays, UserRound, Heart } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20 },
  },
};

function BlogCard({ blog }) {
  const formattedDate = blog.createdAt
    ? new Date(blog.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <motion.article
      variants={cardVariants}
      className="group overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10 transition-transform duration-300 hover:-translate-y-1"
    >
      <Link to={`/blog/${blog._id}`} aria-label={`Read more about ${blog.title}`} className="block">
        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 to-teal-700">
          {blog.images?.[0] ? (
            <img
              src={blog.images[0]}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <span className="text-5xl font-bold text-white/20">
              {blog.title?.[0]?.toUpperCase() ?? '?'}
            </span>
          )}
          {blog.like_count > 0 && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/30 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
              <Heart className="h-3 w-3" strokeWidth={1.8} fill="currentColor" />
              {blog.like_count}
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-bold text-slate-900 leading-tight">{blog.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{blog.description}</p>

          <div className="mt-4 space-y-2 text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-orange-500" strokeWidth={1.8} />
              <span>{blog.author?.name ?? 'Unknown author'}</span>
            </div>
            {formattedDate && (
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-orange-500" strokeWidth={1.8} />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-orange-600">
            Read More
            <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export default BlogCard;
