const sliderController = require("../controller/slider");
const validateDto = require("../middleware/validate");
const {stringReq} = require("../middleware/JoiSheme");
const {verifyToken, isAdmin} = require("../middleware/auth");
const router = require("express").Router();
const Joi = require("joi");


router.post("/creare-slider", validateDto(Joi.object({
    image: stringReq,
})), verifyToken, isAdmin, sliderController.createSlider);


router.get("/get-slider", sliderController.getSlider);


router.put("/update-slider/:id", validateDto(Joi.object({
    image: stringReq,
})), verifyToken, isAdmin, sliderController.updateSlider);


router.delete("/delete-slider/:id", verifyToken, isAdmin, sliderController.deleteSlider);


module.exports = router;
