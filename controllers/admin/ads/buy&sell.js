const { json } = require("express");

const mongoose = require("mongoose"),
postBuySellAd = mongoose.model("Buy & Sell"),
PostViews = mongoose.model("Post_view"),
tagline_keywords = mongoose.model("keywords"),
paymentModel = mongoose.model('payment'),
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
    isValidIndianMobileNumber,
  } = require(`../../../utils/validators`);





/////////////



exports.fetchAll = async (req, res, next) => {
  try {
    let totalViewCount = 0; // Initialize the total view count variable
    let todayViewCount = 0; // Initialize the view count for records created today
    let todayRecordsCount = 0;
    let searchTerm = req.body.searchTerm;
    let dbQuery = {};
    const {
      status,
      ads_type,
      category,
      sub_category,
      title,
      product_condition,
      user_type,
      payment_mode,
      fullfilment,
      location,
      tagline,
      sortBy,
      longitude,
      latitude,
      maxDistance,
    } = req.query;
    const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
    // console.log(longitude, latitude,'longitude, latitude');
    let Distance
    
    if(maxDistance === "0" || !maxDistance){
      // console.log("bol");
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
    var perPage = parseInt(req.query.perpage) || 40;
    var page = parseInt(req.query.page) || 1;
    if (status) {
      dbQuery.status = status;
    }

    if (ads_type) {
      dbQuery.adsType = ads_type;
    }

    if (category) {
      dbQuery["adsInfo.category"] = category;
    }

    if (sub_category) {
      dbQuery["adsInfo.sub_category"] = sub_category;
    }

    if (title) {
      dbQuery["adsInfo.title"] = title;
    }

    if (product_condition) {
      dbQuery["adsInfo.product_condition"] = product_condition;
    }

    if (user_type) {
      dbQuery["adsInfo.user_type"] = user_type;
    }

    if (payment_mode) {
      dbQuery["adsInfo.payment_mode"] = payment_mode;
    }

    if (fullfilment) {
      dbQuery["adsInfo.fullfilment"] = fullfilment;
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
// console.log(dbQuery,"77777777777777777777777777777777777777777777777");
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
    let records = await postBuySellAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
      .sort(sortval)
      .skip(perPage * page - perPage)
      .limit(perPage);
      const totalCount = await postBuySellAd.find({
        $or: [queryFinal],
      });
      let responseModelCount = totalCount.length;
   
    if (records) {
      const currentDate = new Date();
      const currentDateOnly = currentDate.toISOString().substring(0, 10);
      // Calculate the total view count
      let sadsid
      records.forEach((job) => {
        sadsid= job.adsType
        totalViewCount += job.viewCount;
        if (
          job.createdAt.toISOString().substring(0, 10) === currentDateOnly
        ) {
          todayViewCount += job.viewCount;
          todayRecordsCount += 1;
        }
      });
      const paymentStatus = "confirmed"; // Replace with the actual payment_status value you want to search for

      // Calculate the start and end dates for today
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set the time to the beginning of the day (midnight)
      const endDate = new Date(today); // Create a copy of the start date
      endDate.setDate(today.getDate() + 1); // Set the end date to the next day
      
      const query = {
        $and: [
          { ads_type: sadsid },
          // { payment_status: paymentStatus },
          {
            createdAt: {
              $gte: today,
              $lt: endDate,
            },
          },
        ],
      };
      const query2 = {
        $and: [
          { ads_type: sadsid },
          // { payment_status: paymentStatus },
        ],
      };
      
      let reve = await paymentModel.find(query2);
      let treve = await paymentModel.find(query);
      let totalAmountSum = 0;
      for (const payment of reve) {
        totalAmountSum += payment.total_amount;
      }
    
      let totayAmountSum = 0;
      for (const payment of treve) {
        totayAmountSum += payment.total_amount;
      }
     
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
        totalViewCount: totalViewCount, // Include total view count in the response
        todayViewCount: todayViewCount, 
        todayRecordsCount:todayRecordsCount,
        totalrevenue:totalAmountSum,
        todayrevenue:totayAmountSum,// 
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
    let checkId = await postBuySellAd.findOne({_id:adsId})
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
    let records = await postBuySellAd.findOne(data_Obj)
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
      return failureJSONResponse(res, { message: `ad not Available` });
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

      let records = await  postBuySellAd.findOneAndDelete(dbQuery);
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