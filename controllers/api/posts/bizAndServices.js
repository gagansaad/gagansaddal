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
    profession: ["Local Professional - Individuals who offer services at customer doorstep (e.g., Plumber, Electrician)", "Business Center / Local Retailer / Showroom - Customers visit provider’s location to access service (e.g., Beauty salon, Grocery store)", "Brand - Customers are familiar with the brand of your service/product (e.g., Ethiopian Airlines).", "Agent - A mediator between user and service providers (e.g., Real estate agent)", "Other - Enter your profession"],
    preferableModeContact: [`Phone Number`, `Email`],
    buisness_experience:["0-5 Years", "5-15 Years", "Above 15 Years"],
  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validatebizAdsData = async (req, res, next) => {
  //   console.log(req.body)
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

    if (status && (status != `active` && status != `inactive` && status != `draft`)) return failureJSONResponse(res, { message: `Please enter status active inactive or draft` });
    if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });
  
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
    console.log(req.files, "dccdcdc");
    const {
      isfeatured,
      status,
      adsType,
      
      
      categories,
      business_name,
      experience,
    
      tagline,
      business_location,
      business_service,
      accreditation_file,

      is_status_monday,
      is_status_tuesday,
      is_status_wednesday,
      is_status_thursday,
      is_status_friday,
      is_status_saturday,
      is_status_sunday,

      is_24hour_monday,
      is_24hour_tuesday,
      is_24hour_wednesday,
      is_24hour_thursday,
      is_24hour_friday,
      is_24hour_saturday,
      is_24hour_sunday,

      open_at_monday,
      open_at_tuesday,
      open_at_wednesday,
      open_at_thursday,
      open_at_friday,
      open_at_saturday,
      open_at_sunday,
      
      close_at_monday,
      close_at_tuesday,
      close_at_wednesday,
      close_at_thursday,
      close_at_friday,
      close_at_saturday,
      close_at_sunday,

      price,
      descriptions,
      Additional_info,
      image,

    } = req.body;

    let work_hour=[]
    let time_records = {
      is_status:false,
     day_name:"",
      open_at :"",
     close_at :"",
    }

    if(is_status_monday == 'true' &&  open_at_monday && close_at_monday){
      time_records.is_status=true, 
      time_records.day_name="monday",
      time_records.open_at= open_at_monday,
      time_records.close_at= close_at_monday,
      work_hour.push(time_records)
    }else{
      console.log("closed")
    }
    if(is_status_tuesday == 'true' && open_at_tuesday && close_at_tuesday){
      time_records.is_status=true, 
      time_records.day_name= "tuesday",
      time_records.open_at= open_at_tuesday,
      time_records.close_at=close_at_tuesday,// 24hr
      work_hour.push(time_records)
    }else{
      console.log("closed")
    }
    if(is_status_wednesday == 'true' && open_at_wednesday && close_at_wednesday){
      time_records.is_status=false, 
      time_records.day_name= "wednesday",
      time_records.open_at  = open_at_wednesday,
      time_records.close_at=close_at_wednesday,// 24hr
      work_hour.push(time_records)
    }else{
      console.log("closed")
    }
    if(is_status_thursday == 'true' && open_at_thursday && close_at_thursday){
      time_records.is_status=true, 
      time_records.day_name= "thursday",
      time_records.open_at= open_at_thursday,
      time_records.close_at=close_at_thursday,// 24hr
      work_hour.push(time_records)
    }else{
      console.log("closed")
    }
    if(is_status_friday == 'true' && open_at_friday && close_at_friday){
      time_records.is_status=true, 
      time_records.day_name= "friday",
      time_records.open_at= open_at_friday,
      time_records.close_at=close_at_friday,// 24hr
      work_hour.push(time_records)
    }else{
      console.log("closed")
    }
    if(is_status_saturday == 'true' && open_at_saturday && close_at_saturday){
      time_records.is_status=true, 
      time_records.day_name= "saturday",
      time_records.open_at= open_at_saturday,
      time_records.close_at=close_at_saturday,// 24hr
      work_hour.push(time_records)
    }else{
      console.log("closed")
    }
    if(is_status_sunday == 'true' && open_at_sunday && close_at_sunday){
      time_records.is_status=true, 
      time_records.day_name= "sunday",
      time_records.open_at= open_at_sunday,
      time_records.close_at= close_at_sunday,// 24hr
      work_hour.push(time_records)
    }else{
      console.log( "sclosed")
    }
    const userId = req.userId;

    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path

      productImages = await Media.create({ image: thumbnail });
      imageArr.push(productImages._id);

    }

// let dat =  day_name.substring(1, day_name.length-1).split(",")
    const dataObj = {
      isfeatured,
      status: status,
      adsType,
      adsInfo: {
       
        categories,
        business_name,
        experience,
        working_hours:work_hour,
        tagline,
        business_location,
        business_service,
        price,
        descriptions,
        Additional_info,
        image: imageArr,

      },

      userId: userId,
    };

    const newbizPost = await postbizAndServicesAd.create(dataObj);

    const bizAndServices = {};

    for (let key in newbizPost.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key)) && (!listerBasicInfo.hasOwnProperty(String(key)))) {
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
  console.log(`kejhrjhyewgrjhew`);
  try {
    console.log(req.files);
    const bizId = req?.params?.bizId;

    const validate_id = await postbizAndServicesAd.findById(bizId)
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your loacl biz And Services id`,
      })
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
      location,
      name,
      emailAddress,
      phoneNumber,
      hideAddress,
      addressInfo,
      preferableModeContact,
    } = req.body;
    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path

      productImages = await Media.create({ image: thumbnail });
      imageArr.push(productImages._id);

    }


    console.log(`imageArr`, imageArr);

    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};

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
    let updatebizAdObjToSend = {}
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

////////////////

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
