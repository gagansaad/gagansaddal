const { json } = require("express");

const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("RoomRent"),
  jobsAd = mongoose.model("job"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
    isValidUrl,
    isValidlink,
  } = require(`../../../utils/validators`);

///-----------------------Dynamic Data---------------------------////

////////////////
exports.fetchAlldashboard = async (req, res, next) => {
  try {
    const isFeatured = req.query.isfeatured;
    let dbQuery = {
      status: 1,
    };

    if (isFeatured) dbQuery.isfeatured = isFeatured;
    let event = await eventAd.find(dbQuery);
    let biz = await bizAd.find(dbQuery);
    let babysitter = await babysitterAd.find(dbQuery);
    let roomrent = await roomrentAd.find(dbQuery);
    let jobs = await jobsAd.find(dbQuery);
    let buysell = await buysellAd.find(dbQuery);
    let records = [
      ...event,
      ...biz,
      ...babysitter,
      ...roomrent,
      ...jobs,
      ...buysell,
    ];
    
    const count = records.filter(function (item) {
      if (item.isfeatured === true) {
        return true;
      }
    });
    
    
//     const sum = records.reduce(((parseInt(sum)), item) => {
//         if(item.adsInfo.price && !isNaN(item.adsInfo.price)){
//             console.log(item.adsInfo.price ,"fufheuhdfe",parseInt(sum));
//             return parseInt(sum) + parseInt(item?.adsInfo?.price || 0);
//         }
       
        

//     }, 0);

// console.log(`asdgahfdhgsafdhasfdhgsafdhgfhsgadfhas`,sum,"jhyfgvuydfhvufdhyud");

//  const sum = records.reduce((a, b) => {
//     console.log()
// return(a+b.adsInfo.price)
// }, 1);

// console.log(sum)

    if (records || count) {
      return successJSONResponse(res, {
        message: `success`,
        totalads: Object.keys(records).length,
        isfeatured: Object.keys(count).length,
        // totalrevenue:total,
        records,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `Ads not available` });
    }
  } catch (err) {
    return failureJSONResponse(res, {
      message: `something went wrong`,
      err: err.message,
    });
  }
};
