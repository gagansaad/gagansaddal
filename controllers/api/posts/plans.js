
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
        // console.log(adsId);

        AdsPlan.find({
            ads_type: adsId
        })
        .then(result => {
            if (!result){
                console.log('fail');
                return failureJSONResponse(res, {message: `something went wrong` })
            }
            console.log('success');
            console.log(result);
            return  successJSONResponse(res, { data: result })
        })
        .catch(err=>{
            console.log('result fail');
            return failureJSONResponse(res, { message: `something went wrong` })
        })

    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
 



}










