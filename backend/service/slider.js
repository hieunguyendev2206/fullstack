const Slider = require("../models/slider");
const cloudinary = require("cloudinary").v2;


const createSlider = (image) => {
    return new Promise(async (resolve, reject) => {
        try {
            const myCloud = await cloudinary.uploader.upload(image, {
                folder: "CloneTopZone/Slider",
            });
            const slider = Slider.create({
                image: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
            });
            resolve(slider.then((res) => res));
        } catch (e) {
            reject(e);
        }
    });
};

const getSlider = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const slider = await Slider.find();
            if (!slider) {
                reject({
                    success: false,
                    mes: "Không tìm thấy !",
                });
                return;
            }

            resolve({
                slider,
            });
        } catch (e) {
            reject(e);
        }
    });
};

const updateSlider = (id, {image}) => {
    return new Promise(async (resolve, reject) => {
        try {
            const slider = await Slider.findById(id);
            if (image.includes("cloudinary")) {
                return;
            }
            await cloudinary.uploader.destroy(slider.image.public_id, {
                resource_type: "image",
            });
            const myCloud = await cloudinary.uploader.upload(image, {
                folder: "CloneTopZone/Slider",
            });
            slider.image = {
                public_id: myCloud.public_id,
                url: myCloud.url,
            };
            await slider.save();
            if (!slider) {
                reject({
                    success: false,
                    mes: "Không tìm thấy !",
                });
                return;
            }

            resolve(slider.then((res) => res));
        } catch (e) {
            reject(e);
        }
    });
};

const deleteSlider = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const slider = await Slider.findById(id);
            await cloudinary.uploader.destroy(slider.image.public_id, {
                resource_type: "image",
            });
            const checkdelete = await Slider.findByIdAndDelete(id);
            if (!checkdelete) {
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
    createSlider,
    getSlider,
    updateSlider,
    deleteSlider,
};
