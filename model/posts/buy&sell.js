const mongoose = require("mongoose");
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const BuySellSchema = new mongoose.Schema({

    status: {
        type: Number,
        enum: [1, 2, 3],
        required: true

        //1 = active
        //2 = inactive
        //3 = draft 
    },
    isfeatured:{
        type: Boolean,
        required: true,
        default:false
    },
    adsType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `PostType`,
        required: true
    },
    adsInfo: {
        categories: {
            ...defaultStringConfig,
            required: true
        },
        title: {
            ...defaultStringConfig,
            required: true
        },
        product_condition: {
            ...defaultStringConfig,
            required: true
        },
        user_type: {
            ...defaultStringConfig,
            required: true
        },

        price: {
            type:Number,
            required: true
        },
        descriptions: {
            ...defaultStringConfig,
            required: true
        },
        additional_info: {
            ...defaultStringConfig,
            required: true
        },
        image: [{
            ...defaultStringConfig,
            required: true
        }]

    },
    listerBasicInfo: {
        name: defaultStringConfig,
        emailAddress: defaultStringConfig,
        mobileNumber: {
            countryCode: defaultStringConfig,
            phoneNumber: defaultStringConfig
        },
            
        location:defaultStringConfig,
        hideAddress: defaultBooleanConfig,
        addressInfo: defaultStringConfig,
        preferableModeContact: {
            type: Number,
            enum: [1,2,3]
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('Buy & Sell',BuySellSchema);
