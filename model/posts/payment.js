const mongoose = require("mongoose");

const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const roomRentsSchema = new mongoose.Schema({

    status:{
        type: String,
        enum: [`active`, `inactive`, `draft`],
        required: true,
        default: "draft"

    },
    plan_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `adsplan`,
        required: true

    },

    plan_addons: [{
        type:String,
    }],
    plan_price:defaultPriceProperty,
    coupan_discount:defaultPriceProperty,
    total_amount:defaultPriceProperty,
    

    ads: {
        type: mongoose.Schema.Types.ObjectId,
    },
    ads_type: { ...defaultStringConfig },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `user`,
        required: true
    },
    payment_status:defaultStringConfig,
    payment_intent: {

    },


}, { timestamps: true });

module.exports = mongoose.model('payment', roomRentsSchema);
