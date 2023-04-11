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
        title: {
            ...defaultStringConfig,
            required: true
        },
        descriptions: {
            ...defaultStringConfig,
            required: true
        },
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
        experience: {
            type: Number,
            required: true
        },
        language: {
            ...defaultStringConfig,
            required: true

        },
        salary: {
            type: Number,
            required: true
        },
        no_of_opening: {
            type: Number,
            required: true
        },
        website: {
            ...defaultStringConfig,
            required: true
        },

        work_authorization: {
            ...defaultStringConfig,
            required: true
        },
       
        location:{
            ...defaultStringConfig,
            required:true,
        },
        preferred_gender: {
            type: Number,
            enum: [1, 2, 3],
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

module.exports = mongoose.model('job', roomRentsSchema);
