const mongoose = require("mongoose");

const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);

const reportSchema = new mongoose.Schema(
  {
    adsid: {
      type: String,
      // required: true
    },
    adstype: {
      type: String,
      // required: true
    },

    message: {
      type: String,
      // required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
