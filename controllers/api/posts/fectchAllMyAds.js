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
  BannerSchema=mongoose.model("Banner"),
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
    let adstype = req.query.adsType;
    console.log(adstype);
    var perPage = 10 || parseInt(req.query.perpage)
    var page = parseInt(req.query.page) || 1
    let dbquery = ``
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

exports.fetchAll = async (req, res, next) => {
  try {
    console.log("object-------------------------------");
    let myid 
    if(req.userId){
      myid=req.userId || "0"
    }
    let banner = await BannerSchema.find().populate({ path: "image", strictPopulate: false,select:"url"})
    console.log(banner);
    
    const adons_name = ["Homepage Gallery", "Urgent", "Upcoming Event", "Price Drop"];
    const mergedData = [];
    let commonPopulateOptions = [
      { path: "adsType", strictPopulate: false, select: "name" },
      { path: "adsInfo.image", strictPopulate: false, select: "url" },
      { path: "viewCount" },
      { path: 'isFavorite', select: 'user', match: { user: myid } }
  ];
  
  let commonSelectFields = {
      "addons_validity":1,
      "adsInfo.title": 1,
      "adsInfo.location.location_name": 1,
      "_id": 1,
  };
    for (const adons of adons_name) {
      const adonsData = [];

      const data1 = await babysitterAd.find({ "addons_validity.name": adons })
      .sort({ createdAt: -1 })
      .limit(2)
      .populate(commonPopulateOptions)
      .select(commonSelectFields);
      const data2 = await buysellAd.find({ "addons_validity.name": adons }).sort({ createdAt: -1 }).limit(2)
      .sort({ createdAt: -1 })
      .limit(2)
      .populate(commonPopulateOptions)
      .select(commonSelectFields);
      const data3 = await bizAd.find({ "addons_validity.name": adons }).sort({ createdAt: -1 }).limit(2)
      .sort({ createdAt: -1 })
      .limit(2)
      .populate(commonPopulateOptions)
      .select(commonSelectFields);
      const data4 = await eventAd.find({ "addons_validity.name": adons }).sort({ createdAt: -1 }).limit(2)
      .sort({ createdAt: -1 })
      .limit(2)
      .populate(commonPopulateOptions)
      .select(commonSelectFields);
      const data5 = await jobsAd.find({ "addons_validity.name": adons }).sort({ createdAt: -1 }).limit(2)
      .sort({ createdAt: -1 })
      .limit(2)
      .populate(commonPopulateOptions)
      .select(commonSelectFields);
      const data6 = await roomrentAd.find({ "addons_validity.name": adons }).sort({ createdAt: -1 }).limit(2)
      .sort({ createdAt: -1 })
      .limit(2)
      .populate(commonPopulateOptions)
      .select(commonSelectFields);

      const combinedData = [...data1, ...data2, ...data3, ...data4, ...data5, ...data6];
      let filterData
      if (combinedData) {
         filterData = combinedData.map((job) => {
          console.log("Job:", job);
          console.log("Addons Validity:", job.addons_validity);
      
          const isFeaturedAddonValid = job.addons_validity && Array.isArray(job.addons_validity) &&
              job.addons_validity.some((addon) => {
                  const addonExpired = new Date(addon.expired_on) >= new Date();
                  console.log(`Addon: ${addon.name}, Expired: ${addonExpired}`);
                  return addon.name === "Featured" && addonExpired;
              });
      
          console.log("Is Featured Addon Valid:", isFeaturedAddonValid);
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
console.log(adonsData,"999999999999999999999")
      // Only add to mergedData if there is adonsData
      if (adonsData.length > 0) {
        mergedData.push(...adonsData);
      }
    }
  }
    return successJSONResponse(res, {
      message: "success",
      data: mergedData,banner
    });
  
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` }, { error: err.message });
  }
};




