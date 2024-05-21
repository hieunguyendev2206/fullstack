const userController = require("../controller/user");
const validateDto = require("../middleware/validate");
const {stringReq} = require("../middleware/JoiSheme");
const {verifyToken, isAdmin, checkToken} = require("../middleware/auth");
const router = require("express").Router();
const Joi = require("joi");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});


router.post('/:id/uploadProfilePicture', upload.single('profilePicture'), userController.uploadProfilePicture);

router.post("/register", userController.register);

router.post("/login", userController.login);


router.get("/get-user-token", verifyToken, userController.getUserToken);

router.get("/get-users", verifyToken, isAdmin, userController.getUsers);

router.get("/refreshToken", checkToken, userController.refreshToken);

router.get("/verify-email", userController.verifyEmail);


router.put("/update-user/:id", validateDto(Joi.object({
    name: stringReq,
    phone: stringReq,
    address: stringReq
})), verifyToken, userController.updateUser);

router.put("/update-user-admin/:id", validateDto(Joi.object({
    name: stringReq,
    email: stringReq,
    phone: stringReq,
    address: stringReq,
    role: stringReq
})), verifyToken, isAdmin, userController.updateUserAsAdmin);


router.delete("/delete/:id", verifyToken, isAdmin, userController.deleteUser);


router.patch("/add-card/:id", verifyToken, userController.addProductCart);

router.patch("/remove-card/:id", verifyToken, userController.removeProductCart);

module.exports = router;
