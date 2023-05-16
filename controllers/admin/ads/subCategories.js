
const mongoose = require("mongoose"),
    AdsSubCategory = mongoose.model("adsSubCategory"),
    {
        successJSONResponse,
        failureJSONResponse,
    } = require(`../../../handlers/jsonResponseHandlers`),
    { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
    {
        isValidString,
        isValidMongoObjId,
    } = require(`../../../utils/validators`);


exports.createNewSubCategories = async (req, res, next) => {
    try {

        const {
            name,
            categoryId,
        } = req.body

        if (!isValidString(name)) return failureJSONResponse(res, { message: `Please provide name` });
        if (!adsId) return failureJSONResponse(res, { message: `Please provide ads id` });
        let checking = await AdsSubCategory.findOne({name:name})
        if(checking){
            return failureJSONResponse(res, { message: `sub category already ` });
        }

        const dataObj = {}
        if (name) dataObj.name = name;
        if (categoryId) dataObj.category = categoryId;


        AdsSubCategory.create(dataObj)
        .then((newCategory)=>{
            if(!newCategory) return failureJSONResponse(res, { message: `Something went wrong` });
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




exports.fetchNewSubCategories = async (req, res, next) => {
    try {

        const {
          
            categoryId,
        } = req.body

    
        if (!categoryId) return failureJSONResponse(res, { message: `Please provide ads id` });
    

        AdsSubCategory.findById({category:categoryId})
        .then((newCategory)=>{
            if(!newCategory) return failureJSONResponse(res, { message: `Something went wrong` });
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
