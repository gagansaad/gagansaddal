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
        title: {
            ...defaultStringConfig,
            required: true
        },
        descriptions: {
            ...defaultStringConfig,
            required: true
        },
        roomType: {
            ...defaultStringConfig,
            required: true
        },
        listerType: {
            ...defaultStringConfig,
            required: true

        },
        accommodates: {
            type: Number,
            required: true
        },
        accommodates: {
            type: String,
            required: true
        },
        attachedBath: {
            type: Number,
            required: true
        },
        rent: {
            type: Number,
            required: true
        },
        isSmokingAllowed: {
            type: Boolean,
            required: true
        },
        isAlcoholAllowed: {
            type: Boolean,
            required: true
        },
        isPetFriendly: {
            type: Boolean,
            required: true
        },
        occupation: {
            ...defaultStringConfig,
            required: true
        },
        preferredGender: {
            type: Number,
           
            required: true
        },
        furnished: {
            ...defaultStringConfig,
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
            enum: [1,2,3]
        }

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

}, { timestamps: true });

module.exports = mongoose.model('RoomRent', roomRentsSchema);