const mongoose = require("mongoose");

const privacySchema = new mongoose.Schema({

    htmlText: {
        type: String,
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model('privacy', privacySchema);