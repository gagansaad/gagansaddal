const mongoose = require("mongoose");
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const babysitter_Schema = new mongoose.Schema({

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
    ads_info: {
        type: {
            type_value:{
                type:Number,
                required: true
            },
           type_name:{
            ...defaultStringConfig,
            required: true
           }
           
        },
        work_type:{
            ...defaultStringConfig,
            required: true
        },
        care_service: [{
            ...defaultStringConfig,
            required: true
        }],
        age_group: [{
            ...defaultStringConfig,
            required: true
        }],
        prefered_language:[{
            ...defaultStringConfig,
            required: true
        }],
        prefered_gender:{
            ...defaultStringConfig,
            required: true
        },
        service_from_date:{
            ...defaultStringConfig,
            required: true
        },
        transport_facilty:{
            type: Boolean,
            required: true,
            default: false
        },
        description:{
            ...defaultStringConfig,
            required: true
        },
        location:{
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
        mobile_number: {
            country_code: defaultStringConfig,
            phone_number: defaultStringConfig
        },
        hide_address: defaultBooleanConfig,
        address_info: defaultStringConfig,
        preferable_contact_mode: {
            type: Number,
            enum: [1, 2, 3]
            //   1:  Phone Number
            //   2:  email Address
            //   3:
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('babysitter & nannie', babysitter_Schema);
