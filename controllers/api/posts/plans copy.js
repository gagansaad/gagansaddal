const mongoose = require("mongoose"),
  AdsPlan = mongoose.model("plan"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`);

exports.fetchPlanForAds = async (req, res, next) => {
  try {
    let planObjectId = "";

    if (req?.query?.adsId) {
      planObjectId = req?.query?.adsId;
    } else if (req?.body?.adsId) {
      planObjectId = req?.body?.adsId;
    }
console.log(planObjectId,"==============--------------o0lkmn ");
    const { adsId } = req.body;

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
