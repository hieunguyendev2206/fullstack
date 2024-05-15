const Payment = require("../controller/VNPay");
const {verifyToken} = require("../middleware/auth");
const express = require("express");
const router = express.Router();


router.post("/vnpay", verifyToken, Payment.createPaymentVNP);

router.get("/vnpay-return", verifyToken, Payment.handleVnpayReturn);

module.exports = router;
