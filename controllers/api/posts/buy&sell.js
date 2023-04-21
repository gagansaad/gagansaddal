const { json } = require("express");

const mongoose = require("mongoose"),
  postBuySellAd = mongoose.model("Buy & Sell"),
  Media = mongoose.model("media"),
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
    categories: [`buy`, `sell `],
    product_condition: [`New`, `Used`, `Good`, `Age-worn`],
    user_type: [`Individual`, `Retailer`],


  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validateBuySellAdsData = async (req, res, next) => {
  //   console.log(req.body)
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
      location,
      additional_info,
      image,
    } = req.body;
    if (status && (status != `active` && status != `inactive` && status != `draft`)) return failureJSONResponse(res, { message: `Please enter status active inactive or draft` });
    if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });

    if (!isValidString(title))
      return failureJSONResponse(res, {
        message: "Pleae provide us your title",
      });

    if (!isValidString(descriptions))
      return failureJSONResponse(res, {
        message: `please provide valid description`,
      });

    if (!isValidString(categories))
      return failureJSONResponse(res, {
        message: `Please provide valid category`,
      });
    if (!isValidString(user_type))
      return failureJSONResponse(res, {
        message: `Please provide valid user_type`,
      });
    if (!isValidString(product_condition))
      return failureJSONResponse(res, {
        message: `Please provide valid product_condition`,
      });
    if (!price)
      return failureJSONResponse(res, {
        message: `please provide valid price`,
      });


    if (isNaN(Number(price)))
      return failureJSONResponse(res, {
        message: `please provide valid price`,
      });

    if (!isValidString(additional_info))
      return failureJSONResponse(res, { message: `please provide valid additional_info` });



    return next();
  } catch (err) {
    console.log(err);
  }
};

///////////////

exports.validateListerBasicinfo = async (req, res, next) => {

  try {
    const {
      emailAddress,
      // phoneNumber,
      // countryCode,
      hideAddress,
      preferableModeContact,
    } = req.body;
   
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

    if (["true", "false"].includes(hideAddress) == false) {
      return failureJSONResponse(res, {
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

////-----------------------Create buysell------------------------------//

exports.createBuySellAds = async (req, res, next) => {
  try {
    const {
      isfeatured,
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
    } = req.body;

    const userId = req.userId;

    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = JSON.stringify(req.files[i]);

      productImages = await Media.create({ image: thumbnail });
      imageArr.push(productImages._id);

    }


    const dataObj = {
      isfeatured,
      status: status,
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
      userId: userId,
    };

    const newBuySellPost = await postBuySellAd.create(dataObj);

    const postBuySellAdObjToSend = {};

    for (let key in newBuySellPost.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key)) && !listerBasicInfo.hasOwnProperty(String(key))) {
        postBuySellAdObjToSend[key] = newBuySellPost[key];
      }
    }

    if (newBuySellPost) {
      return successJSONResponse(res, {
        message: `success`,
        postBuySellAdObjToSend: postBuySellAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        postBuySellAdObjToSend: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

///--------------------------Edit buysell-----------------------------///

exports.editBuySellAds = async (req, res, next) => {

  try {
    console.log(req.params);
    const buyAndSellId = req?.params?.buyAndSellId;

    const validate_id = await postBuySellAd.findById(buyAndSellId)
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your buy sell id`,
      })
    }

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
      addressInfo,
      preferableModeContact,
    } = req.body;
    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = JSON.stringify(req.files[i]);

      productImages = await Media.create({ image: thumbnail });
      imageArr.push(productImages._id);

    }


    console.log(`imageArr`, imageArr);

    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};

    if (status) dataObj.status = status;
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
        addressInfo,
        preferableModeContact: preferableModeContact,
      },
    };

    console.log(dataObjq);
    console.log("object", { image: imageArr });

    const updateProduct = await postBuySellAd.findByIdAndUpdate(
      { _id: buyAndSellId },
      { $set: dataObjq },
      { new: true }
    );

    let updateBuySellAdObjToSend = {}
    for (let key in updateProduct.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updateBuySellAdObjToSend[key] = updateProduct[key];
      }
    }

    if (updateProduct) {
      return successJSONResponse(res, {
        message: `success`,
        updateBuySellAdObjToSend: updateBuySellAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updateBuySellAdObjToSend: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/////----------------------Update Buy Sell Status -------------------/////

exports.editBuySellStatus = async (req, res, next) => {
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

    const updateProduct = await postBuySellAd.findByIdAndUpdate(
      { _id: buyAndSellId },
      { $set: dataObj },
      { new: true }
    );

    if (updateProduct) {
      return successJSONResponse(res, {
        message: `success`,
        updateProductStatus: updateProduct,
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



/////////////


exports.fetchAll = async (req, res, next) => {
  try {
    const isFeatured = req.query.isfeatured;
    let dbQuery = {
      status: 1
    };

    if (isFeatured) dbQuery.isfeatured = isFeatured;
    let records = await postBuySellAd.find(dbQuery);
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