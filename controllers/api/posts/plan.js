const mongoose = require("mongoose"),
  AdminConfigurations = mongoose.model("adminConfigurations"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../../handlers/jsonResponseHandlers`);
const PostType = mongoose.model("PostType");
const AddPlan = mongoose.model("adsplan");

exports.gettypeconfigurations = async (req, res, next) => {
  try {
    AddPlan.find()
      .then((result) => {
        if (!result) {
          return failureJSONResponse(res, { message: `something went wrong` });
        }
        return successJSONResponse(res, { data: result });
      })
      .catch((err) => {
        return failureJSONResponse(res, { message: `something went wrong` });
      });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
