const categogyController = require("../controller/category");
const validateDto = require("../middleware/validate");
const {stringReq} = require("../middleware/JoiSheme");
const {verifyToken, isAdmin} = require("../middleware/auth");
const router = require("express").Router();
const Joi = require("joi");


router.post("/creare-category", validateDto(Joi.object({
    name: stringReq,
    image: stringReq,
})), verifyToken, isAdmin, categogyController.createCategory);


router.get("/get-category", categogyController.getCategory);


router.put("/update-category/:id", validateDto(Joi.object({
    name: stringReq,
    image: stringReq,
})), verifyToken, isAdmin, categogyController.updateCategory);


router.delete("/delete-category/:id", verifyToken, isAdmin, categogyController.deleteCategory);


module.exports = router;
