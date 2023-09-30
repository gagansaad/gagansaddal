const mongoose = require("mongoose");
const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);

const BannerSchema = new mongoose.Schema({
  status: {
    type: Boolean,
    default: false,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `media`,
    required: true,
  },
  caption: {
    type: String,
    required: true,
  },
  target_url: {
    type: String,
    required: true,
  },
  img_type: {
    type: String,
    enum: [`topbanner`, `sidebanner`],
    required: true,
    default: "topbanner",
  },
});

module.exports = mongoose.model("Banner", BannerSchema);
