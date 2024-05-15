const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    products: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: "Product"},
            quantity: {type: Number, required: true},
            color: {type: String, required: true},
        },
    ],
    totalPrice: {type: String, required: true},

    payments: {type: String, required: true},
    status: {type: String, default: "Chờ xử lý"},
}, {timestamps: true,});

module.exports = mongoose.model("Order", orderSchema);
