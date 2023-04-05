const { json } = require("express");

const mongoose = require("mongoose"),
  postJobAd = mongoose.model("job"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude } = require(`../../../utils/mongoose`),
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
    categories: [`employed`, `self employed`, `engineer`],
    
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
      title,
      descriptions,
      categories,
      user_type,
      product_condition,
      price,
      location,
      additional_info,
      image,
    } = req.body;

    if (!isValidString(categories))
      return failureJSONResponse(res, {
        message: `Please provide valid jobCategory`,
      });
    if (!isValidString(user_type))
      return failureJSONResponse(res, {
        message: `Please provide valid user_type`,
      });
    if (!isValidString(product_condition))
      return failureJSONResponse(res, {
        message: `Please provide valid product_condition`,
      });
    if (!isValidString(title))
      return failureJSONResponse(res, {
        message: "Pleae provide us your jobTitle",
      });
    if (!isValidString(descriptions))
      return failureJSONResponse(res, {
        message: `please provide valid jobDescription`,
      });
   
   
    if (!isValidString(price))
      return failureJSONResponse(res, { message: `please provide us salary` });
      if (!isValidString(additional_info))
      return failureJSONResponse(res, { message: `please provide us additional_info` });
    if (!isValidString(location))
      return failureJSONResponse(res, {
        message: "Please let us know your current location",
      });

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
      user_type,
      product_condition,
      price,
      additional_info,
      image,

      name,
      emailAddress,
      phoneNumber,
      location,
      hideAddress,
      preferableModeContact,
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
        title,
        descriptions,
        categories,
        user_type,
        product_condition,
        price,
        additional_info,
        image: imageArr,
      },
      listerBasicInfo: {
        name,
        emailAddress,
        phoneNumber,
        hideAddress,
        location,
        mobileNumber: {
          countryCode: +91,
          phoneNumber: phoneNumber,
        },
        preferableModeContact: preferableModeContact,
      },
      userId: userId,
    };

    const newproductPost = await postJobAd.create(dataObj);

    const buyAndSell = {};

    for (let key in newproductPost.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        buyAndSell[key] = newproductPost[key];
      }
    }

    return successJSONResponse(res, {
      message: `success`,
      buyAndSell,
      status: 200,
    });
  } catch (err) {
    console.log(err);
  }
};

///--------------------------Edit Job-----------------------------///

exports.editJobAds = async (req, res, next) => {
 
  try {
    console.log(req.files);
    const buyAndSellId = req?.params?.buyAndSellId;

    if (!buyAndSellId)
      return successJSONResponse(res, {
        message: `success`,
        newProductPost,
        status: 200,
      });

    const {
      status,
      adsType,
      title,
      descriptions,
      categories,
      user_type,
      product_condition,
      price,
      additional_info,
      image,

      name,
      emailAddress,
      phoneNumber,
      hideAddress,
      location,
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

    if (title) adsInfoObj.title = title;
    if (descriptions) adsInfoObj.descriptions = descriptions;
    if (user_type) adsInfoObj.user_type = user_type;
    if (categories) adsInfoObj.categories = categories;
    if (product_condition) adsInfoObj.product_condition = product_condition;
    if (price) adsInfoObj.price = price;
    if (location) listerBasicInfo.location = location;
    if (additional_info) adsInfoObj.additional_info = additional_info;
    if (imageArr.length) adsInfoObj.image = imageArr;

    if (name) listerBasicInfo.name = name;

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
        mobileNumber: {
          countryCode: +91,
          phoneNumber: phoneNumber,
        },
        preferableModeContact: preferableModeContact,
      },
    };

    console.log(dataObjq);
    console.log("object", { image: imageArr });

    const updateProduct = await postJobAd.findByIdAndUpdate(
      { _id: buyAndSellId },
      { $set: dataObjq },
      { new: true }
    );

    if (updateProduct) {
      return successJSONResponse(res, {
        message: `success`,
        updateProduct,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updateProduct: null,
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
    const buyAndSellId = req?.params?.buyAndSellId;

    if (!buyAndSellId)
      return successJSONResponse(res, {
        message: `success`,
        newProductPost,
        status: 200,
      });
    const dataObj = {};
    const { status } = req.body;

    if (status) dataObj.status = parseInt(status);

    const updateProduct = await postJobAd.findByIdAndUpdate(
      { _id: buyAndSellId },
      { $set: dataObj },
      { new: true }
    );

    if (updateProduct) {
      return successJSONResponse(res, {
        message: `success`,
        updateProductStatus:updateProduct,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updateProduct: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
