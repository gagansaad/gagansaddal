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
        default: "draft"
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
    is_featured: {
        value: {
            type: Boolean,
            required: true,
            default: false
        },
        started_at: {

        },
        end_at: {

        }

    },
    listing_type: {
        ...defaultStringConfig,
        required: true
    },
    adsType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `PostType`,
        required: true
    },
    adsInfo: {
        title: {
            ...defaultStringConfig,
            required: true
        },
        descriptions: {
            ...defaultStringConfig,
            required: true
        },
        categories: {
            ...defaultStringConfig,
            required: true
        },
        type: {
            ...defaultStringConfig,
            required: true
        },
        role: [],
        employment_type: {
            type: Array
            // required: true
        },
        experience: [],
       
        language: {
            type: Array
            // required: true

        },
        salary: {
            amount: { type: Number },
            currency: { type: String, default: "USD" },
        },
        salary_info: {
            ...defaultStringConfig,
            // required: true
        },
        no_of_opening: {
            type: Number,
            // required: true
        },
        // job_website_link: {
        //     ...defaultStringConfig,
        //     // required: true
        // },

        work_authorization: [],

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
        tagline: {
            type: Array,
            // required: true,
        },
        preferred_gender: {
            ...defaultStringConfig,
            // enum: [`Male`,`Female`,`Any Gender`],
            // required: true
        },

        image: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: `media`,
        }],
        // video: {
        //     ...defaultStringConfig,
        // },

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
        preferable_contact_mode: {
            type: Number,
            enum: [1, 2, 3]
            //   1:  Phone Number
            //   2:  email Address
            //   3:
        }

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
 
  roomRentsSchema.virtual("viewCount", {
    ref: "Post_view",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });

    // Define a virtual property to alias 'expected_salary_amount' as 'price_default'
    roomRentsSchema.virtual('price_default')
.get(function () {
  return this.adsInfo.salary;
})
.set(function (value) {
  this.adsInfo.salary = value;
});

// Make sure to include 'toJSON' transform to include virtual properties when converting to JSON
roomRentsSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('job', roomRentsSchema);


