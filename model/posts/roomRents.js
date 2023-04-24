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
        default: `draft`
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
         
        rental_type: {
            ...defaultStringConfig,
            required: true
        },
         
        category: {
            ...defaultStringConfig,
            required: true
        },
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
        availability:{
           custom_date:{
            ...defaultStringConfig,
           },
           immidiate:{
            type: Boolean,
            default:false
           }
        },
        listerType: {
            ...defaultStringConfig,
            required: true

        },
        accommodates: {
            type: Number,
            required: true
        },
        attachedBath: {
            type: Number,
            required: true
        },
        rent: {
           amount:{
            type: Number,
            required: true,
           },
            negotiable:{
                type: Boolean,
                default:false
            },
        },
        
        isSmokingAllowed: {
            type: Boolean,
            default:false
        },
        isAlcoholAllowed: {
            type: Boolean,
            default:false
        },
        isPetFriendly: {
            type: Boolean,
           default:false
        },
        occupation: {
            ...defaultStringConfig,
           
        },
        preferredGender: {
            ...defaultStringConfig,
            enum: [`Male`,`Female`,`Any gender`],
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
        hideAddress: defaultBooleanConfig,

        preferableModeContact: {
            type: Number,
            enum: [1, 2, 3]
        }

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

}, { timestamps: true });

module.exports = mongoose.model('RoomRent', roomRentsSchema);