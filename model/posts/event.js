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
        type: {
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
        details: {
            ...defaultStringConfig,
            required: true
        },
        venue_name: {
            ...defaultStringConfig,
        },
        location: {
            ...defaultStringConfig,
            // required: true
        },
        live_event: [{
            live_platform: {
                ...defaultStringConfig,
            },
            platform_link: {
                ...defaultStringConfig,
            }
        }],
        date_time: {
            time_zone: {
                ...defaultStringConfig,
                required: true
            },
            start_date: {
                ...defaultStringConfig,
                required: true
            },
            end_date: {
                ...defaultStringConfig,
                required: true
            },
            start_time: {
                ...defaultStringConfig,
                required: true
            },
            end_time: {
                ...defaultStringConfig,
                required: true
            },

        },
        recurring_type: {
            ...defaultStringConfig,
            // required: true
        },
        ticket_price: {
            type: Number,
            required: true
        },
        vip_ticket_price: {
            type: Number,
            // required: true
        },
        no_of_ticket: {
            regular_ticket: {
                type: Number,
                // required: true
            },
            vip_ticket: {
                type: Number,
                // required: true
            },

        },
        image: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: `media`,
        }],
        video: {
            ...defaultStringConfig,
        },
       
        tagline: {
            type:Array
        }

    },
    listerBasicInfo: {
        organization_name: {
            ...defaultStringConfig,
           
        },
        hosted_by: {
            ...defaultStringConfig,
           
        },

        // website_link: defaultStringConfig,
        emailAddress: defaultStringConfig,
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

        // mobileNumber: {
        //     countryCode: defaultStringConfig,
        //     phoneNumber: defaultStringConfig
        // },
        // hideAddress: defaultBooleanConfig,
        // addressInfo: defaultStringConfig,
        // preferableModeContact: {
        //     type: Number,
        //     enum: [1, 2, 3]
        // }

    }

}, { timestamps: true });

module.exports = mongoose.model('event', events_Schema);

