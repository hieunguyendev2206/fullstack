const mongoose = require("mongoose");

const DataBaseConnect = () => {
    mongoose
        .connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Đã Kết Nối Thành Công Với CSDL MongoDB");
        })
        .catch((e) => {
            console.log("Lỗi, Không Thể Kết Nối !");
        });
};
module.exports = DataBaseConnect;
