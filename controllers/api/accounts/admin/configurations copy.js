const mongoose = require("mongoose"),
    AdminConfigurations = mongoose.model("adminConfigurations"),
    {
        successJSONResponse,
        failureJSONResponse,
    } = require(`../../../../handlers/jsonResponseHandlers`);
const PostType = mongoose.model("PostType");
const AdsPlan = mongoose.model("plan");
const addons_plan = mongoose.model("plan_addons");



//////////------------------//////////
exports.postconfigurations = async (req, res, next) => {
    try {
        // console.log(req.body);
        const {
            main_categories,
            post_15_currency,
            post_15_ammount,
            post_30_currency,
            post_30_ammount,
            featured_15_currency,
            featured_15_ammount,
            featured_30_currency,
            featured_30_ammount,
            is_active,
        } = req.body;

        const configurations = await AdminConfigurations.findOne({
            main_categories,
        });

        if (configurations) {
            return failureJSONResponse(res, {
                message: `Main categories already exists`,
            });
        }

        const allconfigurations = new AdminConfigurations({
            adsType: PostType.id,
            "post_15.package.currency": post_15_currency,
            "post_15.package.ammount": post_15_ammount,
            "post_30.package.currency": post_30_currency,
            "post_30.package.ammount": post_30_ammount,
            "featured_15.package.currency": featured_15_currency,
            "featured_15.package.ammount": featured_15_ammount,
            "featured_30.package.currency": featured_30_currency,
            "featured_30.package.ammount": featured_30_ammount,
            is_active: is_active,
        });
        allconfigurations
            .save()
            .then((foundConfigurations) => {
                return successJSONResponse(res, {
                    message: `success`,
                    Configurations: foundConfigurations,
                });
            })
            .catch((err) => {
                return failureJSONResponse(res, { message: `something went wrong` });
            });
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` });
    }
};

//////////------------------//////////


exports.posttypeconfigurations = async (req, res, next) => {
    try {
        // console.log(req.body);
        const {
            is_active,
            visible,
            name,
            ads_type,
            price_isfree,
            price_amount,
            price_currency,
            duration,
           
        } = req.body;
     

        const addTypePlan = new AdsPlan({
            is_active: is_active,
            visible: visible,
            name: name,
            duration: duration,
            ads_type: ads_type,
            "price.amount": price_amount,
            "price.isfree": price_isfree,
            "price.currency": price_currency,
          

        });
        addTypePlan
            .save()
            .then((foundTypeplan) => {
                return successJSONResponse(res, {
                    message: `success`,
                    Typeplan: foundTypeplan,
                });
            })
            .catch((err) => {
                console.log(err,"jdnvdnjdnjd")
                return failureJSONResponse(res, { message: `something went wrong` });
            });
    } catch (err) {
        console.log(err,"jdnvdnjdnjd")
        return failureJSONResponse(res, { message: `something went wrong` });
    }
};


//////////------------------//////////


exports.create_adons=async(req, res)=>{
    try{
    const {
        name,
        plan_id,
        isfree,
        duration,
        amount,
        currency,
        price
    } = req.body;
    
    const addOnsPlan = {
        name: name,
        plan_id: plan_id,
        price:price
    };
    
    let addons_result = await addons_plan.create(addOnsPlan)
    if(addons_result){
        let pushdata = await AdsPlan.findByIdAndUpdate({"_id":plan_id},{$push:{"add_ons":addons_result._id}})
        if(pushdata){
            return successJSONResponse(res, {
                      message: `success`,
                      addons: addons_result,
                   });
        }
    }
  
} catch (err) {
    console.log(err,"jdnvdnjdnjd")
    return failureJSONResponse(res, { message: `something went wrong` });
}
}

//////////------------------//////////


exports.gettypeconfigurations = async (req, res, next) => {
    try {

        // let plans = await AdsPlan.findOne({"_id":req.body.plan_id})
        // if(plans){
            // let addons = await AdsPlan.find({"plan_id":req.body.plan_id}).populate("add_ons")
            // if(addons){
            //     return successJSONResponse(res, {addonsplan:addons});
            // }else{
            //     return failureJSONResponse(res, { message: `something went wrong1` });
            // }
        // }
        // else{
        //     return failureJSONResponse(res, { message: `something went wrong` });
        // }
        // AdsPlan.find()
        //     .then((result) => {
        //         if (!result) {
        //             return failureJSONResponse(res, { message: `something went wrong` });
        //         }
        //         return successJSONResponse(res, { data: result });
        //     })
        //     .catch((err) => {
        //         return failureJSONResponse(res, { message: `something went wrong` });
        //     });
    } catch (err) {
        console.log(err)
        return failureJSONResponse(res, { message: `something went wrong` });
    }
};


//////////------------------//////////
