import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, Calendar, Users } from "lucide-react";

const DESTINATIONS = [
    { name: "Taj Mahal", wikiTitle: "Taj Mahal" },
    { name: "Jaipur", wikiTitle: "Jaipur" },
    { name: "Kerala", wikiTitle: "Kerala backwaters" },
    { name: "Goa", wikiTitle: "Goa" },
    { name: "Ladakh", wikiTitle: "Ladakh" },
];

export default function Hero() {
    const [slides, setSlides] = useState(
        DESTINATIONS.map((d) => ({ ...d, image: null }))
    );
    const [index, setIndex] = useState(0);

    // fetch image using wikipedia free api
    useEffect(() => {
        let cancelled = false;

        async function fetchAll() {
            const results = await Promise.all(
                DESTINATIONS.map(async (d) => {
                    try {
                        const res = await fetch(
                            `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
                                d.wikiTitle
                            )}&prop=pageimages&format=json&pithumbsize=1400&origin=*`
                        );
                        const data = await res.json();
                        const page = Object.values(data.query.pages)[0];
                        return { ...d, image: page?.thumbnail?.source || null };
                    } catch {
                        return { ...d, image: null };
                    }
                })
            );
            if (!cancelled) setSlides(results);
        }

        fetchAll();
        return () => {
            cancelled = true;
        };
    }, []);

    // Auto-advance every 5s
    useEffect(() => {
        const t = setInterval(() => setIndex((i) => (i + 1) % DESTINATIONS.length), 5000);
        return () => clearInterval(t);
    }, []);

    const current = slides[index];

    return (
        <div className="h-screen relative overflow-hidden">
            <section className="relative h-screen min-h-[640px] w-full overflow-hidden bg-teal-950">
               {/* background dark shade and image by using psedo selector */}
                <AnimatePresence mode="sync">
                    <motion.div
                        key={current.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        className="absolute inset-0"
                    >
                        {current.image ? (
                            <motion.img
                                src={current.image}
                                alt={current.name}
                                initial={{ scale: 1 }}
                                animate={{ scale: 1.12 }}
                                transition={{ duration: 6, ease: "linear" }}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-teal-900 via-teal-950 to-slate-900" />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Overlay for legibility */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/60" />

                {/* Attribution */}
                {current.image && (

                    <img href={`https://en.wikipedia.org/wiki/${encodeURIComponent(current.wikiTitle)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 z-10 text-[11px] text-white/60 hover:text-white underline overflow-hidden"
                    />
                )}

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-orange-300 font-semibold tracking-widest uppercase text-sm mb-4"
                    >
                        Your next adventure across India awaits
                    </motion.p>

                    <h1 className="text-white font-extrabold leading-tight text-4xl sm:text-5xl lg:text-7xl max-w-4xl">
                        Discover the beauty
                        <br className="hidden sm:block" /> of{" "}
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={current.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                                className="inline-block text-orange-400"
                            >
                                {current.name}
                            </motion.span>
                        </AnimatePresence>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="text-white/80 mt-6 max-w-xl text-base sm:text-lg"
                    >
                        Handpicked destinations, unforgettable experiences, and trips planned across every corner of India.
                    </motion.p>

                    {/* Destination dots */}
                    <div className="flex gap-2 mt-8">
                        {DESTINATIONS.map((d, i) => (
                            <button
                                key={d.name}
                                onClick={() => setIndex(i)}
                                aria-label={`Show ${d.name}`}
                                className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-8 bg-orange-400" : "w-2 bg-white/40 hover:bg-white/70"
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Floating search card, overlapping the bottom edge */}
            </section>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute left-1/2 -translate-x-1/2 bottom-6 sm:bottom-10 z-20 w-[92%] max-w-4xl"
            >
                <div className="bg-white rounded-2xl shadow-xl shadow-black/20 p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3 sm:border-r sm:border-slate-200 sm:pr-4">
                        <MapPin className="w-5 h-5 text-orange-500 shrink-0" />
                        <div className="text-left w-full">
                            <p className="text-xs text-slate-400 font-medium">Destination</p>
                            <input type="text" placeholder="Where in India?" className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 outline-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:border-r sm:border-slate-200 sm:pr-4">
                        <Calendar className="w-5 h-5 text-orange-500 shrink-0" />
                        <div className="text-left w-full">
                            <p className="text-xs text-slate-400 font-medium">When</p>
                            <input type="text" placeholder="Add dates" className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 outline-none" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 sm:border-r sm:border-slate-200 sm:pr-4">
                        <Users className="w-5 h-5 text-orange-500 shrink-0" />
                        <div className="text-left w-full">
                            <p className="text-xs text-slate-400 font-medium">Travelers</p>
                            <input type="text" placeholder="Add guests" className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 outline-none" />
                        </div>
                    </div>

                    <button className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold rounded-xl py-3 sm:py-0">
                        <Search className="w-5 h-5" />
                        Search
                    </button>
                </div>
            </motion.div>
        </div>
    );
}