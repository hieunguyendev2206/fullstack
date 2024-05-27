import axios from "./axios";

export const login = async (data) => {
    const res = await axios.post("/user/login", data);
    return res.data;
};

export const register = async (data) => {
    const res = await axios.post("/user/register", data);
    return res.data;
};

export const forgotPassword = async (data) => {
    const res = await axios.post("/user/forgot-password", data);
    return res.data;
};

export const resetPassword = async (token, data) => {
    const res = await axios.post(`/user/reset-password/${token}`, data);
    return res.data;
};

export const verifyResetToken = async (token) => {
    try {
        const res = await axios.get(`/user/verify-reset-token/${token}`);
        return res.data;
    } catch (error) {
        throw error.response.data;
    }
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

export const updateUserAdmin = async (id, data) => {
    const res = await axios.put(`/user/update-user-admin/${id}`, data);
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

export const uploadUserCoverPicture = async (userId, file) => {
    const formData = new FormData();
    formData.append('coverPicture', file);

    return await axios.post(`/user/${userId}/uploadCoverPicture`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

export const getUserById = async (id) => {
    try {
        const res = await axios.get(`/user/get-user-id/${id}`);
        return res.data;
    } catch (error) {
        console.error("Error fetching user data:", error);
        throw error;
    }
};