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
    ModelNameByAdsType
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
    // console.log(dbQuery);
    try {
      let favoriteAd;
      let checkAlreadyexist = await FavoriteAd.findOne({ $and: [{ user: userId }, { ad: adId }] }).exec();
      if (checkAlreadyexist) {
    
        favoriteAd = await FavoriteAd.findOneAndDelete(
          {_id:checkAlreadyexist._id},
          );
          if (favoriteAd) {
            return successJSONResponse(res, { message: `success`, favoriteAd: false});
          } else {
            return failureJSONResponse(res, { message: `failure` });
          }
      } else {
        favoriteAd = await FavoriteAd.create(dbQuery);
        if (favoriteAd) {
          return successJSONResponse(res, { message: `success`, favoriteAd: true});
        } else {
          return failureJSONResponse(res, { message: `failure` });
        }
      }
      
      
    } catch (error) {
      console.log(error);
      return failureJSONResponse(res, { message: `Something went wrong` });
    }
    
}





exports.CountFavoriteAd = async (req, res, next) => {
  
 
  let  userId = req.userId

  try {
    let adTypes = ["job","event","Buy & Sell","babysitter & nannie","Local_biz & Service","rental"]
    let results = [];
    for (const adType of adTypes) {

    let checkAlreadyExist = await FavoriteAd.find({ $and: [{ user: userId }, { adType : adType  }] }).exec();
    let adTypeCount = checkAlreadyExist.length;
    results.push({ Category:adType, Count: adTypeCount});
    }
          return successJSONResponse(res, { message: `success`, results});
    
  } catch (error) {
    console.log(error);
    return failureJSONResponse(res, { message: `Something went wrong` });
  }
  
}



// if(favoriteAd){
//   await ModelName.findByIdAndUpdate({_id:adId},
//   { $push: { favorite:userId} },
//   { new: true },)
// }



// await ModelName.findByIdAndUpdate({_id:adId},
//   { $pull: { favorite: userId } },
//   { new: true },)