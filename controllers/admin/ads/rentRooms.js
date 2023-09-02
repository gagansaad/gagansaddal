const { json } = require("express");

const mongoose = require("mongoose"),
    RoomRentsAds = mongoose.model("rental"),
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
          let searchTerm = req.body.searchTerm || "";
          let dbQuery = {};
          const {
            userId,
            isfeatured,
            status,
            adsType,
            rental_type,
            category,
            title,
            roomType,
            listerType,
            accommodates,
            furnished,
            attachedBath,
            isSmokingAllowed,
            isAlcoholAllowed,
            isPetFriendly,
            preferedGender,
            location,
            tagline,
          } = req.query;
          var perPage = parseInt(req.query.perpage) || 6;
          var page = parseInt(req.query.page) || 1;
      
      if (isfeatured) dbQuery.isfeatured = isfeatured;
      if (status) dbQuery.status = status;
      if (adsType) dbQuery.adsType = adsType;
      if (rental_type) dbQuery["adsInfo.rental_type"] = rental_type;
      if (category) dbQuery["adsInfo.category"] = category;
      if (title) dbQuery["adsInfo.title"] = title;
      if (roomType) dbQuery["adsInfo.roomType"] = roomType;
      if (listerType) dbQuery["adsInfo.listerType"] = listerType;
      if (accommodates) dbQuery["adsInfo.accommodates"] = accommodates;
      if (furnished) dbQuery["adsInfo.furnished"] = furnished;
      if (attachedBath) dbQuery["adsInfo.attachedBath"] = attachedBath;
      if (isSmokingAllowed) dbQuery["adsInfo.isSmokingAllowed"] = isSmokingAllowed;
      if (isAlcoholAllowed) dbQuery["adsInfo.isAlcoholAllowed"] = isAlcoholAllowed;
      if (isPetFriendly) dbQuery["adsInfo.isPetFriendly"] = isPetFriendly;
      if (preferedGender) dbQuery["adsInfo.preferedGender"] = preferedGender;
          // Get the current date
          const currentDate = new Date();
          // Convert the date to ISO 8601 format
          const currentISODate = currentDate.toISOString();
          // Extract only the date portion
          const currentDateOnly = currentISODate.substring(0, 10);
          dbQuery.status = "active";
          dbQuery["plan_validity.expired_on"] = { $gte: currentDateOnly };
          if (userId) dbQuery.userId = userId;
          let queryFinal = dbQuery;
          if (searchTerm) {
            queryFinal = {
              ...dbQuery,
              $or: [
                { "adsInfo.title": { $regex: searchTerm, $options: "i" } },
                { "adsInfo.tagline": { $regex: searchTerm, $options: "i" } }
              ]
            };
          }
      console.log(queryFinal);
          let myid = req.userId;
          let records = await RoomRentsAds.find()
            .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
            .populate({ path: "favoriteCount", select: "_id" })
            // .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
            .sort({ createdAt: -1 })
            .skip(perPage * page - perPage)
            .limit(perPage);
          const responseModelCount = await RoomRentsAds.countDocuments({
            $or: [queryFinal],
          });
         
            
          if (records) {
            const jobData = records.map((job) => {
              return {
                ...job._doc,
                // Add other job fields as needed
                favoriteCount: job.favoriteCount,
                isFavorite: !!job.isFavorite, 
              };
            });
            return successJSONResponse(res, {
              message: `success`,
              total: responseModelCount,
              perPage: perPage,
              totalPages: Math.ceil(responseModelCount / perPage),
              currentPage: page,
              records:records,
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
      
      let dbQuery ={
        _id:req.query.adsId
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
        _id:req.query.adsId
      };
  
        let records = await  RoomRentsAds.findOneAndDelete(dbQuery);
        if (records) {
            return successJSONResponse(res, {
                message: `success`,
                status: 200,
            })
        } else {
            return failureJSONResponse(res, { message: `Ad not available` })
        }
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
  }








