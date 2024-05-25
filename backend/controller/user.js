const User = require('../models/user');
const UserService = require("../service/user");
const cloudinary = require('cloudinary').v2;
const cloudinaryConnect = require('../config/cloudinaryConnect')
const crypto = require('crypto');
const { sendEmail } = require('../utils/mailer');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
cloudinaryConnect();


const uploadCoverPicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, mes: 'No file uploaded!' });
        }

        const fileStr = req.file.buffer.toString('base64');
        const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileStr}`, {
            upload_preset: 'ml_default',
        });

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, mes: 'User not found!' });
        }

        user.coverPicture = uploadResponse.secure_url;
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

const uploadProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({success: false, mes: 'No file uploaded !'});
        }

        const fileStr = req.file.buffer.toString('base64');
        const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${fileStr}`, {
            upload_preset: 'ml_default',
        });

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({success: false, mes: 'User not found !'});
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

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, mes: 'Email không tồn tại!' });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 60 * 1000; // 1 phút
        await user.save();

        const resetUrl = `${process.env.RESET_PASSWORD_URL}${resetToken}`;
        const emailOptions = {
            from: 'autofeedback003@gmail.com',
            to: email,
            subject: 'Yêu cầu thay đổi mật khẩu',
            html: `<strong>Xin chào</strong>,<br>Vui lòng nhấn vào <a href="${resetUrl}">đây</a> để thay đổi mật khẩu của bạn.`,
        };

        await sendEmail(emailOptions);

        return res.status(200).json({
            success: true,
            mes: 'Email yêu cầu thay đổi mật khẩu đã được gửi!',
        });
    } catch (error) {
        return res.status(500).json({ mes: error.message });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        // Tìm người dùng dựa trên token và kiểm tra thời hạn của token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }, // Kiểm tra thời hạn của token
        });

        if (!user) {
            // Nếu không tìm thấy người dùng hoặc token đã hết hạn
            return res.status(400).json({ success: false, mes: 'Liên kết đã hết hạn hoặc không hợp lệ!' });
        }

        // Mã hóa mật khẩu mới
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return res.status(200).json({ success: true, mes: 'Mật khẩu đã thay đổi thành công!' });
    } catch (error) {
        return res.status(500).json({ mes: error.message });
    }
};

const verifyResetToken = async (req, res) => {
    try {
        const { token } = req.params;

        // Tìm người dùng dựa trên token và kiểm tra thời hạn của token
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            // Nếu không tìm thấy người dùng hoặc token đã hết hạn
            return res.status(400).json({ success: false, mes: 'Liên kết đã hết hạn hoặc không hợp lệ!' });
        }

        return res.status(200).json({ success: true, mes: 'Liên kết hợp lệ.' });
    } catch (error) {
        return res.status(500).json({ mes: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const {token} = req.query;
        console.log("Token received in verifyEmail route:", token);
        const response = await UserService.verifyEmail(token);
        console.log("Response from verifyEmail service:", response);
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error in verifyEmail route:", error);
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
                user: response.user
            });
    } catch (e) {
        return res.status(500).json({
            mes: e.mes,
        });
    }
};

const updateUserAsAdmin = async (req, res) => {
    try {
        const {id} = req.params;
        const updateData = req.body;
        const user = await User.findByIdAndUpdate(id, updateData, {new: true});

        if (!user) {
            return res.status(404).json({success: false, message: "User not found"});
        }

        res.status(200).json({success: true, user});
    } catch (error) {
        res.status(500).json({success: false, message: error.message});
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
    forgotPassword,
    resetPassword,
    verifyResetToken,
    verifyEmail,
    login,
    getUsers,
    getUserToken,
    refreshToken,
    addProductCart,
    deleteUser,
    updateUser,
    updateUserAsAdmin,
    removeProductCart,
    uploadProfilePicture,
    uploadCoverPicture
};