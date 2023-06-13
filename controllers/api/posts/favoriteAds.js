const { json } = require("express");
const user = require("../accounts/user");

const mongoose = require("mongoose"),
  FavoriteAd = mongoose.model("FavoriteAd"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("rental"),
  jobsAd = mongoose.model("job"),
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
    let dbQuery={}
    let  userId = req.userId
    if (!adId)
      return failureJSONResponse(res, { message: `Please provide ad id` });
      if (!ads_type)
      return failureJSONResponse(res, { message: `Please provide ads type` });
    let {ModelName,Typename}= await ModelNameByAdsType(ads_type)
    console.log(ModelName ,"jcnhdjbcjdcjd",Typename);
    if(userId)dbQuery.user = userId
    if(adId)dbQuery.ad = adId
    if(ads_type)dbQuery.ads_type = ads_type
    if(Typename)dbQuery.adType = Typename
    try {
      let favoriteAd;
      let checkAlreadyexist = await FavoriteAd.findOne({ user: userId, ad: adId }).exec();
      if (checkAlreadyexist) {
        await ModelName.findByIdAndUpdate({_id:adId},
          { $pull: { favorite: userId } },
          { new: true },)
        favoriteAd = await FavoriteAd.findOneAndDelete(
          {_id:checkAlreadyexist._id},
          );
      } else {
        favoriteAd = await FavoriteAd.create(dbQuery);
        if(favoriteAd){
          await ModelName.findByIdAndUpdate({_id:adId},
          { $push: { favorite:userId} },
          { new: true },)
        }
      }
      
      if (favoriteAd) {
        return successJSONResponse(res, { message: `success`, favoriteAd: favoriteAd });
      } else {
        return failureJSONResponse(res, { message: `failure` });
      }
    } catch (error) {
      console.log(error);
      return failureJSONResponse(res, { message: `Something went wrong` });
    }
    
}

const ModelNameByAdsType = async (ads_type) => {

  let findModelName = await category.findById({ "_id": ads_type})

  let ModelName;
let Typename;
  switch (findModelName.name) {
    case "Rentals":
      Typename = "rental"
      ModelName = roomrentAd
      break;
    case "Jobs":
      Typename = "Job"
      ModelName = jobsAd
      break;
    case "Local Biz & Service":
      Typename = "Local_biz & Service"
      ModelName = bizAd
      break;
    case "Events":
      Typename = "event"
      ModelName = eventAd
      break;
    case "Buy & Sell":
      Typename = "Buy & Sell"
      ModelName = buysellAd
      break;
    case "Babysitters & Nannies":
      Typename = "babysitter & nannie"
      ModelName = babysitterAd
      break;
    default:
      console.log(`Please provide valid ads id`);
  }
  return ModelName,Typename;
}