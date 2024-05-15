import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
    baseURL: "https://shop-online-service.onrender.com/api/v1",
});

instance.interceptors.request.use(
    function (config) {
        // Lấy token từ cookie
        let accessToken = Cookies.get("accesstoken");
        // Nếu token tồn tại, thêm nó vào HeaderAdmin Authorization
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
