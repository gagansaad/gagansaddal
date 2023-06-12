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
    const {adId ,ads_type,isfavorite} = req.body;
    let dbQuery={}
    let  userId = req.userId
    if (!adId)
      return failureJSONResponse(res, { message: `Please provide ad id` });
      if (!ads_type)
      return failureJSONResponse(res, { message: `Please provide ads type` });
      if (!isfavorite)
      return failureJSONResponse(res, { message: `Please provide isfavorite` });
    let ModelName= await ModelNameByAdsType(ads_type)
    if(userId)dbQuery.user = userId
    if(adId)dbQuery.ad = adId
    if(isfavorite)dbQuery.isfavorite = isfavorite
    if(ads_type)dbQuery.ads_type = ads_type
    if(ModelName)dbQuery.adType = ModelName
    try {
      let checkAlreadyexist = await FavoriteAd.findOne({user:userId})
      console.log(checkAlreadyexist,"jenfvjdnvjn");
      const favoriteAd = await FavoriteAd.create(dbQuery);
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