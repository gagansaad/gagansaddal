
const mongoose = require("mongoose"),
    AdsPlan = mongoose.model("adsplan"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`);
   
exports.fetchPlanForAds = async (req, res, next) => {

    try {
        
        // const {adsId} = req?.params?.adsId;
        const {adsId} = req.body;
        console.log("iadsid",req.query);

        AdsPlan.find({
            ads_type: adsId
        })
        .then(result => {
            console.log('result ',result);

            if (!result){
                console.log('fail');
                return failureJSONResponse(res, {message: `something went wrong` })
            }
            console.log('success');
            console.log(result);
            return  successJSONResponse(res, { data: result })
        })
        .catch(err=>{
            console.log('result fail',err);
            return failureJSONResponse(res, { message: `something went wrong` })
        })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
 



}










