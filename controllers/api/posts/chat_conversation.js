const { json } = require("express");

const crypto = require("crypto");
const {io} = require('../../../app'); 
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

    let chat = await Chat.find({
      $or: [
        { 'buyer': userId },
        { 'seller': userId },
      ],
    }).populate({
      path: 'ads_id',
      select: 'adsInfo.title',
      populate: {
        path: 'adsInfo.image',
        select: 'url', // Assuming 'imageUrl' is the field you want to select
      },
    }).populate({
      path: 'seller',
      select: 'userInfo.name',
    }).populate({
      path: 'buyer',
      select: 'userInfo.name',
    }).populate({
      path: 'messages.senderId',
      select: 'userInfo.name',
    });
    let newChatObject
    let userlist=[]
    chat.map((chat)=>{
      newChatObject = {
       _id: chat?._id || null,
       buyer_name: chat?.buyer?.userInfo?.name || null,
       buyerId: chat?.buyer?._id || null,
       seller_name: chat?.seller?.userInfo?.name || null,
       sellerId: chat?.seller?._id || null,
       ads_name: chat?.ads_id?.adsInfo?.title || null,
       ads_id: chat?.ads_id?._id || null,
       ads_type: chat?.ads_type || null,
       messages: chat?.messages?.slice(-1).map(message => ({
         sender_name: message?.senderId?.userInfo?.name || null,
         senderId: message?.senderId?._id || null,
         content: message?.content || null,
         content_type: message?.content_type || null,
         _id: message?._id || null,
         timestamp: message?.timestamp || null,
       })),
       
     };
     userlist.push(newChatObject)
   })
       


    if (chat) {
      return successJSONResponse(res, {
        message: 'success',
        data: userlist,
      });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: 'something went wrong' });
  }
};


