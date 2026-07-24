import { ArrowRight, CalendarDays, UserRound } from 'lucide-react';

function BlogCard({ article }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-lg shadow-black/10 transition-transform duration-300 hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img src={article.image} alt={article.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <span className="absolute left-3 top-3 rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-white">
          {article.category}
        </span>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-900 leading-tight">{article.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{article.description}</p>

        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4 text-orange-500" strokeWidth={1.8} />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-orange-500" strokeWidth={1.8} />
            <span>{article.date}</span>
          </div>
        </div>

        <button
          type="button"
          aria-label={`Read more about ${article.title}`}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
        >
          Read More
          <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>
    </article>
  );
}

export default BlogCard;
