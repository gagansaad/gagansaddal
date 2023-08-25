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

        categories: {
            ...defaultStringConfig,
            // required: true
        },
        sub_categories: {
            ...defaultStringConfig,
            // required: true
        },
        title: {
            ...defaultStringConfig,
            // required: true
        },

        tagline: {
            type:Array,
            // required: true
        },
        experience: {
            ...defaultStringConfig,
            // required: true
        },
        working_hours: {
            week_days:{
                is_available: Boolean, is_24_hour: Boolean, open_at: String, close_at: String 
            },
            week_ends:{
                is_available: Boolean, is_24_hour: Boolean, open_at: String, close_at: String 
            },
            appointment:{
                type:Boolean,
                default:false
            },
            is_24_seven:{
                type:Boolean,
                default:false
            }
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
        // business_service:{
        //     ...defaultStringConfig,
        //     // required: true
        // },
        accreditation_file: {
            type:[{
                name: {
                    ...defaultStringConfig,
                },
                url: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: `media`,
                },
    
            }]
        },
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
        video_link: {
            ...defaultStringConfig,
            // required:true,
        }

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
bizAndServices.virtual("favoriteCount", {
    ref: "FavoriteAd",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });
  bizAndServices.virtual("isFavorite", {
    ref: "FavoriteAd",
    localField: "_id",
    foreignField: "ad",
    justOne: true,  
    match: function () {
        return { user: this.userId };
      },
  });
  bizAndServices.virtual("viewCount", {
    ref: "Post_view",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });
module.exports = mongoose.model('Local_biz & Service', bizAndServices);
