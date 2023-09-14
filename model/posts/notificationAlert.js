const mongoose = require("mongoose");

const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const AlertSchema = new mongoose.Schema({

        adstype: {
            type: String
            // required: true
        },
        Typename:{
            type:String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }

}, { timestamps: true });



module.exports = mongoose.model('Alert', AlertSchema);


