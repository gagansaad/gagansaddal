
const mongoose = require("mongoose"),
    AdsCategories = mongoose.model("adsCategory"),
    {
        successJSONResponse,
        failureJSONResponse,
    } = require(`../../../handlers/jsonResponseHandlers`),
    { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
    {
        isValidString,
        isValidMongoObjId,
    } = require(`../../../utils/validators`);


exports.createNewCategories = async (req, res, next) => {
    try {

        const {
            name,
            adsId,
        } = req.body

        if (!isValidString(name)) return failureJSONResponse(res, { message: `Please provide name` });
        if (!adsId) return failureJSONResponse(res, { message: `Please provide ads id` });
        // else if(adsId){
        //     const 
        // }


        const dataObj = {}
        if (name) dataObj.name = name;
        if (adsId) dataObj.adsId = adsId;


        AdsCategories.create(dataObj)
        .then((newCategory)=>{
            if(!AdsCategories) return failureJSONResponse(res, { message: `Something went wrong` });
            else {
                return successJSONResponse(res, { message: "Success" });
            }
        }).catch((err)=>{
            return failureJSONResponse(res, { message: `Something went wrong` });
        })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
}

