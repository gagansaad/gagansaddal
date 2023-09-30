const mongoose = require("mongoose");
const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);

const favoriteAdSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "adType",
    required: true,
  },
  ads_type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PostType",
    required: true,
  },
  adType: {
    type: String,
    required: true,
    enum: [
      "babysitter & nannie",
      "Local_biz & Service",
      "Buy & Sell",
      "event",
      "job",
      "rental",
    ],
  },
});

// favoriteAdSchema.virtual("favoritesCount", {
//   ref: "FavoriteAd",
//   localField: "ad",
//   foreignField: "ad",
//   count: true,
// });
const FavoriteAd = mongoose.model("FavoriteAd", favoriteAdSchema);

module.exports = FavoriteAd;
