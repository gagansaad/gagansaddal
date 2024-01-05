const { json } = require("express");
const mongoose = require("mongoose"),
  postJobAd = mongoose.model("job"),
  PostViews = mongoose.model("Post_view"),
  tagline_keywords = mongoose.model("keywords"),
  paymentModel = mongoose.model("payment"),
  PostType = mongoose.model("PostType"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidUrl,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
    isValidNumber,
  } = require(`../../../utils/validators`);

///////////////////

exports.fetchAll = async (req, res, next) => {
  try {
    let totalViewCount = 0; // Initialize the total view count variable
    let todayViewCount = 0; // Initialize the view count for records created today
    let totalReportCount = 0; // Initialize the total view count variable
    let todayReportCount = 0; 
    let todayRecordsCount = 0;
    let searchTerm = req.query.searchTerm || "";
    let dbQuery = {};
    const {
      isfeatured,
      status,
      adsType,
      listing_type,
      title,
      category,
      type,
      employment_type,
      language,
      amount,
      preferred_gender,
      location,
      tagline,
      userId,
      sortBy,
      longitude,
      latitude,
      maxDistance,
      startDate,
      endDate,
      daysFilter,
    } = req.query;
    const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
    let Distance;
    if (startDate && endDate) {
      // If start date and end date are provided, filter by custom date range
      dbQuery.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    } 
    if(daysFilter) {
       // Default to last 30 days if not specified
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysFilter);
      console.log(startDate,"kiya hai");
      dbQuery.createdAt = {
        $gte: startDate,
      };
    }

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
    if (isfeatured) {
      dbQuery.isfeatured = isfeatured;
    }
    if (status) {
      dbQuery.status = status;
    }

    if (adsType) {
      dbQuery.adsType = adsType;
    }

    if (listing_type) {
      dbQuery.listing_type = listing_type;
    }

    if (title) {
      dbQuery["adsInfo.title"] = title;
    }

    if (category) {
      dbQuery["adsInfo.categories"] = category;
    }

    if (type) {
      dbQuery["adsInfo.type"] = type;
    }

    if (employment_type) {
      dbQuery["adsInfo.employment_type"] = employment_type;
    }

    if (language) {
      dbQuery["adsInfo.language"] = language;
    }

    if (amount) {
      dbQuery["adsInfo.rent.amount"] = amount;
    }

    if (preferred_gender) {
      dbQuery["adsInfo.preferedGender"] = preferred_gender;
    }

    if (location) {
      dbQuery["adsInfo.location"] = location;
    }

    if (tagline) {
      dbQuery["adsInfo.tagline"] = tagline;
    }
    if (userId) dbQuery.userId = userId;
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
    let records = await postJobAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "ReportCount" })
      .sort(sortval)
      .skip(perPage * page - perPage)
      .limit(perPage);
    const totalCount = await postJobAd.find({
      $or: [queryFinal],
    });
    let responseModelCount = totalCount.length;
    let record = await postJobAd
    .find({ $or: [queryFinal] })
    .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
    .populate({ path: "favoriteCount", select: "_id" })
    .populate({ path: "viewCount" })
    .populate({ path: "isFavorite", select: "user", match: { user: myid } })
    .populate({ path: "ReportCount" })
    .sort(sortval)
    if (record) {
      const currentDate = new Date();
      const currentDateOnly = currentDate.toISOString().substring(0, 10);
      // Calculate the total view count
      let sadsid;
      record.forEach((job) => {
console.log(job,"edede");
        sadsid = job.adsType;
        totalViewCount += job.viewCount;
        totalReportCount += job.ReportCount;
        if (job.createdAt.toISOString().substring(0, 10) === currentDateOnly) {
          todayViewCount += job.viewCount;
          todayReportCount += job.ReportCount;
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
          // Add other job fields as needed
          report_count:job.ReportCount,
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
        totalViewCount: totalViewCount, // Include total view count in the response
        todayViewCount: todayViewCount,
        todayRecordsCount: todayRecordsCount,
        totalReportCount:totalReportCount,
        todayReportCount:todayReportCount,
        totalrevenue: totalAmountSum,
        todayrevenue: totayAmountSum, // Include view count for today in the response
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

exports.fetchOne = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    let data_Obj;
    let checkId = await postJobAd.findOne({ _id: adsId });
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
    } else {
      return failureJSONResponse(res, { message: `ad id not Available` });
    }
    let myid = req.userId;
    let records = await postJobAd
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
        is_favorite: records.isFavorite,
      };
      return successJSONResponse(res, {
        message: `success`,
        ads_details: jobData,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `ad not available` });
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

    let records = await postJobAd.findOneAndDelete(dbQuery);
    if (records) {
      return successJSONResponse(res, {
        message: `success`,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `Ad not available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
exports.fetchGraph = async (req, res, next) => {
  try {
    const currentYear = new Date().getFullYear();
    const data = []; // Array to store monthly counts
    const data1 = []; // Array to store monthly counts
    const revenueData = []; // Array to store monthly revenue
    const adTypes = [
      "jobs",
    ];
    let type = await PostType.find({name:"Jobs"})

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
      const monthlyRevenue = await calculateMonthlyRevenue(startDate, endDate,type[0]._id);
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
      return babysitterAd;
    case "roomrent":
      return RoomRentsAds;
    case "jobs":
      return postJobAd;
    case "buysell":
      return buysellAd;
    default:
      throw new Error(`Unsupported ad type: ${adType}`);
  }
}
const calculateMonthlyRevenue = async (startDate, endDate ,adstype) => {
  
  let staDate = startDate.toISOString();
   let eDate = endDate.toISOString()
   let type = adstype.toString()
   console.log(adstype.toString(),staDate, eDate);
   const todayTotalAmountAggregation = await paymentModel.aggregate([
     {
       $match: {
         createdAt: {
           $gte: startDate,
           $lt: endDate,
         },
         ads_type: type,
         payment_status:"confirmed"
       },
     },
     {
       $group: {
         _id: null,
         revenue: { $sum: "$total_amount" },
       },
     },
   ]);
   
 
 console.log(todayTotalAmountAggregation);
   if (todayTotalAmountAggregation.length > 0) {
     return todayTotalAmountAggregation[0].revenue;
   } else {
     console.log("dedede");
     return 0; // No revenue for the given month
   }
 };