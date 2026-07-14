import { motion } from "framer-motion";
import { Compass, Home } from "lucide-react";
import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="min-h-screen bg-bgLight font-sans flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-lg"
            >
                <div className="flex justify-center mb-6">
                    <div className="bg-orange-100 text-orange-500 rounded-full p-5">
                        <Compass className="w-12 h-12" />
                    </div>
                </div>

                <h1 className="text-7xl font-extrabold text-slate-800 tracking-tight">404</h1>
                <p className="mt-3 text-xl font-semibold text-slate-700">
                    Looks like you've wandered off the map
                </p>
                <p className="mt-2 text-slate-500">
                    The page you're looking for doesn't exist or may have been moved.
                </p>

                <Link
                    to="/"
                    className="mt-8 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 transition-colors text-white font-semibold rounded-xl px-6 py-3"
                >
                    <Home className="w-5 h-5" />
                    Back to Home
                </Link>
            </motion.div>
        </div>
    );
}

export default NotFound;
