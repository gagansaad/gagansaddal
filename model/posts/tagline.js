const mongoose = require("mongoose");

const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);
const { Task } = require("twilio/lib/twiml/VoiceResponse");

const tagline = new mongoose.Schema({
keywords:{
    ...defaultStringConfig
},
ads_type:{
    type: mongoose.Schema.Types.ObjectId,
    ref: `PostType`,
    required: true
}
}, { timestamps: true });

module.exports = mongoose.model('keywords', tagline);
