import api from "../api";

export const getBlogs = async () => {
    const { data } = await api.get("/blogs");
    return data;
};

export const getBlog = async (id) => {
    const { data } = await api.get(`/blogs/${id}`);
    return data;
};

export const createBlog = async (blogData) => {
    const { data } = await api.post("/blogs", blogData);
    return data;
};

export const editBlog = async (id, blogData) => {
    const { data } = await api.put(`/blogs/${id}`, blogData);
    return data;
};

export const deleteBlog = async (id) => {
    const { data } = await api.delete(`/blogs/${id}`);
    return data;
};

export const toggleLikeBlog = async (id) => {
    const { data } = await api.post(`/blogs/${id}/like`);
    return data;
};

export const toggleDislikeBlog = async (id) => {
    const { data } = await api.post(`/blogs/${id}/dislike`);
    return data;
};
