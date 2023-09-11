
const mongoose = require("mongoose"),
    Privacy = mongoose.model("privacy"),
    TermAndCondition = mongoose.model("termandcondition"),
    AboutUS = mongoose.model("aboutus"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../handlers/jsonResponseHandlers`);




exports.create_configuration = async (req, res, next) => {
    try{
    const {
        term_text,
        privacy_text,
        about_text,
    } = req.body
    const existingTermCondition = await TermAndCondition.find();
    const existingPrivacyPolicy = await Privacy.find();
    const existingAboutUs = await AboutUS.find();
   
    if (!term_text) return failureJSONResponse(res, { message: `Please provide Term And Conditions` });
    if (!privacy_text) return failureJSONResponse(res, { message: `Please provide Privacy Policy` });
    if (!about_text) return failureJSONResponse(res, { message: `Please provide About Us` });
    if (existingTermCondition) {
        // If data exists, update it
        existingTermCondition.htmlText = term_text;
        await existingTermCondition.save();
      } else {
        // If data doesn't exist, create it
        await TermAndCondition.create({ htmlText: term_text });
      }
  
      if (existingPrivacyPolicy) {
        existingPrivacyPolicy.htmlText = privacy_text;
        await existingPrivacyPolicy.save();
      } else {
        await Privacy.create({ htmlText: privacy_text });
      }
  
      if (existingAboutUs) {
        existingAboutUs.htmlText = about_text;
        await existingAboutUs.save();
      } else {
        await AboutUS.create({ htmlText: about_text });
      }
  
    
} catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` })
}

}

exports.createPrivacypolicy = async (req, res, next) => {
    res.json({
        data: `jhgdajhgda`
    })

}