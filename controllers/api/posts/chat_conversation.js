const { json } = require("express");

const crypto = require("crypto");
const mongoose = require("mongoose"),
  Chat = mongoose.model("Chat"),
  Media = mongoose.model("media"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidUrl,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
    isValidNumber,
  } = require(`../../../utils/validators`);

exports.ChatDetails = async (req, res, next) => {
  try {
    const {ads_id} = req.query;
   let userId = req.userId;
   console.log(ads_id,userId,"mekmrkmkg vfkj jmmelokmdm sk mdkjf dfm mmm bfs kjcvm mnd vfdm kdxf dxf  k,cb k, sfv,mcbm k, mnd k, nf k,cbvm md ,k mn vdszm, nkj zsdmn kj mx c cvkjm mnf cvkj ");
    let chat = await Chat.findOne({
      $and: [
        { ads_id: ads_id },
        {
          $or: [
            { 'buyer': userId },
            { 'seller': userId },
          ],
        },
      ],
    });
    console.log(chat);
if(chat){
  return successJSONResponse(res, {
    message: `success`,
    data: chat,
  });
}  else{
  return successJSONResponse(res, {
    message: `success`,
    data: null,
  });
}
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.ChatList = async (req, res, next) => {
  try {
   let userId = req.userId;
 
    let chat = await Chat.findOne({
          $or: [
            { 'buyer': userId },
            { 'seller': userId },
          ],
    });
    console.log(chat);
if(chat){
  return successJSONResponse(res, {
    message: `success`,
    data: chat,
  });
}  
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

