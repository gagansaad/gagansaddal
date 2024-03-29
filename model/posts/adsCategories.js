const mongoose = require("mongoose");

const { defaultStringConfig } = require(`../../utils/mongoose`);

const roomRentsSchema = new mongoose.Schema(
  {
    entity: {
      ...defaultStringConfig,
      default: `adsCategories`,
      required: true,
      immutable: true,
    },
    status: {
      type: String,
      enum: [`active`, `inactive`],
      required: true,
      default: "active",
    },
    name: {
      ...defaultStringConfig,
      required: true,
    },
    sub_categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: `adsSubCategory`,
    }],
    ads_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `PostType`,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("adsCategory", roomRentsSchema);
