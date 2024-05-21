const User = require("../models/user");
const {sendEmail} = require('../utils/mailer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const register = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {email, password, role, name} = data;
            const check = await User.findOne({email: email});
            if (check) {
                reject({
                    success: false,
                    mes: "Email đã tồn tại !",
                });
                return;
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                name: name,
                email: email,
                password: hashedPassword,
                role: role,
                verified: false,
                verificationExpires: Date.now() + 60 * 1000 // 1 minute from now
            });

            const verificationToken = jwt.sign(
                {userId: newUser._id},
                process.env.EMAIL_SECRET,
                {expiresIn: '1m'}
            );

            const verificationUrl = `${process.env.VERIFICATION_URL}${verificationToken}`;

            const emailOptions = {
                from: 'autofeedback003@gmail.com',
                to: email,
                subject: 'Xác Thực Tài Khoản Của Bạn',
                html: `<strong>Xin chào ${name}</strong>,<br>Vui lòng nhấn vào <a href="${verificationUrl}">đây</a> để xác thực tài khoản của bạn.`
            };

            await sendEmail(emailOptions);

            if (verificationToken) {
                resolve({
                    success: true,
                    verificationToken,
                    res: newUser
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};

const verifyEmail = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("Token received for verification:", token); // Log token received
            const {userId} = jwt.verify(token, process.env.EMAIL_SECRET);
            console.log("UserId extracted from token:", userId); // Log userId extracted from token
            const user = await User.findById(userId);
            if (!user) {
                console.error("User not found for userId:", userId); // Log user not found
                reject({
                    success: false,
                    mes: "Người dùng không tồn tại !",
                });
                return;
            }
            if (user.verified) {
                console.error("User already verified:", userId); // Log user already verified
                reject({
                    success: false,
                    mes: "Tài khoản đã được xác thực !",
                });
                return;
            }
            if (user.verificationExpires < Date.now()) {
                console.error("Verification link expired for userId:", userId); // Log link expired
                reject({
                    success: false,
                    mes: "Liên kết xác thực đã hết hạn !",
                });
                return;
            }
            user.verified = true;
            user.verificationExpires = undefined; // Clear verificationExpires by setting it to undefined
            await user.save();
            console.log("User verified successfully:", userId); // Log successful verification
            resolve({
                success: true,
                mes: "Xác thực thành công !",
            });
        } catch (error) {
            console.error("Error during email verification:", error); // Log error
            reject({
                success: false,
                mes: "Liên kết xác thực không hợp lệ hoặc đã hết hạn !",
            });
        }
    });
};

const login = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {email, password} = data;
            const user = await User.findOne({email: email});
            if (!user) {
                reject({
                    success: false,
                    mes: "Email không chính xác !",
                });
                return;
            }
            if (!user.verified) {
                if (user.verificationExpires < Date.now()) {
                    await User.findByIdAndDelete(user._id);
                    reject({
                        success: false,
                        mes: "Tài khoản chưa được xác thực và đã hết hạn. Vui lòng đăng ký lại!",
                    });
                } else {
                    reject({
                        success: false,
                        mes: "Tài khoản chưa được xác thực!",
                    });
                }
                return;
            }
            const checkPassword = bcrypt.compareSync(password, user.password);
            if (!checkPassword) {
                reject({
                    success: false,
                    mes: "Mật khẩu không chính xác !",
                });
                return;
            }
            const token = jwt.sign(
                {id: user.id, role: user.role},
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "10d",
                }
            );
            const refreshToken = jwt.sign(
                {id: user.id, role: user.role},
                process.env.TOKEN_SECRET,
                {
                    expiresIn: "15d",
                }
            );
            if (token) {
                resolve({
                    success: true,
                    token,
                    refreshToken,
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

const getUserToken = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await User.findById(id)
                .select("-password")
                .populate("cart.product");
            resolve({
                res,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const getUsers = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {name, limit, page} = options;
            const skip = (page - 1) * limit;
            if (name) {
                const regex = new RegExp(name, "i");
                const user = await User.find({name: regex}).select("-password");
                if (user) {
                    resolve({
                        success: true,
                        user,
                    });
                } else {
                    resolve({
                        success: false,
                        message: "Không tìm thấy người dùng !",
                    });
                }
            } else {
                const user = await User.find().select("-password");
                if (user) {
                    resolve({
                        success: true,
                        user,
                    });
                } else {
                    resolve({
                        success: false,
                        message: "Không tìm thấy người dùng !",
                    });
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};

const refreshToken = (id, role) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = jwt.sign({id: id, role: role}, process.env.TOKEN_SECRET, {
                expiresIn: "10d",
            });
            if (token) {
                resolve({
                    success: true,
                    token,
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findByIdAndDelete(id);
            if (user) {
                resolve({
                    success: true,
                    mes: "Xóa người dùng thành công !",
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                return resolve({
                    success: false,
                    message: "Không tìm thấy người dùng!",
                });
            }
            user.name = data.name;
            user.phone = data.phone;
            user.address = data.address;
            await user.save();
            resolve({
                success: true,
                user,
            });
        } catch (err) {
            console.log("Error in updateUser service:", err);
            reject(err);
        }
    });
};

const updateUserAdmin = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                resolve({
                    success: false,
                    message: "Không tìm thấy người dùng !",
                });
            }
            user.name = data.name;
            user.email = data.email;
            user.phone = data.phone;
            user.address = data.address;
            user.role = data.role;
            await user.save();
            resolve({
                success: true,
                user,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const addProductCart = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {idProduct, color} = data;
            const user = await User.findById(id);
            if (!user) {
                resolve({
                    success: false,
                    message: "Không tìm thấy người dùng !",
                });
            }
            const isProductInCart = user.cart.some(
                (item) => item.product.toString() === idProduct
            );

            if (!isProductInCart) {
                user.cart.push({
                    product: idProduct,
                    quantity: data.quantity || 1,
                    color: color,
                });
            } else {
                reject({
                    mes: "Sản phẩm đã có trong giỏ hàng !",
                });
                return;
            }
            await user.save();
            const response = await User.findById(id).populate("cart.product");
            resolve({
                success: true,
                response,
            });
        } catch (err) {
            reject(err);
        }
    });
}

const removeProductCart = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {_id} = data;
            const user = await User.findById(id);
            if (!user) {
                resolve({
                    success: false,
                    message: "Không tìm thấy người dùng !",
                });
            }
            const filter = user.cart.filter((item) => item._id.toString() !== _id);

            if (filter) {
                user.cart = filter;
            } else {
                reject({
                    mes: "Sản phẩm đã có trong giỏ hàng !",
                });
                return;
            }
            await user.save();
            const response = await User.findById(id).populate("cart.product");
            resolve({
                success: true,
                response,
            });
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = {
    register,
    verifyEmail,
    login,
    getUsers,
    getUserToken,
    refreshToken,
    deleteUser,
    updateUser,
    updateUserAdmin,
    addProductCart,
    removeProductCart,
};