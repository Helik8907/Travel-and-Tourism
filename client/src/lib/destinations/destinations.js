import api from "../api";

export const destinationLoader = async () => {
    const { data } = await api.get("/destinations");
    return data;
};

export const getDestination = async (id) => {
    const { data } = await api.get(`/destinations/${id}`);
    return data;
};

export const createDestination = async (destinationData) => {
    const { data } = await api.post("/destinations", destinationData);
    return data;
};

export const editDestination = async (id, destinationData) => {
    const { data } = await api.put(`/destinations/${id}`, destinationData);
    return data;
};

export const deleteDestination = async (id) => {
    const { data } = await api.delete(`/destinations/${id}`);
    return data;
};

export const toggleLikeDestination = async (id) => {
    const { data } = await api.post(`/destinations/${id}/like`);
    return data;
};
