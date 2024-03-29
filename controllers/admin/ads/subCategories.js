const mongoose = require("mongoose"),
  AdsSubCategory = mongoose.model("adsSubCategory"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  { isValidString, isValidMongoObjId } = require(`../../../utils/validators`);

  exports.createNewSubCategories = async (req, res, next) => {
    try {
      const { name, category_id } = req.body;
  
      if (!isValidString(name))
        return failureJSONResponse(res, { message: `Please provide name` });
      if (!category_id)
        return failureJSONResponse(res, {
          message: `Please provide category id`,
        });
      let checking = await AdsSubCategory.findOne({$and: [
        { name: name },
        { category: category_id }
      ] });
      if (checking) {
        return failureJSONResponse(res, {
          message: `sub category already exist`,
        });
      } else {
        const dataObj = {};
        if (name) dataObj.name = name;
        if (category_id) dataObj.category = category_id;
  
        AdsSubCategory.create(dataObj)
          .then((newCategory) => {
            
            if (!newCategory)
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

exports.fetchNewSubCategories = async (req, res, next) => {
  try {
    const { category_id } = req.query;

    if (!category_id)
      return failureJSONResponse(res, { message: `Please provide category_id` });

    AdsSubCategory.find({ category: category_id })
      .then((newCategory) => {
        if (!newCategory)
          return failureJSONResponse(res, { message: `Something went wrong` });
        else {
          return successJSONResponse(res, {
            message: "Success",
            subCategories: newCategory,
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
exports.fetchOneSubCategories = async (req, res, next) => {
  try {
    const { sub_category_id } = req.query;

    if (!sub_category_id)
      return failureJSONResponse(res, { message: `Please provide subcategory_id` });

    AdsSubCategory.find({ _id: sub_category_id })
      .then((newCategory) => {
        if (!newCategory)
          return failureJSONResponse(res, { message: `Something went wrong` });
        else {
          return successJSONResponse(res, {
            message: "Success",
            subCategories: newCategory,
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
exports.deleteNewSubCategories = async (req, res, next) => {
  try {
    const { sub_category_id } = req.query;

    if (!sub_category_id)
      return failureJSONResponse(res, { message: `Please provide sub_category_id` });

    AdsSubCategory.findOneAndDelete({ _id: sub_category_id })
      .then((newCategory) => {
        if (!newCategory)
          return failureJSONResponse(res, { message: `Something went wrong` });
        else {
          return successJSONResponse(res, {
            message: "Success",
            newCategory: newCategory,
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
exports.updateSubCategories = async (req, res) => {
  try {
    let dbQuery = {};
    const { name, status, sub_category_id } = req.body;

    if (name) dbQuery.name = name;
    if (status) dbQuery.status = status;
    if (!sub_category_id)
      return failureJSONResponse(res, { message: `Please provide sub_category_id` });

    AdsSubCategory.findByIdAndUpdate(
      { _id: sub_category_id },
      { $set: dbQuery }
    )
      .then((newCategory) => {
        if (!newCategory)
          return failureJSONResponse(res, { message: `Something went wrong` });
        else {
          return successJSONResponse(res, {
            message: "Success",
            newCategory: newCategory,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return failureJSONResponse(res, { message: `Something went wrong` });
      });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
