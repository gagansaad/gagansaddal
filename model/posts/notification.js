const mongoose = require(`mongoose`)
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const NotificationSchema = new mongoose.Schema({

    title: {
        ...defaultStringConfig,
        required: true
    },
    body: {
        ...defaultStringConfig,
        required: true
    },
    url: {
        ...defaultStringConfig,
        // required: true
    },
    sendToAdmin: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    sendToUser: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    notificationType: {
        ...defaultStringConfig,
        required: true
    },
    notificationSeenUser: {
        type: String,
        possibleValues: ["admin", "user"],
        default: "user"
    },
    status: { type: String, possibleValues: ["seen", "unseen"], default: "unseen" }


}, { timestamps: true });


exports.module = mongoose.model(`notification`, NotificationSchema);