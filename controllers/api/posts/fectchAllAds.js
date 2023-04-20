const { json } = require("express");
const { find } = require("../../../model/posts/payment");

const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("RoomRent"),
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

////////////////





exports.fetchAll = async (req, res, next) => {

  try {
    let adstype = req.query.adsType;
    var perPage = 10 || parseInt(req.query.perpage)
    var page = parseInt(req.query.page) || 1

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
        successJSONResponseWithPagination(res, babysitterAd, page, perPage)
        break;
      case 'Buy & Sell':
        successJSONResponseWithPagination(res, buysellAd, page, perPage)
        break;
      case 'Local Biz and services':
         successJSONResponseWithPagination(res, bizAd, page, perPage)
        break;
      case 'Events':
         successJSONResponseWithPagination(res, eventAd, page, perPage)
        break;
      case 'Job':
        successJSONResponseWithPagination(res, jobsAd, page, perPage)
        break;
        case "Room For Rent":
           successJSONResponseWithPagination(res, roomrentAd, page, perPage)
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




