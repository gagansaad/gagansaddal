const mongoose = require("mongoose");

const termAndConditionSchema = new mongoose.Schema({

    htmlText: {
        type: String,
        required: true
    },

}, { timestamps: true });

module.exports = mongoose.model('termandcondition', termAndConditionSchema);