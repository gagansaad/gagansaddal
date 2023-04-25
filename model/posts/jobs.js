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
        type: String,
        enum: [`active`, `inactive`, `draft`],
        required: true,
        default: "draft"
    },
    is_featured: {
        value: {
            type: Boolean,
            required: true,
            default: false
        },
        started_at: {

        },
        end_at: {

        }

    },
    listing_type:{
        ...defaultStringConfig,
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
        employment_type: {
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
        salary_info:{
            ...defaultStringConfig,
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

        location: {
            ...defaultStringConfig,
            required: true,
        },
        preferred_gender: {
            ...defaultStringConfig,
            enum: [`Male`,`Female`,`Any Gender`],
            required: true
        },

        image: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: `media`,
        }],
        video: {
            ...defaultStringConfig,
        },

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
