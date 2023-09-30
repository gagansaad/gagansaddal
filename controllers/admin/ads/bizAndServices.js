const { json } = require("express");

const mongoose = require("mongoose"),
  postbizAndServicesAd = mongoose.model("Local_biz & Service"),
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
    let searchTerm = req.body.searchTerm;
    let dbQuery = {};
    const {
      status,
      category,
      sub_category,
      business_name,
      tagline,
      business_location,
      is_24_seven,
      sortBy,
      longitude,
      experience,
      latitude,
      maxDistance,
      availability,
    } = req.query;
    if (availability) {
      switch (availability) {
        case "Weekdays":
          dbQuery["adsInfo.working_hours.week_days.is_available"] = true;
          break;
        case "Weekends":
          dbQuery["adsInfo.working_hours.week_ends.is_available"] = true;
          break;
        case "Weekdays & Weekends":
          dbQuery["adsInfo.working_hours.week_days.is_available"] = true;
          dbQuery["adsInfo.working_hours.week_ends.is_available"] = true;
          break;
        case "24/7":
          dbQuery["adsInfo.working_hours.is_24_seven"] = true;
          break;
        case "By appointment":
          dbQuery["adsInfo.working_hours.appointment"] = true;
          break;
        default:
          break;
      }
    }

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

    if (category) {
      dbQuery.categories = category;
    }

    if (sub_category) {
      dbQuery.sub_categories = sub_category;
    }

    if (business_name) {
      dbQuery["adsInfo.title"] = business_name;
    }

    if (tagline) {
      dbQuery["adsInfo.tagline"] = tagline;
    }

    if (business_location) {
      dbQuery["adsInfo.business_location"] = business_location;
    }

    if (is_24_seven) {
      dbQuery["adsInfo.is_24_seven"] = is_24_seven;
    }
    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    dbQuery.status = "active";
    dbQuery["plan_validity.expired_on"] = { $gte: currentDateOnly };
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
    let records = await postbizAndServicesAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .sort(sortval)
      .skip(perPage * page - perPage)
      .limit(perPage);
    const totalCount = await postbizAndServicesAd.find({
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
          // { payment_status: paymentStatus },
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
          // { payment_status: paymentStatus },
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
    let checkId = await postbizAndServicesAd.findOne({ _id: adsId });
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
    const currentDateOnly = currentISODate.substring(0, 10);
    if (adsId) {
      data_Obj = {
        _id: adsId,
        status: "active",
        "plan_validity.expired_on": { $gte: currentDateOnly },
      };
    }
    let myid = req.userId;
    let records = await postbizAndServicesAd
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

    let records = await postbizAndServicesAd.findOneAndDelete(dbQuery);
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
