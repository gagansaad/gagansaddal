const { json } = require("express");
const user = require("../accounts/user");

const mongoose = require("mongoose"),
  Alert = mongoose.model("Alert"),
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

exports.createAlert = async (req, res, next) => {
    const {ads_type} = req.body;
    let dbQuery={}
    let  userId = req.userId
    
      if (!ads_type)
      return failureJSONResponse(res, { message: `Please provide ads type` });
      let getAdDetails = await category.findById({ _id: ads_type });
      let adsName = getAdDetails.name;
    if(userId)dbQuery.user = userId
    if(ads_type)dbQuery.ads_type = ads_type
    if(Typename)dbQuery.Typename = adsName
    if(userId)dbQuery.userId = userId

    console.log(dbQuery);
    try {
      let AlertAd;
      let checkAlreadyexist = await Alert.findOne({ $and: [{ user: userId }, { Typename:Typename}] }).exec();
      if (checkAlreadyexist) {
    
        AlertAd = await Alert.findOneAndDelete(
          {_id:checkAlreadyexist._id},
          );
      } else {
        AlertAd = await Alert.create(dbQuery);
       
      }
      if (AlertAd) {
        return successJSONResponse(res, { message: `success`});
      } else {
        return failureJSONResponse(res, { message: `failure` });
      }
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