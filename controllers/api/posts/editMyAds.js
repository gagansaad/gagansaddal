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
    ModelNameByAdsType,
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

exports.setStatus = async (req, res, next) => {
  try {
    const { adId, ads_type } = req.body;
    let dbQuery = {};
    let userId = req.userId;
    if (!adId) {
      return failureJSONResponse(res, { message: `Please provide ad id` });
    }
    if (!ads_type) {
      return failureJSONResponse(res, { message: `Please provide ads type` });
    }
    let findModelName = await category.findById({ _id: ads_type });
    if (findModelName) {
      let { ModelName, Typename } = await ModelNameByAdsType(ads_type);

      let checkAlreadyexist = await ModelName.findOne({
        $and: [{ userId: userId }, { _id: adId }],
      }).exec();
    } else {
      return failureJSONResponse(res, {
        message: `Please provide valid ads_type id`,
      });
    }
  } catch (error) {
    console.log(error);
    return failureJSONResponse(res, { message: `Something went wrong` });
  }
};

// if(favoriteAd){
//   await ModelName.findByIdAndUpdate({_id:adId},
//   { $push: { favorite:userId} },
//   { new: true },)
// }

// await ModelName.findByIdAndUpdate({_id:adId},
//   { $pull: { favorite: userId } },
//   { new: true },)
