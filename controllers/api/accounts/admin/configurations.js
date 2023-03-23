
const mongoose = require("mongoose"),
AdminConfigurations = mongoose.model("adminConfigurations"),
{
    successJSONResponse,
    failureJSONResponse
} = require(`../../../../handlers/jsonResponseHandlers`);
const PostType = mongoose.model("PostType");
const AddPlan = mongoose.model("adsplan");

exports.postconfigurations = async (req, res, next) => {

    try {
        
        // console.log(req.body);
        const { main_categories ,post_15_currency,post_15_ammount ,post_30_currency,post_30_ammount ,featured_15_currency,featured_15_ammount ,featured_30_currency,featured_30_ammount ,is_active } = req.body;

        const configurations = await AdminConfigurations.findOne({
            main_categories,
        })

        if (configurations) {
            return failureJSONResponse(res, { message: `Main categories already exists` })
        } 

        const allconfigurations = new AdminConfigurations({
            "adsType": PostType.id,
            "post_15.package.currency": post_15_currency,
            "post_15.package.ammount": post_15_ammount,
            "post_30.package.currency": post_30_currency,
            "post_30.package.ammount": post_30_ammount,
            "featured_15.package.currency": featured_15_currency,
            "featured_15.package.ammount": featured_15_ammount,
            "featured_30.package.currency": featured_30_currency,
            "featured_30.package.ammount": featured_30_ammount,
            "is_active": is_active,

        })
        allconfigurations.save()
        .then((foundConfigurations) => {
            return successJSONResponse(res, { message: `success`, Configurations: foundConfigurations });
        }).catch((err) => {
            return failureJSONResponse(res, { message: `something went wrong` })
        })


    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }

}
exports.posttypeconfigurations = async (req, res, next) => {

    try {
        
        // console.log(req.body);
        const { is_active ,visible ,name ,ads_type ,featured_amount ,featured_currency ,price_amount ,price_currency, duration } = req.body; 

        const addTypePlan = new AddPlan({
            "is_active":is_active,
            "visible":visible,
            "name":name,
            "duration":duration,
            "ads_type":ads_type,
            "featured_price.amount":featured_amount,
            "featured_price.currency":featured_currency,
            "price.amount":price_amount,
            "price.currency":price_currency,

        })
        addTypePlan.save()
        .then((foundTypeplan) => {
            return successJSONResponse(res, { message: `success`, Typeplan: foundTypeplan });
        }).catch((err) => {
            return failureJSONResponse(res, { message: `something went wrong` })
        })


    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }

}
exports.gettypeconfigurations = async (req, res, next) => {

    try {
        
        AddPlan.find()
        .then(result => {
            if (!result){
                return failureJSONResponse(res, {message: `something went wrong` })
            }
            return  successJSONResponse(res, { data: result })
        })
        .catch(err=>{
            return failureJSONResponse(res, { message: `something went wrong` })
        })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }

}

