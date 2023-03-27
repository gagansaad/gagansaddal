
const mongoose = require("mongoose"),
    AdsPlan = mongoose.model("adsplan"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`);
   
exports.fetchPlanForAds = async (req, res, next) => {

    try {
        
        const {adsId} = req?.params?.adsId;
        AdsPlan.find({
            _id: adsId
        })
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










