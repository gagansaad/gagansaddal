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
  tagline_keywords = mongoose.model("keywords")

exports.successJSONResponseWithPagination = async (res, responseModel, OnPage, perPage = 10, dbquery, message = `Record found successfully`, data, httpStatusCode = 200) => {
    console.log(responseModel)
    if (res) {
        let responseModelWithLimit;
        if(dbquery){
            responseModelWithLimit = await responseModel.find(dbquery).populate({ path: 'adsInfo.image', strictPopulate: false, select: 'url' }).sort({ createdAt: -1 }).skip((perPage * OnPage) - perPage).limit(perPage)
        }else{
            responseModelWithLimit = await responseModel.find().populate({ path: 'adsInfo.image', strictPopulate: false, select: 'url' }).sort({ createdAt: -1 }).skip((perPage * OnPage) - perPage).limit(perPage)
        }
        console.log(responseModelWithLimit);
        const responseModelCount = await responseModel.count();
        const mainData = {
            message: message,
            perPage: perPage,
            totalPages: Math.ceil(responseModelCount / perPage),
            currentPage: OnPage,
            data: responseModelWithLimit
        }
        return res.status(httpStatusCode).json({
            status: httpStatusCode,
            ...mainData, ...data
        });
    }
}


exports.successJSONResponse = (res = null, data = null, httpStatusCode = 200) => {

    if (res) {
        // let httpStatusCodeToUse = 200;
        if (httpStatusCode && Number(httpStatusCode))
            httpStatusCodeToUse = Number(httpStatusCode);

        return res.status(httpStatusCodeToUse).json({
            status: httpStatusCodeToUse,
            ...data
        });
    }
}
exports.ModelNameByAdsType = async (ads_type) => {

    let findModelName = await category.findById({ "_id": ads_type})
    let ModelName;
  let Typename;
    switch (findModelName.name) {
      case "Rentals":
        Typename = "rental"
        ModelName = roomrentAd
        break;
      case "Jobs":
        Typename = "job"
        ModelName = jobsAd
        break;
      case "Local Biz & Service":
        Typename = "Local_biz & Service"
        ModelName = bizAd
        break;
      case "Events":
        Typename = "event"
        ModelName = eventAd
        break;
      case "Buy & Sell":
        Typename = "Buy & Sell"
        ModelName = buysellAd
        break;
      case "Babysitters & Nannies":
        Typename = "babysitter & nannie"
        ModelName = babysitterAd
        break;
      default:
        console.log(`Please provide valid ads id`);
    }
    return {ModelName,Typename};
  }
exports.failureJSONResponse = (res = null, data = null, httpStatusCode = 400) => {
    if (res) {
        let httpStatusCodeToUse = 400;
        if (httpStatusCode && Number(httpStatusCode))
            httpStatusCodeToUse = Number(httpStatusCode);

        return res.status(httpStatusCodeToUse).json({
            status: httpStatusCodeToUse,
            ...data
        });
    }
}

exports.failureJSONResponse = (res = null, message = `Error occured on server`, errorCode = null, data = null, httpStatusCode = 500) => {

    const objToSend = {
        status: `error`,
        message
    };

    if (errorCode) objToSend.code = errorCode;
    if (data) objToSend.data = data;

    return res.status(Number(httpStatusCode)).json(objToSend);
}