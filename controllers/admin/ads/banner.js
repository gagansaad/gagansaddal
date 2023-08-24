
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
        console.log(req.body,"-----------------------------------");
        const {
            image,
            caption,
            target_url,
            img_type,
        } = req.body
        console.log(req.files);
        if (!caption) return failureJSONResponse(res, { message: `Please provide caption` });
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
        console.log(dataObj, "----------------------");


        let bannerdata = await BannerSchema.create(dataObj)

        if (!bannerdata) return failureJSONResponse(res, { message: `Something went wrong` });
        else {
            return successJSONResponse(res, { message: "Success" });
        }

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
}
