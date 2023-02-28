const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({

    code: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`,
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model('otp', otpSchema);