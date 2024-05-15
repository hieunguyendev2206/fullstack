const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, default: 'user'},
    phone: {type: String},
    cart: [
        {
            product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
            quantity: {type: Number, default: 1},
            color: {type: String, required: true},
        },
    ],
    address: {type: String},
    verified: {type: Boolean, default: false},
    profilePicture: {type: String},
    verificationExpires: {type: Date, required: false, default: null}, // Allow null value and not required
});

module.exports = mongoose.model('User', userSchema);
