const mongoose = require("mongoose");

const postTypesSchema = new mongoose.Schema({

    is_active: {
        type: Boolean,
        required: true
    },

    type: {
        name: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true

            // 1 = Room For Rent,
            // 2 = jobs
            // 3 = Events
            // 4 = Local Biz and services
            // 5 = Buy & Sell
            // 6 = Babysitters and Nannies
        }

    },


}, { timestamps: true });

module.exports = mongoose.model('PostType', postTypesSchema);