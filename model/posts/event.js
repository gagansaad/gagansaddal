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
        venue_name :{
            ...defaultStringConfig,
        },
        live_event:{
            live_platform:{
                ...defaultStringConfig,
            },
            platform_link:{
                ...defaultStringConfig,
            }
        },
        date_time:{
            time_zone:{
                ...defaultStringConfig,
                required: true
            },
            start_date:{
                ...defaultStringConfig,
                required: true
            },
            end_date:{
                ...defaultStringConfig,
                required: true
            },
            start_time:{
                ...defaultStringConfig,
                required: true
            },
            end_time:{
                ...defaultStringConfig,
                required: true
            },
           
        },
        recurring_type:{
            ...defaultStringConfig,
            required: true
        },
        ticket_price: {
            type:Number,
            required: true
        },
        image: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: `media`,
        }],
        video:{
            ...defaultStringConfig,
        },
        location:{
            ...defaultStringConfig}
    },
    contactInfo:{
        organization_name:{
            ...defaultStringConfig,
            required: true
        },
        hosted_by:{
            ...defaultStringConfig,
            required: true
        },
        host_Number: {
            host_countryCode: defaultStringConfig,
            host_phoneNumber: defaultStringConfig
        },
        link: {
            ...defaultStringConfig,
            required: true
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
        addressInfo: defaultStringConfig,
        preferableModeContact: {
            type: Number,
            enum: [1,2,3]
        }

    }

}, { timestamps: true });

module.exports = mongoose.model('event',events_Schema);
