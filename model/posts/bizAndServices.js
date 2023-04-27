const mongoose = require("mongoose");
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);
const { Number } = require("twilio/lib/twiml/VoiceResponse");

const bizAndServices = new mongoose.Schema({

    status: {
        type: String,
        enum: [`active`, `inactive`, `draft`],
        required: true,
        default: "draft"

        //1 = active
        //2 = inactive
        //3 = draft 
    },
    isfeatured: {
        type: Boolean,
        required: true,
        default: false
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
        experience:{
            ...defaultStringConfig,
            required: true
        },
        working_hours:{
           type:[{
                day_name:{...defaultStringConfig}
                 }]
        },
        buisnesslocation: {
            ...defaultStringConfig,
            required: true
        },

        price: {
            type: Number,
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
            type: mongoose.Schema.Types.ObjectId,
            ref: `media`,
        }],

    },
    listerBasicInfo: {
        name: defaultStringConfig,
        emailAddress: defaultStringConfig,
        mobileNumber: {
            countryCode: defaultStringConfig,
            phoneNumber: defaultStringConfig
        },

        location: defaultStringConfig,
        hideAddress: defaultBooleanConfig,
        addressInfo: defaultStringConfig,
        preferableModeContact: {
            type: Number,
            enum: [1, 2, 3]
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('Local_biz & Service', bizAndServices);
