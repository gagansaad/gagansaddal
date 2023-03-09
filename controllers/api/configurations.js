
const mongoose = require("mongoose"),
    Privacy = mongoose.model("privacy"),
    TermAndCondition = mongoose.model("termandcondition"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../handlers/jsonResponseHandlers`);


exports.privacyPolicy = async(req, res, next) => {
    try{
        Privacy.find({})
        .then((privacy)=>{
            if (!(privacy && privacy.length)) return failureJSONResponse(res,{message: `something went wrong`});
            else {
                return successJSONResponse(res, { privacy: privacy[0]?.htmlText });
            }
        }).catch((err)=>{
            console.log(err)
            return failureJSONResponse(res, { message: `something went wrong` })
        })

    }catch(err){
        return failureJSONResponse(res, { message: `something went wrong` })
    }
  
}


exports.termAndConditions = async (req, res, next) => {
    try {
        TermAndCondition.find({})
            .then((termAndCondition) => {
                if (!(termAndCondition && termAndCondition.length)) return failureJSONResponse(res, { message: `something went wrong` });
                else {
                    return successJSONResponse(res, { termAndCondition: termAndCondition[0]?.htmlText });
                }
            }).catch((err) => {
                console.log(err)
                return failureJSONResponse(res, { message: `something went wrong` })
            })

    } catch (err) {
        console.log(err)
        return failureJSONResponse(res, { message: `something went wrong` })
    }

}