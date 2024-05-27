import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: "http://localhost:5000/api/v1",
});

instance.interceptors.request.use(
    function (config) {
        let accessToken = Cookies.get("accesstoken");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default instance;
