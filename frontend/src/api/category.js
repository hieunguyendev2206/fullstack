import axios from "./axios";

export const getCategory = async () => {
    try {
        const res = await axios.get("/category/get-category");
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const deleteCategory = async (id) => {
    try {
        const res = await axios.delete(`/category/delete-category/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const createCategory = async (data) => {
    try {
        const res = await axios.post("/category/creare-category", data);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const updateCategory = async (id, data) => {
    try {
        const res = await axios.put(`category/update-category/${id}`, data);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
