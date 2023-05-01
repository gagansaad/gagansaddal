const { json } = require("express");

const mongoose = require("mongoose"),
    RoomRentsAds = mongoose.model("RoomRent"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`),
    { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
    {
        isValidString,
        isValidMongoObjId,
        isValidBoolean,
        isValidDate,
        isValidEmailAddress,
        isValidIndianMobileNumber
    } = require(`../../../utils/validators`);



exports.fetchAll = async (req, res, next) => {
    
    try {
        const isFeatured = req.query.isfeatured;
        // let dbQuery ={
        //     status: 
        // };

    // if(isFeatured) dbQuery.isfeatured = isFeatured;
    // dbQuery
        let records = await RoomRentsAds.find();
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



exports.fetchOne = async (req, res, next) => {
    try {
      
      let dbQuery ={
        _id:req.query._id
      };
  
        let records = await  RoomRentsAds.findOne(dbQuery);
        if (records) {
            return successJSONResponse(res, {
                message: `success`,
                records,
                status: 200,
            })
        } else {
            return failureJSONResponse(res, { message: `Ad not available` })
        }
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
  }
  exports.fetchOneDelete = async (req, res, next) => {
    try {
      
      let dbQuery ={
        _id:req.query._id
      };
  
        let records = await  RoomRentsAds.findOneAndDelete(dbQuery);
        if (records) {
            return successJSONResponse(res, {
                message: `success`,
                records,
                status: 200,
            })
        } else {
            return failureJSONResponse(res, { message: `Ad not available` })
        }
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
  }








