const { json } = require("express");
const crypto = require("crypto");
const { mongoose, ObjectId, modelNames }  = require("mongoose"),
  postJobAd = mongoose.model("job"),
  PostViews = mongoose.model("Post_view"),
  Users = mongoose.model("user"),
  Media = mongoose.model("media"),
  tagline_keywords = mongoose.model("keywords"),
  Skills = mongoose.model("skill"),
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
          deletedAt: new Date().toISOString(),// Add your temporary field and its value here
          "plan_validity.expired_on": new Date().toISOString(), // Set the plan validity expiry date
          "addons_validity.$[].expired_on": new Date().toISOString(), 
        }
      };
  
      let records = await postJobAd.update(dbQuery, updateFields, { new: true });
  
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
  let records = await tagline_keywords.find().select({ keywords: 1, _id: 1 });
  let skills = await Skills.find().select({ keywords: 1, _id: 1 });

  const dynamicsData = {
    tagline: records,
    skills:skills,
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

////-----------------------Create Job------------------------------//

exports.createJobAds = async (req, res, next) => {
  try {
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
    let userID = req.userId
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
    };
    let roles = role;
    if (roles) {
      for (i = 0; i < roles.length; i++) {
        let tags = await Skills.findOne({ keywords: roles[i] });
        if (!tags) {
          let tag = {
            keywords: roles[i],
            ads_type: adsType,
          };
          await Skills.create(tag);
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
        location: {
          location_name: location_name,
          coordinates: [longitude, latitude],
        },
        tagline,
        preferred_gender: preferred_gender,
        image: imageArr,
        video,
      },
      userId: userID,
    };

    const newJobPost = await postJobAd.create(dataObj);
    const stringToHash = newJobPost._id.toString();
    const hash = await crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % Math.pow(10, 10);
    let ad_Id = numericHash.toString().padStart(10, "0");

    await postJobAd.findByIdAndUpdate(
      { _id: newJobPost._id },
      { $set: { advertisement_id: ad_Id } }
    );
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
  try {
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
    let userID = req.userId
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
    let roles = role;
    if (roles) {
      for (i = 0; i < roles.length; i++) {
        let tags = await Skills.findOne({ keywords: roles[i] });
        if (!tags) {
          let tag = {
            keywords: roles[i],
            ads_type: adsType,
          };
          await Skills.create(tag);
        }
      }
    }
    let imageArr = [];
    const existingRoomRents = await postJobAd.findById(jobId);
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
    if(userID) dataObj.userId = userID;
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
    let locationobj = {};
    if (longitude && latitude) {
      locationobj = {
        coordinates: [longitude, latitude],
      };
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
    const jobId = req.query.ads_id;

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
    let searchTerm = req.query.search_term || "";
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
      is_favorite,
      is_myad,
    } = req.query;
    let adOnsQuery = {};
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
    if (isfeatured) {
      dbQuery.isfeatured = isfeatured;
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
      adOnsQuery["adsInfo.categories"] = category
    }

    if (type) {
      dbQuery["adsInfo.type"] = type;
    }

    if (employment_type) {
      // Convert prefered_age to an array if it's not already
      const employment_typeArray = Array.isArray(employment_type)
        ? employment_type
        : [employment_type];

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
      const work_authorizationArray = Array.isArray(work_authorization)
        ? work_authorization
        : [work_authorization];

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
        $lte: parseFloat(max_price),
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

    // If isfavorite is true, add a filter to dbQuery
    // if (isFavoriteFilter !== undefined) {
    //   dbQuery.isFavorite = isFavoriteFilter;
    // }
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
      dbQuery.status = "active";
      dbQuery["plan_validity.expired_on"] = { $gte: currentISODate };

      adOnsQuery.status = "active";
      adOnsQuery["plan_validity.expired_on"] = { $gte: currentISODate };
    } else {
      dbQuery.userId = myid;
      if (status == 0) {
        dbQuery.status = "active";
      }
      if (status == 1) {
        dbQuery.status = { $in: ["inactive", "deleted"] };
      }
      if (status == 2) {
        dbQuery.status = "draft";
      }
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
      "userNotification.job"
    );
    let valueofnotification = notification?.userNotification?.job;

      let featuredData;
      let bumpupData;
      let commonId;
      if(is_favorite != "true"){
      if (is_myad != "true"  && !searchTerm) {
        let FeaturedData = await postJobAd
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
          if(FeaturedData){
            
            FeaturedData = FeaturedData.map(FeaturedData => FeaturedData.toObject({ virtuals: true }));
            
          }
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
            ...job,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
          };
        });
        
        // let excludedIds = featuredData.map(featuredItem => featuredItem._id)
        /////
        let BumpupData = await postJobAd
          .find({ ...adOnsQuery, "addons_validity.name": "Bump up" 
          // , _id: { $nin: excludedIds }
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
        // commonId = [...excludedIds,...bumpId]
      }
    }
      let query = {
        $or: [queryFinal]
      };
      
      // if (commonId && commonId.length > 0) {
      //   query._id = { $nin: commonId };
      // }

    let records = await postJobAd
    .find(query)
    .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
    .populate({ path: "favoriteCount", select: "_id" })
    .populate({ path: "viewCount" })
    .populate({ path: "isFavorite", select: "user", match: { user: myid } })
    .populate({ path: "ReportCount", select: "_id" })
    .populate({
      path: "isReported",
      select: "userId",
      match: { userId: myid },
    })
    .sort(sortval);
  // const totalCount = await postJobAd.find({
  //   $or: [queryFinal],
  // });
  // let responseModelCount = totalCount.length;
  records = records.map(record => record.toObject({ virtuals: true }));
  if (records) {
    let jobData = records.map((job) => {
      return {
        ...job,
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
    let paginationlength = req.query.perpage || 40
    // let freedata
    // if(is_myad == "true" || searchTerm || is_favorite == "true"){
    //   totalresult = totalCount
    //   freedata = JSON.parse(paginationlength)
    // }else{
      console.log(totalCount);
      totalresult = totalCount
    //   adodata = bumpupData.length + featuredData.length
    //   freedata = paginationlength - adodata
    //       freedata=Math.abs(freedata);
      paginationlength= JSON.parse(paginationlength)
    // }
    // console.log(freedata);
    const perPage = parseInt(paginationlength) || 40;
    const page = parseInt(req.query.page) || 1;

    
    let paginatedData
    if (perPage === 0) {
      paginatedData = []; // Create an empty array
    } else {
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
    
      paginatedData = jobData.slice(startIndex, endIndex);
    }

      let finalResponse = {
        message: `success`,
        total: totalresult,
        perPage: paginationlength,
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
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.fetchonead = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    let data_Obj;
    let checkId = await postJobAd.findOne({ _id: adsId });
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
    } else {
      return failureJSONResponse(res, { message: `ad id not Available` });
    }
    let myid = req.userId;
    let records = await postJobAd
      .findOne(data_Obj)
      // .populate({ path: "userId", select: "_id userInfo.name userBasicInfo.profile_image createdAt" })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      // .populate("userDetails")
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      });
      
      records = records.toObject({ virtuals: true });
      // records.userDetails = records.userDetails.toObject();

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
      let userDetails = await Users.findById(records.userId)
      const profileImageValue = userDetails?.userBasicInfo?.profile_image;
      const profile_img = profileImageValue !== "null" ? profileImageValue : null;
      // console.log();
      const jobData = {
        ...records,
        view_count: records.viewCount,
        favorite_count: records.favoriteCount,
        is_favorite: !!records.isFavorite,
        Report_count: records.ReportCount,
        is_Reported: !!records.isReported,
        userDetails:{
          name:userDetails.userInfo.name,
          profile_img:profile_img,
          createdAt:userDetails.createdAt
        },
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
      Jobs: [
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
    const lalcount = [];
    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];
      const currentDate = new Date();
      // Convert the date to ISO 8601 format
      const currentISODate = currentDate.toISOString();
      // Extract only the date portion
      const currentDateOnly = currentISODate.substring(0, 10);
      for (const subCategory of subCategoryArray) {
        const query = {
          "adsInfo.categories": subCategory,
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
        const count = await postJobAd.countDocuments(query);
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
    return failureJSONResponse(res, {
      message: "An error occurred",
      error: error.message,
    });
  }
};
