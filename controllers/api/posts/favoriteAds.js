const { json } = require("express");
const user = require("../accounts/user");

const mongoose = require("mongoose"),
  FavoriteAd = mongoose.model("FavoriteAd"),
  category = mongoose.model("PostType"),
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
    const {adId ,ads_type} = req.body;
    let  userId = req.userId
    let ModelName= await ModelNameByAdsType(ads_type)
    console.log(userId,"bol bai bandya bol",ModelName);
    let adType = ModelName
    try {
      
      const favoriteAd = await FavoriteAd.create({ user: userId, ad: adId ,adType:adType});
      res.status(201).json(favoriteAd);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add favorite ad" });
    }
}

const ModelNameByAdsType = async (ads_type) => {

  let findModelName = await category.findById({ "_id": ads_type})

  let ModelName;

  switch (findModelName.name) {
    case "Rentals":
      ModelName = "rental"
      break;
    case "Jobs":
      ModelName = "Job"
      break;
    case "Local Biz & Service":
      ModelName = "Local_biz & Service"
      break;
    case "Events":
      ModelName = "event"
      break;
    case "Buy & Sell":
      ModelName = "Buy & Sell"
      break;
    case "Babysitters & Nannies":
      ModelName = "babysitter & nannie"
      break;
    default:
      console.log(`Please provide valid ads id`);
  }
  return ModelName;
}