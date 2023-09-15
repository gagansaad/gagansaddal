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
  User = mongoose.model("user")
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


const Category = mongoose.model("PostType");

exports.createAlert = async (req, res, next) => {
  try {
    const { ads_type, notification_status } = req.body;
    const userId = req.userId;
    // console.log(req.body);
    if (!ads_type && !notification_status) {
      return failureJSONResponse(res, {
        message: "Please provide ads type and notification status",
      });
    }

    const category = await Category.findById(ads_type);

    if (!category) {
      return failureJSONResponse(res, {
        message: "Invalid ads_type Category not found.",
      });
    }

    const adsName = category.name;
    const updateQuery = {};

    switch (adsName) {
      case "Events":
        updateQuery["userNotification.event"] = notification_status;
        break;
      case "Jobs":
        updateQuery["userNotification.job"] = notification_status;
        break;
      case "Rentals":
        updateQuery["userNotification.rental"] = notification_status;
        break;
      case "Local Biz & Services":
        updateQuery["userNotification.localBiz"] = notification_status;
        break;
      case "Buy & Sell":
        updateQuery["userNotification.buysell"] = notification_status;
        break;
      case "Babysitters & Nannies":
        updateQuery["userNotification.careService"] = notification_status;
        break;
      default:
        return failureJSONResponse(res, {
          message: "Invalid adsName. Cannot update notification status.",
        });
    }

    let alert = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateQuery },
      { new: true, upsert: true }
    );

    return successJSONResponse(res, { message: "Success", alert });
  } catch (error) {
    console.error(error);
    return failureJSONResponse(res, { message: "Something went wrong" });
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