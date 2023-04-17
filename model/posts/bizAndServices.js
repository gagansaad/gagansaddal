const mongoose = require("mongoose");
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const bizAndServices = new mongoose.Schema({

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
        profession: {
            ...defaultStringConfig,
            required: true
        },
        categories: {
            ...defaultStringConfig,
            required: true
        },
        buisness_name: {
            ...defaultStringConfig,
            required: true
        },
       
        tagline: {
            ...defaultStringConfig,
            required: true
        },
        buisnesslocation:{
            ...defaultStringConfig,
            required: true
        },

        price: {
            ...defaultStringConfig,
            required: true
        },
        descriptions: {
            ...defaultStringConfig,
            required: true
        },
        Additional_info: {
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
        addressInfo:defaultStringConfig,
        preferableModeContact: {
            type: Number,
            enum: [1,2,3]
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('Local_biz & Service',bizAndServices);
