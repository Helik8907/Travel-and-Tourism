import api from "../api";

export const destinationLoader = async (city = "") => {
  // If city has text, add the query. Otherwise, just use "/destinations"
  const url = city ? `/destinations?city=${encodeURIComponent(city)}` : "/destinations";
  
  const { data } = await api.get(url);
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
