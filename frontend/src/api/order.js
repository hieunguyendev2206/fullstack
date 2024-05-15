import axios from "./axios";

export const createOrder = async (data) => {
    try {
        const res = await axios.post("/order/create-order", data);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
export const getOrders = async () => {
    try {
        const res = await axios.get("/order/get-orders");
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const getOrderUser = async (id) => {
    try {
        const res = await axios.get(`/order/get-order-user/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const cancleOrderUser = async (id) => {
    try {
        const res = await axios.patch(`/order/cancle-order/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const deleteOrder = async (id) => {
    try {
        const res = await axios.delete(`/order/delete-order/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
export const updateStatusOrder = async (id, data) => {
    try {
        const res = await axios.patch(`/order/update-order/${id}`, data);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
