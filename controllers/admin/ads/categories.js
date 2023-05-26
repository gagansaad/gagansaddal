
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
            ads_type,
        } = req.body
console.log(req.body);
        if (!isValidString(name)) return failureJSONResponse(res, { message: `Please provide name` });
        if (!ads_type) return failureJSONResponse(res, { message: `Please provide ads id` });
        // else if(){
        //     const 
        // }


        const dataObj = {}
        if (name) dataObj.name = name;
        if (ads_type) dataObj.ads_type = ads_type;
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
            ads_type,
        } = req.query

        if (!ads_type) return failureJSONResponse(res, { message: `Please provide ads id` });



        AdsCategories.find({ "ads_type": ads_type })
            .then((newCategory) => {
                if (!newCategory) return failureJSONResponse(res, { message: `Something went wrong` });
                else {
                    console.log(newCategory,"jvhjrfbv");
                    return successJSONResponse(res, { message: "Success", categories: newCategory });
                }
            }).catch((err) => {
                console.log(err,"*******-------------++++++++");
                return failureJSONResponse(res, { message: `Something went wrong` });
            })

    } catch (err) {
        console.log(err,"**catch eroor*****---------++++++");
        return failureJSONResponse(res, { message: `something went wrong` })
    }
}

exports.deleteNewCategories = async (req, res, next) => {
    try {

        const {
            ads_type,
        } = req.body

        if (!ads_type) return failureJSONResponse(res, { message: `Please provide ads id` });



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