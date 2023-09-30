const { json } = require("express");

const mongoose = require("mongoose"),
  tagline_keywords = mongoose.model("keywords"),
  Media = mongoose.model("media"),
  BannerSchema = mongoose.model("Banner"),
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
  } = require(`../../../utils/validators`);

////////////////

exports.fetchAllTags = async (req, res, next) => {
  try {
    // let adtype = req.body.adType
    let records = await tagline_keywords.find().select({ keywords: 1, _id: 0 });
    if (records) {
      return successJSONResponse(res, {
        message: `success`,
        records,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `Room not Available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
