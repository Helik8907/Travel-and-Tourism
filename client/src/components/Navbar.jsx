import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Compass } from "lucide-react";
import { NavLink } from "react-router-dom";

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Experiences", href: "/experiences" },
  { label: "Trip planner", href: "/planner" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-teal-950/90 backdrop-blur-md shadow-md shadow-black/10"
            : "bg-gradient-to-b from-black/50 to-transparent"
        }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}
            <a
              href="#home"
              className="flex items-center gap-2 font-bold text-xl tracking-tight text-white shrink-0"
            >
              <Compass className="w-7 h-7 text-orange-400" strokeWidth={1.75} />
              <span>Wanderly</span>
            </a>

            {/* Desktop nav links */}
            <ul
              className="hidden lg:flex items-center gap-8 relative"
              onMouseLeave={() => setHovered(null)}
            >
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="relative">
                  <NavLink
                    to={link.href}
                    onMouseEnter={() => setHovered(link.href)}
                    className="text-sm font-medium text-white/90 hover:text-white transition-colors py-2 block"
                  >
                    {link.label}
                  </NavLink>
                  {hovered === link.href && (
                    <motion.div
                      layoutId="flight-path"
                      className="absolute left-0 right-0 -bottom-0.5 h-[2px]"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, #FB923C 0, #FB923C 6px, transparent 6px, transparent 11px)",
                      }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </li>
              ))}
            </ul>

            {/* Right side controls */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Search toggle */}
              <div className="relative flex items-center">
                <motion.button
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Search"
                  className="text-white/90 hover:text-white transition-colors z-10"
                  whileTap={{ scale: 0.9 }}
                >
                  <Search className="w-5 h-5" strokeWidth={1.75} />
                </motion.button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: 220, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                      className="overflow-hidden ml-2"
                    >
                      <div
                        className={`flex items-center rounded-full border transition-colors duration-300 ${
                          searchFocused
                            ? "border-orange-400/70 bg-white/10"
                            : "border-white/20 bg-white/5"
                        }`}
                      >
                        <input
                          ref={searchInputRef}
                          type="text"
                          placeholder="Search destinations..."
                          className="w-full bg-transparent text-white text-sm px-3 py-1.5 outline-none placeholder-white/40"
                          onFocus={() => setSearchFocused(true)}
                          onBlur={() => setSearchFocused(false)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setSearchOpen(false);
                          }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="w-px h-5 bg-white/20" />

              <NavLink
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full border border-orange-400/60 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
              >
                Log in
              </NavLink>
              <NavLink
                href="/signup"
                className="text-sm font-semibold px-4 py-2 rounded-full border border-orange-400/60 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
              >
                Sign up
              </NavLink>

              {/* Book now */}
              <NavLink
                to="/bookNow"
                className="font-semibold text-sm px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors shadow-lg shadow-orange-500/20"
              >
                Book now
              </NavLink>
            </div>

            {/* Mobile hamburger */}
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="lg:hidden text-white"
            >
              <Menu className="w-7 h-7" strokeWidth={1.75} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-teal-950 lg:hidden"
          >
            <div className="flex items-center justify-between px-4 sm:px-6 h-16">
              <a
                href="#home"
                className="flex items-center gap-2 font-bold text-xl tracking-tight text-white"
                onClick={() => setMobileOpen(false)}
              >
                <Compass
                  className="w-7 h-7 text-orange-400"
                  strokeWidth={1.75}
                />
                <span>Wanderly</span>
              </a>
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="text-white"
              >
                <X className="w-7 h-7" strokeWidth={1.75} />
              </button>
            </div>

            <motion.ul
              className="flex flex-col gap-1 px-6 pt-6"
              initial="closed"
              animate="open"
              variants={{
                open: {
                  transition: { staggerChildren: 0.07, delayChildren: 0.1 },
                },
                closed: {},
              }}
            >
              {/* Mobile search */}
              <motion.li
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: 24 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div className="flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-2.5 mb-4">
                  <Search
                    className="w-5 h-5 text-white/50 mr-3 shrink-0"
                    strokeWidth={1.75}
                  />
                  <input
                    type="text"
                    placeholder="Search destinations..."
                    className="w-full bg-transparent text-white text-base outline-none placeholder-white/40"
                  />
                </div>
              </motion.li>

              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    open: { opacity: 1, x: 0 },
                    closed: { opacity: 0, x: 24 },
                  }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <a
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-2xl font-semibold text-white py-3 border-b border-white/10"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}

              {/* Mobile auth */}
              <motion.li
                variants={{
                  open: { opacity: 1, x: 0 },
                  closed: { opacity: 0, x: 24 },
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-6 flex flex-col gap-3"
              >
                <div className="flex gap-3">
                  <NavLink
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-base font-semibold px-5 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
                  >
                    Log in
                  </NavLink>
                  <NavLink
                    to="/signUp"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center text-base font-semibold px-5 py-3 rounded-full border border-orange-400/60 text-orange-300 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-300"
                  >
                    Sign up
                  </NavLink>
                </div>
                <NavLink
                  to="/bookNow"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center font-semibold px-5 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                >
                  Book now
                </NavLink>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}