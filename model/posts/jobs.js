const mongoose = require("mongoose"),
      Users = mongoose.model("user");
const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);

const roomRentsSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [`active`, `inactive`, `draft`, `deleted`],
      required: true,
      default: "draft",
    },
    advertisement_id: defaultStringConfig,
    plan_validity: {
      plan_id: { type: String, trim: true },
      active_on: { type: String, trim: true },
      expired_on: { type: String, trim: true },
    },
    addons_validity: [{}],
    website_url: {
      ...defaultStringConfig,
    },
    isfeatured: {
      type: Boolean,
      required: true,
      default: false,
    },
    listing_type: {
      ...defaultStringConfig,
      required: true,
    },
    adsType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `PostType`,
      required: true,
    },
    adsInfo: {
      title: {
        ...defaultStringConfig,
        required: true,
      },
      descriptions: {
        ...defaultStringConfig,
        required: true,
      },
      categories: {
        ...defaultStringConfig,
        required: true,
      },
      type: {
        ...defaultStringConfig,
        required: true,
      },
      role: {
        type: Array,
    },
      employment_type: {
        type: Array,
        // required: true
      },
      experience: [],

      language: {
        type: Array,
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
        location_name: {
          ...defaultStringConfig,
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: "2dsphere",
          default: [0, 0], // Specify a 2dsphere index for geospatial querying
        },
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

      image: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: `media`,
        },
      ],
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
        enum: [1, 2, 3],
        //   1:  Phone Number
        //   2:  email Address
        //   3:
      },
    },
    location_timezone:{type:String},
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    deletedAt:{
      type :String,
      default:null
      
        },
        active_on_bumpup_at:{
          type:String,
          default:null,
        },
  },
  { timestamps: true }
);
// roomRentsSchema.virtual('userDeta', {
//   ref: 'user',
//   localField: 'userId',
//   foreignField: '_id',
//   justOne: true,
//   get: async function () {
//     try {
//       // Use await to wait for the result of the query
//       const user = await mongoose.model('user').findById(this.userId);
//       console.log(user);
//       if (!user) {
//         console.log("User not found");
//         return null;
//       }
//       console.log(user.userInfo.name);
//       return {
//         userId:"._id",
//         name: ".userInfo.name",
//         // Add other user fields as needed
//       };
//     } catch (error) {
//       console.error("Error fetching user:", error);
//       return null;
//     }
//   },
// });
roomRentsSchema.virtual('active_on_virtual').get(function () {
  // Check if bumpupAt is not null
  if (this.active_on_bumpup_at !== null && this.active_on_bumpup_at >= this.plan_validity.active_on) {
    return this.active_on_bumpup_at;
  }
  if (this.active_on_bumpup_at == null) {
    return this.plan_validity.active_on;
  }
  if (this.active_on_bumpup_at < this.plan_validity.active_on) {
    return this.plan_validity.active_on;
  }
  // Check if addons_validity is not empty
  if (this.plan_validity && this.plan_validity.active_on) {
    return this.plan_validity.active_on;
  }

  // Default value if neither bumpupAt nor "Bump up" add-on is present
  return null;
});
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
roomRentsSchema
  .virtual("price_default")
  .get(function () {
    return {
      price: this.adsInfo.salary,
      price_info: this.adsInfo.salary_info,
    };
  })
  .set(function (value) {
    this.adsInfo.price = value.price;
    this.adsInfo.price_info = value.price_info; // Corrected from this.adsInfo.price_drop
  });
  roomRentsSchema.virtual('expiredAt').get(function () {
    const dateString =  this.plan_validity.expired_on;

    // Split the date string to get the year, month, day, etc.
    const [year, month, day] = dateString.split("T")[0].split("-");
    
    // Create a Date object
    const originalDate = new Date(year, month - 1, day); // Note: Month is zero-based
    
    // Add one day to the original date
    originalDate.setDate(originalDate.getDate()+1);
    
    // Get today's date
    const today = new Date();
    today.setDate(today.getDate()+1);
    today.setHours(0, 0, 0, 0); // Set hours, minutes, seconds, and milliseconds to zero for accurate comparison
    originalDate.setHours(0, 0, 0, 0)
    // Check if the next day is equal to today's date
    console.log(dateString,originalDate,today);
    if (originalDate > today) {
      return null;
     
    } else {
      return dateString;
    }
  
    
  });
// Make sure to include 'toJSON' transform to include virtual properties when converting to JSON
roomRentsSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("job", roomRentsSchema);
