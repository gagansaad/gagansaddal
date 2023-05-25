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
    plan_validity:{
        plan_id:{type: mongoose.Schema.Types.ObjectId},
        active_on:{type:String,trim:true},
        expired_on:{type:String,trim:true},
    },
    addons_validity:[{
        
    }],
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
            // required: true
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
            // required: true

        },
        accommodates: {
            type: Number,
            // required: true
        },
        attachedBath: {
            type: Number,
            // required: true
        },
        rent: {
           amount:{
            type: Number,
            // required: true,
           },
            negotiable:{
                type: Boolean,
                default:false
            },
            is_contact:{
                type: Boolean,
                default:false
            },
            currency:{type:String,default:"USD"},
        },
        
        isSmokingAllowed: {
            type: Boolean,
            default:false
        },
        // isAlcoholAllowed: {
        //     type: Boolean,
        //     default:false
        // },
        tagline:{
            type:Array
        },
        isPetFriendly: {
            type: Boolean,
            default:false
        },
        // occupation: {
        //     ...defaultStringConfig,
           
        // },
        preferedGender: {
            ...defaultStringConfig,
            // enum: [`Male`,`Female`,`Any Gender`],
            // required: true
        },
        prefered_age:{
            ...defaultStringConfig,
        },
        furnished: {
            ...defaultStringConfig,
            // required: true
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
    lister_basic_info: {
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

module.exports = mongoose.model('rental', roomRentsSchema);
