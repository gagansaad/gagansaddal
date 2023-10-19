const mongoose = require("mongoose"),
  AdsPlan = mongoose.model("plan"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`);

exports.fetchPlanForAds = async (req, res, next) => {
  try {
    let planObjectId = "";

    if (req?.query?.ads_type) {
      planObjectId = req?.query?.ads_type;
    } else if (req?.body?.ads_type) {
      planObjectId = req?.body?.ads_type;
    }

    const { ads_type } = req.body;
    let {Typename} = await ModelNameByAdsType(planObjectId)
    let YourModel = mongoose.model(Typename);
    let previousdata
    if(postid){
      previousdata = await YourModel.findById(postid)
    
    }
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
