const mongoose = require("mongoose");

const favoriteAdSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "DynamicModel", // Default value for the ref
  },
});

// Setter function for the 'ad' field
favoriteAdSchema.path("ad").set(function(adId) {
  const adType = this.adType; // Assuming you have a field 'adType' that determines the ad type dynamically
  const model = getModelByAdType(adType); // Implement this function to return the appropriate model based on adType
  this.$__.schema.path("ad").options.ref = model; // Set the ref dynamically based on the adType
  return adId;
});

// Function to get the appropriate model based on adType
function getModelByAdType(adType) {
  // Implement your logic here to return the corresponding model name based on the adType
  // For example:
  if (adType === "babysitter & nannie") {
    return "BabysitterNanny";
  } else if (adType === "Local_biz & Service") {
    return "Local_biz & Service";
  }else if (adType === "Buy & Sell") {
    return "Buy & Sell";
  }else if (adType === "event") {
    return "event";
  }else if (adType === "job") {
    return "job";
  }else if (adType === "rental") {
    return "rental";
  }
  // Return the default model name if no matching adType is found
  return "DynamicModel";
}

const FavoriteAd = mongoose.model("FavoriteAd", favoriteAdSchema);

module.exports = FavoriteAd;
