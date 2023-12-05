const mongoose = require("mongoose"),
  AdsCategories = mongoose.model("adsCategory"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  { isValidString, isValidMongoObjId } = require(`../../../utils/validators`);

exports.createNewCategories = async (req, res, next) => {
  try {
    const { name, ads_type } = req.body;
    if (!isValidString(name))
      return failureJSONResponse(res, { message: `Please provide name` });
    if (!ads_type)
      return failureJSONResponse(res, { message: `Please provide ads type id` });

    const dataObj = {};
    if (name) dataObj.name = name;
    if (ads_type) dataObj.ads_type = ads_type;
    let checking = await AdsCategories.findOne({  $and: [
      { name: name },
      { ads_type: ads_type }
    ] });
    if (checking) {
      return failureJSONResponse(res, { message: `category already exist` });
    } else {
      AdsCategories.create(dataObj)
        .then((newCategory) => {
          if (!AdsCategories)
            return failureJSONResponse(res, {
              message: `Something went wrong`,
            });
          else {
            return successJSONResponse(res, { message: "Success" });
          }
        })
        .catch((err) => {
          return failureJSONResponse(res, { message: `Something went wrong` });
        });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.fetchNewCategories = async (req, res, next) => {
  try {
    const { ads_type } = req.query;

    if (!ads_type)
      return failureJSONResponse(res, { message: `Please provide ads_type id` });
    AdsCategories.find({ ads_type: ads_type }).populate({path:"ads_type",select:"name"})
      .then((newCategory) => {
        if (!newCategory)
          return failureJSONResponse(res, { message: `Something went wrong` });
        else {
          return successJSONResponse(res, {
            message: "Success",
            categories: newCategory,
          });
        }
      })
      .catch((err) => {
        return failureJSONResponse(res, { message: `Something went wrong` });
      });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
exports.fetchOneCategory = async (req, res, next) => {
  try {
    const { category_id } = req.query;

    if (!category_id)
      return failureJSONResponse(res, { message: `Please provide category_id` });
    AdsCategories.findById({ _id: category_id })
      .then((newCategory) => {
        if (!newCategory)
          return failureJSONResponse(res, { message: `Something went wrong` });
        else {
          return successJSONResponse(res, {
            message: "Success",
            categories: newCategory,
          });
        }
      })
      .catch((err) => {
        return failureJSONResponse(res, { message: `Something went wrong` });
      });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
exports.deleteNewCategories = async (req, res, next) => {
  try {
    const { category_id } = req.query;

    if (!category_id)
      return failureJSONResponse(res, { message: `Please provide category_id` });

    AdsCategories.findOneAndDelete({ _id: category_id })
      .then((newCategory) => {
        if (!newCategory)
          return failureJSONResponse(res, { message: `Something went wrong` });
        else {
          return successJSONResponse(res, { message: "Success" });
        }
      })
      .catch((err) => {
        return failureJSONResponse(res, { message: `Something went wrong` });
      });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.UpdateCategories = async (req, res, next) => {
  try {
    let dbQuery = {};
    const { category_id, name, status } = req.body;

    if (!category_id)
      return failureJSONResponse(res, { message: `Please provide category_id` });
    if (name) dbQuery.name = name;
    if (status) dbQuery.status = status;

    AdsCategories.findByIdAndUpdate({ _id: category_id }, { $set: dbQuery })
      .then((newCategory) => {
        if (!newCategory)
          return failureJSONResponse(res, { message: `Something went wrong` });
        else {
          return successJSONResponse(res, { message: "Success" });
        }
      })
      .catch((err) => {
        return failureJSONResponse(res, { message: `Something went wrong` });
      });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
