const { json } = require("express");

const mongoose = require("mongoose"),
  postbabyAd = mongoose.model("babysitter & nannie"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude ,listerBasicInfo} = require(`../../../utils/mongoose`),
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
      let searchTerm = req.body.searchTerm;
      let dbQuery = {};
      const {
        status,
        category_value,
        category,
        work_type,
        care_service,
        age_group,
        prefered_language,
        prefered_gender,
        transport_facilty,
        location,
        tagline,
        sortBy,
        longitude,
        latitude,
        maxDistance,
      } = req.query;
      console.log(req.query,"---------------");
      const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
      let Distance
      
      if(maxDistance === "0" || !maxDistance){
        console.log("bol");
        Distance =  200000
      }else{
        Distance =maxDistance*1000
      }
      // console.log(longitude, latitude,'longitude, latitude');
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
      var perPage = parseInt(req.query.perpage) || 40;
      var page = parseInt(req.query.page) || 1;
  
      if (status) {
        dbQuery.status = status;
      }
  
      if (category_value) {
        dbQuery["adsInfo.category.category_value"] = category_value;
      }
  
      if (category === "I%20want%20a%20Babysitter%2FNanny") {
        dbQuery["adsInfo.category.category_name"] = "I want a Babysitter/Nanny";
      }else if(category === "I%2520am%2520a%2520Babysitter%252FNanny"){
          dbQuery["adsInfo.category.category_name"] = "I am a Babysitter/Nanny";
      }
      if (work_type) {
        dbQuery["adsInfo.work_type"] = work_type;
      }
  
      if (care_service) {
        dbQuery["adsInfo.care_service"] = care_service;
      }
  
      if (age_group) {
        dbQuery["adsInfo.age_group"] = age_group;
      }
  
      if (prefered_language) {
        dbQuery["adsInfo.prefered_language"] = prefered_language;
      }
  
      if (prefered_gender) {
        dbQuery["adsInfo.prefered_gender"] = prefered_gender;
      }
  
      if (transport_facilty) {
        dbQuery["adsInfo.transport_facilty"] = transport_facilty;
      }
  
      if (location) {
        dbQuery["adsInfo.location"] = location;
      }
  
      if (tagline) {
        dbQuery["adsInfo.tagline"] = tagline;
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
            { "adsInfo.tagline": { $regex: searchTerm, $options: "i" } }
          ]
        };
      }
      let myid = req.userId;
      let records = await postbabyAd
        .find({ $or: [queryFinal] })
        .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
        .populate({ path: "favoriteCount", select: "_id" })
        .populate({ path: "viewCount" })
        .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
        .sort(sortval)
        .skip(perPage * page - perPage)
        .limit(perPage);
        const totalCount = await postbabyAd.find({
          $or: [queryFinal],
        });
        let responseModelCount = totalCount.length;
     
      if (records) {
        const jobData = records.map((job) => {
          return {
            ...job._doc,
            // Add other job fields 
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
          records:jobData,
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
    
    let dbQuery ={
      _id:req.query.adsId
    };

      let records = await  postbabyAd.findOne(dbQuery);
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

      let records = await  postbabyAd.findOneAndDelete(dbQuery);
      if (records) {
          return successJSONResponse(res, {
              message: `success`,
              status: 200,
          })
      } else {
          return failureJSONResponse(res, { message: `Ad not available` })
      }
  } catch (err) {
      return failureJSONResponse(res, {err, message: `something went wrong` })
  }
}