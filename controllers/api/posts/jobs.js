const { json } = require("express");
const mongoose = require("mongoose"),
  postJobAd = mongoose.model("job"),
  Media = mongoose.model("media"),
  {
    successJSONResponse,
    failureJSONResponse,
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
    isValidNumber
  } = require(`../../../utils/validators`);

///-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
  const dynamicsData = {
    categories: [`Accounting and Finance`,
      `Tax Services`,
      `Bar and Restaurant`,
      `Sales and Retail sales`,
      `Child care`,
      `Cleaning and House Keeping`,
      `Construction and trades`,
      `Customer Service`,
      `Drivers and Security`,
      `General Labour`,
      `Graphic and Geb design`,
      `Hair Stylist and Salon`,
      `Health Care`,
      `Office Manager and Receptionist`,
      `Interns and Students`,
      `Programmers and Computer`,
      `TV, Media ,Fashion`,
      `Other`],

    type: [`Local Jobs`,
      `Remote Jobs`],

    language: [`English`,
      `Amharic`,
      `Afan Oromo`,
      `Tigrigna`,
      `Arabic`,
      `French`,
      `Other`],
    employment_type: [`Full-time`,
      `Part-time`,
      `Contract`,
      `Temporary`,
      `Please contact`],
    salary_info: ["/hour", "/day", "/week", "/month"],
    work_authorization: [`test`, `test1`],
    preferred_gender: [`Male`,
      `Female`,
      `Any Gender`],
    list_type: ["Offering - I have a job to offer", "Wanted - I am looking for a job"]
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
      salary,
      salary_info,
      no_of_opening,
      job_website_link,
      work_authorization,
      location,
      preferred_gender,
      image,
      video,
      tagline,
    } = req.body;


    if (status && (status != `active` && status != `inactive` && status != `draft`)) return failureJSONResponse(res, { message: `Please enter status active inactive or draft` });
    if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });
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

    // if (isNaN(Number(experience)))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us your experience`,
    //   });
    // if (!isValidString(language))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us the information about how many languages do you know`,
    //   });
    // if (!salary) return failureJSONResponse(res, {
    //   message: `Please provide us your salary`,
    // });
    // if (isNaN(Number(salary)))
    //   return failureJSONResponse(res, { message: `Please provide us salary` });
    // if (!isValidString(salary_info))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid salary info`,
    //   });
    if (isNaN(Number(no_of_opening)))
      return failureJSONResponse(res, { message: "Please provide number of jobs opening" });
    else if (no_of_opening <= 0 || no_of_opening === "" || no_of_opening === null || no_of_opening.includes(".")) failureJSONResponse(res, { message: `Please provide valid number of job opening` });
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
    if (!isValidString(location))
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
      salary,
      salary_info,
      no_of_opening,
      job_website_link,
      work_authorization,
      preferred_gender,
      location,
      tagline,
      image,
      video,
    } = req.body;

    const imageArr = [];
if(req.files){
    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path

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
        experience,
        language,
        salary,
        salary_info,
        no_of_opening,
        job_website_link,
        work_authorization,
        location,
        tagline,
        preferred_gender: preferred_gender,
        image: imageArr,
        video,
      },
      userId: userId,



    };

    const newJobPost = await postJobAd.create(dataObj);

    const postJobAdObjToSend = {};



    for (let key in newJobPost.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key)) && !listerBasicInfo.hasOwnProperty(String(key))) {
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
    const validate_id = await postJobAd.findById(jobId)
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your job id`,
      })
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
      salary,
      salary_info,
      no_of_opening,
      job_website_link,
      work_authorization,
      location,
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
      hide_my_email,
      // preferableModeContact,
    } = req.body;
    console.log(req.body.hideAddress, "ddeedr");
    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path

      productImages = await Media.create({ url: thumbnail});
      imageArr.push(productImages._id);

    }


    console.log(`imageArr`, imageArr);

    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};

    if (status) dataObj.status = status;
    if (adsType) dataObj.adsType = adsType;


    if (title) adsInfoObj.title = title;
    if (tagline) adsInfoObj.tagline = tagline;
    if (descriptions) adsInfoObj.descriptions = descriptions;
    if (type) adsInfoObj.type = type;
    if (categories) adsInfoObj.categories = categories;
    if (role) adsInfoObj.role = role;
    if (employment_type) adsInfoObj.employment_type = employment_type;
    if (experience) adsInfoObj.experience = experience;
    if (language) adsInfoObj.language = language;
    if (salary) adsInfoObj.salary = salary;
    if (salary_info) adsInfoObj.salary_info = salary_info;
    if (no_of_opening) adsInfoObj.no_of_opening = no_of_opening;
    if (job_website_link) adsInfoObj.job_website_link = job_website_link;
    if (work_authorization) adsInfoObj.work_authorization = work_authorization;
    if (location) adsInfoObj.location = location;
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
        hide_my_phone,
        hide_my_email,
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
    let updateJobAdObjToSend = {}
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


exports.fetchAll = async (req, res, next) => {
  try {
    const isFeatured = req.query.isfeatured;
    let dbQuery = {
      status: 1
    };

    if (isFeatured) dbQuery.isfeatured = isFeatured;
    let records = await postJobAd.find(dbQuery);
    if (records) {

      return successJSONResponse(res, {
        message: `success`,
        total: Object.keys(records).length,
        records,
        status: 200,
      })
    } else {
      return failureJSONResponse(res, { message: `Room not Available` })
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` })
  }
}