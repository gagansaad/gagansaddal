const { json } = require("express");

const mongoose = require("mongoose"),
  Media = mongoose.model("media"),
  postbizAndServicesAd = mongoose.model("Local_biz & Service"),
  {
    successJSONResponse,
    failureJSONResponse,
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
  const dynamicsData = {
    profession: [
      "Local Professional - Individuals who offer services at customer doorstep (e.g., Plumber, Electrician)",
      "Business Center / Local Retailer / Showroom - Customers visit provider’s location to access service (e.g., Beauty salon, Grocery store)",
      "Brand - Customers are familiar with the brand of your service/product (e.g., Ethiopian Airlines).",
      "Agent - A mediator between user and service providers (e.g., Real estate agent)",
      "Other - Enter your profession",
    ],
    preferableModeContact: [`Phone Number`, `Email`],
    buisness_experience: ["0-5 Years", "5-15 Years", "Above 15 Years"],
  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validatebizAdsData = async (req, res, next) => {
  try {
    const {
      status,
      adsType,
      profession,
      categories,
      business_name,
      tagline,
      experience,
      working_hours,
      business_location,
      price,
      descriptions,
      Additional_info,
      image,
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

    // if (!isValidString(categories))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid Category`,
    //   });
    // if (!isValidString(business_name))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid business_name`,
    //   });
    // if (!isValidString(tagline))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid tagline`,
    //   });
    // if (!isValidString(business_location))
    //   return failureJSONResponse(res, {
    //     message: "Pleae provide us your buisness location",
    //   });
    // if (!isValidString(descriptions))
    //   return failureJSONResponse(res, {
    //     message: `please provide valid Description`,
    //   });
    // // if (isNaN(Number(price)))
    // //   return failureJSONResponse(res, {
    // //     message: `Please provide valid price`,
    // //   });
    // if (!isValidString(Additional_info))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us Additional_info`,
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
      emailAddress,
      // phoneNumber,
      // countryCode,
      hideAddress,
      preferableModeContact,
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
    if (emailAddress && !isValidEmailAddress(emailAddress)) {
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
////-----------------------Create Event------------------------------//

exports.createbizAds = async (req, res, next) => {
  try {

    const {
      isfeatured,
      status,
      adsType,
      categories,
      profession,
      business_name,
      experience,
      tagline,
      business_location,
      business_service,
      accreditation_name,
      accreditation_files,
      price,
      descriptions,
      Additional_info,
      image,
    } = req.body;

    let work_hour = [];
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let mondayObj = {};

    for (i = 0; i <= days.length - 1; i++) {
      let monday = {
        is_24hour: false,
        is_status: false,
        day_name: "",
        open_at: "",
        close_at: "",
      };
      let day_s = `is_status_${days[i].toLocaleLowerCase()}`;
      let day_24 = `is_24_hour_${days[i].toLocaleLowerCase()}`;
      let day_o = `open_at_${days[i].toLocaleLowerCase()}`;
      let day_c = `close_at_${days[i].toLocaleLowerCase()}`;
      let day_n = `day_name_${days[i].toLocaleLowerCase()}`;
      let day_status;
      let day_24_hour;
      var day_open;
      let day_close;
      let day_Name;
      if (day_s in req.body) {
        day_status = req.body[day_s];
      }
      if (day_24 in req.body) {
        day_24_hour = req.body[day_24];
      }
      if (day_o in req.body) {
        day_open = req.body[day_o];
      }
      if (day_c in req.body) {
        day_close = req.body[day_c];
      }
      if (day_n in req.body) {
        day_Name = req.body[day_n];
      }

      if (day_status == `true`) {
        if (!work_hour[day_Name]) {
          monday.is_status = day_status;
          monday.day_name = day_Name;
          if (day_24_hour == `true`) {
            monday.is_24_hour = true;
            monday.open_at = "00:00:00";
            monday.close_at = "23:59:00";
          } else {
            monday.is_24_hour = false;
            monday.day_name = day_Name;
            monday.open_at = day_open;
            monday.close_at = day_close;
          }
        }
      } else {

        monday.is_status = false;
        monday.day_name = day_Name;
        monday.open_at = null;
        monday.close_at = null;
        monday.is_24_hour = false;
      }
      work_hour.push(monday);
    }



    const userId = req.userId;

    const imageArr = [];
    const accreditationArr = [];
    
    if(req.files.photos){
    for (var i = 0; i < req.files.photos.length; i++) {
       
     
      if (req.files.photos[i].fieldname === `photos`) {
        let type_of_file = req.files.photos[i].mimetype;
        if (type_of_file === 'image/png' || type_of_file === 'image/jpeg') {
          var thumbnail = req.files.photos[i].path;
          productImages = await Media.create({ url: thumbnail, url_type: type_of_file });
          imageArr.push(productImages._id);
        } else {
          return failureJSONResponse(res, {
            message: `Please provide only png,jpg`,
          });
        }
      } }}
      if(req.files.accreditation_document){
      
      for (var i = 0; i < req.files.accreditation_document.length; i++) {
      if (req.files.accreditation_document[i].fieldname === `accreditation_document`){
        let type_of_files = req.files.accreditation_document[i].mimetype;
        if (type_of_files === 'application/pdf' || type_of_files === 'image/jpg' || type_of_files === 'image/jpeg') {
          var doc = req.files.accreditation_document[i].path;
          productDoc = await Media.create({ url: doc, url_type: type_of_files });
          console.log(productDoc,"hdhcbdhh");
          accreditationArr.push(productDoc._id);
        } else {
          return failureJSONResponse(res, {
            message: `Please provide only pdf,png`,
          });
        }
      }
      }
     
    }
    
    console.log(work_hour.length,"dcdnjchnbjbc");

    const dataObj = {
      isfeatured,
      status: status,
      adsType,
      adsInfo: {
        categories,
        profession,
        business_name,
        experience,
        working_hours: work_hour,
        tagline,
        business_location,
        business_service,
        price,
        descriptions,
        Additional_info,
        image: imageArr,
        accreditation_file:{
        accreditation_name,
        accreditation_files:accreditationArr
      }
      },

      userId: userId,
    };

    const newbizPost = await postbizAndServicesAd.create(dataObj);
    console.log(newbizPost);
    const bizAndServices = {};

    for (let key in newbizPost.toObject()) {
      if (
        !fieldsToExclude.hasOwnProperty(String(key)) &&
        !listerBasicInfo.hasOwnProperty(String(key))
      ) {
        bizAndServices[key] = newbizPost[key];
      }
    }
    if (newbizPost) {
      return successJSONResponse(res, {
        message: `success`,
        bizAndServices: bizAndServices,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        bizAndServices: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

///--------------------------Edit event-----------------------------///

exports.editbizAds = async (req, res, next) => {

  try {

    const bizId = req?.params?.bizId;

    const validate_id = await postbizAndServicesAd.findById(bizId);
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your loacl biz And Services id`,
      });
    }

    if (!bizId)
      return successJSONResponse(res, {
        message: `success`,
        updatebizAdObjToSend,
        status: 200,
      });

    const {
      status,
      adsType,

      profession,
      categories,
      business_name,
      tagline,
      business_location,
      price,
      descriptions,
      Additional_info,
      image,
      accreditation_name,
      accreditation_files,
      location,
      name,
      emailAddress,
      phoneNumber,
      hideAddress,
      addressInfo,
      preferableModeContact,
    } = req.body;

    let work_hour = [];
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    

    for (i = 0; i <= days.length - 1; i++) {
      let monday = {
        is_24hour: false,
        is_status: false,
        day_name: "",
        open_at: "",
        close_at: "",
      };
      let day_s = `is_status_${days[i].toLocaleLowerCase()}`;
      let day_24 = `is_24_hour_${days[i].toLocaleLowerCase()}`;
      let day_o = `open_at_${days[i].toLocaleLowerCase()}`;
      let day_c = `close_at_${days[i].toLocaleLowerCase()}`;
      let day_n = `day_name_${days[i].toLocaleLowerCase()}`;
      let day_status;
      let day_24_hour;
      var day_open;
      let day_close;
      let day_Name;
      if (day_s in req.body) {
        day_status = req.body[day_s];
      }
      if (day_24 in req.body) {
        day_24_hour = req.body[day_24];
      }
      if (day_o in req.body) {
        day_open = req.body[day_o];
      }
      if (day_c in req.body) {
        day_close = req.body[day_c];
      }
      if (day_n in req.body) {
        day_Name = req.body[day_n];
      }

      if (day_status == `true`) {
        if (!work_hour[day_Name]) {
          monday.is_status = day_status;
          monday.day_name = day_Name;
          if (day_24_hour == `true`) {
            monday.is_24_hour = true;
            monday.open_at = "00:00:00";
            monday.close_at = "23:59:00";
          } else {
            monday.is_24_hour = false;
            monday.day_name = day_Name;
            monday.open_at = day_open;
            monday.close_at = day_close;
          }
        }
      } else {

        monday.is_status = false;
        monday.day_name = day_Name;
        monday.open_at = null;
        monday.close_at = null;
        monday.is_24_hour = false;
      }
      work_hour.push(monday);
    }

console.log(work_hour.length,"dcdnjchnbjbc");

    const imageArr = [];
    const accreditationArr = [];
    
    if(req.files.photos){
    for (var i = 0; i < req.files.photos.length; i++) {
       
     
      if (req.files.photos[i].fieldname === `photos`) {
        let type_of_file = req.files.photos[i].mimetype;
        if (type_of_file === 'image/png' || type_of_file === 'image/jpeg') {
          var thumbnail = req.files.photos[i].path;
          productImages = await Media.create({ url: thumbnail, url_type: type_of_file });
          imageArr.push(productImages._id);
        } else {
          return failureJSONResponse(res, {
            message: `Please provide only png,jpg`,
          });
        }
      } }}
      if(req.files.accreditation_document){
      
      for (var i = 0; i < req.files.accreditation_document.length; i++) {
      if (req.files.accreditation_document[i].fieldname === `accreditation_document`){
        let type_of_files = req.files.accreditation_document[i].mimetype;
        if (type_of_files === 'application/pdf' || type_of_files === 'image/jpg' || type_of_files === 'image/jpeg') {
          var doc = req.files.accreditation_document[i].path;
          productDoc = await Media.create({ url: doc, url_type: type_of_files });
          console.log(productDoc,"hdhcbdhh");
          accreditationArr.push(productDoc._id);
        } else {
          return failureJSONResponse(res, {
            message: `Please provide only pdf,png`,
          });
        }
      }
      }
     
    }
    



    const dataObj = {},
      adsInfoObj = {},
      accreditation_data = {};

    if (status) dataObj.status = status;
    if (adsType) dataObj.adsType = adsType;

    if (profession) adsInfoObj.profession = profession;
    if (categories) adsInfoObj.categories = categories;
    if (business_name) adsInfoObj.business_name = business_name;
    if (tagline) adsInfoObj.tagline = tagline;
    if (business_location) adsInfoObj.business_location = business_location;
    if (price) adsInfoObj.price = price;
    if (descriptions) adsInfoObj.descriptions = descriptions;
    if (Additional_info) adsInfoObj.Additional_info = Additional_info;
    if (imageArr.length) adsInfoObj.image = imageArr;
    if (accreditationArr.length)accreditation_data.accreditation_files = accreditationArr;
    if (accreditation_name)accreditation_data.accreditation_name=accreditation_name;
    if (accreditation_files)adsInfoObj.accreditation_file = accreditation_data;
    if (work_hour.length == 7) adsInfoObj.working_hours = work_hour;
    if (adsInfoObj && Object.keys(adsInfoObj).length) {
      dataObj.adsInfo = adsInfoObj;
    }

    const dataObjq = {
      adsInfo: adsInfoObj,
      listerBasicInfo: {
        location,
        name,
        emailAddress,
        phoneNumber,
        hideAddress,
        mobileNumber: {
          countryCode: +91,
          phoneNumber: phoneNumber,
        },
        addressInfo,
        preferableModeContact: preferableModeContact,
      },
    };
    const updatebiz = await postbizAndServicesAd.findByIdAndUpdate(
      { _id: bizId },
      { $set: dataObjq },
      { new: true }
    );
    let updatebizAdObjToSend = {};
    for (let key in updatebiz.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updatebizAdObjToSend[key] = updatebiz[key];
      }
    }

    if (updatebiz) {
      return successJSONResponse(res, {
        message: `success`,
        updatebizAdObjToSend: updatebizAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updatebizAdObjToSend: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/////----------------------Update Job Status -------------------/////

exports.editJobStatus = async (req, res, next) => {

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

////////////////

exports.fetchAll = async (req, res, next) => {
  try {
    const isFeatured = req.query.isfeatured;
    let dbQuery = {
      status: 1,
    };

    if (isFeatured) dbQuery.isfeatured = isFeatured;
    let records = await postJobAd.find(dbQuery);
    if (records) {
      return successJSONResponse(res, {
        message: `success`,
        total: Object.keys(records).length,
        records,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `Room not Available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
