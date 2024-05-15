import axios from "./axios";

export const createBlog = async (data) => {
    const res = await axios.post("/blog/create-blog", data);
    return res.data;
};

export const getBlogs = async () => {
    const res = await axios.get("/blog/get-blogs");
    return res.data;
};

export const getBlog = async (id) => {
    const res = await axios.get(`/blog/get-blog/${id}`);
    return res.data;
};
export const deleteBlog = async (id) => {
    const res = await axios.delete(`/blog/delete-blog/${id}`);
    return res.data;
};
export const updateBlog = async (id, data) => {
    const res = await axios.put(`/blog/update-blog/${id}`, data);
    return res.data;
};
