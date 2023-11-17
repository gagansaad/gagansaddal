const mongoose = require("mongoose"),
  AdsPlan = mongoose.model("plan"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType
  } = require(`../../../handlers/jsonResponseHandlers`);

exports.fetchPlanForAds = async (req, res, next) => {
  try {
    let planObjectId = "";
let postid
    if (req?.query?.ads_type) {
      planObjectId = req?.query?.ads_type;
    } else if (req?.body?.ads_type) {
      planObjectId = req?.body?.ads_type;
    }

    if(req?.query?.ads_id){
      postid = req?.query?.ads_id;
    }else if(req?.body?.ads_id){
      postid = req?.body?.ads_id;
    }
    const { ads_type } = req.body;
    let {Typename} = await ModelNameByAdsType(planObjectId)
    let YourModel = mongoose.model(Typename);
    let previousdata
    
    let results = await AdsPlan.find({
      ads_type: planObjectId,
    }).populate("add_ons");
    
    if (!results ) {
      return failureJSONResponse(res, { message: "No matching results found" });
    }
    if (postid){
    
      previousdata = await YourModel.findById(postid)
    
    
    const currentDate = new Date();
    const modifiedResults = [];
    // let thisplan = previousdata?.plan_validity;
   

  
    for (let result of results) {
      const finaldata = JSON.parse(JSON.stringify(result));
      let thisplan = previousdata?.plan_validity;
      let thedata = [];

      for (let addon of finaldata.add_ons) {
        const addonValidity = previousdata?.addons_validity.find(
          (addonValidity) => addonValidity.name === addon.name
        );

        if (addonValidity) {
          const expiredDate = new Date(addonValidity.expired_on);
          const status = expiredDate >= currentDate;
          thedata.push({
            ...addon,
            current_plan: {
              validity: thisplan,
            },
            current_addon: {
              validity: addonValidity,
              status: status,
            },
          });
        } else {
          // If no matching add-on found, add a modified addon with expired_on and status set to false
          thedata.push({
            ...addon,
            current_plan: {
              validity: thisplan,
            },
            current_addon: {
              validity: null,
              status: false,
            },
          });
        }
      }

      // Replace the add_ons field with the modified thedata
      finaldata.add_ons = thedata;
      modifiedResults.push(finaldata);
    }
    // console.log(modifiedResults,"gagan");
    return successJSONResponse(res, { data: modifiedResults });
  }else{
    // console.log(results,"naman");
    return successJSONResponse(res, { data: results });
  }

     
  } catch (err) {
    // console.log(err,"fdknvkfvkfv");

    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
