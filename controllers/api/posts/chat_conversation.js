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
//    let userId = JSON.stringify(usId);
// console.log(userId);
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
}  
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.ChatList = async (req, res, next) => {
  try {
    // const {ads_id} = req.query;
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

