import axios from "./axios";

export const login = async (data) => {
    const res = await axios.post("/user/login", data);
    return res.data;
};

export const register = async (data) => {
    const res = await axios.post("/user/register", data);
    return res.data;
};

export const verifyEmail = async (token) => {
    const res = await axios.get(`/user/verify-email?token=${token}`);
    return res.data;
};

export const userTK = async (data) => {
    const res = await axios.get("/user/get-user-token", data);
    return res.data;
};

export const refreshToken = async () => {
    const res = await axios.get("/user/refreshToken");
    return res.data;
};

export const getUsers = async () => {
    const res = await axios.get("/user/get-users");
    return res.data;
};

export const deleteUser = async (id) => {
    const res = await axios.delete(`/user/delete/${id}`);
    return res.data;
};

export const updateUser = async (id, data) => {
    const res = await axios.put(`/user/update-user/${id}`, data);
    return res.data;
};

export const addCart = async (id, data) => {
    const res = await axios.patch(`/user/add-card/${id}`, data);
    return res.data;
};

export const removeCart = async (id, data) => {
    const res = await axios.patch(`/user/remove-card/${id}`, data);
    return res.data;
};

export const uploadUserProfilePicture = async (userId, file) => {
    const formData = new FormData();
    formData.append('profilePicture', file);

    return await axios.post(`/user/${userId}/uploadProfilePicture`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
