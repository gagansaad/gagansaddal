const mongoose = require("mongoose");

const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);
// const defaultPaymentStatus="pending";
const roomRentsSchema = new mongoose.Schema(
  {
    plan_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `adsplan`,
      required: true,
    },

    plan_addons: [{}],
    plan_price: defaultPriceProperty,
    coupan_discount: defaultPriceProperty,
    total_amount: defaultPriceProperty,

    ads: {
      type: mongoose.Schema.Types.ObjectId,
    },
    ads_type: { ...defaultStringConfig },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `user`,
      required: true,
    },
    payment_status: {
      type: String,
      enum: [`pending`, `paid`, `failed`, `confirmed`, `expired`],
      required: true,
      default: "pending",
    },
    device_type: {
      type: String,
      enum: [`mobile`, `web`],
      required: true,
      default: "mobile",
    },
    payment_intent: {},
  },
  { timestamps: true }
);

module.exports = mongoose.model("payment", roomRentsSchema);
