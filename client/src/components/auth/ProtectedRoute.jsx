import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, onAuthChange, refreshSession } from "../../lib/auth/auth";
import AuthPromptModal from "./AuthPromptModal";

const SESSION_KEY = "authPromptShown";

export default function ProtectedRoute({ requireAuth = true, roles }) {
    const [user, setUser] = useState(() => getCurrentUser());
    const [checked, setChecked] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const unsubscribe = onAuthChange(() => setUser(getCurrentUser()));
        refreshSession().finally(() => setChecked(true));
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!checked || user || requireAuth) return;
        if (!sessionStorage.getItem(SESSION_KEY)) {
            sessionStorage.setItem(SESSION_KEY, "1");
            setShowPrompt(true);
        }
    }, [checked, user, requireAuth]);

    if (!checked) return null;

    const goTo = (path) => navigate(path, { state: { from: location } });

    if (requireAuth && !user) {
        return (
            <AuthPromptModal
                onClose={() => navigate("/", { replace: true })}
                onLogin={() => goTo("/login")}
                onSignup={() => goTo("/signup")}
            />
        );
    }

    if (user && roles && roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            <Outlet />
            {showPrompt && (
                <AuthPromptModal
                    onClose={() => setShowPrompt(false)}
                    onLogin={() => goTo("/login")}
                    onSignup={() => goTo("/signup")}
                />
            )}
        </>
    );
}
