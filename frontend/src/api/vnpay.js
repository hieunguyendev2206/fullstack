import axios from "./axios";

export const createOrderVNpay = async (data) => {
    const res = await axios.post("/checkout/vnpay", data);
    return res.data;
};
export const returnPayment = async (query) => {
    const res = await axios.get(`/checkout/vnpay-return${query}`);
    return res.data;
};
