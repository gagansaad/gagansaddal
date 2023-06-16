const mongoose = require("mongoose"),
    AdminConfigurations = mongoose.model("adminConfigurations"),
    {
        successJSONResponse,
        failureJSONResponse,
    } = require(`../../../../handlers/jsonResponseHandlers`);
const PostType = mongoose.model("PostType");
const AdsPlan = mongoose.model("plan");
  let  Media = mongoose.model("media");
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

exports.edit_adons=async(req, res)=>{
    try{
    const {
        addons_id,
        example_title,
        example_desc,
        color
    } = req.body;
   let dbQuery = {};
   let Images;
//    console.log(req.file);
  if (req.file) {
      var thumbnail = req.file.path;
    //   console.log(thumbnail);
      Images = await Media.create({ url:thumbnail });
  } 
    if(example_title)dbQuery.example_title=example_title
    if(example_desc)dbQuery.example_description=example_desc
    if(Images)dbQuery.example_image=Images.url
    if(color)dbQuery.color_code=color
    // console.log(Images.url,"dnvhjjdfhjvdfjhb");
    let result = await addons_plan.findByIdAndUpdate({"_id":addons_id},{$set:dbQuery},{new:true})
    if(result){
            return successJSONResponse(res, {
                      message: `success`,
                      addons: result,
                   });
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
            let addons = await AdsPlan.find().populate("add_ons")
            if(addons){
                return successJSONResponse(res, {message:"success",addonsplan:addons});
            }else{
                return failureJSONResponse(res, { message: `something went wrong1` });
            }
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
