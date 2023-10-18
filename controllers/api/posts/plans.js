const mongoose = require("mongoose"),
  AdsPlan = mongoose.model("adsplan"),
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

    const { adsId } = req.body;
// console.log(planObjectId,"gksakdkdkd=dwdefer============================================================----------------------------------------09876567876545678");
    AdsPlan.find({
      ads_type: planObjectId,
    })
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
