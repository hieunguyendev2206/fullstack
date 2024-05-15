const DataBaseConnect = require("./config/mongoConnect");
const CloudinaryConnect = require("./config/cloudinaryConnect");
const connect = require("./config/redisConnect");
const express = require("express");
const initialRouter = require("./router");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();
require("dotenv").config();
app.use(
    cors({
        origin: process.env.CLIENT_URL,
    })
);
app.use(express.json({limit: "50mb"}));
app.use(express.urlencoded({extended: true, limit: "50mb"}));
app.use(cookieParser());
initialRouter(app);

// Định nghĩa hàm deleteExpiredUnverifiedUsers
const deleteExpiredUnverifiedUsers = async () => {
    const now = new Date();
    await User.deleteMany({
        verified: false,
        verificationExpires: {$lt: now}
    });
};

// Gọi hàm này định kỳ, ví dụ mỗi ngày
setInterval(deleteExpiredUnverifiedUsers, 24 * 60 * 60 * 1000); // Mỗi 24 giờ

const PORT = process.env.PORT;
app.listen(PORT || 8000, () => {
    console.log("Đang lắng nghe cổng " + process.env.PORT);
});
CloudinaryConnect();
DataBaseConnect();
