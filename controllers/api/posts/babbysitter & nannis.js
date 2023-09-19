const { json } = require("express");
const crypto = require('crypto');
const mongoose = require("mongoose"),
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

///-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
  // let adtype = req.query.ads_type;
  let records = await tagline_keywords
    .find()
    .select({ keywords: 1, _id: 1 });
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
    // console.log(req.body, "ye boDY HAI");
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
    // if (countryCode && isNaN(Number(countryCode)))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid country code`,
    // });
    // if(preferableModeContact){
    //   if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".") ){
    //     return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
    //   } else if (preferableModeContact != 1 && preferableModeContact != 2  && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });}
    // }
    // if (preferableModeContact && isNaN(Number(preferableModeContact))){
    //   return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
    // }
    if (email_address && !isValidEmailAddress(email_address)) {
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
    }

    // console.log("isValidBoolean(hideAddress)",typeof isValidBoolean(hideAddress));

    // if (["true", "false"].includes(hideAddress) == false) {
    //   return failureJSONResponse(res, {
    //     message: `Please provide us hide/show address (true/false)`
    //   })
    // }

    // if (phoneNumber && !isValidIndianMobileNumber(phoneNumber))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid phone number`,
    // });

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
      is_contact
    } = req.body;
    // console.log(req.body);
    const userId = req.userId;
    const imageArr = [];
    let iscontact;
    // console.log(typeof(is_contact),"===============");
    if (is_contact == "true") {
      iscontact = true;
    }else{
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
    // console.log(req.files,"qwertyuikol;nhbvfcdxsdfghjkjhgfds");
    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
    }

    const dataObj = {
      isfeatured,
      status: status,
      adsType:ads_type,
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
        description,
        location:{
          location_name:location_name,
          coordinates:[longitude,latitude]
        },
        tagline,
        image: imageArr,
      },

      userId: userId,
    };
    // console.log(dataObj, "vhebjvbdsgjvhbesdvgbedhcvwsehjcbsdbvjhyudsbvghr");
    const newPost = await postbabyAd.create(dataObj);
    const stringToHash = newPost._id.toString();
    const hash = await crypto.createHash('sha256').update(stringToHash).digest('hex');
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % (Math.pow(10, 10));
    let ad_Id = numericHash.toString().padStart(10, '0') 
  
   await postbabyAd.findByIdAndUpdate({_id:newPost._id},{$set:{advertisement_id:ad_Id}})
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
  // console.log(`kejhrjhyewgrjhew`);
  try {
    // console.log(req.params);
    const productId = req?.params?.productId;
    // console.log(productId, "id dsso hai gi ja nhi ");
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
      is_contact
    } = req.body;
    let iscontact;
    // console.log(typeof(is_contact),"===============");
    if (is_contact == "true") {
      // console.log(is_contact,"===============");
      iscontact = true;
    }else{
      iscontact = false;
    }
    // console.log(
    //   tagline,
    //   "vdhvdbhdbvhdbvhdvdbdhvbdh----------------------------------------"
    // );
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
    const imageArr = [];
    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
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
    if (amount || is_contact == "true") adsInfoObj.expected_salary_amount = expected_salary_amount;
    if (expected_salary_rate)
      adsInfoObj.expected_salary_rate = expected_salary_rate;
    if (description) adsInfoObj.description = description;
    let locationobj={}
    if(longitude && latitude){
      locationobj={
        coordinates:[longitude,latitude]
      }
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
      max_price
    } = req.query;
    console.log(req.query,"jassi ki jai");
    if (is_contact !== undefined) {
      // Add filter for is_contact
      dbQuery["adsInfo.expected_salary_amount.is_contact"] = is_contact === true || is_contact === "true";
    }
    if (min_price && max_price) {
      dbQuery["adsInfo.expected_salary_amount.amount"] = {
        $gte: parseFloat(min_price),
        $lte: parseFloat(max_price)
      };
    }
    if (amount) {
      // Add filter for rent amount
      dbQuery["adsInfo.expected_salary_amount.amount"] = { $lte: amount };
    }
    if (add_on){
      // Add filter for rent amount
      dbQuery["addons_validity.name"] = add_on;
    }
    // console.log(req.query,"---------------");
    const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
    let Distance
    
    if(maxDistance === "0" || !maxDistance){
      // console.log("bol");
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

    if (category) {
      dbQuery["adsInfo.category.category_name"] = category;
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
    let notification = await Users.findOne({_id:myid}).select('userNotification.careService')
    let valueofnotification = notification?.userNotification?.careService;
    let records = await postbabyAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "ReportCount" })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({ path: 'isReported', select: 'userId', match: { userId: myid } })
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
          // Add other job fields as needed
          view_count: job.viewCount,
          favorite_count: job.favoriteCount,
          is_favorite: !!job.isFavorite, 
          Report_count: job.ReportCount,
          is_Reported: !!job.isReported, 
        };
      });
      return successJSONResponse(res, {
        message: `success`,
        total: responseModelCount,
        perPage: perPage,
        totalPages: Math.ceil(responseModelCount / perPage),
        currentPage: page,
        notification:valueofnotification,
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

////

exports.fetchonead = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    let data_Obj
    let checkId = await postbabyAd.findOne({_id:adsId})
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
    let records = await postbabyAd.findOne(data_Obj)
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
};

exports.fetchBabyData = async (req, res, next) => {
  try {
    let maxDistance = req.query.maxDistance || 200;
    const sub_categories = {
      "Babysitter & nannies": [
        "I want a Babysitter/Nanny", 
        "I am a Babysitter/Nanny"
      ],
    };
    
    const responseArray = [];
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];

      for (const subCategory of subCategoryArray) {
        const query = {"adsInfo.category.category_name": subCategory ,"status" :"active",["plan_validity.expired_on"]:{ $gte: currentDateOnly }};
        if (req.query.longitude && req.query.latitude) {
          // Assuming you have longitude and latitude fields in your data
          query["adsInfo.location.coordinates"] = {
            $geoWithin: {
              $centerSphere: [
                [parseFloat(req.query.longitude), parseFloat(req.query.latitude)],
                maxDistance / 6371 // 6371 is the Earth's radius in kilometers
              ]
            }
          };
        }
        const count = await postbabyAd.countDocuments(query);
        subcategoryData.push({ sub_category_name: subCategory, count });
      }

      const totalCount = subcategoryData.reduce((total, item) => total + item.count, 0);

      responseArray.push({
        name: category,
        count: totalCount,
        sub_categories: subcategoryData,
      });
    }

    // console.log(responseArray);

    return successJSONResponse(res, {
      message: `success`,
      data: responseArray,
    });
  } catch (error) {
    console.error('Error:', error);
    return failureJSONResponse(res, {
      message: 'An error occurred',
      error: error.message,
    });
  }
};