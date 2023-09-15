const { json } = require("express");

const mongoose = require("mongoose"),
    RoomRentsAds = mongoose.model("rental"),
    PostViews = mongoose.model("Post_view"),
    tagline_keywords = mongoose.model("keywords"),
    {
        successJSONResponse,
        failureJSONResponse,
        ModelNameByAdsType
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
          category,
          sub_category,
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
          sortBy,
          location,
          tagline,
          longitude,
          latitude,
          maxDistance,
          prefered_age,
        } = req.query;
        // console.log(req.query,"aayi");
        var perPage = parseInt(req.query.perpage) || 40;
        var page = parseInt(req.query.page) || 1;
        const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
        // console.log(longitude, latitude,'longitude, latitude');
        let Distance
        
        if(maxDistance === "0" || !maxDistance){
        
          Distance =  200000
        }else{
          Distance =maxDistance*1000
        }
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
      
      // console.log(dbQuery);
      // let recordss = await RoomRentsAds.find(dbQuery)
      // console.log(recordss);
      // return successJSONResponse(res, {
      //   message: `success`,
      //   total: recordss,})
    
    if (isfeatured) dbQuery.isfeatured = isfeatured;
    if (status) dbQuery.status = status;
    if (adsType) dbQuery.adsType = adsType;
    if (category) dbQuery["adsInfo.rental_type"] = category;
    if (sub_category) dbQuery["adsInfo.category"] = sub_category;
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
    
    
    if (prefered_age) {
      // Convert prefered_age to an array if it's not already
      const preferedAgeArray = Array.isArray(prefered_age) ? prefered_age : [prefered_age];
    
      // Add $in query to filter based on prefered_age
      dbQuery["adsInfo.prefered_age"] = {
        $in: preferedAgeArray,
      };
    }
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
        // console.log(sortval);
        let myid = req.userId;
        let records = await RoomRentsAds.find({
          $or: [queryFinal],
        })
          .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
          .populate({ path: "favoriteCount", select: "_id" })
          .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
          .populate({ path: "viewCount" })
          .sort(sortval)
          .skip(perPage * page - perPage)
          .limit(perPage);
          // console.log(records);
         
          const totalCount = await RoomRentsAds.find({
            $or: [queryFinal],
          });
          let responseModelCount = totalCount.length;
          // console.log(responseModelCount);
        if (records) {
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
            records:jobData,
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
    const adsId = req.query.adsId;
    let data_Obj
    let checkId = await RoomRentsAds.findOne({_id:adsId})
    if(!checkId){
        return failureJSONResponse(res, { message: `Please provide valid ad id` });
    }
     // Get the current date
     const currentDate = new Date();
     // Convert the date to ISO 8601 format
     const currentISODate = currentDate.toISOString();
     // Extract only the date portion
     const currentDateOnly = currentISODate.substring(0, 10);
     if(adsId){
      data_Obj = {
          _id:adsId,
          status :"active" ,
          "plan_validity.expired_on" :{ $gte: currentDateOnly }
      }
    }
    let myid = req.userId
    let records = await RoomRentsAds.findOne(data_Obj)
    .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
    .populate({ path: "favoriteCount", select: "_id" })
    .populate({ path: "viewCount" })
    .populate({ path: 'isFavorite', select: 'user', match: { user: myid } });
    
    if (records) {
      const ads_type =records.adsType.toString();
    
    let {ModelName,Typename}= await ModelNameByAdsType(ads_type)
    // console.log(Typename,"nfjdnfcjed");
    let dbQuery ={
      userId:myid,
      ad:records._id,
      adType:Typename
    } 
    
     let checkview = await PostViews.findOne({ $and: [{ userId: dbQuery.userId }, { ad: dbQuery.ad }] })
    //  console.log(checkview,"tere nakhre maare mainu ni mai ni jan da  tainu ni");
      if(!checkview){
      let data=  await PostViews.create(dbQuery)
      // console.log(data,"billo ni tere kale kalle naina ");
      }
      const jobData = {
        ...records._doc,
        view_count: records.viewCount,
        favorite_count: records.favoriteCount,
        is_favorite: !!records.isFavorite
      };
      return successJSONResponse(res, {
        message: `success`,
        ads_details: jobData,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `Ads plan expired` });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
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








