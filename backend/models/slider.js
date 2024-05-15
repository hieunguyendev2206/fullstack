const mongoose = require("mongoose");


const sliderSchema = new mongoose.Schema({
    image: {
        public_id: {
            type: String,
        }, url: {
            type: String,
        },
    },
}, {timestamps: true,});

module.exports = mongoose.model("Slider", sliderSchema);
