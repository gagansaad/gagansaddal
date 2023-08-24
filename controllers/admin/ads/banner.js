
const mongoose = require("mongoose"),
    BannerSchema = mongoose.model("Banner"),
    Media = mongoose.model("media"),
    {
        successJSONResponse,
        failureJSONResponse,
    } = require(`../../../handlers/jsonResponseHandlers`),
    { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
    {
        isValidString,
        isValidMongoObjId,
    } = require(`../../../utils/validators`);


exports.createBanner = async (req, res, next) => {
    try {
        console.log(req.body);
        const {
            image,
            caption,
            target_url,
            img_type,
        } = req.body
        console.log(req.body);
        if (!isValidString(caption)) return failureJSONResponse(res, { message: `Please provide caption` });
        if (!target_url) return failureJSONResponse(res, { message: `Please provide target_url` });
        if (req.files.length) {
            var thumbnail = req.files.path;

            productImages = await Media.create({ url: thumbnail });
        } else {
            return failureJSONResponse(res, { message: `Please provide Banner image` });
        }

        let dataObj = {
            image: productImages._id,
            caption,
            target_url,
            img_type,
        }
console.log(dataObj,"----------------------");
    
       
            BannerSchema.create(dataObj)
                .then((newCategory) => {
                    if (!BannerSchema) return failureJSONResponse(res, { message: `Something went wrong` });
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
                    console.log(newCategory, "jvhjrfbv");
                    return successJSONResponse(res, { message: "Success", categories: newCategory });
                }
            }).catch((err) => {
                console.log(err, "*******-------------++++++++");
                return failureJSONResponse(res, { message: `Something went wrong` });
            })

    } catch (err) {
        console.log(err, "**catch eroor*****---------++++++");
        return failureJSONResponse(res, { message: `something went wrong` })
    }
}

exports.deleteNewCategories = async (req, res, next) => {
    try {

        const {
            category_id,
        } = req.body

        if (!category_id) return failureJSONResponse(res, { message: `Please provide ads id` });



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

exports.UpdateCategories = async (req, res, next) => {
    try {
        let dbQuery = {}
        const {
            category_id,
            name,
            status
        } = req.body

        if (!category_id) return failureJSONResponse(res, { message: `Please provide ads id` });
        if (name) dbQuery.name = name
        if (status) dbQuery.status = status


        AdsCategories.findByIdAndUpdate({ "_id": category_id }, { $set: dbQuery })
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