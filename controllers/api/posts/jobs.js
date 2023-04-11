const { json } = require("express");

const mongoose = require("mongoose"),
  postJobAd = mongoose.model("job"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude,listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidUrl,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
    isValidNumber
  } = require(`../../../utils/validators`);

///-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
  const dynamicsData = {
    categories: [`employed`, `self employed`, `engineer`],
    role: [`male`,`female`,`couple`],

    type: [`Enginner`, `Plumber`],

    language: [`English`, `Hindi`],

    work_authorization: [`test`, `test1`],
    preferred_gender: [`male`, `female`],
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
      title,
      descriptions,
      categories,
      type,
      role,
      experience,
      language,
      salary,
      no_of_opening,
      website,
      work_authorization,
      location,
      preferred_gender,
      image,

    } = req.body;

    if (isNaN(Number(status))) return failureJSONResponse(res, { message: `Please enter valid status` });
    else if (status < 1 || status > 3) failureJSONResponse(res, { message: `Please enter status between 1 to 3` });

    if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });
    if (!isValidString(categories))
      return failureJSONResponse(res, {
        message: `Please provide valid job Category`,
      });
    if (!isValidString(type))
      return failureJSONResponse(res, {
        message: `Please provide valid job Type`,
      });
    if (!isValidString(role))
      return failureJSONResponse(res, {
        message: `Please provide valid job Role`,
      });
    if (!isValidString(title))
      return failureJSONResponse(res, {
        message: "Please provide us your job Title",
      });
    if (!isValidString(descriptions))
      return failureJSONResponse(res, {
        message: `please provide valid job Description`,
      });
    if (isNaN(Number(experience)))
      return failureJSONResponse(res, {
        message: `Please provide us your experience`,
      });
    if (!isValidString(language))
      return failureJSONResponse(res, {
        message: `Please provide us the information about how many languages do you know`,
      });
    if (isNaN(Number(salary)))
      return failureJSONResponse(res, { message: `Please provide us salary` });
    if (isNaN(Number(no_of_opening)))
      return failureJSONResponse(res, { message: "Please provide number of jobs opening" });
      else if (no_of_opening <= 0 || no_of_opening === "" || no_of_opening === null ) failureJSONResponse(res, { message: `Please provide number of job opening` });
      if (isNaN(Number(preferred_gender)))
      return failureJSONResponse(res, { message: "Please provide valid gender preferences" });
      else if (preferred_gender < 1 || preferred_gender > 3) failureJSONResponse(res, { message: `Please enter preferred_gender between 1 to 3` });
    if (!isValidUrl(website))
      return failureJSONResponse(res, {
        message: `Please provide valid website`,
      });
    if (!isValidString(work_authorization))
      return failureJSONResponse(res, {
        message: `Please provide us work authorization`,
      });
      if (!isValidString(location))
      return failureJSONResponse(res, {
        message: `Please provide us location`,
      });
      
    return next();
  } catch (err) {
    console.log(err);
  }
};
exports.validateListerBasicinfo = async (req, res, next) => {
  //   console.log(req.body)
  try {
    const {
      emailAddress,
      // phoneNumber,
      // countryCode,
      hideAddress,
      preferableModeContact,
    } = req.body;
   console.log(typeof(hideAddress),"yyyyyyyyyyyyyyyyyyyyyy");
   
    // if (countryCode && isNaN(Number(countryCode)))
    // return failureJSONResponse(res, {
    //   message: `Please provide us your country code`,
    // });
 if (preferableModeContact && isNaN(Number(preferableModeContact)))
      return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
      else if (preferableModeContact < 1 || preferableModeContact > 3) failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
   
    if (emailAddress && !isValidEmailAddress(emailAddress))
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
      if (hideAddress && !isValidBoolean(`${hideAddress}`))
      return failureJSONResponse(res, {
        message: `Please provide us hide/show address (true/false)`,
      });
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
    const {
      status,
      adsType,

      title,
      descriptions,
      categories,
      type,
      role,
      experience,
      language,
      salary,
      no_of_opening,
      website,
      work_authorization,
      preferred_gender,
      location,
    } = req.body;
 
    const imageArr = [];

    req.files.forEach((data) => {
      imageArr.push(data?.path);
    });

    const dataObj = {
     
      status: parseInt(status),
      adsType,
      adsInfo: {
        title,
        descriptions,
        title,
        descriptions,
        categories,
        type,
        role,
        experience,
        language,
        salary,
        no_of_opening,
        website,
        work_authorization,
        location,
        preferred_gender: parseInt(preferred_gender),
        image: imageArr,
      },
      userId: userId,
    
 
     
    };

    const newJobPost = await postJobAd.create(dataObj);

    const postJobAdObjToSend = {};
  
  

    for (let key in newJobPost.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))&&!listerBasicInfo.hasOwnProperty(String(key))) {
        postJobAdObjToSend[key] = newJobPost[key];
      }
    }

    if (newJobPost) {
      return successJSONResponse(res, {
        message: `success`,
        postJobAdObjToSend:postJobAdObjToSend,
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
      experience,
      language,
      salary,
      no_of_opening,
      website,
      work_authorization,
      location,
      preferred_gender,
      image,

      name,
      emailAddress,
      phoneNumber,
      countryCode,
      hideAddress,
      preferableModeContact,
    } = req.body;
    console.log(req.body.hideAddress,"ddeedr");
    const imageArr = [];

    req.files.forEach((data) => {
      imageArr.push(data?.path);
    });
    
    console.log(`imageArr`, imageArr);
   
    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};

    if (status) dataObj.status = parseInt(status);
    if (adsType) dataObj.adsType = adsType;

    if (title) adsInfoObj.title = title;
    if (descriptions) adsInfoObj.descriptions = descriptions;
    if (type) adsInfoObj.type = type;
    if (categories) adsInfoObj.categories = categories;
    if (role) adsInfoObj.role = role;
    if (experience) adsInfoObj.experience = experience;
    if (language) adsInfoObj.language = language;
    if (salary) adsInfoObj.salary = salary;
    if (no_of_opening) adsInfoObj.no_of_opening = no_of_opening;
    if (website) adsInfoObj.website = website;
    if (work_authorization) adsInfoObj.work_authorization = work_authorization;
    if (location) adsInfoObj.location = location;
    if (preferred_gender) adsInfoObj.preferred_gender = preferred_gender;
    if (imageArr.length) adsInfoObj.image = imageArr;

    if (name) listerBasicInfoObj.name = name;
   
    if (adsInfoObj && Object.keys(adsInfoObj).length) {
      dataObj.adsInfo = adsInfoObj;
     
    }

    const dataObjq = {
      adsInfo: adsInfoObj,
      listerBasicInfo: {
        name,
        emailAddress,
        phoneNumber,
        hideAddress,
        mobileNumber: {
          countryCode,
          phoneNumber: phoneNumber,
        },
        preferableModeContact: preferableModeContact,
      },
    };

    console.log(dataObjq);
    console.log("object", { image: imageArr });

    const updateJob = await postJobAd.findByIdAndUpdate(
      { _id: jobId },
      { $set: dataObjq },
      { new: true }
    );
   let updateJobAdObjToSend ={}
    for (let key in updateJob.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updateJobAdObjToSend[key] = updateJob[key];
      }
    }
    if (updateJob) {
      return successJSONResponse(res, {
        message: `success`,
        updateJobAdObjToSend:updateJobAdObjToSend,
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
