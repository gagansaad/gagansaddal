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
    advertisement_id:defaultStringConfig,
    plan_validity:{
        plan_id:{type: String,trim:true},
        active_on:{type:String,trim:true},
        expired_on:{type:String,trim:true},
    },
    addons_validity:[{
        
    }],
    website_url:{
        ...defaultStringConfig,
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
            location_name:{
                ...defaultStringConfig,
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                index: '2dsphere',
                default: [0, 0] // Specify a 2dsphere index for geospatial querying
              }
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
            currency: {
                type: String,
                default:"USD"
            },
            vip_ticket_price: {
                type: Number,
                // required: true
            },
            regular_ticket_price:{
            type: Number,
            // required: true
            }
        },
       
        no_of_ticket: {
            no_of_regular_ticket: {
                type: Number,
                // required: true
            },
            no_of_vip_ticket: {
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
    lister_basic_info: {
        organization_name: {
            ...defaultStringConfig,
           
        },
        name: {
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
        hide_my_secondary_phone: defaultBooleanConfig,
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
        

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

}, { timestamps: true });

events_Schema.virtual("favoriteCount", {
    ref: "FavoriteAd",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });
  events_Schema.virtual("isFavorite", {
    ref: "FavoriteAd",
    localField: "_id",
    foreignField: "ad",
    justOne: true,  
    match: function () {
        return { user: this.userId };
      },
  });
  events_Schema.virtual("viewCount", {
    ref: "Post_view",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });
  events_Schema.virtual("ReportCount", {
    ref: "Report",
    localField: "_id",
    foreignField: "adsid",
    count: true,
  });
  events_Schema.virtual("isReported", {
    ref: "Report",
    localField: "_id",
    foreignField: "adsid",
    justOne: true,  
    match: function () {
        return { user: this.userId };
      },
  });

    // Define a virtual property to alias 'expected_salary_amount' as 'price_default'
    events_Schema.virtual('price_default')
    .get(function () {
        return {
          price: this.adsInfo.ticket_price,
        };
      })
      .set(function (value) {
        this.adsInfo.price = value // Corrected from this.adsInfo.price_drop
      });

// Make sure to include 'toJSON' transform to include virtual properties when converting to JSON
events_Schema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('event', events_Schema);

