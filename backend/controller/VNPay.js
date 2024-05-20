const moment = require("moment");
const crypto = require("crypto");
const querystring = require("qs");


function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const createPaymentVNP = async (req, res, next) => {
    try {
        process.env.TZ = "Asia/Ho_Chi_Minh";
        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");
        let orderId = moment(date).format("DDHHmmss");
        let ipAddr =
            req.headers["x-forwarded-for"] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const tmnCode = process.env.VNP_TMN_CODE;
        const secretKey = process.env.VNP_HASH_SECRET;
        const vnpUrl = process.env.VNP_API_URL;
        let returnUrl = process.env.RETURNURL;
        let amount = req.body.amount;
        let locale = req.body.language || "vn";

        let vnp_Params = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: tmnCode,
            vnp_Locale: locale,
            vnp_CurrCode: "VND",
            vnp_TxnRef: orderId,
            vnp_OrderInfo: "Thanh toan cho ma GD:" + orderId,
            vnp_OrderType: "other",
            vnp_Amount: amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_IpAddr: ipAddr,
            vnp_CreateDate: createDate,
        };

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, {encode: false});
        let hmac = crypto.createHmac("sha512", secretKey);
        vnp_Params["vnp_SecureHash"] = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

        let paymentUrl =
            vnpUrl + "?" + querystring.stringify(vnp_Params, {encode: false});
        res.json({
            success: true,
            paymentUrl: paymentUrl,
        });
    } catch (err) {
        return next(err);
    }
};

const handleVnpayReturn = async (req, res, next) => {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    let orderId = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = process.env.VNP_HASH_SECRET;
    let signData = querystring.stringify(vnp_Params, {encode: false});
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    let paymentStatus = "0";

    let checkOrderId = true;
    let checkAmount = true;
    if (secureHash === signed) {
        if (checkOrderId) {
            if (checkAmount) {
                if (paymentStatus === "0") {
                    if (rspCode === "00") {
                        res.status(200).json({RspCode: "00", Message: "Success"});
                    } else {
                        res.status(200).json({RspCode: "01", Message: "Success"});
                    }
                } else {
                    res.status(200).json({
                        RspCode: "02",
                        Message: "This order has been updated to the payment status",
                    });
                }
            } else {
                res.status(200).json({RspCode: "04", Message: "Amount invalid"});
            }
        } else {
            res.status(200).json({RspCode: "01", Message: "Order not found"});
        }
    } else {
        res.status(200).json({RspCode: "97", Message: "Checksum failed"});
    }
};

module.exports = {
    createPaymentVNP,
    handleVnpayReturn,
};
