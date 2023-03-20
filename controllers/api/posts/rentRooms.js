
const mongoose = require("mongoose"),
    PostType = mongoose.model("PostType"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`);


exports.fetchDynamicsData = async (req, res, next) => {

   const objtSend={
        roomType:[
            `Single`,
           `Double`,
           `Triple`,
           `Quad`
        ],
        whoAreU:[
            `owner`,
            `broker`
        ],
       Accommodates: [
        1,2,3,4,5,6,7,8,9
       ],
       furnished :[
           `Semi-furnished`,
           `furnished`,
           `fully-furnished` 
       ]
   }

   return successJSONResponse(res,{
       message: `success`,
       data: objtSend
   })

}




