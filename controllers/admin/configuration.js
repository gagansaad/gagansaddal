const mongoose = require("mongoose"),
  Privacy = mongoose.model("privacy"),
  TermAndCondition = mongoose.model("termandcondition"),
  AboutUS = mongoose.model("aboutus"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../handlers/jsonResponseHandlers`);

exports.create_tconfiguration = async (req, res, next) => {
  try {
    const { term_text } = req.body;
    const existingTermCondition = await TermAndCondition.findOne();

    if (!term_text)
      return failureJSONResponse(res, {
        message: `Please provide Term And Conditions`,
      });
    // if (!privacy_text) return failureJSONResponse(res, { message: `Please provide Privacy Policy` });
    // if (!about_text) return failureJSONResponse(res, { message: `Please provide About Us` });

    if (existingTermCondition) {
      // If data exists, update it
      existingTermCondition.htmlText = term_text;
      await existingTermCondition.save();
    } else {
      // If data doesn't exist, create it
      await TermAndCondition.create({ htmlText: term_text });
    }

    return successJSONResponse(res, { message: "Success" });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
exports.create_pconfiguration = async (req, res, next) => {
  try {
    const { privacy_text } = req.body;

    const existingPrivacyPolicy = await Privacy.findOne();

    if (!privacy_text)
      return failureJSONResponse(res, {
        message: `Please provide Privacy Policy`,
      });

    if (existingPrivacyPolicy) {
      existingPrivacyPolicy.htmlText = privacy_text;
      await existingPrivacyPolicy.save();
    } else {
      await Privacy.create({ htmlText: privacy_text });
    }

    return successJSONResponse(res, { message: "Success" });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
exports.create_aconfiguration = async (req, res, next) => {
  try {
    const { about_text } = req.body;

    const existingAboutUs = await AboutUS.findOne();

    if (!about_text)
      return failureJSONResponse(res, { message: `Please provide About Us` });

    if (existingAboutUs) {
      existingAboutUs.htmlText = about_text;
      await existingAboutUs.save();
    } else {
      await AboutUS.create({ htmlText: about_text });
    }
    return successJSONResponse(res, { message: "Success" });
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
exports.get_configuation = async (req, res, next) => {
  try {
    const existingTermCondition = await TermAndCondition.findOne();
    const existingPrivacyPolicy = await Privacy.findOne();
    const existingAboutUs = await AboutUS.findOne();

    // Pass the data to an HTML form or template
    return successJSONResponse(res, {
      message: "Success",
      existingTermCondition,
      existingPrivacyPolicy,
      existingAboutUs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};
