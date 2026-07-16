import api from "../api";

export const myItinerariesLoader = async () => {
    const { data } = await api.get("/itineraries");
    return data;
};

export const getItinerary = async (id) => {
    const { data } = await api.get(`/itineraries/${id}`);
    return data;
};

export const createItinerary = async (itineraryData) => {
    const { data } = await api.post("/itineraries", itineraryData);
    return data;
};

export const editItinerary = async (id, itineraryData) => {
    const { data } = await api.put(`/itineraries/${id}`, itineraryData);
    return data;
};

export const deleteItinerary = async (id) => {
    const { data } = await api.delete(`/itineraries/${id}`);
    return data;
};
