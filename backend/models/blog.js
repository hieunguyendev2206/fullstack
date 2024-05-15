const mongoose = require("mongoose");


const blogSchema = new mongoose.Schema({
    title: {
        type: String, required: true
    },
    avatar: {
        public_id: {
            type: String,
        },
        url: {
            type: String,
        },
    },
    content: {
        type: Buffer
    },
}, {timestamps: true,});

module.exports = mongoose.model("Blog", blogSchema);
