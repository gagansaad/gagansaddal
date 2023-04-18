const { json } = require("express");

const mongoose = require("mongoose"),
  postbizAndServicesAd = mongoose.model("Local_biz & Service"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude,listerBasicInfo } = require(`../../../utils/mongoose`),
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
      const isFeatured = req.query.isfeatured;
      let dbQuery ={
          status: 1
      };
  
  if(isFeatured) dbQuery.isfeatured = isFeatured;
        let records = await  postbizAndServicesAd.find(dbQuery);
        if (records) {
            return successJSONResponse(res, {
                message: `success`,
                total:Object.keys(records).length,
                records,
                status: 200,
            })
        } else {
            return failureJSONResponse(res, { message: `Room not Available` })
        }
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
  }