import api from "../api";

export const getProfile = async () => {
    const { data } = await api.get("/me/profile");
    return data;
};

export const updateProfile = async ({ name, resident }) => {
    const { data } = await api.put("/me", { name, resident });
    return data;
};
