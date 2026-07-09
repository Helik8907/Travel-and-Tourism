import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Moon, Compass } from "lucide-react";

const NAV_LINKS = [
  { label: "Destinations", href: "#destinations" },
  { label: "Experiences", href: "#experiences" },
  { label: "Trip planner", href: "#planner" },
  { label: "About", href: "#about" },
  { label: "Blog", href: "#blog" },
];

export default function Navbar({ darkMode, onToggleDarkMode }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);

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

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${scrolled
            ? "bg-teal-950/90 backdrop-blur-md shadow-md shadow-black/10"
            : "bg-gradient-to-b from-black/50 to-transparent"
          }`}
      >
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo */}

            <a href="#home"
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

                  <a href={link.href}
                    onMouseEnter={() => setHovered(link.href)}
                    className="text-sm font-medium text-white/90 hover:text-white transition-colors py-2 block"
                  >
                    {link.label}
                  </a>
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
            <div className="hidden lg:flex items-center gap-4">
              <button aria-label="Search" className="text-white/90 hover:text-white transition-colors">
                <Search className="w-5 h-5" strokeWidth={1.75} />
              </button>


              <a href="#book"
                className="font-semibold text-sm px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
              >
                Book now
              </a>
            </div>

            {/* Mobile hamburger */}
            <button aria-label="Open menu" onClick={() => setMobileOpen(true)} className="lg:hidden text-white">
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

              <a href="#home"
                className="flex items-center gap-2 font-bold text-xl tracking-tight text-white"
                onClick={() => setMobileOpen(false)}
              >
                <Compass className="w-7 h-7 text-orange-400" strokeWidth={1.75} />
                <span>Wanderly</span>
              </a>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-white">
                <X className="w-7 h-7" strokeWidth={1.75} />
              </button>
            </div>

            <motion.ul
              className="flex flex-col gap-1 px-6 pt-8"
              initial="closed"
              animate="open"
              variants={{
                open: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
                closed: {},
              }}
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 24 } }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >

                  <a href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-2xl font-semibold text-white py-3 border-b border-white/10"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}

              <motion.li
                variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 24 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-6 flex items-center gap-6"
              >
                <button aria-label="Search" className="text-white/90" onClick={() => setMobileOpen(false)}>
                  <Search className="w-5 h-5" strokeWidth={1.75} />
                </button>
              </motion.li>

              <motion.li
                variants={{ open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 24 } }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="mt-4"
              >

                <a href="#book"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center font-semibold px-5 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors"
                >
                  Book now
                </a>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}