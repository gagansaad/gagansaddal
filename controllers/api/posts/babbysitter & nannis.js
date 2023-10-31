const { json } = require("express");
const crypto = require("crypto");
const { mongoose, ObjectId, modelNames } = require("mongoose"),
  postbabyAd = mongoose.model("babysitter & nannie"),
  PostViews = mongoose.model("Post_view"),
  Media = mongoose.model("media"),
  tagline_keywords = mongoose.model("keywords"),
  Users = mongoose.model("user"),
  {
    successJSONResponse,
    failureJSONResponse,
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
  } = require(`../../../utils/validators`);


  exports.fetchOneUpdate = async (req, res, next) => {
    try {
      if (!req.query.ads_id) {
        return failureJSONResponse(res, { message: "Please provide adsId" });
      }
      if (!req.userId) {
        return failureJSONResponse(res, { message: "Please provide UserId" });
      }
  
      let dbQuery = {
        $and: [
          { _id: req.query.ads_id },
          { userid: req.userId }
        ]
      };
  
      let updateFields = {
        $set: {
          status: "deleted",
          deletedAt: new Date().toISOString()// Add your temporary field and its value here
        }
      };
  
      let records = await postbabyAd.update(dbQuery, updateFields, { new: true });
  
      if (records) {
        return successJSONResponse(res, {
          message: "Success",
          status: 200,
          
        });
      } else {
        return failureJSONResponse(res, { message: "Ad not available" });
      }
    } catch (err) {
      return failureJSONResponse(res, { message: "Something went wrong" });
    }
  };
  
///-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
  // let adtype = req.query.ads_type;
  let records = await tagline_keywords.find().select({ keywords: 1, _id: 1 });
  const dynamicsData = {
    tagline: records,
    category: ["I want a Babysitter/Nanny", "I am a Babysitter/Nanny"],
    currency: ["USD", "AED", "AUD", "AWG", "CAD", "EUR", "GBP", "INR", "USN"],
    work_type: ["Live in", "Live in & out", "Live out"],
    care_service_need: [
      "Childcare Duties",
      "Educational Activities",
      "Homework Assistance",
      "Light Cooking only for Babies",
      "Light Household Chores",
    ],
    care_service_offer: [
      "Childcare Duties",
      "Educational Activities",
      "Homework Assistance",
      "Light Cooking only for Babies",
      "Light Household Chores",
      "Storytelling",
    ],
    age_group_need: [
      "0-6 month",
      "6 month - 3 years",
      "3-5 years",
      "5-10 years",
      "10-13 years",
      "above 13",
      "any age",
    ],
    age_group_offer: [
      "0-6 month",
      "6 month - 3 years",
      "3-5 years",
      "5-10 years",
      "10-13 years",
      "above 13",
      "any age",
    ],
    preferrd_languge_need: [
      "English",
      "Amharic",
      "Afan Oromo",
      "Tigrigna",
      "Arabic",
      "French",
      "Other",
    ],
    preferrd_languge_offer: [
      "English",
      "Amharic",
      "Afan Oromo",
      "Tigrigna",
      "Arabic",
      "French",
      "Other",
    ],
    preferrd_gender_need: ["Male", "Female", "Any Gender"],
    preferrd_gender_offer: ["Male", "Female"],
    transport_facilty_need: ["Yes", "No"],
    transport_facilty_offer: ["Yes", "No"],
    expected_salary_rate_need: [
      "/hour",
      "/day",
      "/week",
      "/month",
      "/biweekly",
      "fixed amount",
    ],
    expected_salary_rate_offer: [
      "/hour",
      "/day",
      "/week",
      "/month",
      "/biweekly",
      "fixed amount",
    ],
  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validateAdsData = async (req, res, next) => {
  try {
    const {
      status,
      ads_type,
      category_value,
      category_name,
      work_type,
      care_service,
      age_group,
      prefered_language,
      prefered_gender,
      service_from_date,
      amount,
      description,
      location_name,
      tagline,
      latitude,
      longitude,
    } = req.body;
    if (
      status &&
      status != `active` &&
      status != `inactive` &&
      status != `draft`
    )
      return failureJSONResponse(res, {
        message: `Please enter status active inactive or draft`,
      });
    if (!latitude && !longitude) {
      return failureJSONResponse(res, {
        message: `Please provide both latitude and longitude`,
      });
    }
    if (!ads_type)
      return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (ads_type && !isValidMongoObjId(mongoose, ads_type))
      return failureJSONResponse(res, {
        message: `Please provide valid ads type`,
      });

    // if(category_name)
    if (!isValidString(category_name))
      return failureJSONResponse(res, {
        message: `Please provide valid category_name`,
      });
    if (!isValidString(category_value))
      return failureJSONResponse(res, {
        message: `Please provide valid category_value`,
      });
    if (work_type && !isValidString(work_type))
      return failureJSONResponse(res, {
        message: `Please provide valid work type`,
      });
    // if (!isValidString(care_service))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid care service`,
    // });
    // if (!isValidString(age_group))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid age group`,
    // });
    // if (!isValidString(prefered_language))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid prefered language`,
    // });
    // if (!isValidString(prefered_gender))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid prefered gender`,
    //   });
    if (service_from_date && !isValidString(service_from_date))
      return failureJSONResponse(res, {
        message: `Please provide valid service starting date`,
      });
    if (amount && isNaN(Number(amount)))
      return failureJSONResponse(res, {
        message: `please provide valid salary amount`,
      });

    if (!isValidString(description))
      return failureJSONResponse(res, {
        message: `Please provide valid description`,
      });
    if (!isValidString(location_name))
      return failureJSONResponse(res, {
        message: `Please provide valid location`,
      });
    // if (tagline && !isValidString(tagline))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid tagline`,
    //   });

    return next();
  } catch (err) {
    console.log(err);
  }
};
//////////////
exports.validateListerBasicinfo = async (req, res, next) => {
  try {
    const {
      email_address,
      // phoneNumber,
      // countryCode,
      hide_adress,
      preferableModeContact,
    } = req.body;

    if (email_address && !isValidEmailAddress(email_address)) {
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
    }

    return next();
  } catch (err) {
    console.log(err);
  }
};
////-----------------------Create babbysitter & nannis------------------------------//

exports.createAds = async (req, res, next) => {
  try {
    const {
      title,
      isfeatured,
      status,
      ads_type,
      category_value,
      category_name,
      work_type,
      care_service,
      age_group,
      prefered_language,
      prefered_gender,
      service_from_date,
      transport_facilty,
      amount,
      currency,
      expected_salary_rate,
      description,
      location_name,
      longitude,
      latitude,
      tagline,
      image,
      is_contact,
    } = req.body;

    const userId = req.userId;
    const imageArr = [];
    let iscontact;
    if (is_contact == "true") {
      iscontact = true;
    } else {
      iscontact = false;
    }
    let taglines = tagline;
    if (taglines) {
      for (i = 0; i < taglines.length; i++) {
        let tags = await tagline_keywords.findOne({ keywords: taglines[i] });
        if (!tags) {
          let tag = {
            keywords: taglines[i],
            ads_type: ads_type,
          };
          await tagline_keywords.create(tag);
        }
      }
    }
    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
    }

    const dataObj = {
      isfeatured,
      status: status,
      adsType: ads_type,
      adsInfo: {
        title,
        category: {
          category_value,
          category_name,
        },
        work_type,
        care_service,
        age_group,
        prefered_language,
        prefered_gender,
        service_from_date,
        transport_facilty,
        expected_salary_amount: {
          amount,
          currency,
          is_contact: iscontact,
        },
        expected_salary_rate,
        descriptions:description,
        location: {
          location_name: location_name,
          coordinates: [longitude, latitude],
        },
        tagline,
        image: imageArr,
      },

      userId: userId,
    };
    const newPost = await postbabyAd.create(dataObj);
    const stringToHash = newPost._id.toString();
    const hash = await crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % Math.pow(10, 10);
    let ad_Id = numericHash.toString().padStart(10, "0");

    await postbabyAd.findByIdAndUpdate(
      { _id: newPost._id },
      { $set: { advertisement_id: ad_Id } }
    );
    const Babysitter_Nannies = {};

    for (let key in newPost.toObject()) {
      if (
        !fieldsToExclude.hasOwnProperty(String(key)) &&
        !listerBasicInfo.hasOwnProperty(String(key))
      ) {
        Babysitter_Nannies[key] = newPost[key];
      }
    }

    if (newPost) {
      return successJSONResponse(res, {
        message: `success`,
        Babysitter_Nannies: Babysitter_Nannies,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        Babysitter_Nannies: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

///--------------------------Edit babbysitter & nannis-----------------------------///

exports.editAds = async (req, res, next) => {
  try {
    const productId = req?.params?.productId;
    const validate_id = await postbabyAd.findById(productId);
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your babysitter and nannies id`,
      });
    }
    const {
      title,
      status,
      ads_type,
      category_value,
      category_name,
      work_type,
      care_service,
      age_group,
      prefered_language,
      prefered_gender,
      service_from_date,
      transport_facilty,
      amount,
      currency,
      expected_salary_rate,
      description,
      location_name,
      longitude,
      latitude,
      tagline,
      name,
      email_address,
      primary_phone_number,
      secondary_phone_number,
      website_link,
      hide_my_phone,
      hide_my_secondary_phone,
      hide_my_email,
      // hide_address,
      address_info,
      preferable_contact_mode,
      image,
      is_contact,
    } = req.body;
    let iscontact;
    if (is_contact == "true") {
      iscontact = true;
    } else {
      iscontact = false;
    }

    let taglines = tagline;
    if (taglines) {
      for (i = 0; i < taglines.length; i++) {
        let tags = await tagline_keywords.findOne({ keywords: taglines[i] });
        if (!tags) {
          let tag = {
            keywords: taglines[i],
            ads_type: ads_type,
          };
          await tagline_keywords.create(tag);
        }
      }
    }
    let imageArr = [];
    const existingRoomRents = await postbabyAd.findById(productId);
    if (existingRoomRents) {
      imageArr = imageArr.concat(existingRoomRents.adsInfo.image || []);
    }
    if (req.files && req.files.length > 0) {
      for (var i = 0; i < req.files.length; i++) {
        var thumbnail = req.files[i].path;
    
        productImages = await Media.create({ url: thumbnail });
        imageArr.push(productImages._id);
      }
      }
     
    let my_phone = false;
    let my_email = false;
    let secondary_phone = false;

    if (hide_my_secondary_phone == "true") {
      secondary_phone = true;
    } else if (hide_my_secondary_phone == "false") {
      secondary_phone = false;
    }
    if (hide_my_phone == "true") {
      my_phone = true;
    } else if (hide_my_phone == "false") {
      my_phone = false;
    }

    if (hide_my_email == "true") {
      my_email = true;
    } else if (hide_my_email == "false") {
      my_email = false;
    }

    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};
    let category = {};
    let expected_salary_amount = {};
    if (status) dataObj.status = status;
    if (ads_type) dataObj.adsType = ads_type;
    if (category_name) category.category_name = category_name;
    if (category_value) category.category_value = category_value;
    if (category_name) adsInfoObj.category = category;
    if (title) adsInfoObj.title = title;
    if (care_service) adsInfoObj.care_service = care_service;
    if (work_type) adsInfoObj.work_type = work_type;
    if (age_group) adsInfoObj.age_group = age_group;
    if (prefered_language) adsInfoObj.prefered_language = prefered_language;
    if (prefered_gender) adsInfoObj.prefered_gender = prefered_gender;
    if (service_from_date) adsInfoObj.service_from_date = service_from_date;
    if (transport_facilty) adsInfoObj.transport_facilty = transport_facilty;
    if (amount) expected_salary_amount.amount = amount;
    if (currency) expected_salary_amount.currency = currency;
    if (is_contact) expected_salary_amount.is_contact = iscontact;
    if (tagline) adsInfoObj.tagline = tagline;
    if (amount || is_contact == "true")
      adsInfoObj.expected_salary_amount = expected_salary_amount;
    if (expected_salary_rate)
      adsInfoObj.expected_salary_rate = expected_salary_rate;
    if (description) adsInfoObj.descriptions = description;
    let locationobj = {};
    if (longitude && latitude) {
      locationobj = {
        coordinates: [longitude, latitude],
      };
    }
    if (location_name) locationobj.location_name = location_name;
    if (locationobj) adsInfoObj.location = locationobj;

    if (name) listerBasicInfoObj.name = name;
    if (imageArr.length) adsInfoObj.image = imageArr;
    if (adsInfoObj && Object.keys(adsInfoObj).length) {
      dataObj.adsInfo = adsInfoObj;
    }

    const dataObjq = {
      adsInfo: adsInfoObj,
      lister_basic_info: {
        name,
        email_address,
        website_link,
        hide_my_phone: my_phone,
        hide_my_email: my_email,
        hide_my_secondary_phone: secondary_phone,
        address_info,
        primary_mobile_number: {
          country_code: +91,
          primary_phone_number: primary_phone_number,
        },
        secondary_mobile_number: {
          country_code: +91,
          secondary_phone_number: secondary_phone_number,
        },
        preferable_contact_mode: preferable_contact_mode,
      },
    };

    const updateproduct = await postbabyAd.findByIdAndUpdate(
      { _id: productId },
      { $set: dataObjq },
      { new: true }
    );

    // if(updateproduct && Object.keys(updateproduct).length){
    //   return  successJSONResponse(res, {
    //     message: `object full`
    // })
    // } else{
    //   return  failureJSONResponse(res, {
    //     message: `object empty`
    // })
    // }

    let BabysitterNannies = {};

    for (let key in updateproduct.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        BabysitterNannies[key] = updateproduct[key];
      }
    }

    if (updateproduct) {
      return successJSONResponse(res, {
        message: `success`,
        Babysitter_Nannies: BabysitterNannies,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updateproduct: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/////----------------------Update Job Status -------------------/////

// exports.editJobStatus = async (req, res, next) => {
//   console.log(`kejhrjhyewgrjhew`);
//   try {
//     const jobId = req?.params?.jobId;

//     if (!jobId)
//       return successJSONResponse(res, {
//         message: `success`,
//         newJobPost,
//         status: 200,
//       });
//     const dataObj = {};
//     const { status } = req.body;

//     if (status) dataObj.status = parseInt(status);

//     const updateJob = await postJobAd.findByIdAndUpdate(
//       { _id: jobId },
//       { $set: dataObj },
//       { new: true }
//     );

//     if (updateJob) {
//       return successJSONResponse(res, {
//         message: `success`,
//         updateJob,
//       });
//     } else {
//       return failureJSONResponse(res, {
//         message: `Something went wrong`,
//         updatejob: null,
//       });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

//////////////
exports.fetchAll = async (req, res, next) => {
  try {
    let searchTerm = req.query.search_term || "";
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
      add_on,
      amount,
      is_contact,
      min_price,
      max_price,
      is_favorite,
      is_myad,
    } = req.query;
    let adOnsQuery = {};
    if (is_contact !== undefined) {
      // Add filter for is_contact
      dbQuery["adsInfo.expected_salary_amount.is_contact"] =
        is_contact === true || is_contact === "true";
    }
    if (min_price && max_price) {
      dbQuery["adsInfo.expected_salary_amount.amount"] = {
        $gte: parseFloat(min_price),
        $lte: parseFloat(max_price),
      };
    }
    if (amount) {
      // Add filter for rent amount
      dbQuery["adsInfo.expected_salary_amount.amount"] = { $lte: amount };
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
      adOnsQuery["adsInfo.location.coordinates"] = {
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance,
        },
      };
      // dbQuery["adsInfo.location.coordinates"] = {
      //   $near: {
      //     $geometry: targetPoint,
      //     $maxDistance: Distance,
      //   },
      // };
    }
    let locationQuery = {}; // Separate object for location filter

    if (longitude && latitude && Distance) {
      const targetPoint = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      locationQuery["adsInfo.location.coordinates"] = {
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance,
        },
      };
    }
    let addOnsQuery = {}; // Separate object for add_on filter

    if (add_on) {
      addOnsQuery = {
        addons_validity: {
          $elemMatch: {
            name: add_on,
            expired_on: {
              $gte: new Date().toISOString(),
            },
          },
        },
      };
    }

    var perPage = parseInt(req.query.perpage) || 40;
    var page = parseInt(req.query.page) || 1;

    

    if (category_value) {
      dbQuery["adsInfo.category.category_value"] = category_value;
    }

    if (category) {
      dbQuery["adsInfo.category.category_name"] = category;
      adOnsQuery["adsInfo.category.category_name"] = category;

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
    let myid = req.userId;
    if (is_myad == "true" && !myid) {
      return failureJSONResponse(res, {
        message: "Please login to your account",
      });
    }
    if (is_myad != "true") {
      adOnsQuery.status = "active";
      adOnsQuery["plan_validity.expired_on"] = { $gte: currentISODate };
      dbQuery.status = "active";
      dbQuery["plan_validity.expired_on"] = { $gte: currentISODate };
    } else {
      if (status == 0) {
        dbQuery.status = "active";
      }
      if (status == 1) {
        dbQuery.status = { $in: ["inactive", "deleted"] };
      }
      if (status == 2) {
        dbQuery.status = "draft";
      }
      dbQuery.userId = myid;
    }
    dbQuery ={  ...dbQuery,
      ...locationQuery,
      ...addOnsQuery,}
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

    let notification = await Users.findOne({ _id: myid }).select(
      "userNotification.careService"
    );
    let valueofnotification = notification?.userNotification?.careService;
   
      let featuredData;
      let bumpupData;
      let commonId;
      if (is_myad != "true" && !searchTerm) {
        let FeaturedData = await postbabyAd
          .find({
            ...adOnsQuery,
            addons_validity: {
              $elemMatch: {
                name: "Featured",
                expired_on: {
                  $gte: currentDateOnly, // Construct ISODate manually
                },
              },
            },
          })
          .populate({
            path: "adsInfo.image",
            strictPopulate: false,
            select: "url",
          })
          .populate({ path: "favoriteCount", select: "_id" })
          .populate({ path: "viewCount" })
          .populate({
            path: "isFavorite",
            select: "user",
            match: { user: myid },
          });

        const featuredRecordsToPick = 6;
        const FeaturedpickedRecords = [];

        while (
          FeaturedpickedRecords.length < featuredRecordsToPick &&
          FeaturedData.length > 0
        ) {
          const randomIndex = Math.floor(Math.random() * FeaturedData.length);
          const randomRecord = FeaturedData.splice(randomIndex, 1)[0]; // Remove and pick the record
          FeaturedpickedRecords.push(randomRecord);
        }

        featuredData = FeaturedpickedRecords.map((job) => {
          return {
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
          };
        });
        /////
        let excludedIds = featuredData.map(featuredItem => featuredItem._id)
        let BumpupData = await postbabyAd
          .find({ ...adOnsQuery, "addons_validity.name": "Bump up" , _id: { $nin: excludedIds }})
          .populate({
            path: "adsInfo.image",
            strictPopulate: false,
            select: "url",
          })
          .populate({ path: "favoriteCount", select: "_id" })
          .populate({ path: "viewCount" })
          .populate({
            path: "isFavorite",
            select: "user",
            match: { user: myid },
          });

        let bumpUpDates = BumpupData.map((data) => {
          // Filter addons_validity to get only the "Bump up" addon
          let bumpUpAddon = data.addons_validity.find(
            (addon) => addon.name === "Bump up"
          );
          if (bumpUpAddon) {
            return {
              active_on: bumpUpAddon.active_on,
              expired_on: bumpUpAddon.expired_on,
              interval: bumpUpAddon.days, // Add the interval property
            };
          }
          return null; // If "Bump up" addon is not found, return null
        }).filter((dates) => dates !== null);

        const resultDates = [];

        for (const dateRange of bumpUpDates) {
          const { active_on, expired_on, interval } = dateRange;
          const startDate = new Date(active_on);
          const endDate = new Date(expired_on);
          const recordDates = []; // Create a separate array for each record

          while (startDate <= endDate) {
            recordDates.push(startDate.toISOString().split("T")[0]);
            startDate.setDate(startDate.getDate() + interval);
          }

          resultDates.push(recordDates); // Push the record's dates array into the result array
        }

        const today = new Date().toISOString().split("T")[0]; // Get today's date in the format "YYYY-MM-DD"

        // Filter adonsData to find records where resultDates array contains today's date
        const recordsWithTodayDate = BumpupData.filter((data, index) => {
          const recordDates = resultDates[index]; // Get the resultDates array for the current record
          return recordDates.includes(today);
        });

        const numberOfRecordsToPick = 3;
        const pickedRecords = [];

        while (
          pickedRecords.length < numberOfRecordsToPick &&
          recordsWithTodayDate.length > 0
        ) {
          const randomIndex = Math.floor(
            Math.random() * recordsWithTodayDate.length
          );
          const randomRecord = recordsWithTodayDate.splice(randomIndex, 1)[0]; // Remove and pick the record
          pickedRecords.push(randomRecord);
        }

        bumpupData = pickedRecords.map((job) => {
          return {
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
          };
        });
        let bumpId = bumpupData.map(featuredItem => featuredItem._id)
        commonId = [...excludedIds,...bumpId]
      }
      let query = {
        $or: [queryFinal]
      };
      
      if (commonId && commonId.length > 0) {
        query._id = { $nin: commonId };
      }
      let records = await postbabyAd
      .find(query)
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "ReportCount" })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .sort(sortval);

    // const totalCount = await postbabyAd.find({
    //   $or: [queryFinal],
    // });
    // let responseModelCount = totalCount.length;

    if (records) {
      let jobData = records.map((job) => {
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
      let totalCount = jobData.length; 
      let totalresult;
      if(is_myad == "true" || searchTerm){
        totalresult = totalCount
      }else{
        console.log(totalCount);
        totalresult = totalCount + bumpupData.length + featuredData.length
      }
      const perPage = parseInt(req.query.perpage) || 40;
      const page = parseInt(req.query.page) || 1;

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;

      const paginatedData = jobData.slice(startIndex, endIndex);
      let finalResponse = {
        message: `success`,
        total: totalresult,
        perPage: perPage,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        notification: valueofnotification,
        records: paginatedData,
        status: 200,
        ...(is_myad == "true"
          ? {}
          : { AdOnsData: { bumpupData, featuredData } }),
      };
      return successJSONResponse(res, finalResponse);
    } else {
      return failureJSONResponse(res, { message: `ads not Available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

////

exports.fetchonead = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    let data_Obj;
    let checkId = await postbabyAd.findOne({ _id: adsId });
    if (!checkId) {
      return failureJSONResponse(res, {
        message: `Please provide valid ad id`,
      });
    }
    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    if (adsId) {
      data_Obj = {
        _id: adsId,
        
      };
    }
    let myid = req.userId;
    let records = await postbabyAd
      .findOne(data_Obj)
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } });

    if (records) {
      const ads_type = records.adsType.toString();

      let { ModelName, Typename } = await ModelNameByAdsType(ads_type);
      let dbQuery = {
        userId: myid,
        ad: records._id,
        ads_type: ads_type,
        adType: Typename,
      };

      let checkview = await PostViews.findOne({
        $and: [{ userId: dbQuery.userId }, { ad: dbQuery.ad }],
      });
      if (!checkview) {
        let data = await PostViews.create(dbQuery);
      }
      const jobData = {
        ...records._doc,
        view_count: records.viewCount,
        favorite_count: records.favoriteCount,
        is_favorite: !!records.isFavorite,
        Report_count: records.ReportCount,
        is_Reported: !!records.isReported,
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
};

exports.fetchBabyData = async (req, res, next) => {
  try {
    let maxDistance = req.query.maxDistance || 200;
    const sub_categories = {
      "Babysitter & nannies": [
        "I want a Babysitter/Nanny",
        "I am a Babysitter/Nanny",
      ],
    };

    const responseArray = [];
    const lalcount = [];
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];

      for (const subCategory of subCategoryArray) {
        const query = {
          "adsInfo.category.category_name": subCategory,
          status: "active",
          ["plan_validity.expired_on"]: { $gte: currentISODate },
        };
        if (req.query.longitude && req.query.latitude) {
          // Assuming you have longitude and latitude fields in your data
          query["adsInfo.location.coordinates"] = {
            $geoWithin: {
              $centerSphere: [
                [
                  parseFloat(req.query.longitude),
                  parseFloat(req.query.latitude),
                ],
                maxDistance / 6371, // 6371 is the Earth's radius in kilometers
              ],
            },
          };
        }
        const count = await postbabyAd.countDocuments(query);
        subcategoryData.push({ sub_category_name: subCategory, count });
      }

      const totalCount = subcategoryData.reduce(
        (total, item) => total + item.count,
        0
      );
      lalcount.push(totalCount);
      responseArray.push({
        name: category,
        count: totalCount,
        sub_categories: subcategoryData,
      });
    }
    let RedZone = lalcount.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    return successJSONResponse(res, {
      message: `success`,
      totalCount: RedZone,
      data: responseArray,
    });
  } catch (error) {
    console.error("Error:", error);
    return failureJSONResponse(res, {
      message: "An error occurred",
      error: error.message,
    });
  }
};
