
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
            ads_id,
        } = req.body

        if (!isValidString(name)) return failureJSONResponse(res, { message: `Please provide name` });
        if (!ads_id) return failureJSONResponse(res, { message: `Please provide ads id` });
        // else if(ads_id){
        //     const 
        // }


        const dataObj = {}
        if (name) dataObj.name = name;
        if (ads_id) dataObj.ads_type = ads_id;
        let checking = await AdsCategories.findOne({ "name": name })
        if (checking) {
            return failureJSONResponse(res, { message: `category already exist` });
        }
        else {
            AdsCategories.create(dataObj)
                .then((newCategory) => {
                    if (!AdsCategories) return failureJSONResponse(res, { message: `Something went wrong` });
                    else {
                        return successJSONResponse(res, { message: "Success" });
                    }
                }).catch((err) => {
                    return failureJSONResponse(res, { message: `Something went wrong` });
                })
        }
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
}

exports.fetchNewCategories = async (req, res, next) => {
    try {

        const {
            ads_id,
        } = req.body

        if (!ads_id) return failureJSONResponse(res, { message: `Please provide ads id` });



        AdsCategories.find({ "ads_type": ads_id })
            .then((newCategory) => {
                if (!newCategory) return failureJSONResponse(res, { message: `Something went wrong` });
                else {
                    return successJSONResponse(res, { message: "Success", newCategory: newCategory });
                }
            }).catch((err) => {
                return failureJSONResponse(res, { message: `Something went wrong` });
            })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
}

exports.deleteNewCategories = async (req, res, next) => {
    try {

        const {
            ads_id,
        } = req.body

        if (!ads_id) return failureJSONResponse(res, { message: `Please provide ads id` });



        AdsCategories.findOneAndDelete({ "_id": category_id })
            .then((newCategory) => {
                if (!newCategory) return failureJSONResponse(res, { message: `Something went wrong` });
                else {
                    return successJSONResponse(res, { message: "Success" });
                }
            }).catch((err) => {
                return failureJSONResponse(res, { message: `Something went wrong` });
            })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
}