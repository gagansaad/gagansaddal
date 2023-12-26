const { json } = require("express");

const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("rental"),
  jobsAd = mongoose.model("job"),
  users = mongoose.model("user"),
  paymentModel = mongoose.model("payment"),
  posttype = mongoose.model("PostType"),
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
const moment = require("moment");
const paymentEvent = require("../../../model/posts/paymentEvent");
///-----------------------Dynamic Data---------------------------////

////////////////
exports.fetchAllFeaturedAds = async (req, res, next) => {
  try {
    const isFeatured = req.query.isfeatured;
    let dbQuery = {
      status: 1,
    };

    if (isFeatured) dbQuery.isfeatured = isFeatured;
    if (!isFeatured) dbQuery.isfeatured = true;
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
    let buysell = await buysellAd.find().populate({ path: "viewCount" });

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
        records: jobData,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `ads not Available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.fetchAlldashboard = async (req, res, next) => {
  try {
    let post_type = await posttype.find();
    let totalAmountSums = []; // Initialize an array to store the sums

    for (const ids of post_type) {
      let reve = await paymentModel.find({$and:[{ads_type: ids._id },{payment_status:"confirmed"}] });

      let totalAmountSum = 0;
      for (const payment of reve) {
        totalAmountSum += payment.total_amount;
      }

      // Push the sum into the array along with the corresponding ads_type
      totalAmountSums.push({ totalrevenue: totalAmountSum });
    }

    let totalAmount = 0;
    let todayTotalAmount = 0;
    const eventCount = await eventAd.countDocuments();
    const bizCount = await bizAd.countDocuments();
    const babysitterCount = await babysitterAd.countDocuments();
    const roomrentCount = await roomrentAd.countDocuments();
    const jobsCount = await jobsAd.countDocuments();
    const buysellCount = await buysellAd.countDocuments();

    // Calculate the total sum
    const totalSum =
      eventCount +
      bizCount +
      babysitterCount +
      roomrentCount +
      jobsCount +
      buysellCount;
    let featuredTotalCount;
    let featuredcounts;
    const totalclients = await users.countDocuments();

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

    if (totalSum > 0) {
      let dbquery = { "addons_validity.name": "Featured" };
      const eventCount = await eventAd.countDocuments(dbquery);
      const bizCount = await bizAd.countDocuments(dbquery);
      const babysitterCount = await babysitterAd.countDocuments(dbquery);
      const roomrentCount = await roomrentAd.countDocuments(dbquery);
      const jobsCount = await jobsAd.countDocuments(dbquery);
      const buysellCount = await buysellAd.countDocuments(dbquery);
      featuredTotalCount =
        eventCount +
        bizCount +
        babysitterCount +
        roomrentCount +
        jobsCount +
        buysellCount;
      featuredcounts = {
        featuredevent: eventCount,
        featuredbiz: bizCount,
        featuredbabysitter: babysitterCount,
        featuredroomrent: roomrentCount,
        featuredjobs: jobsCount,
        featuredbuysell: buysellCount,
      };
    }
    const thisDay = moment().startOf("day");
    let todayAdsCount;
    if (thisDay) {
      let dbquery = { createdAt: { $gte: thisDay.toDate() } };
      const eventCount = await eventAd.countDocuments(dbquery);
      const bizCount = await bizAd.countDocuments(dbquery);
      const babysitterCount = await babysitterAd.countDocuments(dbquery);
      const roomrentCount = await roomrentAd.countDocuments(dbquery);
      const jobsCount = await jobsAd.countDocuments(dbquery);
      const buysellCount = await buysellAd.countDocuments(dbquery);
      todayAdsCount =
        eventCount +
        bizCount +
        babysitterCount +
        roomrentCount +
        jobsCount +
        buysellCount;
    }
    const totalAmountAggregation = await paymentModel.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$total_amount" },
        },
      },
    ]);

    // Calculate today's date range
    const today = moment().startOf("day");
    const tomorrow = moment(today).add(1, "days");

    const todayTotalAmountAggregation = await paymentModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: today.toDate(),
            $lt: tomorrow.toDate(),
          },
        },
      },
      {
        $group: {
          _id: null,
          todayTotalAmount: { $sum: "$total_amount" },
        },
      },
    ]);

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
        totalrevenue: totalAmountSums[0].totalrevenue,
      },
      biz: {
        total: bizCount,
        featured: featuredcounts.featuredbiz,
        totalrevenue: totalAmountSums[1].totalrevenue,
      },
      babysitter: {
        total: babysitterCount,
        featured: featuredcounts.featuredbabysitter,
        totalrevenue: totalAmountSums[2].totalrevenue,
      },
      roomrent: {
        total: roomrentCount,
        featured: featuredcounts.featuredroomrent,
        totalrevenue: totalAmountSums[3].totalrevenue,
      },
      jobs: {
        total: jobsCount,
        featured: featuredcounts.featuredjobs,
        totalrevenue: totalAmountSums[4].totalrevenue,
      },
      buysell: {
        total: buysellCount,
        featured: featuredcounts.featuredbuysell,
        totalrevenue: totalAmountSums[5].totalrevenue,
      },
    };

    if (totalSum > 0) {
      return successJSONResponse(res, {
        message: "Success",
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
      return failureJSONResponse(res, { message: "Ads not available" });
    }
  } catch (err) {
    return failureJSONResponse(res, {
      message: `something went wrong`,
      err: err.message,
    });
  }
};

exports.fetchGraph = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const data = []; // Array to store monthly counts
    const data1 = []; // Array to store monthly counts
    const revenueData = []; // Array to store monthly revenue
    const adTypes = [
      "event",
      "biz",
      "babysitter",
      "roomrent",
      "jobs",
      "buysell",
    ];

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(currentYear, month, 1);
      const endDate = new Date(currentYear, month + 1, 0);

      const adCounts = {};
      const adfCounts = {};

      // Create an array of promises for each ad type
      const promises = adTypes.map(async (adType) => {
        const AdModel = getModelByType(adType); // Replace with a function to get the correct model
        adCounts[adType] = await AdModel.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        });

        adfCounts[adType] = await AdModel.countDocuments({
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
          "addons_validity.name": "Featured",
        });
      });

      // Wait for all promises to resolve
      await Promise.all(promises);

      // Calculate the total counts for the month
      const monthlyTotal = adTypes.reduce(
        (total, adType) => total + adCounts[adType],
        0
      );
      const monthlyfTotal = adTypes.reduce(
        (total, adType) => total + adfCounts[adType],
        0
      );

      data.push(monthlyTotal);
      data1.push(monthlyfTotal);

      // Calculate revenue for the month
      const monthlyRevenue = await calculateMonthlyRevenue(startDate, endDate);
      revenueData.push(monthlyRevenue);
    }

    if (data.length > 0) {
      return successJSONResponse(res, {
        message: "Success",
        data,
        data1,
        revenueData, // Include revenue data in the response
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: "Ads not available" });
    }
  } catch (err) {
    return failureJSONResponse(res, {
      message: "Something went wrong",
      err: err.message,
    });
  }
};

const calculateMonthlyRevenue = async (startDate, endDate) => {
  const todayTotalAmountAggregation = await paymentModel.aggregate([
    {
      $match: {
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        revenue: { $sum: "$total_amount" },
      },
    },
  ]);

  if (todayTotalAmountAggregation.length > 0) {
    return todayTotalAmountAggregation[0].revenue;
  } else {
    return 0; // No revenue for the given month
  }
};

function getModelByType(adType) {
  switch (adType) {
    case "event":
      return eventAd;
    case "biz":
      return bizAd;
    case "babysitter":
      return babysitterAd;
    case "roomrent":
      return roomrentAd;
    case "jobs":
      return jobsAd;
    case "buysell":
      return buysellAd;
    default:
      throw new Error(`Unsupported ad type: ${adType}`);
  }
}
