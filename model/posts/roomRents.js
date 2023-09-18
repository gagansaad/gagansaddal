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
    advertisement_id:defaultStringConfig,
    plan_validity: {
        plan_id: { type: String, trim: true },
        active_on: { type: String, trim: true },
        expired_on: { type: String, trim: true },
    },
    addons_validity: [{

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
    // favorite:[{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: `PostType`,
    // }],
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
            default:``
        },
        availability: {
            custom_date: {
                ...defaultStringConfig,
                default:``
            },
            immidiate: {
                type: Boolean,
                default: false
            }
        },
        listerType: {
            ...defaultStringConfig,
            // required: true
            default:``

        },
        accommodates: {
            type: Number,
            // required: true
            default:null
        },
        attachedBath: {
            type: Number,
            // required: true
            default:null
        },
        rent: {
            amount: {
                type: Number,
                // required: true,
                default:null
            },
            negotiable: {
                type: Boolean,
                default: false
            },
            is_contact: {
                type: Boolean,
                default: false
            },
            currency: { type: String, default: "USD" },
        },
        rent_info: {
            ...defaultStringConfig,
            // required: true
        },
        isSmokingAllowed: {
            type: Boolean,
            default: false
        },
        // isAlcoholAllowed: {
        //     type: Boolean,
        //     default:false
        // },
        tagline: {
            type: Array
        },
        isPetFriendly: {
            type: Boolean,
            default: false
        },
        // occupation: {
        //     ...defaultStringConfig,

        // },
        preferedGender: {
            ...defaultStringConfig,
            // enum: [`Male`,`Female`,`Any Gender`],
            // required: true
            default:``
        },
        prefered_age:[String],
        furnished: {
            ...defaultStringConfig,
            // required: true
            default:``
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
            primary_phone_number: defaultStringConfig,

        },
        secondary_mobile_number: {
            country_code: defaultStringConfig,
            secondary_phone_number: defaultStringConfig,

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

roomRentsSchema.virtual("favoriteCount", {
    ref: "FavoriteAd",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });
  roomRentsSchema.virtual("viewCount", {
    ref: "Post_view",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });
  roomRentsSchema.virtual("isFavorite", {
    ref: "FavoriteAd",
    localField: "_id",
    foreignField: "ad",
    justOne: true,  
    match: function () {
        return { user: this.userId };
      },
  });
  roomRentsSchema.virtual("ReportCount", {
    ref: "Report",
    localField: "_id",
    foreignField: "adsid",
    count: true,
  });
  roomRentsSchema.virtual("isReported", {
    ref: "Report",
    localField: "_id",
    foreignField: "adsid",
    justOne: true,  
    match: function () {
        return { user: this.userId };
      },
  });
  roomRentsSchema.virtual("userNotificationRentals", {
    ref: "user",
    foreignField: "_id",
    justOne: true,
    populate: {
      path: "userNotification.rental",
      select: "rental",
    },
  });
 

module.exports = mongoose.model('rental', roomRentsSchema);

