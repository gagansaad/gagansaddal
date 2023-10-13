const mongoose = require("mongoose");
const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);

const viewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adType",
  },
  ads_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "adType",
  },
  adType: {
    type: String,
    enum: [
      "babysitter & nannie",
      "Local_biz & Service",
      "Buy & Sell",
      "event",
      "job",
      "rental",
    ],
  },
}, { timestamps: true });

// favoriteAdSchema.virtual("favoritesCount", {
//   ref: "FavoriteAd",
//   localField: "ad",
//   foreignField: "ad",
//   count: true,
// });
const views = mongoose.model("Post_view", viewSchema);

module.exports = views;
