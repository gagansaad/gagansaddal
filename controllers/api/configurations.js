
const mongoose = require("mongoose"),
    User = mongoose.model("user"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../handlers/jsonResponseHandlers`);


exports.privacyPolicy = async(req,res) => {
    return res.json({data: `jhgdjhqejhgeghqw`})
}