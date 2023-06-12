const { json } = require("express");

const mongoose = require("mongoose"),
  FavoriteAd = mongoose.model("FavoriteAd"),
  Media = mongoose.model("media"),
  tagline_keywords = mongoose.model("keywords"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
  } = require(`../../../utils/validators`);

////-----------------------Dynamic Data---------------------------////
exports.createFavoriteAd = async (req, res, next) => {
    const { userId, adId } = req.body;
    try {
      const favoriteAd = await FavoriteAd.create({ user: userId, ad: adId });
      res.status(201).json(favoriteAd);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite ad" });
    }
}

