const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const cloudinary = require("cloudinary").v2;


const createProduct = (props) => {
    return new Promise(async (resolve, reject) => {
        const {name, image, category, des, price, discount, color} = props;
        try {
            const res = await Product.findOne({name: name});
            if (res) {
                reject({
                    success: false,
                    mes: "Tên đã tồn tại !",
                });
                return;
            }
            const uploadImagesPromises = image.map(async (image) => {
                return await cloudinary.uploader.upload(image, {
                    folder: "CloneTopZone/Product",
                });
            });
            const listImage = await Promise.all(uploadImagesPromises);
            const product = await Product.create({
                name: name,
                category: category,
                des: des,
                price: price,
                discount: discount,
                color: color,
                image: listImage.map((item) => ({
                    public_id: item.public_id,
                    url: item.secure_url,
                })),
            });
            resolve(product);
        } catch (e) {
            reject(e);
        }
    });
};

const getProducts = (options) => {
    return new Promise(async (resolve, reject) => {
        try {
            const {name, limit, category} = options;
            if (name) {
                const regex = new RegExp(name, "i");
                const product = await Product.find({name: regex}).populate(
                    "category"
                );
                // .skip(skip);
                // .limit(limit);
                if (product) {
                    resolve({
                        success: true,
                        product,
                    });
                } else {
                    resolve({
                        success: false,
                        message: "Không tìm thấy sản phẩm !",
                    });
                }
            } else if (category) {
                const product = await Product.find({category: category}).populate(
                    "category"
                );
                // .skip(skip);
                // .limit(limit);
                if (product) {
                    resolve({
                        success: true,
                        product,
                    });
                } else {
                    resolve({
                        success: false,
                        message: "Không tìm thấy sản phẩm !",
                    });
                }
            } else {
                const product = await Product.find().populate("category");
                // .limit(limit);

                if (product) {
                    resolve({
                        success: true,
                        product,
                    });
                } else {
                    resolve({
                        success: false,
                        message: "Không tìm thấy sản phẩm !",
                    });
                }
            }
        } catch (err) {
            reject(err);
        }
    });
};

const getProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(id)
                .populate({
                    path: 'reviews.user',
                    select: 'name profilePicture',
                })
                .populate("category");
            if (product) {
                resolve({
                    success: true,
                    product,
                });
            } else {
                resolve({
                    success: false,
                    message: "Không tìm thấy sản phẩm !",
                });
            }
        } catch (err) {
            reject(err);
        }
    });
};

const deleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                resolve({
                    success: false,
                    message: "Không tìm thấy sản phẩm !",
                });
                return;
            }
            for (const el of product.image) {
                await cloudinary.uploader.destroy(el.public_id);
            }
            await Product.findByIdAndDelete(id);
            resolve({
                success: true,
                message: "Sản phẩm đã được xóa thành công !",
            });
        } catch (err) {
            reject(err);
        }
    });
};

const updateProduct = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(id);
            if (!product) {
                resolve({
                    success: false,
                    message: "Không tìm thấy sản phẩm !",
                });
                return;
            }
            if (!data?.image[0]) {
                for (const el of product.image) {
                    await cloudinary.uploader.destroy(el.public_id);
                }
                const uploadImagesPromises = data.image.map(async (image) => {
                    return await cloudinary.uploader.upload(image, {
                        folder: "CloneTopZone/Product",
                    });
                });
                const listImage = await Promise.all(uploadImagesPromises);
                product.image = listImage.map((item) => ({
                    public_id: item.public_id,
                    url: item.secure_url,
                }));
            }
            product.name = data.name;
            product.category = data.category;
            product.des = data.des;
            product.price = data.price;
            product.discount = data.discount;
            product.color = data.color;
            await product.save();
            resolve({
                product,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const createReviews = (productId, data, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { comment, rating } = data;
            const user = await User.findById(userId).select("name profilePicture");
            const product = await Product.findById(productId);
            if (!product) {
                reject({
                    success: false,
                    message: "Không tìm thấy sản phẩm!",
                });
                return;
            }

            const hasReviewed = product.reviews.some(review => review.user.toString() === userId);
            if (hasReviewed) {
                reject({
                    success: false,
                    message: "Bạn đã bình luận về sản phẩm này rồi!",
                });
                return;
            }

            const orders = await Order.find({
                user: userId,
                status: "Đã giao",
            }).populate("products.product");
            const checkOrder = orders.some(order =>
                order.products.some(orderProduct =>
                    orderProduct.product.equals(product._id)
                )
            );
            if (!checkOrder) {
                reject({
                    success: false,
                    message: "Bạn chưa mua sản phẩm này!",
                });
                return;
            }

            product.reviews.unshift({
                user: user._id,
                rating: rating,
                comment: comment,
            });
            product.ratings = product.reviews.reduce((acc, cur) => acc + cur.rating, 0) /
                product.reviews.length;
            await product.save();
            resolve({
                success: true,
                product,
            });
        } catch (err) {
            reject(err);
        }
    });
};

const updateReview = (productId, reviewId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                return reject({ success: false, message: "Product not found!" });
            }

            const review = product.reviews.id(reviewId);
            if (!review) {
                return reject({ success: false, message: "Review not found!" });
            }

            review.rating = data.rating;
            review.comment = data.comment;

            product.ratings = product.reviews.reduce((acc, cur) => acc + cur.rating, 0) / product.reviews.length;

            await product.save();
            resolve({ success: true, message: "Review updated successfully!", product });
        } catch (err) {
            reject({ success: false, message: err.message });
        }
    });
};

const deleteReview = (productId, reviewId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findById(productId);
            if (!product) {
                return reject({ success: false, message: "Product not found!" });
            }

            const reviewIndex = product.reviews.findIndex(
                (review) => review._id.toString() === reviewId
            );

            if (reviewIndex === -1) {
                return reject({ success: false, message: "Review not found!" });
            }

            product.reviews.splice(reviewIndex, 1);

            if (product.reviews.length > 0) {
                product.ratings = product.reviews.reduce((acc, cur) => acc + cur.rating, 0) / product.reviews.length;
            } else {
                product.ratings = 0; // Hoặc giá trị mặc định của bạn
            }

            await product.save();
            resolve({ success: true, message: "Review deleted successfully!" });
        } catch (err) {
            reject({ success: false, message: err.message });
        }
    });
};


module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
    createReviews,
    updateReview,
    deleteReview
};
