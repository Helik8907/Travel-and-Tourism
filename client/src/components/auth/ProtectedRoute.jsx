import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getCurrentUser, onAuthChange, refreshSession } from "../../lib/auth/auth";
import AuthPromptModal from "./AuthPromptModal";

// Wrap routes that need auth: <Route element={<ProtectedRoute roles={["admin"]} />}>
export default function ProtectedRoute({ roles }) {
    const [user, setUser] = useState(() => getCurrentUser());
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const sync = () => setUser(getCurrentUser());
        const unsubscribe = onAuthChange(sync);
        refreshSession().finally(() => setChecked(true));
        return unsubscribe;
    }, []);

    if (!checked) return null;

    if (!user) {
        return (
            <AuthPromptModal
                onClose={() => navigate("/", { replace: true })}
                onLogin={() => navigate("/login", { state: { from: location }, replace: true })}
                onSignup={() => navigate("/signup", { state: { from: location }, replace: true })}
            />
        );
    }

    if (roles && roles.length > 0 && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
