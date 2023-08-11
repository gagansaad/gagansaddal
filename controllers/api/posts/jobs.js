const { json } = require("express");
const crypto = require('crypto');
const mongoose = require("mongoose"),
  postJobAd = mongoose.model("job"),
  PostViews = mongoose.model("Post_view"),
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
    console.log("hitt hoyi");
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
          locationName:location_name,
          latitude:latitude,
          longitude:longitude
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
  console.log(`kejhrjhyewgrjhew`);
  try {
    console.log(req.files);
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

    console.log(req.body.hideAddress, "ddeedr");
    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
    }

    console.log(`imageArr`, imageArr);

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
    if (experience) adsInfoObj.experience = experience;
    if (work_authorization) adsInfoObj.work_authorization = work_authorization;
    let locationobj={}
    if (location_name) locationobj.locationName = location_name;
    if (longitude) locationobj.longitude = longitude;
    if (latitude) locationobj.latitude = latitude;
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

    console.log(dataObjq);
    console.log("object", { image: imageArr });

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
  console.log(`kejhrjhyewgrjhew`);
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
    console.log(err);
  }
};

///////////////////

exports.fetchAllAds = async (req, res, next) => {
  try {
    let searchTerm = req.body.searchTerm;
    console.log("objectuygtututu");
    let dbQuery = {};
    const {
      isfeatured,
      status,
      adsType,
      listing_type,
      title,
      categories,
      type,
      employment_type,
      language,
      amount,
      preferred_gender,
      location,
      tagline,
      userId,
    } = req.query;
    var perPage = parseInt(req.query.perpage) || 6;
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

    if (categories) {
      dbQuery["adsInfo.categories"] = categories;
    }

    if (type) {
      dbQuery["adsInfo.type"] = type;
    }

    if (employment_type) {
      dbQuery["adsInfo.employment_type"] = employment_type;
    }

    if (language) {
      dbQuery["adsInfo.language"] = language;
    }

    if (amount) {
      dbQuery["adsInfo.rent.amount"] = amount;
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
    let records = await postJobAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage);
    const responseModelCount = await postJobAd.countDocuments({
      $or: [queryFinal],
    });
   
    if (records) {
      const jobData = records.map((job) => {
        return {
          ...job._doc,
          // Add other job fields as needed
          viewCount: records.viewCount,
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

exports.fetchonead = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    console.log("object",adsId);
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
    console.log(records,"saun mahona chad da hai");
    if (records) {
      const ads_type =records.adsType.toString();
    
    let {ModelName,Typename}= await ModelNameByAdsType(ads_type)
    console.log(Typename,"nfjdnfcjed");
    let dbQuery ={
      userId:myid,
      ad:records._id,
      adType:Typename
    } 
    
     let checkview = await PostViews.findOne({ $and: [{ userId: dbQuery.userId }, { ad: dbQuery.ad }] })
     console.log(checkview,"tere nakhre maare mainu ni mai ni jan da  tainu ni");
      if(!checkview){
      let data=  await PostViews.create(dbQuery)
      console.log(data,"billo ni tere kale kalle naina ");
      }
      const jobData = {
        ...records._doc,
        viewCount: records.viewCount,
        favoriteCount: records.favoriteCount,
        isFavorite: records.isFavorite
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
        
        const count = await postJobAd.countDocuments(query);
        subcategoryData.push({ sub_category_name: subCategory, count });
      }

      const totalCount = subcategoryData.reduce((total, item) => total + item.count, 0);

      responseArray.push({
        name: category,
        count: totalCount,
        sub_categories: subcategoryData,
      });
    }

    console.log(responseArray);

    return successJSONResponse(res, {
      message: `success`,
      data: responseArray,
    });
  } catch (error) {
    console.error('Error:', error);
    return errorJSONResponse(res, {
      message: 'An error occurred',
      error: error.message,
    });
  }
};