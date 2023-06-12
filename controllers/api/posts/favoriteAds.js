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
    let ModelName= await getModelNameByAdsType(ads_type)
    console.log(userId,"bol bai bandya bol",ModelName);
    let adType = JSON.stringify(ModelName)
    try {
      
      const favoriteAd = await FavoriteAd.create({ user: userId, ad: adId ,adType:adType});
      res.status(201).json(favoriteAd);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to add favorite ad" });
    }
}

const getModelNameByAdsType = async (ads_type) => {

  let findModelName = await category.findById({ "_id": ads_type})

  let ModelName;

  switch (findModelName.name) {
    case "Rentals":
      ModelName = rentals
      break;
    case "Jobs":
      ModelName = jobsAd
      break;
    case "Local Biz & Services":
      ModelName = bizAd
      break;
    case "Events":
      ModelName = eventAd
      break;
    case "Buy & Sell":
      ModelName = buysellAd
      break;
    case "Babysitters & Nannies":
      ModelName = babysitterAd
      break;
    default:
      console.log(`Please provide valid ads id`);
  }
  return ModelName;
}