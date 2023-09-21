const { json } = require("express");
const crypto = require('crypto');
const mongoose = require("mongoose"),
  postJobAd = mongoose.model("job"),
  PostViews = mongoose.model("Post_view"),
  Users = mongoose.model("user"),
  Media = mongoose.model("media"),
  tagline_keywords = mongoose.model("keywords"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidUrl,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
    isValidNumber,
  } = require(`../../../utils/validators`);

///-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
  
  let records = await tagline_keywords
    .find()
    .select({ keywords: 1, _id: 1 });

  const dynamicsData = {
    tagline: records,
    categories: [
      "Accounting and Finance",
      "Tax Services",
      "Bar and Restaurant",
      "Catering",
      "Cook",
      "Cheif",
      "Sales and Retail sales",
      "Day care",
      "Home Care",
      "Nursing Home",
      "Agent",
      "Cleaning and House Keeping",
      "Construction and trades",
      "Lawn and Garden",
      "Plumber",
      "Electrician",
      "Customer Service",
      "Drivers and Security",
      "Auto Mechanic",
      "General Labour",
      "Graphic and Geb design",
      "Hair Stylist and Salon",
      "Health Care",
      "Volunters",
      "NGO",
      "Real Estate",
      "Education",
      "Training",
      "Office Manager and Receptionist",
      "Interns and Students",
      "Programmers and Computer",
      "TV, Media ,Fashion",
      "Movie",
      "Other",
    ],

    type: [`Local Jobs`, `Remote Jobs`],

    language: [
      `English`,
      `Amharic`,
      `Afan Oromo`,
      `Tigrigna`,
      `Arabic`,
      `French`,
      `Other`,
    ],
    currency: ["USD", "AED", "AUD", "AWG", "CAD", "EUR", "GBP", "INR", "USN"],
    employment_type: [
      `Full-time`,
      `Part-time`,
      `Contract`,
      `Temporary`,
      `Please contact`,
    ],
    salary_info: [
      "/hour",
      "/day",
      "/week",
      "/month",
      "/biweekly",
      "/sqft",
      "fixed amount",
      "OBO",
      "Negotiable",
    ],
    work_authorization: [
      "Citizen",
      "Green Card",
      "Work Permit",
      "Visa",
      "Any Type",
    ],
    preferred_gender: [`Male`, `Female`],
    list_type: [
      "Offering - I have a job to offer",
      "Wanted - I am looking for a job",
    ],
  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validateJobAdsData = async (req, res, next) => {
  //   console.log(req.body)
  try {
    const {
      status,
      adsType,
      listing_type,
      title,
      descriptions,
      categories,
      type,
      role,
      employment_type,
      experience,
      language,
      amount,
      salary_info,
      no_of_opening,
      job_website_link,
      work_authorization,
      location_name,
      preferred_gender,
      image,
      video,
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
    if (!adsType)
      return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType))
      return failureJSONResponse(res, {
        message: `Please provide valid ads type`,
      });
      if (!latitude && !longitude) {
        return failureJSONResponse(res, {
          message: `Please provide both latitude and longitude`,
        });
      }
    if (!isValidString(listing_type))
      return failureJSONResponse(res, {
        message: `Please provide valid listing type`,
      });
    if (!isValidString(categories))
      return failureJSONResponse(res, {
        message: `Please provide valid job Category`,
      });
    if (!isValidString(type))
      return failureJSONResponse(res, {
        message: `Please provide valid job Type`,
      });
    // if (!isValidString(role))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid job Role/Skills`,
    //   });

    // if (!isValidString(employment_type))
    //   return failureJSONResponse(res, {
    //     message: "Please provide us your employment type",
    //   });
    if (!isValidString(title))
      return failureJSONResponse(res, {
        message: "Please provide us your job Title",
      });
    if (!isValidString(descriptions))
      return failureJSONResponse(res, {
        message: `please provide valid job Description`,
      });
    // if (!experience) return failureJSONResponse(res, {
    //   message: `Please provide us your experience`,
    // });

    // if (experience && (isNaN(Number(experience))))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us your experience`,
    //   });
    // if (!isValidString(language))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us the information about how many languages do you know`,
    //   });
    if (amount) {
      if (isNaN(Number(amount)))
        return failureJSONResponse(res, {
          message: `Please provide us valid salary amount`,
        });
    }

    // if (!isValidString(salary_info))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid salary info`,
    //   });
    if (no_of_opening) {
      if (isNaN(Number(no_of_opening)))
        return failureJSONResponse(res, {
          message: "Please provide number of jobs opening",
        });
      else if (
        no_of_opening <= 0 ||
        no_of_opening === "" ||
        no_of_opening === null ||
        no_of_opening.includes(".")
      )
        failureJSONResponse(res, {
          message: `Please provide valid number of job opening`,
        });
    }

    // if (!isValidString(preferred_gender))

    //   return failureJSONResponse(res, { message: "Please provide valid gender preferences" });
    // else if (preferred_gender != `Male` && preferred_gender != `Female` && preferred_gender != `Any Gender`) return failureJSONResponse(res, { message: `Please enter preferred_gender Male,Female or Any Gender` });
    // if (!job_website_link) return failureJSONResponse(res, {
    //   message: `Please provide valid job website`,
    // });
    // if (job_website_link && (!isValidUrl(job_website_link)))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid job website`,
    //   });
    // if (!video && !isValidUrl(video))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid video link`,
    // });
    // if (!isValidString(work_authorization))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us work authorization`,
    //   });
    if (!isValidString(location_name))
      return failureJSONResponse(res, {
        message: `Please provide us location`,
      });
    // if (!isValidString(tagline))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us tagline`,
    //   });
    return next();
  } catch (err) {
    console.log(err);
  }
};
exports.validateListerBasicinfo = async (req, res, next) => {
  try {
    const {
      email_address,
      // phoneNumber,
      // countryCode,
      hideAddress,
    } = req.body;

    // if (countryCode && isNaN(Number(countryCode)))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid country code`,
    // });
    // if (preferableModeContact) {
    //   if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".")) {
    //     return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
    //   } else if (preferableModeContact != 1 && preferableModeContact != 2 && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` }); }
    // }
    // if (preferableModeContact && isNaN(Number(preferableModeContact))) {
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

////-----------------------Create Job------------------------------//

exports.createJobAds = async (req, res, next) => {
  try {
    // console.log("hitt hoyi");
    const {
      isfeatured,
      status,
      adsType,
      listing_type,
      title,
      descriptions,
      categories,
      type,
      role,
      employment_type,
      experience,
      language,
      amount,
      currency,
      salary_info,
      no_of_opening,
      company_name,
      exp_title,
      exp_startdate,
      exp_enddate,
      work_authorization,
      preferred_gender,
      location_name,
      longitude,
      latitude,
      tagline,
      image,
      video,
    } = req.body;
  // console.log("gori gori body",req.body,"gori gori body");
    let taglines = tagline;
    if (taglines) {
      for (i = 0; i < taglines.length; i++) {
        let tags = await tagline_keywords.findOne({ keywords: taglines[i] });
        if (!tags) {
          let tag = {
            keywords: taglines[i],
            ads_type: adsType,
          };
          await tagline_keywords.create(tag);
        }
      }
    }

    const imageArr = [];
    if (req.files) {
      for (var i = 0; i < req.files.length; i++) {
        var thumbnail = req.files[i].path;

        productImages = await Media.create({ url: thumbnail });
        imageArr.push(productImages._id);
      }
    }

    const dataObj = {
      status: status,
      isfeatured,
      adsType,
      listing_type,
      adsInfo: {
        title,
        descriptions,
        title,
        descriptions,
        categories,
        type,
        role,
        employment_type,
        experience: experience,
        language,
        salary: {
          amount,
          currency,
        },
        salary_info,
        no_of_opening,
        work_authorization,
        location:{
          location_name:location_name,
          coordinates:[longitude,latitude]
        },
        tagline,
        preferred_gender: preferred_gender,
        image: imageArr,
        video,
      },
      userId: userId,
    };

    const newJobPost = await postJobAd.create(dataObj);
    const stringToHash = newJobPost._id.toString();
    const hash = await crypto.createHash('sha256').update(stringToHash).digest('hex');
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % (Math.pow(10, 10));
    let ad_Id = numericHash.toString().padStart(10, '0') 
  
   await postJobAd.findByIdAndUpdate({_id:newJobPost._id},{$set:{advertisement_id:ad_Id}})
    const postJobAdObjToSend = {};

    for (let key in newJobPost.toObject()) {
      if (
        !fieldsToExclude.hasOwnProperty(String(key)) &&
        !listerBasicInfo.hasOwnProperty(String(key))
      ) {
        postJobAdObjToSend[key] = newJobPost[key];
      }
    }

    if (newJobPost) {
      return successJSONResponse(res, {
        message: `success`,
        postJobAdObjToSend: postJobAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        postJobAdObjToSend: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

///--------------------------Edit Job-----------------------------///

exports.editJobAds = async (req, res, next) => {
  // console.log(`kejhrjhyewgrjhew`);
  try {
    // console.log(req.files);
    const jobId = req?.params?.jobId;
    const validate_id = await postJobAd.findById(jobId);
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your job id`,
      });
    }

    if (!jobId)
      return successJSONResponse(res, {
        message: `success`,
        newJobPost,
        status: 200,
      });

    const {
      status,
      adsType,

      title,
      descriptions,
      categories,
      type,
      role,
      employment_type,
      experience,
      language,
      amount,
      currency,
      salary_info,
      no_of_opening,

      work_authorization,
      location_name,
      longitude,
      latitude,
      preferred_gender,
      image,
      video,
      tagline,
      name,
      email_address,
      primary_phone_number,
      secondary_phone_number,
      website_link,
      hide_my_phone,
      hide_my_secondary_phone,
      hide_my_email,
      // preferableModeContact,
    } = req.body;
// console.log(req.body,"lpalpa lpai lpa lpa lpai");
    let taglines = tagline;
    if (taglines) {
      for (i = 0; i < taglines.length; i++) {
        let tags = await tagline_keywords.findOne({ keywords: taglines[i] });
        if (!tags) {
          let tag = {
            keywords: taglines[i],
            ads_type: adsType,
          };
          await tagline_keywords.create(tag);
        }
      }
    }

    // console.log(req.body.hideAddress, "ddeedr");
    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
    }

    // console.log(`imageArr`, imageArr);

    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};
    let salry = {
      amount: amount,
      currency: currency,
    };
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

    if (status) dataObj.status = status;
    if (adsType) dataObj.adsType = adsType;

    if (title) adsInfoObj.title = title;
    if (tagline) adsInfoObj.tagline = tagline;
    if (descriptions) adsInfoObj.descriptions = descriptions;
    if (type) adsInfoObj.type = type;
    if (categories) adsInfoObj.categories = categories;
    if (role) adsInfoObj.role = role;
    if (employment_type) adsInfoObj.employment_type = employment_type;

    if (language) adsInfoObj.language = language;
    if (amount) adsInfoObj.salary = salry;
    if (salary_info) adsInfoObj.salary_info = salary_info;
    if (no_of_opening) adsInfoObj.no_of_opening = no_of_opening;
    if (experience) adsInfoObj.experience = JSON.parse(experience);
    if (work_authorization) adsInfoObj.work_authorization = work_authorization;
    let locationobj={}
    if(longitude && latitude){
      locationobj={
        coordinates:[longitude,latitude]
      }
    }
    if (location_name) locationobj.location_name = location_name;
   
    if (locationobj) adsInfoObj.location = locationobj;
    if (preferred_gender) adsInfoObj.preferred_gender = preferred_gender;
    if (imageArr.length) adsInfoObj.image = imageArr;
    if (video) adsInfoObj.video = video;
    if (name) listerBasicInfoObj.name = name;

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
        primary_mobile_number: {
          country_code: +91,
          primary_phone_number: primary_phone_number,
        },
        secondary_mobile_number: {
          country_code: +91,
          secondary_phone_number: secondary_phone_number,
        },
      },
    };

    // console.log(dataObjq);
    // console.log("object", { image: imageArr });

    const updateJob = await postJobAd.findByIdAndUpdate(
      { _id: jobId },
      { $set: dataObjq },
      { new: true }
    );
    let updateJobAdObjToSend = {};
    for (let key in updateJob.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updateJobAdObjToSend[key] = updateJob[key];
      }
    }
    if (updateJob) {
      return successJSONResponse(res, {
        message: `success`,
        updateJobAdObjToSend: updateJobAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updatejob: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/////----------------------Update Job Status -------------------/////

exports.editJobStatus = async (req, res, next) => {
  // console.log(`kejhrjhyewgrjhew`);
  try {
    const jobId = req?.params?.jobId;

    if (!jobId)
      return successJSONResponse(res, {
        message: `success`,
        newJobPost,
        status: 200,
      });
    const dataObj = {};
    const { status } = req.body;

    if (status) dataObj.status = parseInt(status);

    const updateJob = await postJobAd.findByIdAndUpdate(
      { _id: jobId },
      { $set: dataObj },
      { new: true }
    );

    if (updateJob) {
      return successJSONResponse(res, {
        message: `success`,
        updateJob,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updatejob: null,
      });
    }
  } catch (err) {
    (err);
  }
};

///////////////////

exports.fetchAllAds = async (req, res, next) => {
  try {
    let searchTerm = req.query.search_term || "";;
    // console.log("objectuygtututu");
    let dbQuery = {};
    const {
      isfeatured,
      status,
      adsType,
      listing_type,
      title,
      category,
      type,
      employment_type,
      work_authorization,
      language,
      amount,
      preferred_gender,
      location,
      tagline,
      userId,
      sortBy,
      longitude,
      latitude,
      maxDistance,
      add_on,
      min_price,
      max_price,
      isfavorite
    } = req.query;
   
    if (add_on){
      // Add filter for rent amount
      dbQuery["addons_validity.name"] = add_on;
    }
    // console.log(req.query,"-------------------------------------------------------------------------------------------------------------------------------");
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
    if (isfeatured) {
      dbQuery.isfeatured = isfeatured;
    }
    if (status) {
      dbQuery.status = status;
    }

    if (adsType) {
      dbQuery.adsType = adsType;
    }

    if (listing_type) {
      dbQuery.listing_type = listing_type;
    }

    if (title) {
      dbQuery["adsInfo.title"] = title;
    }

    if (category) {
      dbQuery["adsInfo.categories"] = category;
    }

    if (type) {
      dbQuery["adsInfo.type"] = type;
    }

    if (employment_type) {
      // Convert prefered_age to an array if it's not already
      const employment_typeArray = Array.isArray(employment_type) ? employment_type : [employment_type];
    
      // Add $in query to filter based on prefered_age
      dbQuery["adsInfo.employment_type"] = {
        $in: employment_typeArray,
      };
    }
    if (language) {
      // Convert prefered_age to an array if it's not already
      const languageArray = Array.isArray(language) ? language : [language];
    
      // Add $in query to filter based on prefered_age
      dbQuery["adsInfo.language"] = {
        $in: languageArray,
      };
    }  
      if (work_authorization) {
      // Convert prefered_age to an array if it's not already
      const work_authorizationArray = Array.isArray(work_authorization) ? work_authorization : [work_authorization];
    
      // Add $in query to filter based on prefered_age
      dbQuery["adsInfo.work_authorization"] = {
        $in: work_authorizationArray,
      };
    }


    if (amount) {
      dbQuery["adsInfo.salary.amount"] = amount;
    }
    if (min_price && max_price) {
      dbQuery["adsInfo.salary.amount"] = {
        $gte: parseFloat(min_price),
        $lte: parseFloat(max_price)
      };
    }
    
    if (preferred_gender) {
      dbQuery["adsInfo.preferedGender"] = preferred_gender;
    }

    if (location) {
      dbQuery["adsInfo.location"] = location;
    }

    if (tagline) {
      dbQuery["adsInfo.tagline"] = tagline;
    }
    if (userId) dbQuery.userId = userId;
    const isFavoriteFilter = isfavorite === 'true' ? true : undefined;

    // If isfavorite is true, add a filter to dbQuery
    if (isFavoriteFilter !== undefined) {
      dbQuery.isFavorite = isFavoriteFilter;
    }
     // Get the current date
     const currentDate = new Date();
     // Convert the date to ISO 8601 format
     const currentISODate = currentDate.toISOString();
     // Extract only the date portion
     const currentDateOnly = currentISODate.substring(0, 10);
     dbQuery.status = "active";
     dbQuery["plan_validity.expired_on"] = { $gte: currentDateOnly };
     let adOnsQuery = {};
    adOnsQuery.status = "active";
    adOnsQuery["plan_validity.expired_on"] = { $gte: currentDateOnly };

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

    let notification = await Users.findOne({_id:myid}).select('userNotification.job')
    let valueofnotification = notification?.userNotification?.job;

    let records = await postJobAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({ path: 'isReported', select: 'userId', match: { userId: myid } })
      .sort(sortval)
      .skip(perPage * page - perPage)
      .limit(perPage);
      const totalCount = await postJobAd.find({
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
      });//////
      let FeaturedData = await postJobAd.find({ "addons_validity.name": "Bump up" })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } });
    
    const featuredRecordsToPick = 6;
    const FeaturedpickedRecords = [];
    
    while (FeaturedpickedRecords.length < featuredRecordsToPick && FeaturedData.length > 0) {
      const randomIndex = Math.floor(Math.random() * FeaturedData.length);
      const randomRecord = FeaturedData.splice(randomIndex, 1)[0]; // Remove and pick the record
      FeaturedpickedRecords.push(randomRecord);
    }
    
      
       
        const featuredData = FeaturedpickedRecords.map((job) => {
          return {
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
          };
        })
      /////
      let BumpupData = await postJobAd.find({ "addons_validity.name": "Bump up" })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } });
    
    let bumpUpDates = BumpupData.map((data) => {
      // Filter addons_validity to get only the "Bump up" addon
      let bumpUpAddon = data.addons_validity.find((addon) => addon.name === "Bump up");
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
    
    while (pickedRecords.length < numberOfRecordsToPick && recordsWithTodayDate.length > 0) {
      const randomIndex = Math.floor(Math.random() * recordsWithTodayDate.length);
      const randomRecord = recordsWithTodayDate.splice(randomIndex, 1)[0]; // Remove and pick the record
      pickedRecords.push(randomRecord);
    }
    
    
     
      const bumpupData = pickedRecords.map((job) => {
        return {
          ...job._doc,
          // Add other job fields as needed
          view_count: job.viewCount,
          favorite_count: job.favoriteCount,
          is_favorite: !!job.isFavorite,
        };
      })
      return successJSONResponse(res, {
        message: `success`,
        total: responseModelCount,
        perPage: perPage,
        totalPages: Math.ceil(responseModelCount / perPage),
        currentPage: page,
        notification:valueofnotification,
        records:jobData,
        AdOnsData:{
          bumpupData,
          featuredData
        },
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

exports.fetchonead = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    // console.log("object",adsId);
    let data_Obj
    let checkId = await postJobAd.findOne({_id:adsId})
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
    }else{
      return failureJSONResponse(res, { message: `ad id not Available` });
    }
    let myid = req.userId
    let records = await postJobAd.findOne(data_Obj)
    .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
    .populate({ path: "favoriteCount", select: "_id" })
    .populate({ path: "viewCount" })
    .populate({ path: 'isFavorite', select: 'user', match: { user: myid } });
    // console.log(records,"saun mahona chad da hai");
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
      if(!checkview){
      let data=  await PostViews.create(dbQuery)
      }
      const jobData = {
        ...records._doc,
        view_count: records.viewCount,
        favorite_count: records.favoriteCount,
        is_favorite: records.isFavorite
      };
      return successJSONResponse(res, {
        message: `success`,
        ads_details: jobData,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `ad not available` });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};


exports.fetchJobData = async (req, res, next) => {
  try {
    let maxDistance = req.query.maxDistance || 200;
    const sub_categories = {
      "Jobs": [
        "Accounting and Finance",
        "Tax Services",
        "Bar and Restaurant",
        "Catering",
        "Cook",
        "Cheif",
        "Sales and Retail sales",
        "Day care",
        "Home Care",
        "Nursing Home",
        "Agent",
        "Cleaning and House Keeping",
        "Construction and trades",
        "Lawn and Garden",
        "Plumber",
        "Electrician",
        "Customer Service",
        "Drivers and Security",
        "Auto Mechanic",
        "General Labour",
        "Graphic and Geb design",
        "Hair Stylist and Salon",
        "Health Care",
        "Volunters",
        "NGO",
        "Real Estate",
        "Education",
        "Training",
        "Office Manager and Receptionist",
        "Interns and Students",
        "Programmers and Computer",
        "TV, Media ,Fashion",
        "Movie",
        "Other",
      ],
    };
    
    const responseArray = [];
    const lalcount = []
    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];
      const currentDate = new Date();
      // Convert the date to ISO 8601 format
      const currentISODate = currentDate.toISOString();
      // Extract only the date portion
      const currentDateOnly = currentISODate.substring(0, 10);
      for (const subCategory of subCategoryArray) {
        const query = {"adsInfo.categories": subCategory ,"status" :"active",["plan_validity.expired_on"]:{ $gte: currentDateOnly }};
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
        const count = await postJobAd.countDocuments(query);
        subcategoryData.push({ sub_category_name: subCategory, count });
      }

      const totalCount = subcategoryData.reduce((total, item) => total + item.count, 0);
      lalcount.push(totalCount)
      responseArray.push({
        name: category,
        count: totalCount,
        sub_categories: subcategoryData,
      });
    }
    let RedZone = lalcount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // console.log(responseArray);

    return successJSONResponse(res, {
      message: `success`,
      totalCount:RedZone,
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