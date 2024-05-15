const Category = require("../models/category");
const cloudinary = require("cloudinary").v2;


const createCategory = (name, image) => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await Category.findOne({name: name});
            if (res) {
                reject({
                    success: false,
                    mes: "Tên đã tồn tại !",
                });
                return;
            }
            const myCloud = await cloudinary.uploader.upload(image, {
                folder: "CloneTopZone/Category",
            });
            const category = Category.create({
                name: name,
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
            });
            resolve(category.then((res) => res));
        } catch (e) {
            reject(e);
        }
    });
};

const getCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const category = await Category.find();
            if (!category) {
                reject({
                    success: false,
                    mes: "Không tìm thấy !",
                });
                return;
            }

            resolve({
                category,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateCategory = (id, props) => {
    return new Promise(async (resolve, reject) => {
        const {image, name} = props;
        try {
            const category = await Category.findById(id);
            if (!image.includes("cloudinary")) {
                await cloudinary.uploader.destroy(category.image.public_id);
                const myCloud = await cloudinary.uploader.upload(image, {
                    folder: "CloneTopZone/Category",
                });
                category.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
            category.name = name;
            await category.save();
            resolve({
                success: true,
                category,
            });
        } catch (e) {
            reject({
                success: false,
            });
        }
    });
};

const deleteCategory = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const category = await Category.findById(id);
            await cloudinary.uploader.destroy(category.image.public_id);
            await Category.findByIdAndDelete(id);
            if (!category) {
                reject({
                    success: false,
                    mes: "Không tìm thấy !",
                });
                return;
            }

            resolve({
                success: true,
                mes: "Xóa thành công !",
            });
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    createCategory,
    getCategory,
    updateCategory,
    deleteCategory,
};
