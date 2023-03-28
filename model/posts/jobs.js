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

    status: {
        type: Number,
        enum: [1, 2, 3],
        required: true

        //1 = active
        //2 = inactive
        //3 = draft 
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
        type: {
            ...defaultStringConfig,
            required: true
        },
        role: {
            ...defaultStringConfig,
            required: true
        },
        experince: {
            ...defaultStringConfig,
            required: true
        },
        language: {
            ...defaultStringConfig,
            required: true

        },
        no_of_open_day: {
            type: Number,
            required: true
        },
        website: {
            type: String,
            required: true
        },
        attachedBath: {
            type: Number,
            required: true
        },
        work_authorization: {
            type: Number,
            required: true
        },
        location: {
            type: Boolean,
            required: true
        },
     
        preferredGender: {
            type: Number,
            required: true
        },
     
        location: {
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
        hideAddress: defaultBooleanConfig,

        preferableModeContact: {
            type: Number,
            enum: [1, 2, 3]
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('jobs', roomRentsSchema);