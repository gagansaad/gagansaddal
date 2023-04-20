const mongoose = require(`mongoose`);
const MediaSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
}, { timestamps: true });
exports.module = mongoose.model(`media`, MediaSchema);