import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

const AUTH_EVENT = "auth-changed";

const setSession = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new Event(AUTH_EVENT));
};

const clearSession = () => {
    localStorage.removeItem("user");
    window.dispatchEvent(new Event(AUTH_EVENT));
};

export const login = async (email, password) => {
    const { data } = await api.post("/login", { email, password });
    setSession(data.user);
    return data;
};

export const signup = async ({ name, email, password, resident }) => {
    const { data } = await api.post("/signup", { name, email, password, resident });
    setSession(data.user);
    return data;
};

export const logout = async () => {
    try {
        await api.post("/logout");
    } finally {
        clearSession();
    }
};

export const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

// Reconciles local UI state with the server-verified session (the JWT lives
// in an httpOnly cookie, so this is the only way to confirm it's still valid).
export const refreshSession = async () => {
    try {
        const { data } = await api.get("/me");
        setSession(data.user);
        return data.user;
    } catch {
        clearSession();
        return null;
    }
};

export const onAuthChange = (callback) => {
    window.addEventListener(AUTH_EVENT, callback);
    window.addEventListener("storage", callback);
    return () => {
        window.removeEventListener(AUTH_EVENT, callback);
        window.removeEventListener("storage", callback);
    };
};

export default api;
