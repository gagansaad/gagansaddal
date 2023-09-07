const { json } = require("express");

const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("rental"),
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
exports.fetchAllFeaturedAds = async (req, res, next) => {
  try {
    const isFeatured = req.query.isfeatured;
    let dbQuery = {
      status: 1,
    };

    if (isFeatured) dbQuery.isfeatured = isFeatured;
    if(!isFeatured) dbQuery.isfeatured =true;
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
    
    if (records) {
      return successJSONResponse(res, {
        message: `success`,
        isfeatured: Object.keys(records).length,
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


exports.fetchAlldashboard = async (req, res, next) => {
  try {

    const eventCount = await eventAd.countDocuments();
    const bizCount = await bizAd.countDocuments();
    const babysitterCount = await babysitterAd.countDocuments();
    const roomrentCount = await roomrentAd.countDocuments();
    const jobsCount = await jobsAd.countDocuments();
    const buysellCount = await buysellAd.countDocuments();

    // Calculate the total sum
    const totalSum = eventCount + bizCount + babysitterCount + roomrentCount + jobsCount + buysellCount;

    // Create an object with model counts
    const counts = {
      event: eventCount,
      biz: bizCount,
      babysitter: babysitterCount,
      roomrent: roomrentCount,
      jobs: jobsCount,
      buysell: buysellCount,
    };

    if (totalSum > 0) {
      return successJSONResponse(res, {
        message: 'Success',
        counts,
        totalads: totalSum,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: 'Ads not available' });
    }
    // let event = await eventAd.find();
    // let biz = await bizAd.find();
    // let babysitter = await babysitterAd.find();
    // let roomrent = await roomrentAd.find();
    // let jobs = await jobsAd.find();
    // let buysell = await buysellAd.find();
    // let records = [
    //   ...event,
    //   ...biz,
    //   ...babysitter,
    //   ...roomrent,
    //   ...jobs,
    //   ...buysell,
    // ];
    
 
    // if (records) {
    //   return successJSONResponse(res, {
    //     message: `success`,
    //     totalads: Object.keys(records).length,
    //     status: 200,
    //   });
    // } else {
    //   return failureJSONResponse(res, { message: `Ads not available` });
    // }
  } catch (err) {
    return failureJSONResponse(res, {
      message: `something went wrong`,
      err: err.message,
    });
  }
};