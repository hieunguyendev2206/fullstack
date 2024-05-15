const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
        name: {type: String, required: true},
        image: {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
    }, {timestamps: true,});

module.exports = mongoose.model("Category", categorySchema);
