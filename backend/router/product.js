const productController = require("../controller/product");
const validateDto = require("../middleware/validate");
const {stringReq, arrayReq, numberReq} = require("../middleware/JoiSheme");
const {verifyToken, isAdmin} = require("../middleware/auth");
const router = require("express").Router();
const Joi = require("joi");


router.post("/creare-product", validateDto(Joi.object({
    name: stringReq,
    category: stringReq,
    image: arrayReq,
    des: stringReq,
    price: numberReq,
    discount: numberReq,
    color: arrayReq,
})), verifyToken, isAdmin, productController.createProduct);

router.post("/create-reviews/:id", validateDto(Joi.object({
    rating: numberReq,
    comment: stringReq,
})), verifyToken, productController.createReviews);


router.get("/get-products", productController.getProducts);
router.get("/get-product/:id", productController.getProduct);


router.put("/update-product/:id", validateDto(Joi.object({
    name: stringReq,
    category: stringReq,
    image: arrayReq,
    des: stringReq,
    price: numberReq,
    discount: numberReq,
    color: arrayReq,
})), verifyToken, isAdmin, productController.updateProduct);


router.delete("/delete-product/:id", verifyToken, isAdmin, productController.deleteProduct);
router.delete("/delete-review/:productId/:reviewId", verifyToken, isAdmin, productController.deleteReview);


router.put("/update-review/:productId/:reviewId", verifyToken, productController.updateReview);


module.exports = router;
