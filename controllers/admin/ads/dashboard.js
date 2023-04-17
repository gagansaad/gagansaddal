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
exports.fetchAll_dashboard = async (req, res, next) => {
  try {
    console.log("object");
    const isFeatured = req.query.isfeatured;
    let dbQuery ={
        status: 1
    };

if(isFeatured) dbQuery.isfeatured = isFeatured;
let ads = {eventAd,bizAd,buysellAd,babysitterAd,roomrentAd,jobsAd}


      let records = await bizAd.find(dbQuery);
      if (records) {
          return successJSONResponse(res, {
              message: `success`,
              total:Object.keys(records).length,
              records,
              status:200,
          })
      } else {
          return failureJSONResponse(res, { message: `Ads not available` })
      }
  } catch (err) {
      return failureJSONResponse(res, { message: `something went wrong` })
  }
}