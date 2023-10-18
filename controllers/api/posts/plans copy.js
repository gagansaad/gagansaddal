const mongoose = require("mongoose"),
  AdsPlan = mongoose.model("plan"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType,
  } = require(`../../../handlers/jsonResponseHandlers`);

exports.fetchPlanForAds = async (req, res, next) => {
  try {
    let planObjectId = "";
    let postid =''
    if (req?.query?.adsId) {
      planObjectId = req?.query?.adsId;
      postid = req?.query?.post_id;

    } else if (req?.body?.adsId) {
      planObjectId = req?.body?.adsId;
      postid = req?.body?.post_id;
    }
console.log(planObjectId,"==============--------------o0lkmn ");
let Typename = await ModelNameByAdsType(planObjectId)
let YourModel = mongoose.model(Typename);
let previousdata = await YourModel.findById(postid)
console.log(previousdata);
    AdsPlan.find({
      ads_type: planObjectId,
    })
      .populate("add_ons")
      .then((result) => {
        if (!result) {
          return failureJSONResponse(res, { message: `something went wrong` });
        }
        return successJSONResponse(res, { data: result });
      })
      .catch((err) => {
        return failureJSONResponse(res, { message: `something went wrong` });
      });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
