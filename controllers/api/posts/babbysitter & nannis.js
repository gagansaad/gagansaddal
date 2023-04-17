const { json } = require("express");

const mongoose = require("mongoose"),
  postbabyAd = mongoose.model("babysitter & nannie"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude ,listerBasicInfo} = require(`../../../utils/mongoose`),
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
    option: [`I offer care`, `I need care`],
    care_service: [`Child care`, `Home care`, `Day care centers`],
    Child_care: [`Nannies`, `Babysitter`],
    Home_care: [`Housekeeping`, `Cooking`],
    Elder_care: [`Enginner`, `Plumber`],
  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validateAdsData = async (req, res, next) => {
    console.log(req.body.status)
  try {
    const {
      status,
      adsType,
     option,
     care_service,
     sub_type
      
    } = req.body;
    console.log(req.body.status)
    if (isNaN(Number(status))) return failureJSONResponse(res, { message: `Please enter valid status` });
    else if (status < 1 || status > 3) failureJSONResponse(res, { message: `Please enter status between 1 to 3` });
    else if (status != 1 && status != 2 &&  status != 3)  return failureJSONResponse(res, { message: `Please enter status between 1 to 3` });
    if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });

    if (!isValidString(option))
      return failureJSONResponse(res, {
        message: `Please provide valid option`,
      });
    if (!isValidString(care_service))
      return failureJSONResponse(res, {
        message: `Please provide valid care service`,
      });
    if (!isValidString(sub_type))
      return failureJSONResponse(res, {
        message: `Please provide valid sub-type`,
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
    if(preferableModeContact){
      if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".") ){
        return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
      } else if (preferableModeContact != 1 && preferableModeContact != 2  && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });}
    }
    if (preferableModeContact && isNaN(Number(preferableModeContact))){
      return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
    }
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
////-----------------------Create babbysitter & nannis------------------------------//

exports.createAds = async (req, res, next) => {
  try {
    const {
      isfeatured,
      status,
      adsType,

      option,
      care_service,
      sub_type
       
    } = req.body;

    const userId = req.userId;

    

    const dataObj = {
      isfeatured,
      status: parseInt(status),
      adsType,
      adsInfo: {
          option,
          care_service,
          sub_type
      },
    
      userId: userId,
    };

    const newPost = await postbabyAd.create(dataObj);

    const Babysitter_Nannies = {};

    for (let key in newPost.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))&&!listerBasicInfo.hasOwnProperty(String(key))) {
        Babysitter_Nannies[key] = newPost[key];
      }
    }

    if (newPost) {
      return successJSONResponse(res, {
        message: `success`,
        Babysitter_Nannies:Babysitter_Nannies,
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
  console.log(`kejhrjhyewgrjhew`);
  try {
    
    const productId = req?.params?.productId;

    const validate_id = await postbabyAd.findById(productId)
    if (!validate_id){
    return failureJSONResponse(res, {
      message: `Failed to find your babysitter and nannies id`,
    })}
    const {
      status,
      adsType,
      option,
      care_service,
      sub_type,
      name,
      emailAddress,
      phoneNumber,
      hideAddress,
      location,
      addressInfo,
      preferableModeContact,
    } = req.body;
    

   

    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};

    if (status) dataObj.status = parseInt(status);
    if (adsType) dataObj.adsType = adsType;

    if (option) adsInfoObj.option = option;
    if (care_service) adsInfoObj.care_service = care_service;
    if (sub_type) adsInfoObj.sub_type = sub_type;
   
    if (location) listerBasicInfoObj.location = location;
    
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
        location,
        addressInfo,
        mobileNumber: {
          countryCode: +91,
          phoneNumber: phoneNumber,
        },
        preferableModeContact: preferableModeContact,
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
    
    let BabysitterNannies ={}

    for (let key in updateproduct.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        BabysitterNannies[key] = updateproduct[key];
      }
    }

    if (updateproduct) {
      return successJSONResponse(res, {
        message: `success`,
        Babysitter_Nannies:BabysitterNannies,
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
    const isFeatured = req.query.isfeatured;
    let dbQuery ={
        status: 1
    };

if(isFeatured) dbQuery.isfeatured = isFeatured;
      let records = await postbabyAd.find(dbQuery);
      if (records) {
          return successJSONResponse(res, {
              message: `success`,
              total:Object.keys(records).length,
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