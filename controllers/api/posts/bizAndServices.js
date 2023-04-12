const { json } = require("express");

const mongoose = require("mongoose"),
  postbizAndServicesAd = mongoose.model("Local_biz & Service"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude,listerBasicInfo } = require(`../../../utils/mongoose`),
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
    profession:[`Local Professional`,`Business Center / Local Retailer / Showroom`,`Brand`,`Agent`],
    categories: [`employed`, `self employed`, `engineer`],
    preferableModeContact:[`Phone Number`,`Email`]
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
        buisness_name,
        tagline,
        buisnesslocation,
        price,
        descriptions,
        Additional_info,
        image,
      
    } = req.body;
    
    if (isNaN(Number(status))) return failureJSONResponse(res, { message: `Please enter valid status` });
    else if (status < 1 || status > 3)  return failureJSONResponse(res, { message: `Please enter status between 1 to 3` });
    else if (status != 1 && status != 2 &&  status != 3 || status.includes(".") )  return failureJSONResponse(res, { message: `Please enter status between 1 to 3` });
    if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });
    if (!isValidString(profession))
    return failureJSONResponse(res, {
      message: `Please provide valid profession`,
    });
    if (!isValidString(categories))
      return failureJSONResponse(res, {
        message: `Please provide valid Category`,
      });
    if (!isValidString(buisness_name))
      return failureJSONResponse(res, {
        message: `Please provide valid buisness_name`,
      });
    if (!isValidString(tagline))
      return failureJSONResponse(res, {
        message: `Please provide valid tagline`,
      });
    if (!isValidString(buisnesslocation))
      return failureJSONResponse(res, {
        message: "Pleae provide us your buisness location",
      });
    if (!isValidString(descriptions))
      return failureJSONResponse(res, {
        message: `please provide valid Description`,
      });
    if (isNaN(Number(price)))
      return failureJSONResponse(res, {
        message: `Please provide valid price`,
      });
    if (!isValidString(Additional_info))
      return failureJSONResponse(res, {
        message: `Please provide us Additional_info`,
      });
   
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
   console.log(typeof(hideAddress),"yyyyyyyyyyyyyyyyyyyyyy");
console.log("isValidBoolean(hideAddress)isValidBoolean(hideAddress)isValidBoolean(hideAddress)",isValidBoolean(hideAddress))
    // if (countryCode && isNaN(Number(countryCode)))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid country code`,
    // });
    if (preferableModeContact && isNaN(Number(preferableModeContact))){
      return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
    }else if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".") ){
      return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 2` });
    } else if (preferableModeContact != 1 && preferableModeContact != 2  && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 2` });}
   
    if (emailAddress && !isValidEmailAddress(emailAddress)){
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
    }
      
      // console.log("isValidBoolean(hideAddress)",typeof isValidBoolean(hideAddress));

    if(["true","false"].includes(hideAddress) == false){
        return  failureJSONResponse(res, {
          message: `Please provide us hide/show address (true/false)`
      })
    }
     
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
    console.log(req.files,"dccdcdc");
    const {
      status,
      adsType,
      profession,
      categories,
      buisness_name,
      tagline,
      buisnesslocation,
      price,
      descriptions,
      Additional_info,
      image,

    } = req.body;

    const userId = req.userId;

    const imageArr = [];

    req.files.forEach((data) => {
      imageArr.push(data?.path);
    });

    const dataObj = {
      status: parseInt(status),
      adsType,
      adsInfo: {
        profession,
        categories,
        buisness_name,
        tagline,
        buisnesslocation,
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
      if (!fieldsToExclude.hasOwnProperty(String(key))&&(!listerBasicInfo.hasOwnProperty(String(key)))) {
        bizAndServices[key] = newbizPost[key];
      }
    }
    if (newbizPost) {
      return successJSONResponse(res, {
        message: `success`,
        bizAndServices:bizAndServices,
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
        buisness_name,
        tagline,
        buisnesslocation,
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

    req.files.forEach((data) => {
      imageArr.push(data?.path);
    });

    console.log(`imageArr`, imageArr);

    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};

    if (status) dataObj.status = parseInt(status);
    if (adsType) dataObj.adsType = adsType;

    if (profession) adsInfoObj.profession = profession;
    if (categories) adsInfoObj.categories = categories;
    if (buisness_name) adsInfoObj.buisness_name = buisness_name;
    if (tagline) adsInfoObj.tagline = tagline;
    if (buisnesslocation) adsInfoObj.buisnesslocation = buisnesslocation;
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
    let updatebizAdObjToSend ={}
    for (let key in updatebiz.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updatebizAdObjToSend[key] = updatebiz[key];
      }
    }

    if (updatebiz) {
      return successJSONResponse(res, {
        message: `success`,
        updatebizAdObjToSend:updatebizAdObjToSend,
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
