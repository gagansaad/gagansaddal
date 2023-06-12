const mongoose = require("mongoose");
const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig
} = require(`../../utils/mongoose`);

const favoriteAdSchema = new mongoose.Schema({
  user: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isfavorite:{
    ...defaultBooleanConfig,
  },

  ad: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "adType",
    required: true,
  },
  adType: {
    type: String,
    required: true,
    enum: ["babysitter & nannie", "Local_biz & Service", "Buy & Sell","event","job","rental"],
  },
});

const FavoriteAd = mongoose.model("FavoriteAd", favoriteAdSchema);

module.exports = FavoriteAd;
