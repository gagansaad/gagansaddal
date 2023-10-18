const mongoose = require("mongoose"),
  AdsPlan = mongoose.model("plan"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType,
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

    if(req?.query?.post_id){
      postid = req?.query?.ads_id;
    }else if(req?.body?.ads_id){
      postid = req?.body?.ads_id;
    }
// console.log(planObjectId,"==============--------------o0lkmn ");
let {Typename} = await ModelNameByAdsType(planObjectId)
let YourModel = mongoose.model(Typename);
let previousdata
if(postid){
  previousdata = await YourModel.findById(postid)

}
// console.log(previousdata);
    AdsPlan.find({
      ads_type: planObjectId,
    })
      .populate("add_ons")
      .then((result) => {
    
        
        if (!result) {
          return failureJSONResponse(res, { message: `something went wrong` });
        }
        if (!result) {
          return failureJSONResponse(res, { message: `something went wrong` });
        }
      
          const currentDate = new Date();
          let thisplan = previousdata?.plan_validity;
          console.log(thisplan);
          const thedata = []; // Create an array to store the modified addons
        
          result[0].add_ons.forEach((addon) => {
            const addonValidity = previousdata.addons_validity.find(
              (addonValidity) => addonValidity.name === addon.name
            );
            let status = false
        
            if (addonValidity) {
              const expiredDate = new Date(addonValidity.expired_on);
        
              if (expiredDate > currentDate) {
                status = true;
              } else {
                status = false;
              }
        
              // Add the modified addon to the thedata array
              thedata.push({
                ...addon._doc,
                current_plan:{
                  validity:thisplan
                },
                current_addon: {
                 validity: addonValidity,
                  status: status,
                },
              });
            } else {
              // If no matching add-on found, add a modified addon with expired_on and status set to false
              thedata.push({
                ...addon._doc,
                current_plan:{validity:null},
                current_addon: {
                  validity: null,
                  status: status,
                },
              });
            }
          });
        
          // Now, the 'thedata' array should contain modified add-ons
          console.log(thedata,"emekmkdemckedmckmdekcmek");
          return successJSONResponse(res, { data: thedata });
       
        
      })
      .catch((err) => {
        console.log(err);
        return failureJSONResponse(res, { message: `something went wrong` });
      });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
