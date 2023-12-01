const mongoose = require("mongoose");
const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);

const BuySellSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: [`active`, `inactive`, `draft`, `deleted`],
      required: true,
      default: "draft",

      //1 = active
      //2 = inactive
      //3 = draft
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
    price_drop: {
      type: Number,
    },
    isfeatured: {
      type: Boolean,
      required: true,
      default: false,
    },
    adsType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `PostType`,
      required: true,
    },
    adsInfo: {
      category: {
        ...defaultStringConfig,
        required: true,
      },
      sub_category: {
        ...defaultStringConfig,
        // required: true
      },
      title: {
        ...defaultStringConfig,
        required: true,
      },
      descriptions: {
        ...defaultStringConfig,
        required: true,
      },
      product_condition: {
        ...defaultStringConfig,
        required: true,
      },
      product_model: {
        ...defaultStringConfig,
        // required: true
      },
      user_type: {
        ...defaultStringConfig,
        required: true,
      },
      price: {
        amount: {
          type: Number,
          // required: true
        },
        currency: { type: String, default: "USD" },
        negotiable: {
          type: Boolean,
          default: false,
        },
        is_contact: {
          type: Boolean,
          default: false,
        },
      },

      quantity: {
        type: Number,
        // required: true
      },
      payment_mode: [
        {
          ...defaultStringConfig,
          // required: true
        },
      ],
      fullfilment: [
        {
          ...defaultStringConfig,
          required: true,
        },
      ],
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
        // required: true
      },
      video_link: {
        ...defaultStringConfig,
        // required: true
      },
      image: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: `media`,
        },
      ],
    },
    lister_basic_info: {
      name: defaultStringConfig,
      email_address: defaultStringConfig,
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
BuySellSchema.virtual('active_on_virtual').get(function () {
  // Check if active_on_bumpup_at is not null
  if (this.active_on_bumpup_at !== null) {
    return this.active_on_bumpup_at;
  }else if (this.plan_validity && this.plan_validity.active_on) {
    return this.plan_validity.active_on;
  }

  // Default value if neither active_on_bumpup_at nor "Bump up" add-on is present
  return null;
});
BuySellSchema.virtual("favoriteCount", {
  ref: "FavoriteAd",
  localField: "_id",
  foreignField: "ad",
  count: true,
});
BuySellSchema.virtual("isFavorite", {
  ref: "FavoriteAd",
  localField: "_id",
  foreignField: "ad",
  justOne: true,
  match: function () {
    return { user: this.userId };
  },
});
BuySellSchema.virtual("viewCount", {
  ref: "Post_view",
  localField: "_id",
  foreignField: "ad",
  count: true,
});
BuySellSchema.virtual("ReportCount", {
  ref: "Report",
  localField: "_id",
  foreignField: "adsid",
  count: true,
});
BuySellSchema.virtual("isReported", {
  ref: "Report",
  localField: "_id",
  foreignField: "adsid",
  justOne: true,
  match: function () {
    return { user: this.userId };
  },
});

BuySellSchema.virtual("price_default")
  .get(function () {
    return {
      price: this.adsInfo.price,
      priceDrop: this.price_drop,
    };
  })
  .set(function (value) {
    this.adsInfo.price = value.Price;
    this.adsInfo.price_drop = value.priceDrop; // Corrected from this.adsInfo.price_drop
  });

// Make sure to include 'toJSON' transform to include virtual properties when converting to JSON
BuySellSchema.set("toJSON", { virtuals: true });
module.exports = mongoose.model("Buy & Sell", BuySellSchema);
