const User = require('../models/user');
const UserService = require("../service/user");
const cloudinary = require('cloudinary').v2;
const cloudinaryConnect = require('../config/cloudinaryConnect')
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
cloudinaryConnect();


const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({success: false, mes: 'No file uploaded'});
        }

        const fileStr = req.file.buffer.toString('base64');
        const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileStr}`, {
            upload_preset: 'ml_default',
        });

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({success: false, mes: 'User not found'});
        }

        user.profilePicture = uploadResponse.secure_url;
        await user.save();

        return res.status(200).json({
            success: true,
            user,
        });
    } catch (err) {
        return res.status(500).json({
            mes: err.message,
        });
    }
};

const register = async (req, res) => {
    try {
        const {email} = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const check = reg.test(email);
        if (!check)
            return res.status(403).json({
                success: false,
                mes: "Định dạng email không hợp lệ !",
            });
        const response = await UserService.register(req.body);
        if (response)
            return res.status(200).json({
                success: true,
                response,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const {token} = req.query;
        console.log("Token received in verifyEmail route:", token); // Log token received
        const response = await UserService.verifyEmail(token);
        console.log("Response from verifyEmail service:", response); // Log response
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in verifyEmail route:", error); // Log error
        return res.status(500).json(error);
    }
};

const login = async (req, res) => {
    try {
        const {email} = req.body;
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const check = reg.test(email);
        if (!check)
            return res.status(403).json({
                success: false,
                mes: "Định dạng email không hợp lệ !",
            });
        const response = await UserService.login(req.body);
        if (response) {
            res.cookie("refesToken", response.refesToken);
            return res.status(200).json({
                success: true,
                token: response.token,
            });
        }
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const getUserToken = async (req, res) => {
    try {
        const response = await UserService.getUserToken(req.user.id);
        if (response)
            return res.status(200).json({
                success: true,
                user: response.res,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const getUsers = async (req, res) => {
    try {
        const {name, page} = req.query;
        let limit = process.env.LIMIT;
        const options = {
            page,
            limit,
        };
        if (name) {
            options.name = name;
        }
        const response = await UserService.getUsers({...options});
        if (response)
            return res.status(200).json({
                success: true,
                users: response.user,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const {id, role} = req.user;
        const response = await UserService.refreshToken(id, role);
        if (response)
            return res.status(200).json({
                success: true,
                response,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const response = await UserService.deleteUser(req.params.id);
        if (response)
            return res.status(200).json({
                success: true,
                user: response.res,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const response = await UserService.updateUser(req.params.id, req.body);
        if (response)
            return res.status(200).json({
                success: true,
                user: response.user,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const addProductCart = async (req, res) => {
    try {
        const response = await UserService.addProductCart(req.params.id, req.body);
        if (response)
            return res.status(200).json({
                success: true,
                user: response.response,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const removeProductCart = async (req, res) => {
    try {
        const response = await UserService.removeProductCart(
            req.params.id,
            req.body
        );
        if (response)
            return res.status(200).json({
                success: true,
                user: response.response,
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

module.exports = {
    register,
    verifyEmail,
    login,
    getUsers,
    getUserToken,
    refreshToken,
    addProductCart,
    deleteUser,
    updateUser,
    removeProductCart,
    uploadProfilePicture
};