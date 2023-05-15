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
    ads_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `PostType`,
        required: true
    },
    adsInfo: {
        category: {
            ...defaultStringConfig,
            required: true
        },
        sub_category:{
            ...defaultStringConfig,
            // required: true
        },
        title: {
            ...defaultStringConfig,
            required: true
        },
        descriptions: {
            ...defaultStringConfig,
            required: true
        },
        product_condition: {
            ...defaultStringConfig,
            required: true
        },
        product_model:{
            ...defaultStringConfig,
            // required: true
        },
        user_type: {
            ...defaultStringConfig,
            required: true
        },
        price:{
            amount: {
                type: Number,
                required: true
            },
            currency:{type:String,default:"USD"},
        },
       
        negotiable:{
            type:Boolean,
            default:false
        },
        quantity:{
            type: Number,
            required: true
        },
        payment_mode:[{
            ...defaultStringConfig,
            // required: true
        }],
        fullfilment:[{
            ...defaultStringConfig,
            required: true
        }],
        location:{
            ...defaultStringConfig,
            required: true
        },
        tagline:{
            type:Array,
            // required: true
        },
        video_link:{
            ...defaultStringConfig,
            // required: true
        },
        image: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: `media`,
        }],

    },
    listerBasicInfo: {
        name: defaultStringConfig,
        email_address: defaultStringConfig,
        // website_link: defaultStringConfig,
        primary_mobile_number: {
            country_code: defaultStringConfig,
            primary_phone_number:defaultStringConfig,
  
          },
          secondary_mobile_number: {
            country_code: defaultStringConfig,
            secondary_phone_number:defaultStringConfig,
  
          },
        hide_my_email: defaultBooleanConfig,
        hide_my_phone: defaultBooleanConfig,
        hide_my_secondary_phone: defaultBooleanConfig,
        // preferable_contact_mode: {
        //     type: Number,
        //     enum: [1, 2, 3]
        //     //   1:  Phone Number
        //     //   2:  email Address
        //     //   3:
        // }

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }
}, { timestamps: true });

module.exports = mongoose.model('Buy & Sell', BuySellSchema);
