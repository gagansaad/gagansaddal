const mongoose = require(`mongoose`)
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const msgSchema = new mongoose.Schema({
    message: {
        type: defaultStringConfig
    },
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `users`,
        required: true
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `users`,
        required: true
    },
    file: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: `media`,
    }],
    unread: {
        type: String,
        enum: [`read`, `unread`],
        required: true,
        default: "unread"
    }
}, { timestamps: true });


exports.module = mongoose.model(`message`, msgSchema);