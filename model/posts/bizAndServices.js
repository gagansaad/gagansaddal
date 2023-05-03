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
       
        categories: {
            ...defaultStringConfig,
            // required: true
        },
        sub_categories: {
            ...defaultStringConfig,
            // required: true
        },
        business_name: {
            ...defaultStringConfig,
            // required: true
        },

        tagline: {
            ...defaultStringConfig,
            // required: true
        },
        experience:{
            ...defaultStringConfig,
            // required: true
        },
        working_hours:{
            type: [{is_status:Boolean,is_24_hour:Boolean,day_name: String, open_at: String, close_at: String}],
        },
        business_location: {
            ...defaultStringConfig,
            // required: true
        },
        // business_service:{
        //     ...defaultStringConfig,
        //     // required: true
        // },
        accreditation_file: [{
            accreditation_name:{
                ...defaultStringConfig,
            },
            accreditation_files:{
                type: mongoose.Schema.Types.ObjectId,
                ref: `media`,
            },
            
        }],
        // price: {
        //     type: Number,
        //     // required: true
        // },
        descriptions: {
            ...defaultStringConfig,
            // required: true
        },
        // Additional_info: {
        //     ...defaultStringConfig,
        //     // required: true
        // },
        image: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: `media`,
        }],
        video_link:{
            ...defaultStringConfig,
            // required:true,
        }

    },
    lister_basic_info: {
        name: defaultStringConfig,
        email_address: defaultStringConfig,
        website_link:defaultStringConfig,
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
        preferable_contact_mode: {
            type: Number,
            enum: [1, 2, 3]
            //   1:  Phone Number
            //   2:  email Address
            //   3:
        }

    },

}, { timestamps: true });

module.exports = mongoose.model('Local_biz & Service', bizAndServices);
