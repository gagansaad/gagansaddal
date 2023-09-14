const { json } = require("express");
const user = require("../accounts/user");

const mongoose = require("mongoose"),
  ReportAd = mongoose.model("report"),
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

exports.createreport = async (req, res, next) => {
    try {
        const {adsid,ads_type ,message} = req.body;
    let dbQuery={}
    let  userId = req.userId
    if (!adsid)
      return failureJSONResponse(res, { message: `Please provide adsid` }); 
    if (!ads_type)
      return failureJSONResponse(res, { message: `Please provide ads_type` });
      let findAd = await ReportAd.create(dbQuery);
    let {ModelName,Typename}= await ModelNameByAdsType(ads_type)
    console.log(ModelName ,"jcnhdjbcjdcjd",Typename);
    if(userId)dbQuery.userId = userId
    if(adsid)dbQuery.adsid = adsid
    if(Typename)dbQuery.ads_type = Typename
    if(message)dbQuery.message = message
    
    console.log(dbQuery);
      let RepotAd;
      
      RepotAd = await ReportAd.create(dbQuery);
       
      if (favoriteAd) {
        return successJSONResponse(res, { message: `success`, RepotAd: RepotAd });
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