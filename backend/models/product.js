const mongoose = require("mongoose");


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: "Category"},
    image: [
        {
            public_id: {
                type: String,
            },
            url: {
                type: String,
            },
        },
    ],
    des: {type: String, required: true},
    price: {type: String, required: true},
    discount: {type: String},
    quantity: {type: String},
    color: [
        {
            color: {type: String, required: true},
            quantity: {type: Number, required: true},
        },
    ],
    reviews: [
        {
            user: {
                type: Object,
            },
            rating: {
                type: Number,
            },
            comment: {
                type: String,
            },
            createAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    sold_out: {
        type: Number,
        default: 0,
    },
    ratings: {
        type: Number,
    },
}, {timestamps: true,});

module.exports = mongoose.model("Product", productSchema);
