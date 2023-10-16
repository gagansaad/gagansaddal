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
      let value = [
        "Tea table",
        "Sudy table",
        "Double bed",
        "Curtains",
        "Book shelf",
        "Center table",
        "Dining table and chairs",
        "Coffee tables",
        "Drawers",
        "Television stand",
        "Office furniture",
        "Bed & Bedroom furniture",
        "Chairs",
        "Computer table",
        "Cabinets",
        "Doors",
        "Couch",
        "Modular kitchen",
        "Windows",
        "Other",
      ];
    // let checking = await AdsSubCategory.findOne({$and: [
      async function createCategory(element) {
        try {
          let dataObj = {
            name: element,
            category_id: category_id, // Ensure ads_type is defined before this code
          };
      
          let checking = await AdsSubCategory.findOne({
            $and: [
              { name: dataObj.name },
              { category_id: dataObj.category_id },
            ],
          });
      
          if (checking) {
            res.status(409).json({ message: `Category already exists` });
          } else {
            const newCategory = await AdsSubCategory.create(dataObj);
            if (!newCategory) {
              res.status(500).json({ message: `Something went wrong` });
            } 
          }
        } catch (error) {
          res.status(500).json({ message: `Something went wrong` });
        }
      }
      
      // Iterate through the values and create or handle categories
      for (const element of value) {
        if (element) {
          createCategory(element);
        }
      }
      // else {
    return res.status(201).json({ message: "Success" });
      // }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.fetchNewSubCategories = async (req, res, next) => {
  try {
    const { category_id } = req.query;

    if (!category_id)
      return failureJSONResponse(res, { message: `Please provide ads id` });

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

exports.deleteNewSubCategories = async (req, res, next) => {
  try {
    const { sub_category_id } = req.body;

    if (!sub_category_id)
      return failureJSONResponse(res, { message: `Please provide ads id` });

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
      return failureJSONResponse(res, { message: `Please provide ads id` });

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
