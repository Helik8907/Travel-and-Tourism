import api from "../api";

export const getDestinationReviews = async (destinationId) => {
    const { data } = await api.get(`/reviews/destination/${destinationId}`);
    return data;
};

export const createReview = async (destinationId, { rating, comment }) => {
    const { data } = await api.post(`/reviews/destination/${destinationId}`, { rating, comment });
    return data;
};

export const getBlogReviews = async (blogId) => {
    const { data } = await api.get(`/reviews/blog/${blogId}`);
    return data;
};

export const createBlogReview = async (blogId, { rating, comment }) => {
    const { data } = await api.post(`/reviews/blog/${blogId}`, { rating, comment });
    return data;
};

export const updateReview = async (reviewId, { rating, comment }) => {
    const { data } = await api.put(`/reviews/${reviewId}`, { rating, comment });
    return data;
};

export const deleteReview = async (reviewId) => {
    const { data } = await api.delete(`/reviews/${reviewId}`);
    return data;
};

export const toggleLikeReview = async (reviewId) => {
    const { data } = await api.post(`/reviews/${reviewId}/like`);
    return data;
};

export const toggleDislikeReview = async (reviewId) => {
    const { data } = await api.post(`/reviews/${reviewId}/dislike`);
    return data;
};
