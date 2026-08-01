import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader, ChevronLeft, ChevronRight } from 'lucide-react';
import BlogCard from '../components/blogs/BlogCard';
import { getBlogs } from '../lib/blogs/blogs';

const PAGE_SIZE = 30;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-12 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" strokeWidth={1.75} />
      </button>

      {pageNumbers.map((n) => (
        <button
          key={n}
          onClick={() => onPageChange(n)}
          aria-current={n === page ? 'page' : undefined}
          className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${
            n === page
              ? 'bg-orange-500 text-white'
              : 'text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          {n}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="w-10 h-10 flex items-center justify-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-4 h-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBlogs();
        setBlogs(data.blogs || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const filteredBlogs = (() => {
    const term = query.trim().toLowerCase();
    if (!term) return blogs;

    return blogs.filter((blog) =>
      [blog.title, blog.description, blog.author?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  })();

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE));
  const pagedBlogs = filteredBlogs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handlePageChange = (n) => {
    if (n < 1 || n > totalPages) return;
    setPage(n);
  };

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
    setPage(1);
  };

  if (loading) {
    return (
      <section className="min-h-screen pt-20 lg:pt-24 bg-teal-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader className="w-8 h-8 text-orange-400 animate-spin" />
          <p className="text-white/60 text-sm">Loading blogs...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="min-h-screen pt-20 lg:pt-24 bg-teal-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 font-medium mb-2">Oops! Something went wrong.</p>
          <p className="text-white/50 text-sm">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-teal-950 pt-20 pb-16 lg:pt-24 lg:pb-24 font-['Bricolage_Grotesque']">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-orange-400">
            Wanderly Journal
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Inspiring stories from India's most loved destinations
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-white/60 sm:text-base">
            Discover trip ideas, hidden gems and local inspiration for your next unforgettable journey.
          </p>
        </div>

        <div className="mb-10 flex justify-center">
          <form className="flex w-full max-w-xl items-center gap-3 rounded-full border border-white/15 bg-white/5 px-4 py-3 text-white shadow-lg shadow-black/10" role="search">
            <label htmlFor="blog-search" className="sr-only">
              Search blog posts
            </label>
            <Search className="h-4 w-4 text-orange-300" strokeWidth={1.8} />
            <input
              id="blog-search"
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search blogs by title, author, or keyword"
              aria-label="Search blog posts"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </form>
        </div>

        {filteredBlogs.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
            No articles matched your search. Try another keyword.
          </div>
        ) : (
          <motion.div
            key={page}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            {pagedBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </motion.div>
        )}

        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </section>
  );
}

export default BlogPage;
