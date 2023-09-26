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
    const { ads_type,add_name, notification_status } = req.body;
    const userId = req.userId;
    let adsName='';
    // console.log(req.body);
    if (!(ads_type || add_name) && !notification_status) {
      return failureJSONResponse(res, {
        message: "Please provide ads type and notification status",
      });
    }
if(add_name=='' || add_name == undefined || add_name == null){

  const category = await Category.findById(ads_type);

  if (!category) {
    return failureJSONResponse(res, {
      message: "Invalid ads_type Category not found.",
    });
  }

   adsName = category.name;

}else{
   adsName = add_name;
} 
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

    return successJSONResponse(res, { message: "Success", alert:alert.userNotification });
  } catch (error) {
    console.error(error);
    return failureJSONResponse(res, { message: "Something went wrong" });
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    let myid = req.userId;

    let notification = await User.findOne({_id:myid}).select('userNotification')
    // let category = await category.find()
// console.log(notification);
let returnNotification=[
  {
    category:"Buy & Sell",
    value: notification?.userNotification?.buysell || false,
    
  } ,
  {
    category:"Babysitters & Nannies",
    value: notification?.userNotification?.careService || false,
  } ,
  {
    category:"Local Biz & Services",
    value: notification?.userNotification?.localBiz|| false,
  } ,
  {
    category:"Jobs",
    value: notification?.userNotification?.job || false,
  } ,
  {
    category:"Rentals",
    value: notification?.userNotification?.rental || false,
  },
   {
    category:"Events",
    value: notification?.userNotification?.event || false,
  }
]
  
  
 
    // return successJSONResponse(res, { message: "Success", notification:notification.userNotification});
    return successJSONResponse(res, { message: "Success", notification:returnNotification});
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