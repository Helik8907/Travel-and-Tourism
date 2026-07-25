import { useState } from 'react';
import { Search, ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import BlogCard from '../components/BlogCard';

const blogArticles = [
  {
    id: 1,
    category: 'Featured',
    title: 'Why Kerala’s Backwaters Still Feel Like a Dream Escape',
    description:
      'From sunrise canoe rides to quiet village breakfasts, the backwaters of Kerala offer a slower rhythm that turns every trip into a memorable story.',
    author: 'Aanya Verma',
    date: 'April 14, 2026',
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 2,
    category: 'Culture',
    title: 'Jaipur in a Weekend: Color, Craft, and Courtyard Charm',
    description:
      'A curated guide to the Pink City’s handcrafted bazaars, rooftop cafés and heritage stays for a short yet rich getaway.',
    author: 'Rohit Sharma',
    date: 'April 08, 2026',
    image:
      'https://images.unsplash.com/photo-1605640840606-5b6d7c5d8e15?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 3,
    category: 'Nature',
    title: 'A Practical Guide to Exploring Munnar’s Tea Hills',
    description:
      'Discover scenic viewpoints, aromatic tea gardens, and weather-friendly itineraries for a calm mountain retreat in Kerala.',
    author: 'Meera Iyer',
    date: 'March 30, 2026',
    image:
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 4,
    category: 'Heritage',
    title: 'Old Delhi Food Trails Worth Planning Around',
    description:
      'From paratha lanes to Mughlai kitchens, the city’s historic neighborhoods still hold the best stories around every table.',
    author: 'Kabir Sethi',
    date: 'March 19, 2026',
    image:
      'https://images.unsplash.com/photo-1536514498072-2ad1eae7af7f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 5,
    category: 'Adventure',
    title: 'Leh-Ladakh: The Best Route for a High-Altitude Escape',
    description:
      'Plan your mountain drive with practical stops, scenic monasteries, and calm moments that make the altitude feel worth it.',
    author: 'Nisha Bhatia',
    date: 'March 11, 2026',
    image:
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 6,
    category: 'Beach',
    title: 'Goa Beyond the Party Strip: Quiet Beaches and Hidden Cafés',
    description:
      'Swap the crowds for shoreline walks, local shacks, and scenic mornings that reveal a softer side of Goa.',
    author: 'Pranav Menon',
    date: 'February 28, 2026',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 7,
    category: 'Wellness',
    title: 'The Best Wellness Retreats in Rishikesh for a Reset',
    description:
      'Slow mornings, yoga by the river, and restorative stays make Rishikesh a dependable place to reconnect and recharge.',
    author: 'Sana Kapoor',
    date: 'February 16, 2026',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 8,
    category: 'Road Trip',
    title: 'Exploring Udaipur Through Lakeside Cafés and Heritage Walks',
    description:
      'A slower route through Rajasthan’s City of Lakes highlights sunset views, palace architecture, and easy day plans.',
    author: 'Harshita Rao',
    date: 'February 05, 2026',
    image:
      'https://images.unsplash.com/photo-1570213489059-0aaa9c8f3f7c?auto=format&fit=crop&w=1200&q=80',
  },
];

function BlogPage() {
  const [query, setQuery] = useState('');

  const filteredArticles = (() => {
    const term = query.trim().toLowerCase();
    const cards = blogArticles.slice(1);

    if (!term) return cards;

    return cards.filter((article) =>
      [article.category, article.title, article.description, article.author]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  })();

  const featuredArticle = blogArticles[0];

  return (
    <section className="min-h-screen bg-teal-950 pt-20 pb-16 lg:pt-24 lg:pb-24 font-['Bricolage_Grotesque']">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <span className="inline-block rounded-full bg-orange-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.24em] text-orange-400">
            Wanderly Journal
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Inspiring stories from India’s most loved destinations
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
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search blogs by destination, category, or author"
              aria-label="Search blog posts"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
            />
          </form>
        </div>

        <div className="mb-12 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="overflow-hidden rounded-3xl bg-white shadow-2xl shadow-black/20">
            <div className="grid h-full md:grid-cols-2">
              <div className="relative min-h-[260px] md:min-h-full">
                <img
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-6 sm:p-7">
                <div>
                  <span className="inline-flex rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.26em] text-white">
                    {featuredArticle.category}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-slate-900 leading-tight">
                    {featuredArticle.title}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {featuredArticle.description}
                  </p>
                </div>

                <div className="mt-6 space-y-3 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <UserRound className="h-4 w-4 text-orange-500" strokeWidth={1.8} />
                    <span>{featuredArticle.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <CalendarDays className="h-4 w-4 text-orange-500" strokeWidth={1.8} />
                    <span>{featuredArticle.date}</span>
                  </div>
                  <button
                    type="button"
                    aria-label="Read more about the featured article"
                    className="mt-2 inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    Read More
                    <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                  </button>
                </div>
              </div>
            </div>
          </article>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 text-white shadow-xl shadow-black/10">
            <h3 className="text-lg font-bold text-white">Travel Notes</h3>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Explore thoughtful destination guides with practical ideas for your next Indian getaway.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/80">
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="font-semibold text-orange-300">Best for</p>
                <p className="mt-1 text-white/70">Mountain escapes, heritage trails, and beach breaks.</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="font-semibold text-orange-300">Reader favorites</p>
                <p className="mt-1 text-white/70">Kerala, Jaipur, Leh-Ladakh, and Udaipur stories.</p>
              </div>
            </div>
          </div>
        </div>

        {filteredArticles.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-white/70">
            No articles matched your search. Try another keyword.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <BlogCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default BlogPage;
