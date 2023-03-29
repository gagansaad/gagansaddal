
const mongoose = require("mongoose"),
    Privacy = mongoose.model("privacy"),
    TermAndCondition = mongoose.model("termandcondition"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../handlers/jsonResponseHandlers`);




exports.createTermAndConditions = async (req, res, next) => {
    res.json({
        data: `jhgdajhgda`
    })

}