import axios from "./axios";

export const getBanner = async () => {
    try {
        const res = await axios.get("/slider/get-slider");
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const createBaner = async (image) => {
    try {
        const res = await axios.post("/slider/creare-slider", image);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};

export const deleteBanner = async (id) => {
    try {
        const res = await axios.delete(`/slider/delete-slider/${id}`);
        return res.data;
    } catch (e) {
        console.log(e);
    }
};
