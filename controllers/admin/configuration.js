
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

   
    if (!term_text) return failureJSONResponse(res, { message: `Please provide Term And Conditions` });
    if (!privacy_text) return failureJSONResponse(res, { message: `Please provide Privacy Policy` });
    if (!about_text) return failureJSONResponse(res, { message: `Please provide About Us` });

        const termCondition = await TermAndCondition.create({ htmlText: term_text });
        const privacyPolicy = await Privacy.create({ htmlText: privacy_text });
        const aboutUs = await AboutUS.create({ htmlText: about_text });

        if (termCondition && privacyPolicy && aboutUs) {
           
                return successJSONResponse(res, { message: "Success" });
            
        } else {
            // Handle a case where records creation failed
            return failureJSONResponse(res, { message: "Failed to create records" });
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