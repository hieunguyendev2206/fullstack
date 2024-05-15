const blogController = require("../controller/blog");
const validateDto = require("../middleware/validate");
const {objectReq, stringReq, binaryReq} = require("../middleware/JoiSheme");
const {verifyToken, isAdmin} = require("../middleware/auth");
const router = require("express").Router();
const Joi = require("joi");


router.post("/create-blog", validateDto(Joi.object({
    title: stringReq,
    avatar: stringReq,
    content: binaryReq,
})), verifyToken, isAdmin, blogController.createBlog);


router.get("/get-blogs", blogController.getBlogs);

router.get("/get-blog/:id", blogController.getBlog);


router.delete("/delete-blog/:id", verifyToken, isAdmin, blogController.deleteBlog);


router.put("/update-blog/:id", verifyToken, isAdmin, blogController.updateBlog);


module.exports = router;
