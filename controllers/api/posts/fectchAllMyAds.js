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
                  
                    $in: [file_id]
                 
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
         return failureJSONResponse(res, {
          message: `Your Ad plan has expired.`,
          
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
    const updateJob = await viewModel.find({ userId: userId }).populate({path:'ad', model: 'adType', match: { adType: { $in: "adType" } }})

    if (updateJob) {
      return successJSONResponse(res, {
        message: `success`,
        recomended_ads:updateJob,
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