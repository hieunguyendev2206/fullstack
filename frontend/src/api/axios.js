import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: "http://localhost:5000/api/v1",
});

instance.interceptors.request.use(
    function (config) {
        // Lấy token từ cookie
        let accessToken = Cookies.get("accesstoken");
        // Nếu token tồn tại, thêm nó vào header Authorization
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
