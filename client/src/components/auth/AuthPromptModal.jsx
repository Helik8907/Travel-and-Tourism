import { motion } from "framer-motion";
import { LogIn, UserPlus, X, Lock } from "lucide-react";

export default function AuthPromptModal({ onClose, onLogin, onSignup }) {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 26 }}
                className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 text-center"
            >
                <button
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex justify-center mb-4">
                    <div className="bg-orange-100 text-orange-500 rounded-full p-4">
                        <Lock className="w-8 h-8" />
                    </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">Sign in required</h2>
                <p className="text-gray-500 text-sm mb-6">
                    You need to be logged in to view this page.
                </p>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={onLogin}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors"
                    >
                        <LogIn className="w-4 h-4" />
                        Log in
                    </button>
                    <button
                        onClick={onSignup}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-colors"
                    >
                        <UserPlus className="w-4 h-4" />
                        Sign up
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
