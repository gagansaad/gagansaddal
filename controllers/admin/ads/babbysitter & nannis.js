const { json } = require("express");

const mongoose = require("mongoose"),
  postbabyAd = mongoose.model("babysitter & nannie"),
  PostViews = mongoose.model("Post_view"),
  tagline_keywords = mongoose.model("keywords"),
  paymentModel = mongoose.model("payment"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
  } = require(`../../../utils/validators`);
exports.fetchAll = async (req, res, next) => {
  try {
    let totalViewCount = 0; // Initialize the total view count variable
    let todayViewCount = 0; // Initialize the view count for records created today
    let todayRecordsCount = 0;

    let searchTerm = req.query.searchTerm || "";
    let dbQuery = {};
    const {
      status,
      category_value,
      category,
      work_type,
      care_service,
      age_group,
      prefered_language,
      prefered_gender,
      transport_facilty,
      location,
      tagline,
      sortBy,
      longitude,
      latitude,
      maxDistance,
    } = req.query;
    const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
    let Distance;

    if (maxDistance === "0" || !maxDistance) {
      Distance = 200000;
    } else {
      Distance = maxDistance * 1000;
    }
    if (longitude && latitude && Distance) {
      const targetPoint = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      dbQuery["adsInfo.location.coordinates"] = {
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance,
        },
      };
    }
    var perPage = parseInt(req.query.perpage) || 40;
    var page = parseInt(req.query.page) || 1;

    if (status) {
      dbQuery.status = status;
    }

    if (category_value) {
      dbQuery["adsInfo.category.category_value"] = category_value;
    }

    if (category === "I%20want%20a%20Babysitter%2FNanny") {
      dbQuery["adsInfo.category.category_name"] = "I want a Babysitter/Nanny";
    } else if (category === "I%2520am%2520a%2520Babysitter%252FNanny") {
      dbQuery["adsInfo.category.category_name"] = "I am a Babysitter/Nanny";
    }
    if (work_type) {
      dbQuery["adsInfo.work_type"] = work_type;
    }

    if (care_service) {
      dbQuery["adsInfo.care_service"] = care_service;
    }

    if (age_group) {
      dbQuery["adsInfo.age_group"] = age_group;
    }

    if (prefered_language) {
      dbQuery["adsInfo.prefered_language"] = prefered_language;
    }

    if (prefered_gender) {
      dbQuery["adsInfo.prefered_gender"] = prefered_gender;
    }

    if (transport_facilty) {
      dbQuery["adsInfo.transport_facilty"] = transport_facilty;
    }

    if (location) {
      dbQuery["adsInfo.location"] = location;
    }

    if (tagline) {
      dbQuery["adsInfo.tagline"] = tagline;
    }
    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    

    // dbQuery.status = "active";
    // dbQuery["plan_validity.expired_on"] = { $gte: currentISODate };
    let queryFinal = dbQuery;
    if (searchTerm) {
      queryFinal = {
        ...dbQuery,
        $or: [
          { "adsInfo.title": { $regex: searchTerm, $options: "i" } },
          { "adsInfo.tagline": { $regex: searchTerm, $options: "i" } },
        ],
      };
    }
    let myid = req.userId;
    let records = await postbabyAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "ReportCount" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .sort(sortval)
      .skip(perPage * page - perPage)
      .limit(perPage);
    const totalCount = await postbabyAd.find({
      $or: [queryFinal],
    });
    let responseModelCount = totalCount.length;

    if (records) {
      const currentDate = new Date();
      const currentDateOnly = currentDate.toISOString().substring(0, 10);
      // Calculate the total view count
      let sadsid;
      records.forEach((job) => {
        sadsid = job.adsType;
        totalViewCount += job.viewCount;
        if (job.createdAt.toISOString().substring(0, 10) === currentDateOnly) {
          todayViewCount += job.viewCount;
          todayRecordsCount += 1;
        }
      });
      const paymentStatus = "confirmed"; // Replace with the actual payment_status value you want to search for

      // Calculate the start and end dates for today
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day (midnight)
      const endDate = new Date(today); // Create a copy of the start date
      endDate.setDate(today.getDate() + 1); // Set the end date to the next day

      const query = {
        $and: [
          { ads_type: sadsid },
          { payment_status: paymentStatus },
          {
            createdAt: {
              $gte: today,
              $lt: endDate,
            },
          },
        ],
      };
      const query2 = {
        $and: [
          { ads_type: sadsid },
          { payment_status: paymentStatus },
        ],
      };

      let reve = await paymentModel.find(query2);
      let treve = await paymentModel.find(query);
      let totalAmountSum = 0;
      for (const payment of reve) {
        totalAmountSum += payment.total_amount;
      }

      let totayAmountSum = 0;
      for (const payment of treve) {
        totayAmountSum += payment.total_amount;
      }

      const jobData = records.map((job) => {
        return {
          ...job._doc,
          // Add other job fields
          view_count: job.viewCount,
          reportCount: job.ReportCount,
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
        totalViewCount: totalViewCount, // Include total view count in the response
        todayViewCount: todayViewCount,
        todayRecordsCount: todayRecordsCount,
        totalrevenue: totalAmountSum,
        todayrevenue: totayAmountSum, //
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `ads not Available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.fetchOne = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    let data_Obj;
    let checkId = await postbabyAd.findOne({ _id: adsId });
    if (!checkId) {
      return failureJSONResponse(res, {
        message: `Please provide valid ad id`,
      });
    }
    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    if (adsId) {
      data_Obj = {
        _id: adsId,
        status: "active",
        "plan_validity.expired_on": { $gte: currentISODate },
      };
    }
    let myid = req.userId;
    let records = await postbabyAd
      .findOne(data_Obj)
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } });

    if (records) {
      const ads_type = records.adsType.toString();

      let { ModelName, Typename } = await ModelNameByAdsType(ads_type);
      let dbQuery = {
        userId: myid,
        ad: records._id,
        adType: Typename,
      };

      let checkview = await PostViews.findOne({
        $and: [{ userId: dbQuery.userId }, { ad: dbQuery.ad }],
      });
      if (!checkview) {
        let data = await PostViews.create(dbQuery);
      }
      const jobData = {
        ...records._doc,
        view_count: records.viewCount,
        favorite_count: records.favoriteCount,
        is_favorite: !!records.isFavorite,
      };
      return successJSONResponse(res, {
        message: `success`,
        ads_details: jobData,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `ad not Available` });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.fetchOneDelete = async (req, res, next) => {
  try {
    let dbQuery = {
      _id: req.query.adsId,
    };

    let records = await postbabyAd.findOneAndDelete(dbQuery);
    if (records) {
      return successJSONResponse(res, {
        message: `success`,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `Ad not available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { err, message: `something went wrong` });
  }
};

exports.fetchGraph = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const data = []; // Array to store monthly counts
    const data1 = []; // Array to store monthly counts
    const revenueData = []; // Array to store monthly revenue
    const adTypes = [
      "babysitter",
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
          "addons_validity": { $exists: true, $not: { $size: 0 } }
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

function getModelByType(adType) {
  switch (adType) {
    case "event":
      return eventAd;
    case "biz":
      return bizAd;
    case "babysitter":
      return postbabyAd;
    case "roomrent":
      return RoomRentsAds;
    case "jobs":
      return jobsAd;
    case "buysell":
      return buysellAd;
    default:
      throw new Error(`Unsupported ad type: ${adType}`);
  }
}
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