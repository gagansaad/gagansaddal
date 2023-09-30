const mongoose = require("mongoose");
const {
  defaultStringConfig,
  defaultPriceProperty,
  defaultCurrencyProperty,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);

const addPlanSchema = new mongoose.Schema(
  {
    entity: {
      ...defaultStringConfig,
      default: `adsPlan`,
      required: true,
      immutable: true,
    },

    is_active: {
      ...defaultBooleanConfig,
      required: true,
    },
    visible: {
      ...defaultBooleanConfig,
      required: true,
    },
    name: {
      ...defaultStringConfig,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    ads_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `PostType`,
    },
    featured_price: {
      amount: defaultPriceProperty,
      currency: defaultCurrencyProperty,
    },

    price: {
      amount: defaultPriceProperty,
      currency: defaultCurrencyProperty,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("adsplan", addPlanSchema);
