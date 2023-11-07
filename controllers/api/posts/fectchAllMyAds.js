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
  BannerSchema = mongoose.model("Banner"),
  viewModel = mongoose.model("Post_view"),
  NotificationsSchema = mongoose.model("notification"),
  UserModel = mongoose.model("user"),
  {
    successJSONResponse,
    failureJSONResponse,
    successJSONResponseWithPagination,
    ModelNameByAdsType,
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
let dynamicRoom = require("./rentRooms");
let dynamicJob = require("./jobs");
let dynamicBiz = require("./bizAndServices");
let dynamicBaby = require("./babbysitter & nannis");
let dynamicBuysell = require("./buy&sell");
let dynamicEvent = require("./event");
const { CallPage } = require("twilio/lib/rest/api/v2010/account/call");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { findByIdAndUpdate } = require("../../../model/otp");

////////////////


exports.fetchAllMyAds = async (req, res, next) => {
  try {
    let maxDistance = req.query.maxDistance || 200;
    let adstype = req.query.adsType;
    var perPage = 10 || parseInt(req.query.perpage);
    var page = parseInt(req.query.page) || 1;
    let dbquery = {};
    if (req.query.userId) {
      dbquery = req.body.userid;
    } else if (req.body.userId) {
      dbquery = req.body.userid;
    }
    if (!adstype)
      return failureJSONResponse(res, {
        message: `Please provide post type id`,
      });
    else if (adstype && !isValidMongoObjId(mongoose, adstype))
      return failureJSONResponse(res, {
        message: `Please provide valid post type id`,
      });

    let findCategory = await category.findOne({ _id: adstype });

    if (!findCategory) {
      return failureJSONResponse(res, {
        message: `Category not found`,
      });
    }
    if (req.query.longitude && req.query.latitude) {
      // Assuming you have longitude and latitude fields in your data
      dbquery["adsInfo.location.coordinates"] = {
        $geoWithin: {
          $centerSphere: [
            [parseFloat(req.query.longitude), parseFloat(req.query.latitude)],
            maxDistance / 6371, // 6371 is the Earth's radius in kilometers
          ],
        },
      };
    }
    switch (findCategory.name) {
      case "Babysitters and Nannies":
        successJSONResponseWithPagination(
          res,
          babysitterAd,
          page,
          perPage,
          dbquery
        );
        break;
      case "Buy & Sell":
        successJSONResponseWithPagination(
          res,
          buysellAd,
          page,
          perPage,
          dbquery
        );
        break;
      case "Local Biz and services":
        successJSONResponseWithPagination(res, bizAd, page, perPage, dbquery);
        break;
      case "Events":
        successJSONResponseWithPagination(res, eventAd, page, perPage, dbquery);
        break;
      case "Job":
        successJSONResponseWithPagination(res, jobsAd, page, perPage, dbquery);
        break;
      case "Rentals":
        successJSONResponseWithPagination(
          res,
          roomrentAd,
          page,
          perPage,
          dbquery
        );
        break;
      default:
        failureJSONResponse(res, {
          message: `Record not found`,
        });
        break;
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(
      res,
      { message: `something went wrong` },
      { error: err.message }
    );
  }
};
exports.CountMyAd = async (req, res, next) => {
  let MyId = req.userId;

  try {
    let adTypes = [
      { key: "job", label: "Jobs" },
      { key: "event", label: "Events" },
      { key: "Buy & Sell", label: "Buy & Sell" },
      { key: "babysitter & nannie", label: "Babysitters & Nannies" },
      { key: "Local_biz & Service", label: "Local Biz & Services" },
      { key: "rental", label: "Rentals" },
    ];
    let results = [];
    for (const adType of adTypes) {
      let YourModel = mongoose.model(adType.key);
      let checkAlreadyExist = await YourModel.find({ userId: MyId }).exec();
      const adTypeCount = checkAlreadyExist.length;
      results.push({ category: adType.label, count: adTypeCount });
    }
    return successJSONResponse(res, { message: `success`, results });
  } catch (error) {
    console.log(error);
    return failureJSONResponse(res, { message: `Something went wrong` });
  }
};
exports.fetchActive = async (req, res, next) => {
  let myid = req.userId
  let MyId = req.query.userId;
if(!MyId){
  return failureJSONResponse(res,  `Please provide Seller Id` );
}
  else if (MyId && !isValidMongoObjId(mongoose, MyId)){
    return failureJSONResponse(res,`Please provide valid Seller Id`);
  }
    
  try {
    let data =[]
    const mergedData = [];
    let commonPopulateOptions = [
      { path: "adsType", strictPopulate: false, select: "name" },
      { path: "adsInfo.image", strictPopulate: false, select: "url" },
      { path: "favoriteCount", select: "_id" },
      { path: "viewCount" },
      { path: "ReportCount" },
      { path: "ReportCount", select: "_id" },
      { path: "isReported", select: "userId", match: { userId: myid } },
      { path: "isFavorite", select: "user", match: { user: myid } },
    ];

    let commonSelectFields = {
      addons_validity: 1,
      "adsInfo.title": 1,
      "adsInfo.descriptions": 1,
      "adsInfo.location": 1,
      createdAt: 1,
      _id: 1,
      plan_validity:1,
    };
    let price_babysitterAd = {
      "adsInfo.expected_salary_amount": 1,
      "adsInfo.expected_salary_rate": 1,
    };
    let price_jobsAd = {
      "adsInfo.salary": 1,
      "adsInfo.salary_info": 1,
    };
    let price_buysellAd = {
      "adsInfo.price": 1,
      "price_drop": 1,
    };
    let price_eventAd = {
      "adsInfo.ticket_price": 1,
    };
    let price_roomrentAd = {
      "adsInfo.rent": 1,
      "adsInfo.rent_info": 1,
    };
    let mergedPrices = {
      price_babysitterAd,
      price_buysellAd,
      price_jobsAd,
      price_eventAd,
      price_roomrentAd,
    };

     let addsModel = {
       jobsAd: "job",
       eventAd: "event",
       buysellAd: "Buy & Sell",
        babysitterAd: "babysitter & nannie",
        bizAd: "Local_biz & Service",
        roomrentAd: "rental",
      };
      let combinedData = [];

      
      // Get the current date
      const currentDate = new Date();
      // Convert the date to ISO 8601 format
      const currentISODate = currentDate.toISOString();
    var dbQuery = {
      $and: [
        { status: "active" },
        { "plan_validity.expired_on": { $gte: currentISODate } },
        { userId: MyId }
      ]
    };
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    let adTypes = [
      { key: "job", label: "Jobs" ,value:{"adsInfo.salary": 1,
      "adsInfo.salary_info": 1,}},
      { key: "event", label: "Events",value:{ "adsInfo.ticket_price": 1} },
      { key: "Buy & Sell", label: "Buy & Sell",value:{"adsInfo.price": 1,
      "price_drop": 1} },
      { key: "babysitter & nannie", label: "Babysitters & Nannies" ,value:{
        "adsInfo.expected_salary_amount": 1,
        "adsInfo.expected_salary_rate": 1,
      }},
      { key: "Local_biz & Service", label: "Local Biz & Services"},
      { key: "rental", label: "Rentals" ,value:{
        "adsInfo.rent": 1,
        "adsInfo.rent_info": 1,
      }},
    ];
    let results = [];
    let adTypeCount;
    for (const adType of adTypes) {
      // for (let [modelLabel, modelName] of Object.entries(addsModel)) {

        let priceDefaultSelect = adType.value;
      console.log(priceDefaultSelect);
      let YourModel = mongoose.model(adType.key);
      let checkAlreadyExist = await YourModel.find(dbQuery)
        .populate(commonPopulateOptions)
        .select({
          ...commonSelectFields,
          ...priceDefaultSelect,
        })
        .exec();
// console.log(object); 
     
     adTypeCount = checkAlreadyExist;
      
    // }
    results.push(...adTypeCount);
  }
  let filterData;
      filterData = results.map((job) => {
        return {
          ...job._doc,

          price_default: job.price_default,
          view_count: job.viewCount,
          favorite_count: job.favoriteCount,
          is_favorite: !!job.isFavorite,
        };
      });
      let adonsData =[]
      adonsData.push(...filterData);

      mergedData.push(...adonsData);
  data = shuffleArray(mergedData);
    return successJSONResponse(res, { message: `success`, data });
  } catch (error) {
    console.log(error);
    return failureJSONResponse(res, { message: `Something went wrong` });
  }
};
exports.fetchAll = async (req, res, next) => {
  try {
    let myid;
    if (req.userId) {
      myid = req.userId || "0";
    }
    const {longitude, latitude, maxDistance,location_name} = req.query;
    console.log(myid,req.query,"----------");
    let Distance;

    if (maxDistance === "0" || !maxDistance) {
      Distance = 200000;
    } else {
      Distance = maxDistance * 1000;
    }
  let live_location = {};
    if (longitude && latitude && location_name) {
      live_location = {
        location_name:location_name,
        coordinates: [longitude, latitude],
      };
    }
    console.log(live_location,"-----------------");
    if(myid != "0"){
      if(longitude && latitude){
        await UserModel.findByIdAndUpdate(myid, { $set: { 'userBasicInfo.live_location': live_location } }, { new: true });
      }
    }
    let banner = await BannerSchema.find().populate({
      path: "image",
      strictPopulate: false,
      select: "url",
    });

    const adons_name = [
      "Homepage Gallery",
      "Urgent",
      "Upcoming Event",
      "Price Drop",
    ];
    const adons_nameLimit = {
      Homepage_Gallery: 3,
      Urgent: 4,
      Upcoming_Event: 16,
      Price_Drop: 16,
    };
    const adons_nameModelActive = {
      Homepage_Gallery: {
        babysitterAd: true,
        buysellAd: true,
        bizAd: true,
        eventAd: true,
        jobsAd: true,
        roomrentAd: true,
      },
      Urgent: {
        babysitterAd: true,
        buysellAd: true,
        bizAd: false,
        eventAd: false,
        jobsAd: true,
        roomrentAd: true,
      },
      Upcoming_Event: {
        babysitterAd: false,
        buysellAd: false,
        bizAd: false,
        eventAd: true,
        jobsAd: false,
        roomrentAd: false,
      },
      Price_Drop: {
        babysitterAd: false,
        buysellAd: true,
        bizAd: false,
        eventAd: false,
        jobsAd: false,
        roomrentAd: false,
      },
    };

    const mergedData = [];
    let commonPopulateOptions = [
      { path: "adsType", strictPopulate: false, select: "name" },
      { path: "adsInfo.image", strictPopulate: false, select: "url" },
      { path: "favoriteCount", select: "_id" },
      { path: "viewCount" },
      { path: "ReportCount" },
      { path: "ReportCount", select: "_id" },
      { path: "isReported", select: "userId", match: { userId: myid } },
      { path: "isFavorite", select: "user", match: { user: myid } },
    ];

    let commonSelectFields = {
      addons_validity: 1,
      "adsInfo.title": 1,
      "adsInfo.location": 1,
      createdAt: 1,
      _id: 1,
      plan_validity:1,
    };
    let price_babysitterAd = {
      "adsInfo.expected_salary_amount": 1,
      "adsInfo.expected_salary_rate": 1,
    };
    let price_jobsAd = {
      "adsInfo.salary": 1,
      "adsInfo.salary_info": 1,
    };
    let price_buysellAd = {
      "adsInfo.price": 1,
      price_drop: 1,
    };
    let price_eventAd = {
      "adsInfo.ticket_price": 1,
    };
    let price_roomrentAd = {
      "adsInfo.rent": 1,
      "adsInfo.rent_info": 1,
    };
    let mergedPrices = {
      price_babysitterAd,
      price_buysellAd,
      price_jobsAd,
      price_eventAd,
      price_roomrentAd,
    };

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    for (const adons of adons_name) {
      const adonsData = [];
      let adonsSlug = adons.replace(/\s+/g, "_");
      let dbQuery = {
        addons_validity: {
          $elemMatch: {
            name: adons,
            expired_on: {
              $gte: new Date().toISOString(), // Construct ISODate manually
            },
          },
        },
      };

      if (longitude && latitude && Distance) {
        const targetPoint = {
          type: "Point",
          coordinates: [longitude, latitude],
        };
        dbQuery["adsInfo.location.coordinates"] = {
          $near: {
            $geometry: targetPoint,
            $maxDistance: Distance,
          },
        };
      }

      let addsModel = {
        babysitterAd: "babysitter & nannie",
        buysellAd: "Buy & Sell",
        bizAd: "Local_biz & Service",
        eventAd: "event",
        jobsAd: "job",
        roomrentAd: "rental",
      };
      let combinedData = [];

      for (let [modelLabel, modelName] of Object.entries(addsModel)) {
        let priceDefaultSelect = `price_${modelLabel}`;
        let data = [];
        if (adons_nameModelActive[adonsSlug][modelLabel] == true) {
          let YourModel = mongoose.model(modelName);

          data = await YourModel.find(dbQuery)

            .populate(commonPopulateOptions)
            .select({
              ...commonSelectFields,
              ...mergedPrices[priceDefaultSelect],
            })
            .exec();

          data = shuffleArray(data);
        }
        let randomlyPickedData = data.slice(0, adons_nameLimit[adonsSlug]);

        combinedData = [...combinedData, ...randomlyPickedData];
      }

      let filterData;
      filterData = combinedData.map((job) => {
        return {
          ...job._doc,

          price_default: job.price_default,
          view_count: job.viewCount,
          favorite_count: job.favoriteCount,
          is_favorite: !!job.isFavorite,
        };
      });
      adonsData.push({
        name: adons,
        data: filterData,
      });

      mergedData.push(...adonsData);
    }
    const unseen_total = await NotificationsSchema.countDocuments({
      $and: [{ user_id: myid }, { status: "unseen" }],
    });

    return successJSONResponse(res, {
      message: "success",
      unseen_total: unseen_total,
      data: mergedData,
      banner,
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(
      res,
      { message: `something went wrong` },
      { error: err.message }
    );
  }
};

exports.removemedia = async (req, res, next) => {
  try {
    let userId = req.userId 
    
    const { ads_id, ads_type, image_id } = req.body;
   
    let {Typename} = await ModelNameByAdsType(ads_type)
     
     
    if(!Typename){
      return failureJSONResponse(res, {
        message: `Please provide valid adstype`,
        
       });
     }
     let dbQuery = {
      $and: [
        {
          "_id": ads_id, // Replace "ads_id" with the actual value you want to match
        },
        {
          "userId": userId,
        },
      ],
    };
    console.log(dbQuery,"--------------------------------------------------------------------------------------------------p--------gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg-");
     let YourModel = mongoose.model(Typename);
         let UpdateMedia= await YourModel.updateOne(
          dbQuery,
            {
              $pull: {
                "adsInfo.image": {
                  
                    $in: [image_id]
                 
                }
              }
            })
   if(UpdateMedia){
    return successJSONResponse(res, {
      message: "Media successfully removed",
     
    });
   }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(
      res,
      { message: `something went wrong` },
      { error: err.message }
    );
  }
};


exports.remove_accredation_media = async (req, res, next) => {
  try {
    let userId = req.userId 
    
    const { ads_id, ads_type, file_id } = req.body;
   
    let {Typename} = await ModelNameByAdsType(ads_type)
     
     
    if(!Typename){
      return failureJSONResponse(res, {
        message: `Please provide valid adstype`,
        
       });
     }
     let dbQuery = {
      $and: [
        {
          "_id": ads_id, // Replace "ads_id" with the actual value you want to match
        },
        {
          "userId": userId,
        },
      ],
    };
    console.log(dbQuery,"--------------------------------------------------------------------------------------------------p--------gggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg-");
     let YourModel = mongoose.model(Typename);
         let UpdateMedia= await YourModel.updateOne(
          dbQuery,
            {
              $pull: {
                "adsInfo.accreditation_file": {
                  "_id": { $in: file_id },
                },
              },
            })
   if(UpdateMedia){
    return successJSONResponse(res, {
      message: "Media successfully removed",
     
    });
   }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(
      res,
      { message: `something went wrong` },
      { error: err.message }
    );
  }
};
exports.editStatus = async (req, res, next) => {
  try {
    const {ads_id,ads_type,status} =req.query;
    let userId = req.userId
    let dbQuery={};
   
    if (!ads_id){
      return failureJSONResponse(res, {
        message: `Please provide valid ads id`,
        
      });
    } 
    if (!ads_type){
      return failureJSONResponse(res, {
        message: `Please provide valid adstype`,
       
      });
    }
   
     let {Typename} = await ModelNameByAdsType(ads_type)
     
     
     if(!Typename){
       return failureJSONResponse(res, {
         message: `Please provide valid adstype`,
         
        });
      }
      let yourModel = mongoose.model(Typename);


   
      if (status == 0) {
        let checkvalidity = await yourModel.findById(ads_id)
        const expiredDate = new Date(checkvalidity.plan_validity.expired_on);
         const currentDate = new Date();

         if (expiredDate <= currentDate) {
         console.log("The plan has expired.");
         
        return successJSONResponse(res, {
          message: `Your Ad plan has expired.`,
          status: 201,
        });
        }
        dbQuery.status = "active";
      }
      if (status == 1) {
        dbQuery.status = "inactive";
      }
      if (status == 2) {
        dbQuery.status = "draft";
      }
      if (status == 3) {
        let checkvalidity = await yourModel.findById(ads_id)
        const expiredDate = new Date(checkvalidity.plan_validity.expired_on);
         const currentDate = new Date();

         if (expiredDate <= currentDate) {
         console.log("The plan has expired.");
         
        return successJSONResponse(res, {
          message: `Your Ad plan has expired.`,
          status: 201,
        });
        }
        dbQuery.status = "active";
      }
      
     
    const updateJob = await yourModel.findOneAndUpdate(
      {$and: [{ userId: userId }, { _id: ads_id}]},
      { $set: dbQuery },
      { new: true }
    );

    if (updateJob) {
      return successJSONResponse(res, {
        message: `success`,
        update_ad:updateJob,
        status: 200,
      });
    } else {
      
      return failureJSONResponse(res, {
        message: `your not Owner of this ad`,
        
      });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, {
      message: `Something went wrong`,
    });
  }
};

exports.recomended_ads = async (req, res, next) => {
  try {
    let userId = req.userId
    let dbQuery={};
   
    if (!userId){
      return failureJSONResponse(res, {
        message: `Please login to your account`,
        
      });
    } 
  // let adType = ["event","rental","job","Local_biz & Service","Buy & Sell","babysitter & nannie"]
    const updateJob = await viewModel.aggregate([
      {
        $match: {
          userId: ObjectId("650d443efa1d18f52e7734d2")
        }
      },
      {
        $sort: {
          adType: 1,
          createdAt: -1
        }
      },
      {
        $group: {
          _id: "$adType",
          data: {
            $push: "$$ROOT"
          }
        }
      },
      {
        $project: {
          _id: 0,
          adType: "$_id",
          data: {
            $slice: ["$data", 3]
          }
        }
      },
      {
        $unwind: "$data"
      },
      {
        $replaceRoot: {
          newRoot: "$data"
        }
      },
      {
        $group: {
          _id: "$adType",
          data: {
            $push: "$$ROOT"
          }
        }
      }
    ]);
    
    const promises = [];

    updateJob.forEach((category) => {
      category.data.forEach((item) => {
        const adid = item.ad;
        const ads_type = item.ads_type;
    
        promises.push({
          adid,
          ads_type,
        });
      });
    });
    
    // Now, you can process these values as needed, for example:
     
    const recordPromises = promises.map(async (data) => {
      const adid = data.adid;
      const ads_type = data.ads_type;
    
      const { Typename } = await ModelNameByAdsType(ads_type);
    
      if (!Typename) {
        return failureJSONResponse(res, {
          message: `Please provide a valid adstype`,
        });
      }
    
      const YourModel = mongoose.model(Typename);
      // console.log(YourModel);
      const record = await YourModel.findById(adid);
      let dbQuery ={}
      dbQuery.status = "active";
      if(Typename== "rental"){
        dbQuery["adsInfo.category"] = record.adsInfo.category;
      }
      if(Typename== "babysitter & nannie"){
        dbQuery["adsInfo.category.category_name"] = record.adsInfo.category.category_name;
      }
      if(Typename== "event"){
        dbQuery["adsInfo.category"] = record.adsInfo.category;
      }
      if(Typename== "job"){
        dbQuery["adsInfo.categories"] = record.adsInfo.categories;
      }
      if(Typename== "Buy & Sell"){
        dbQuery["adsInfo.sub_category"] = record.adsInfo.sub_category;
      }
      if(Typename== "Local_biz & Service"){
        dbQuery["adsInfo.sub_categories"] = record.adsInfo.sub_categories;
      }
      // const record2 = await YourModel.find(adid);
      return record;
    });
    
    const recommendedAds = await Promise.all(recordPromises);
    
    

    if (updateJob) {
      return successJSONResponse(res, {
        message: `success`,
        recomended_ads:recommendedAds,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Recomended Ads not Available`,
      });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, {
      message: `Something went wrong`,
    });
  }
};

exports.search = async (req, res, next) => {
  try {
    let searchTerm = req.query.search_term || "";
    let dbQuery = {};
    let filterd =[];
    const {
      userId,
      status,
      sortBy,
      longitude,
      latitude,
      maxDistance, 
      amount,
      add_on,
      min_price,
      max_price,
      is_favorite,
      is_myad,
    } = req.query;
    
    let commonSelectFields = {
      addons_validity: 1,
      "adsInfo.title": 1,
      "adsInfo.location": 1,
      createdAt: 1,
      _id: 1,
    };
    const sortval = sortBy === "Oldest" ? { 'plan_validity.active_on': 1 } : { 'plan_validity.active_on': -1 };
    let Distance;

    if (maxDistance === "0" || !maxDistance) {
      Distance = 200000;
    } else {
      Distance = maxDistance * 1000;
    }
    if (longitude && latitude && Distance) {
      const targetPoint = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
     
      dbQuery["adsInfo.location.coordinates"] = {
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance,
        },
      };
    }

    if (amount) {
      // Add filter for rent amount
      dbQuery["adsInfo.rent.amount"] = { $lte: amount };
    }
    if (min_price && max_price) {
      dbQuery["adsInfo.rent.amount"] = {
        $gte: parseFloat(min_price),
        $lte: parseFloat(max_price),
      };
    }

    if (add_on) {
      dbQuery = {
        addons_validity: {
          $elemMatch: {
            name: add_on,
            expired_on: {
              $gte: new Date("2023-09-18").toISOString(), // Construct ISODate manually
            },
          },
        },
      };
    }

    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    let myid = req.userId;
    if (is_myad == "true" && !myid) {
      return failureJSONResponse(res, {
        message: "Please login to your account",
      });
    }
    if (is_myad != "true") {
      
      dbQuery["plan_validity.expired_on"] = { $gte: currentISODate };
     
      
    } else {
      dbQuery.userId = myid;
      if (status == 0) {
        dbQuery.status = "active";
      }
      if (status == 1) {
        dbQuery.status = "inactive";
      }
      if (status == 2) {
        dbQuery.status = "draft";
      }
    }
    if (userId) dbQuery.userId = userId;
    let queryFinal = dbQuery;
    if (searchTerm) {
      queryFinal = {
        ...dbQuery,
        $or: [
          { "adsInfo.title": { $regex: searchTerm.trim(), $options: "i" } },
          { "adsInfo.tagline": { $regex: searchTerm.trim(), $options: "i" } },
          {"advertisement_id":searchTerm}
        ],
      };
    }

   if(searchTerm.length > 0){

 
    let records = await roomrentAd.find({
      $or: [queryFinal],
    })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "viewCount" })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      }).select({ addons_validity: 1,
        "adsInfo.title": 1,
        "adsInfo.location": 1,
        createdAt: 1,
        advertisement_id:1,
        _id: 1,
        "adsInfo.rent": 1,
        "adsInfo.rent_info": 1,})
      .sort(sortval);
      let records1 = await jobsAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      }).select({ addons_validity: 1,
        "adsInfo.title": 1,
        "adsInfo.location": 1,
        createdAt: 1,
        advertisement_id:1,
        _id: 1,
        "adsInfo.salary": 1,
        "adsInfo.salary_info": 1,})
      .sort(sortval);

     
      let records2 = await bizAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({
        path: "adsInfo.accreditation_file.file",
        strictPopulate: false,
        select: "url",
      })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      }).select({ addons_validity: 1,
        "adsInfo.title": 1,
        "adsInfo.location": 1,
        createdAt: 1,
        advertisement_id:1,
        _id: 1,})
      .sort(sortval);
      let records3 = await eventAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      }).select({ addons_validity: 1,
        "adsInfo.title": 1,
        "adsInfo.location": 1,
        createdAt: 1,
        advertisement_id:1,
        _id: 1,
        "adsInfo.ticket_price": 1,})
      .sort(sortval);
      let records4 = await buysellAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      }).select({ addons_validity: 1,
        "adsInfo.title": 1,
        "adsInfo.location": 1,
        createdAt: 1,
        advertisement_id:1,
        _id: 1,
        "adsInfo.price": 1,
        price_drop: 1,})
      .sort(sortval);
      let records5 = await babysitterAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "ReportCount" })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      }).select({ addons_validity: 1,
        "adsInfo.title": 1,
        "adsInfo.location": 1,
        createdAt: 1,
        advertisement_id:1,
        _id: 1,
        "adsInfo.expected_salary_amount": 1,
        "adsInfo.expected_salary_rate": 1,})
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .sort(sortval);
    
   filterd = [...records,...records1,...records2,...records3,...records4,...records5]
  }
    if (filterd) {
    
      let jobData = filterd.map((job) => {
      
        return {
          ...job._doc,
          // Add other job fields as needed
          view_count: job.viewCount,
          favorite_count: job.favoriteCount,
          is_favorite: !!job.isFavorite,
          Report_count: job.ReportCount,
          is_Reported: !!job.isReported,
        };
      }); //////
      const isFavoriteFilter = is_favorite === "true" ? true : undefined;
      if (isFavoriteFilter) {
        jobData = jobData.filter((job) => job.is_favorite === true);
      }

      // Pagination
      const totalCount = jobData.length;
      const perPage = parseInt(req.query.perpage) || 40;
      const page = parseInt(req.query.page) || 1;

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
        // Shuffle the sorted data
        for (let i = jobData.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [jobData[i], jobData[j]] = [jobData[j], jobData[i]];
        }
      // jobData.sort((a, b) => a.createdAt - b.createdAt);

    
      const paginatedData = jobData.slice(startIndex, endIndex);
   
      let finalResponse = {
        message: `success`,
        total: totalCount,
        perPage: perPage,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        records: paginatedData,
        status: 200,
       
      };
      return successJSONResponse(res, finalResponse);
    } else {
      return failureJSONResponse(res, { message: `ads not Available` });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};



