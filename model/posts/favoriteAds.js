const mongoose = require("mongoose");

const favoriteAdSchema = new mongoose.Schema({
  user: {
    type:  mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
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
