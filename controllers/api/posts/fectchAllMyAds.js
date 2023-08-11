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
let dynamicEvent = require("./event")

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
        successJSONResponseWithPagination(res, babysitterAd, page, perPage,dbquery)
        break;
      case 'Buy & Sell':
        successJSONResponseWithPagination(res, buysellAd, page, perPage,dbquery)
        break;
      case 'Local Biz and services':
        successJSONResponseWithPagination(res, bizAd, page, perPage,dbquery)
        break;
      case 'Events':
        successJSONResponseWithPagination(res, eventAd, page, perPage,dbquery)
        break;
      case 'Job':
        successJSONResponseWithPagination(res, jobsAd, page, perPage,dbquery)
        break;
      case "Rentals":
        successJSONResponseWithPagination(res, roomrentAd, page, perPage,dbquery)
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
    console.log("object-------------------------------",);
    const adons_name = ["Featured", "Homepage Gallery", "Urgent", "Link to your website", "Bump up", "Upcoming Event", "Price Drop"];
    

    const mergedData = {};

    for (const adons of adons_name) {
      const adonsData = {
        babysitterAd: await babysitterAd.find({ "addons_validity.name": adons }),
        buysellAd: await buysellAd.find({ "addons_validity.name": adons }),
        bizAd: await bizAd.find({ "addons_validity.name": adons }),
        eventAd: await eventAd.find({ "addons_validity.name": adons }),
        jobsAd: await jobsAd.find({ "addons_validity.name": adons }),
        roomrentAd: await roomrentAd.find({ "addons_validity.name": adons }),
      };

      mergedData[adons] = adonsData;
    }

    return successJSONResponse(res, {
      message: "success",
      data: mergedData
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` }, { error: err.message });
  }
};



