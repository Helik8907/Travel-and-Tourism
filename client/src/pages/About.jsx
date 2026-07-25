import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Compass, MapPin, Users, Award, Heart, ShieldCheck, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { destinationLoader } from "../lib/destinations/destinations";

const VALUES = [
    {
        icon: Heart,
        title: "Crafted with care",
        description:
            "Every itinerary is handpicked and refined by travelers who know their destinations inside out — no generic templates.",
    },
    {
        icon: ShieldCheck,
        title: "Trusted & transparent",
        description:
            "Clear pricing, verified stays, and honest reviews so you always know what you're booking.",
    },
    {
        icon: Sparkles,
        title: "Made for explorers",
        description:
            "From island getaways to mountain treks halfway across the world, we help you plan trips that feel personal.",
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
};

export default function About() {
    const [destinationCount, setDestinationCount] = useState(null);

    useEffect(() => {
        let cancelled = false;

        destinationLoader()
            .then((data) => {
                if (!cancelled) setDestinationCount(data?.destinations?.length ?? 0);
            })
            .catch(() => {
                if (!cancelled) setDestinationCount(0);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const STATS = [
        {
            label: "Destinations covered",
            value: destinationCount === null ? "…" : `${destinationCount - destinationCount % 5}+`,
            icon: MapPin,
        },
        { label: "Happy travelers", value: "25K+", icon: Users },
        { label: "Years of experience", value: "8", icon: Award },
    ];

    return (
        <div className="min-h-screen bg-teal-950 font-sans relative">
            <div className="fixed inset-0 bg-gradient-to-br from-teal-900 via-teal-950 to-slate-900 -z-10" />

            {/* Hero */}
            <section className="relative pt-32 pb-24 px-4">
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center justify-center gap-2 text-orange-300 font-semibold tracking-widest uppercase text-sm mb-4"
                    >
                        <Compass className="w-4 h-4" strokeWidth={1.75} />
                        About Wanderly
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-white font-extrabold leading-tight text-4xl sm:text-5xl lg:text-6xl"
                    >
                        We help you fall in love
                        <br className="hidden sm:block" /> with the{" "}
                        <span className="text-orange-400">world</span>, one trip at a time
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-white/80 mt-6 max-w-2xl mx-auto text-base sm:text-lg"
                    >
                        Wanderly is a travel planning platform built by explorers, for explorers —
                        making it simple to discover destinations, plan itineraries, and book
                        unforgettable experiences around the globe.
                    </motion.p>
                </div>
            </section>

            {/* Stats */}
            <section className="max-w-6xl mx-auto px-4 -mt-12 relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ staggerChildren: 0.1 }}
                    className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-xl shadow-black/20 p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-3 gap-6"
                >
                    {STATS.map(({ label, value, icon: Icon }) => (
                        <motion.div
                            key={label}
                            variants={fadeUp}
                            className="flex items-center gap-4"
                        >
                            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-orange-400 shrink-0">
                                <Icon className="w-6 h-6" strokeWidth={1.75} />
                            </div>
                            <div>
                                <p className="text-2xl font-extrabold text-white">{value}</p>
                                <p className="text-sm text-white/60">{label}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Story */}
            <section className="max-w-5xl mx-auto px-4 py-20 sm:py-24 text-center">
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6 }}
                    className="text-orange-400 font-semibold tracking-widest uppercase text-sm mb-4"
                >
                    Our story
                </motion.p>
                <motion.h2
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-white font-extrabold text-3xl sm:text-4xl mb-6"
                >
                    Built by travelers who got tired of scattered planning
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-white/70 max-w-2xl mx-auto text-base sm:text-lg"
                >
                    We started Wanderly after one too many trips juggling spreadsheets, browser
                    tabs, and half-finished bucket lists. Today, Wanderly brings destinations,
                    itineraries, and bookings together in one place — so planning your next trip
                    feels as exciting as taking it.
                </motion.p>
            </section>

            {/* Values */}
            <section className="border-y border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-20 sm:py-24">
                    <div className="text-center mb-14">
                        <p className="text-orange-400 font-semibold tracking-widest uppercase text-sm mb-4">
                            What we stand for
                        </p>
                        <h2 className="text-white font-extrabold text-3xl sm:text-4xl">
                            Why travelers choose Wanderly
                        </h2>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ staggerChildren: 0.12 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-8"
                    >
                        {VALUES.map(({ icon: Icon, title, description }) => (
                            <motion.div
                                key={title}
                                variants={fadeUp}
                                className="rounded-2xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors"
                            >
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 text-orange-400 mb-5">
                                    <Icon className="w-6 h-6" strokeWidth={1.75} />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                                <p className="text-white/60 text-sm leading-relaxed">{description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-4 py-20 sm:py-24">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-6 sm:px-16 py-16 text-center"
                >
                    <div className="relative z-10">
                        <h2 className="text-white font-extrabold text-3xl sm:text-4xl mb-4">
                            Ready to plan your next adventure?
                        </h2>
                        <p className="text-white/70 max-w-xl mx-auto mb-8">
                            Explore handpicked destinations and build an itinerary that's uniquely
                            yours.
                        </p>
                        <NavLink
                            to="/planner"
                            className="inline-block font-semibold text-sm px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-lg shadow-orange-500/20"
                        >
                            Make a Trip
                        </NavLink>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
