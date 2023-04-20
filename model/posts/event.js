const mongoose = require("mongoose");
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const events_Schema = new mongoose.Schema({

    status: {
        type: String,
        enum: [`active`, `inactive`, `draft`],
        required: true,
        default: "draft"

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
        type: {
            ...defaultStringConfig,
            required: true
        },
        title: {
            ...defaultStringConfig,
            required: true
        },
        add_platform: {
            ...defaultStringConfig,
            required: true
        },
        details: {
            ...defaultStringConfig,
            required: true
        },

        ticket_price: {
            type:Number,
            required: true
        },
        link: {
            ...defaultStringConfig,
            required: true
        },
       
        image: [{
            ...defaultStringConfig,
            required: true
        
        }],
        location:defaultStringConfig

    },
    listerBasicInfo: {
        
        name: defaultStringConfig,
        emailAddress: defaultStringConfig,
        
        mobileNumber: {
            countryCode: defaultStringConfig,
            phoneNumber: defaultStringConfig
        },
        hideAddress: defaultBooleanConfig,
        addressInfo: defaultStringConfig,
        preferableModeContact: {
            type: Number,
            enum: [1,2,3]
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('event',events_Schema);
