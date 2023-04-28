const mongoose = require(`mongoose`);
const MediaSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    url_type: {
        type: String,
        required: true
    }
}, { timestamps: true });
exports.module = mongoose.model(`media`, MediaSchema);  