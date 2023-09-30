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
  viewModel = mongoose.model("Post_view"),
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

exports.createFavoriteAd = async (req, res, next) => {
  const { adId, ads_type } = req.body;
  let dbQuery = {};
  let userId = req.userId;
  if (!adId)
    return failureJSONResponse(res, { message: `Please provide ad id` });
  if (!ads_type)
    return failureJSONResponse(res, { message: `Please provide ads type` });
  let { ModelName, Typename } = await ModelNameByAdsType(ads_type);
  if (userId) dbQuery.user = userId;
  if (adId) dbQuery.ad = adId;
  if (ads_type) dbQuery.ads_type = ads_type;
  if (Typename) dbQuery.adType = Typename;
  try {
    let favoriteAd;
    let checkAlreadyexist = await FavoriteAd.findOne({
      $and: [{ user: userId }, { ad: adId }],
    }).exec();
    if (checkAlreadyexist) {
      favoriteAd = await FavoriteAd.findOneAndDelete({
        _id: checkAlreadyexist._id,
      });
      if (favoriteAd) {
        return successJSONResponse(res, {
          message: `success`,
          favoriteAd: false,
        });
      } else {
        return failureJSONResponse(res, { message: `failure` });
      }
    } else {
      favoriteAd = await FavoriteAd.create(dbQuery);
      if (favoriteAd) {
        return successJSONResponse(res, {
          message: `success`,
          favoriteAd: true,
        });
      } else {
        return failureJSONResponse(res, { message: `failure` });
      }
    }
  } catch (error) {
    console.log(error);
    return failureJSONResponse(res, { message: `Something went wrong` });
  }
};

exports.CountFavoriteAd = async (req, res, next) => {
  let userId = req.userId;

  try {
    let adTypes = [
      { key: "job", label: "Jobs" },
      { key: "event", label: "Events" },
      { key: "Buy & Sell", label: "Buy & Sell" },
      { key: "babysitter & nannie", label: "Babysitters & Nannies" },
      { key: "Local_biz & Service", label: "Local Biz & Services" },
      { key: "rental", label: "Rentals" },
    ];
    let results = [];
    for (const adType of adTypes) {
      let checkAlreadyExist = await FavoriteAd.find({
        $and: [{ user: userId }, { adType: adType.key }],
      })
        .populate("ad")
        .exec();
      const currentDate = new Date().toISOString(); // Get the current date in ISO string format
      const filteredAds = checkAlreadyExist.filter((favoriteAd) => {
        if (
          favoriteAd &&
          favoriteAd.ad &&
          favoriteAd.ad.plan_validity &&
          favoriteAd.ad.plan_validity.expired_on
        ) {
          const expiredDate = favoriteAd.ad.plan_validity.expired_on;
          return expiredDate >= currentDate; // Check if expiredDate is greater than or equal to currentDate
        }
        return false; // Ignore this favoriteAd if any property is missing
      });

      const adTypeCount = filteredAds.length;
      if(adTypeCount != 0){
        results.push({ category: adType.label, count: adTypeCount });

      }
    }
    return successJSONResponse(res, { message: `success`, results });
  } catch (error) {
    console.log(error);
    return failureJSONResponse(res, { message: `Something went wrong` });
  }
};
