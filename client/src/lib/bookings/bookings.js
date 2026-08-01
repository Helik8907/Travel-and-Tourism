import api from "../api";

export const createBooking = async (itineraryId) => {
    const { data } = await api.post("/bookings", { itineraryId });
    return data;
};

export const getBooking = async (id) => {
    const { data } = await api.get(`/bookings/${id}`);
    return data;
};

export const updateSplit = async (id, splitConfig) => {
    const { data } = await api.put(`/bookings/${id}/split`, splitConfig);
    return data;
};

export const confirmBooking = async (id) => {
    const { data } = await api.post(`/bookings/${id}/confirm`);
    return data;
};

export const markParticipantPaid = async (bookingId, participantId) => {
    const { data } = await api.patch(`/bookings/${bookingId}/participants/${participantId}/pay`);
    return data;
};
