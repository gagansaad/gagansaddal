const mongoose = require("mongoose");

const roomRentsSchema = new mongoose.Schema({

    is_active: {
        type: Boolean,
        required: true
    },

    name: {
        type: String,
        required: true
    },


}, { timestamps: true });

module.exports = mongoose.model('RoomRent', roomRentsSchema);