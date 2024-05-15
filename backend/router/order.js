const orderController = require("../controller/order");
const validateDto = require("../middleware/validate");
const {arrayReq, stringReq, numberReq, objectReq} = require("../middleware/JoiSheme");
const {verifyToken, isAdmin} = require("../middleware/auth");
const router = require("express").Router();
const Joi = require("joi");


router.post("/create-order", verifyToken, validateDto(Joi.object({
    user: objectReq,
    payments: stringReq,
    products: arrayReq,
    totalPrice: numberReq
})), orderController.createOrder);


router.get("/get-order-user/:id", verifyToken, orderController.getOrderUser);


router.patch("/cancle-order/:id", verifyToken, orderController.cancleOrder);

router.patch("/update-order/:id", verifyToken, isAdmin, orderController.updateStatusOrder);


router.delete("/delete-order/:id", verifyToken, isAdmin, orderController.deleteOrder);


router.get("/get-orders", verifyToken, isAdmin, orderController.getOrders);


module.exports = router;
