const { json } = require("express");

const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("rental"),
  jobsAd = mongoose.model("job"),
  users = mongoose.model("user")
  paymentModel = mongoose.model("payment"),
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
const moment = require('moment');
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

exports.fetchAll = async (req, res, next) => {
  try {
    
    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
 
  
    let event = await eventAd.find();
    let biz = await bizAd.find();
    let babysitter = await babysitterAd.find();
    let roomrent = await roomrentAd.find();
    let jobs = await jobsAd.find();
    let buysell = await buysellAd.find().populate({ path: "viewCount" })
      
      // console.log(records);
     
     
     
    if (records) {
      const jobData = records.map((job) => {
        return {
          ...job._doc,
          // Add other job fields as needed
          view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite, 
        };
      });
      return successJSONResponse(res, {
        message: `success`,
        total: responseModelCount,
        perPage: perPage,
        totalPages: Math.ceil(responseModelCount / perPage),
        currentPage: page,
        records:jobData,
        status: 200, 
      });
    } else {
      return failureJSONResponse(res, { message: `ads not Available` });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
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
    const totalclients =await users.countDocuments();

    let today1 = new Date();
    today1.setHours(0, 0, 0, 0); // Set the time to the start of the day
    
    let tomorrow1 = new Date(today1);
    tomorrow1.setDate(today1.getDate() + 1); // Set the time to the start of the next day
    
    const todayclients = await users.countDocuments({
      createdAt: {
        $gte: today1, // Greater than or equal to the start of today
        $lt: tomorrow1, // Less than the start of tomorrow
      },
    });
    
    // Calculate the total sum
    const totalSum = eventCount + bizCount + babysitterCount + roomrentCount + jobsCount + buysellCount;
    let featuredTotalCount
    let featuredcounts
if(totalSum>0){
  let dbquery ={"addons_validity.name": "Featured"}
  const eventCount = await eventAd.countDocuments(dbquery);
  const bizCount = await bizAd.countDocuments(dbquery);
  const babysitterCount = await babysitterAd.countDocuments(dbquery);
  const roomrentCount = await roomrentAd.countDocuments(dbquery);
  const jobsCount = await jobsAd.countDocuments(dbquery);
  const buysellCount = await buysellAd.countDocuments(dbquery);
  featuredTotalCount= eventCount + bizCount + babysitterCount + roomrentCount + jobsCount + buysellCount;
   featuredcounts = {
    featuredevent:      eventCount,
    featuredbiz:        bizCount,
    featuredbabysitter: babysitterCount,
    featuredroomrent:   roomrentCount,
    featuredjobs:       jobsCount,
    featuredbuysell:    buysellCount,
  };
}
const thisDay = moment().startOf('day');
let todayAdsCount
if(thisDay){
  let dbquery = { createdAt: { $gte: thisDay.toDate() }}
  const eventCount = await eventAd.countDocuments(dbquery);
  const bizCount = await bizAd.countDocuments(dbquery);
  const babysitterCount = await babysitterAd.countDocuments(dbquery);
  const roomrentCount = await roomrentAd.countDocuments(dbquery);
  const jobsCount = await jobsAd.countDocuments(dbquery);
  const buysellCount = await buysellAd.countDocuments(dbquery);
  todayAdsCount= eventCount + bizCount + babysitterCount + roomrentCount + jobsCount + buysellCount;
}
const totalAmountAggregation = await paymentModel.aggregate([
  {
    $group: {
      _id: null,
      totalAmount: { $sum: "$total_amount" }
    }
  }
]);

// Calculate today's date range
const today = moment().startOf('day');
const tomorrow = moment(today).add(1, 'days');

const todayTotalAmountAggregation = await paymentModel.aggregate([
  {
    $match: {
      createdAt: {
        $gte: today.toDate(),
        $lt: tomorrow.toDate()
      }
    }
  },
  {
    $group: {
      _id: null,
      todayTotalAmount: { $sum: "$total_amount" }
    }
  }
]);

let totalAmount = 0;
let todayTotalAmount = 0;

if (totalAmountAggregation.length > 0) {
  totalAmount = totalAmountAggregation[0].totalAmount;
}

if (todayTotalAmountAggregation.length > 0) {
  todayTotalAmount = todayTotalAmountAggregation[0].todayTotalAmount;
}
const counts = {
  event: {
    total: eventCount,
    featured: featuredcounts.featuredevent,
  },
  biz: {
    total: bizCount,
    featured: featuredcounts.featuredbiz,
  },
  babysitter: {
    total: babysitterCount,
    featured: featuredcounts.featuredbabysitter,
  },
  roomrent: {
    total: roomrentCount,
    featured: featuredcounts.featuredroomrent,
  },
  jobs: {
    total: jobsCount,
    featured: featuredcounts.featuredjobs,
  },
  buysell: {
    total: buysellCount,
    featured: featuredcounts.featuredbuysell,
  },
};


    if (totalSum > 0) {
      return successJSONResponse(res, {
        message: 'Success',
        counts,
        totalads: totalSum,
        featuredTotalCount,
        todayAdsCount,
        totalAmount, 
        todayTotalAmount,
        totalclients,
        todayclients,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: 'Ads not available' });
    }
  } catch (err) {
    return failureJSONResponse(res, {
      message: `something went wrong`,
      err: err.message,
    });
  }
};