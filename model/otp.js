const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true
    },
    for: {
        type: Number,
        required: true,
        // 2= email
        // 1= mobile number
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('otp', otpSchema);