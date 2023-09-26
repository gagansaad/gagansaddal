const { json } = require("express");
const { find } = require("../../../model/posts/payment");

const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("rental"),
  jobsAd = mongoose.model("job"),
  category = mongoose.model("PostType"),
  BannerSchema = mongoose.model("Banner"),
  {
    successJSONResponse,
    failureJSONResponse,
    successJSONResponseWithPagination,
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
let dynamicRoom = require("./rentRooms")
let dynamicJob = require("./jobs")
let dynamicBiz = require("./bizAndServices")
let dynamicBaby = require("./babbysitter & nannis")
let dynamicBuysell = require("./buy&sell")
let dynamicEvent = require("./event");
const { CallPage } = require("twilio/lib/rest/api/v2010/account/call");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

////////////////

exports.fetchAllMyAds = async (req, res, next) => {

  try {
    let maxDistance = req.query.maxDistance || 200;
    let adstype = req.query.adsType;
    // console.log(adstype);
    var perPage = 10 || parseInt(req.query.perpage)
    var page = parseInt(req.query.page) || 1
    let dbquery = {};
    if (req.query.userId) {
      dbquery = req.body.userid
    } else if (req.body.userId) {
      dbquery = req.body.userid
    }
    if (!adstype) return failureJSONResponse(res, { message: `Please provide post type id` });
    else if (adstype && !isValidMongoObjId(mongoose, adstype)) return failureJSONResponse(res, { message: `Please provide valid post type id` });

    let findCategory = await category.findOne({ _id: adstype })

    if (!findCategory) {
      return failureJSONResponse(res, {
        message: `Category not found`
      })
    }
    if (req.query.longitude && req.query.latitude) {
      // Assuming you have longitude and latitude fields in your data
      dbquery["adsInfo.location.coordinates"] = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(req.query.longitude), parseFloat(req.query.latitude)],
            maxDistance / 6371 // 6371 is the Earth's radius in kilometers
          ]
        }
      };
    }
    console.log(findCategory.name);
    switch (findCategory.name) {
      case 'Babysitters and Nannies':
        successJSONResponseWithPagination(res, babysitterAd, page, perPage, dbquery)
        break;
      case 'Buy & Sell':
        successJSONResponseWithPagination(res, buysellAd, page, perPage, dbquery)
        break;
      case 'Local Biz and services':
        successJSONResponseWithPagination(res, bizAd, page, perPage, dbquery)
        break;
      case 'Events':
        successJSONResponseWithPagination(res, eventAd, page, perPage, dbquery)
        break;
      case 'Job':
        successJSONResponseWithPagination(res, jobsAd, page, perPage, dbquery)
        break;
      case "Rentals":
        successJSONResponseWithPagination(res, roomrentAd, page, perPage, dbquery)
        break;
      default:
        failureJSONResponse(res, {
          message: `Record not found`
        })
        break;
    }
  } catch (err) {
    console.log(err)
    return failureJSONResponse(res, { message: `something went wrong` }, { error: err.message })
  }
}

exports.fetchAll1 = async (req, res, next) => {
  try {
    // console.log("object-------------------------------");
    let myid
    if (req.userId) {
      myid = req.userId || "0"
    }
    const {
      longitude,
      latitude,
      maxDistance,
    } = req.query;
    let Distance

    if (maxDistance === "0" || !maxDistance) {
      // console.log("bol");
      Distance = 200000
    } else {
      Distance = maxDistance * 1000
    }


    // console.log(Distance,"aayayayayayayayyayayayayayyayayayayayyayayayayayayyayayayayya");
    let banner = await BannerSchema.find().populate({ path: "image", strictPopulate: false, select: "url" })


    const adons_name = ["Homepage Gallery", "Urgent", "Upcoming Event", "Price Drop"];
    const mergedData = [];
    let commonPopulateOptions = [
      { path: "adsType", strictPopulate: false, select: "name" },
      { path: "adsInfo.image", strictPopulate: false, select: "url" },
      { path: "favoriteCount", select: "_id" },
      { path: "viewCount" },
      { path: "ReportCount" },
      { path: "ReportCount", select: "_id" },
      { path: 'isReported', select: 'userId', match: { userId: myid } },
      { path: 'isFavorite', select: 'user', match: { user: myid } },
    ];

    let commonSelectFields = {
      "addons_validity": 1,
      "adsInfo.title": 1,
      "adsInfo.location": 1,
      "_id": 1,
    };
    let pricejobs = {
      "adsInfo.salary": 1
    };


    for (const adons of adons_name) {
      const adonsData = [];
      let dbQuery = { "addons_validity.name": adons }

      if (longitude && latitude && Distance) {
        const targetPoint = {
          type: 'Point',
          coordinates: [longitude, latitude]
        };
        dbQuery["adsInfo.location.coordinates"] = {

          $near: {
            $geometry: targetPoint,
            $maxDistance: Distance
          }

        }
      }
      const eventCount = await eventAd.find(dbQuery);
      const bizCount = await bizAd.find(dbQuery);
      const babysitterCount = await babysitterAd.find(dbQuery);
      const roomrentCount = await roomrentAd.find(dbQuery);
      const jobsCount = await jobsAd.find(dbQuery);
      const buysellCount = await buysellAd.find(dbQuery);
      let eventlimt = 2;
      let bizlimit = 2;
      let babylimit = 2;
      let roomlimit = 2;
      let joblimit = 2;
      let buylimit = 2;

      if (eventCount.length < 2) {
        eventlimt = 0
      }
      if (bizCount.length < 2) {
        bizlimit = 0
      }
      if (babysitterCount.length < 2) {
        babylimit = 0
      }
      if (roomrentCount.length < 2) {
        roomlimit = 0
      }
      if (jobsCount.length < 2) {
        joblimit = 0
      }
      if (buysellCount.length < 2) {
        buylimit = 0
      }
      const data1 = await babysitterAd.find(dbQuery)
        .sort({ createdAt: -1 })
        .limit(babylimit)
        .populate(commonPopulateOptions)
        .select(commonSelectFields);
      const data2 = await buysellAd.find(dbQuery).sort({ createdAt: -1 }).limit(buylimit)
        .populate(commonPopulateOptions)
        .select(commonSelectFields);
      const data3 = await bizAd.find(dbQuery).sort({ createdAt: -1 }).limit(bizlimit)
        .populate(commonPopulateOptions)
        .select(commonSelectFields);
      let data4Limit = adons === "Upcoming Event" ? (eventCount.length < 12 ? eventCount.length : 12) : eventlimt;
      // console.log(data4Limit);
      const data4 = await eventAd.find(dbQuery).sort({ createdAt: -1 }).limit(data4Limit)
        .populate(commonPopulateOptions)
        .select(commonSelectFields);
      const data5 = await jobsAd.find(dbQuery).sort({ createdAt: -1 }).limit(joblimit)
        .populate(commonPopulateOptions)
        .select(commonSelectFields);
      const data6 = await roomrentAd.find(dbQuery).sort({ createdAt: -1 }).limit(roomlimit)
        .populate(commonPopulateOptions)
        .select(commonSelectFields);
      // console.log(data6);
      const combinedData = [...data1, ...data2, ...data3, ...data4, ...data5, ...data6];
      let filterData
      if (combinedData) {
        filterData = combinedData.map((job) => {
          // console.log("Job:", job);
          // console.log("Addons Validity:", job.addons_validity);

          const isFeaturedAddonValid = job.addons_validity && Array.isArray(job.addons_validity) &&
            job.addons_validity.some((addon) => {
              const addonExpired = new Date(addon.expired_on) >= new Date();
              // console.log(`Addon: ${addon.name}, Expired: ${addonExpired}`);
              return addon.name === "Featured" && addonExpired;
            });

          // console.log("Is Featured Addon Valid:", isFeaturedAddonValid);
          return {
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
            is_featured: isFeaturedAddonValid || false, // Set to false if addons_validity doesn't exist
          };
        });

        // Only add to adonsData if there is data
        if (filterData.length >= 0) {
          adonsData.push({
            name: adons,
            data: filterData
          });
        }
        // console.log(adonsData,"999999999999999999999")
        // Only add to mergedData if there is adonsData
        if (adonsData.length > 0) {
          mergedData.push(...adonsData);
        }
      }
    }
    return successJSONResponse(res, {
      message: "success",
      data: mergedData, banner
    });

  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` }, { error: err.message });
  }
};

exports.fetchAll = async (req, res, next) => {
  try {
    console.log("object-------------------------------", new Date().toISOString());
    let myid;
    if (req.userId) {
      myid = req.userId || "0";
    }
    const {
      longitude,
      latitude,
      maxDistance,
    } = req.query;
    let Distance;

    if (maxDistance === "0" || !maxDistance) {
      Distance = 200000;
    } else {
      Distance = maxDistance * 1000;
    }

    let banner = await BannerSchema.find().populate({ path: "image", strictPopulate: false, select: "url" });

    const adons_name = ["Homepage Gallery", "Urgent", "Upcoming Event", "Price Drop"];
    const adons_nameLimit = { "Homepage_Gallery": 3, "Urgent": 4, "Upcoming_Event": 16, "Price_Drop": 16 };
    const adons_nameModelActive = {
       "Homepage_Gallery": { 'babysitterAd': true, 'buysellAd': true, 'bizAd': true, 'eventAd': true, 'jobsAd': true, 'roomrentAd': true }, 
       "Urgent": { 'babysitterAd': true, 'buysellAd': true, 'bizAd': false, 'eventAd': false, 'jobsAd': true, 'roomrentAd': true }, 
       "Upcoming_Event": { 'babysitterAd': false, 'buysellAd': false, 'bizAd': false, 'eventAd': true, 'jobsAd': false, 'roomrentAd': false }, 
       "Price_Drop": { 'babysitterAd': false, 'buysellAd': true, 'bizAd': false, 'eventAd': false, 'jobsAd': false, 'roomrentAd': false } };

    const mergedData = [];
    let commonPopulateOptions = [
      { path: "adsType", strictPopulate: false, select: "name" },
      { path: "adsInfo.image", strictPopulate: false, select: "url" },
      { path: "favoriteCount", select: "_id" },
      { path: "viewCount" },
      { path: "ReportCount" },
      { path: "ReportCount", select: "_id" },
      { path: 'isReported', select: 'userId', match: { userId: myid } },
      { path: 'isFavorite', select: 'user', match: { user: myid } },
    ];

    let commonSelectFields = {
      "addons_validity.": 1,
      "adsInfo.title": 1,
      "adsInfo.location": 1,
      "_id": 1,
    };
    let priceBabySitter = {
      "adsInfo.expected_salary_amount": 1,
    };
    let priceJobs = {
      "adsInfo.salary": 1
    };
    let priceBuysell = {
      "adsInfo.price": 1
    };
    let priceEvent = {
      "adsInfo.ticket_price": 1
    };
    let priceRoomrent = {
      "adsInfo.rent": 1
    };
    for (const adons of adons_name) {
      const adonsData = [];
      let adonsSlug = adons.replace(/\s+/g, '_');
      let dbQuery = {
        "addons_validity": {
          $elemMatch: {
            "name": adons,
            "expired_on": {
              $gte: new Date("2023-09-18").toISOString() // Construct ISODate manually
            }
          }
        }
      };

      if (longitude && latitude && Distance) {
        const targetPoint = {
          type: 'Point',
          coordinates: [longitude, latitude]
        };
        dbQuery["adsInfo.location.coordinates"] = {
          $near: {
            $geometry: targetPoint,
            $maxDistance: Distance
          }
        }
      }
      //       console.log(adons_nameLimit[adonsSlug]);
      //       console.log(adons_nameLimit);
      //       console.log(adonsSlug);
      // return adons_nameLimit[adonsSlug];

      let data1, data2, data3, data4, data5, data6;

      if (adons_nameModelActive[adonsSlug].babysitterAd == true) {
        data1 = await babysitterAd.find(dbQuery)
          .sort({ randomField: 1 }).limit(adons_nameLimit[adonsSlug])
          .populate(commonPopulateOptions).select({ ...commonSelectFields, ...priceBabySitter }).exec()
      }

      if (adons_nameModelActive[adonsSlug].buysellAd == true) {
        data2 = await buysellAd.find(dbQuery)
          .sort({ randomField: 1 }).limit(adons_nameLimit[adonsSlug])
          .populate(commonPopulateOptions).select({ ...commonSelectFields, ...priceBuysell })
      }
      if (adons_nameModelActive[adonsSlug].bizAd == true) {
        data3 = await bizAd.find(dbQuery)
          .sort({ randomField: 1 }).limit(adons_nameLimit[adonsSlug])
          .populate(commonPopulateOptions).select(commonSelectFields)

      }
      if (adons_nameModelActive[adonsSlug].eventAd == true) {
        data4 = await eventAd.find(dbQuery)
          .sort({ randomField: 1 }).limit(adons_nameLimit[adonsSlug])
          .populate(commonPopulateOptions).select({ ...commonSelectFields, ...priceEvent })
      }
      if (adons_nameModelActive[adonsSlug].jobsAd == true) {
        data5 = await jobsAd.find(dbQuery)
          .sort({ randomField: 1 }).limit(adons_nameLimit[adonsSlug])
          .populate(commonPopulateOptions).select({ ...commonSelectFields, ...priceJobs })
      }
      if (adons_nameModelActive[adonsSlug].roomrentAd == true) {
        data6 = await roomrentAd.find(dbQuery)
          .sort({ randomField: 1 }).limit(adons_nameLimit[adonsSlug])
          .populate(commonPopulateOptions).select({ ...commonSelectFields, ...priceRoomrent })
      }
      const combinedData = [...data1, ...data2, ...data3, ...data4, ...data5, ...data6];
      // console.log(combinedData);
      let filterData
      if (combinedData) {
        filterData = combinedData.map((job) => {
          return {
            ...job._doc,
            // Add other job fields as needed
            price_default: job.price_default,
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
            // is_featured: isFeaturedAddonValid || false, // Set to false if addons_validity doesn't exist
          };
        });
        if (filterData.length) {
          adonsData.push({
            name: adons,
            data: filterData
          });
        }
        // Only add to mergedData if there is adonsData
        if (adonsData.length) {
          mergedData.push(...adonsData);
        }
      }

    }
    return successJSONResponse(res, {
      message: "success",
      data: mergedData,
      banner
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` }, { error: err.message });
  }
};


