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
      const PAGE_SIZE = 20;
      // Assuming req.query.page and req.query.perpage are used to get the page and limit from the request query parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.perpage) || PAGE_SIZE;
      const { ads_id } = req.query;
      let userId = req.userId;
  
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
      })
      .populate({
        path: 'ads_id',
        select: 'adsInfo.title adsInfo.image',
        populate: {
          path: 'adsInfo.image',
          select: 'url',
        },
      })
      .populate({
        path: 'seller',
        select: 'userInfo.name userBasicInfo.profile_image',
        populate: {
          path: 'userBasicInfo.profile_image',
        },
      })
      .populate({
        path: 'buyer',
        select: 'userInfo.name userBasicInfo.profile_image',
        populate: {
          path: 'userBasicInfo.profile_image',
        },
      })
      .populate({
        path: 'messages.senderId',
        select: 'userInfo.name userBasicInfo.profile_image',
      });
  
      if (!chat) {
        return successJSONResponse(res, {
          message: 'success',
          data: null,
        });
      }
  
      
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      let paginatedMessages = [];
      let totalItems = chat.messages.length;
  
      if (chat.messages && totalItems > 0) {
        paginatedMessages = chat.messages.slice(startIndex, endIndex);
      }
      
      const customResponse = {
        _id: chat._id,
        ads_id: chat.ads_id._id || null,
        ads_name: chat.ads_id.adsInfo.title || null,
        ads_image: chat.ads_id.adsInfo.image || null,
        buyer_id: chat.buyer._id || null,
        buyer_name: chat.buyer.userInfo.name || null,
        buyer_image: chat.buyer.userBasicInfo.profile_image || null,
        seller_id: chat.seller._id || null,
        seller_name: chat.seller.userInfo.name || null,
        seller_image: chat.seller.userBasicInfo.profile_image || null,
        ads_type: chat.ads_type || null,
        messages: paginatedMessages || null,
        
      };
  
      return successJSONResponse(res, {
        message: 'success',
        totalItems: totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        data: customResponse,
      });
    } catch (err) {
      console.log(err);
      return failureJSONResponse(res, { message: 'something went wrong' });
    }
  };
  
  
  

exports.ChatList = async (req, res, next) => {
  try {
    let userId = req.userId;
    const PAGE_SIZE = 20;
    // Assuming req.query.page and req.query.limit are used to get the page and limit from the request query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.perpage) || PAGE_SIZE;
    
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
      select: 'userInfo.name userBasicInfo.profile_image',
      populate: {
        path: 'userBasicInfo.profile_image',
      },
    }).populate({
      path: 'buyer',
      select: 'userInfo.name userBasicInfo.profile_image',
      populate: {
        path: 'userBasicInfo.profile_image', // Assuming 'imageUrl' is the field you want to select
      },
    }).populate({
      path: 'messages.senderId',
      select: 'userInfo.name userBasicInfo.profile_image',
      
    });
    let newChatObject
    let userlist=[]
    chat.map((chat)=>{
      console.log(chat.messages);
      newChatObject = {
       _id: chat?._id || null,
       messageCount: chat.messages ? chat.messages.filter(message => message.senderId !== userId).length : 0,
       buyer_name: chat?.buyer?.userInfo?.name || null,
       buyer_image: chat?.buyer?.userBasicInfo?.profile_image || null,

       buyerId: chat?.buyer?._id || null,
       seller_name: chat?.seller?.userInfo?.name || null,
       seller_image: chat?.seller?.userBasicInfo?.profile_image || null,
       sellerId: chat?.seller?._id || null,
       ads_name: chat?.ads_id?.adsInfo?.title || null,
       ads_image: chat?.ads_id?.adsInfo?.image || null,
       ads_id: chat?.ads_id?._id || null,
       ads_type: chat?.ads_type || null,
       messages: chat?.messages?.slice(-1).map(message => ({
         sender_name: message?.senderId?.userInfo?.name || null,
         senderId: message?.senderId?._id || null,
         content: message?.content || null,
         status: message?.status || null,
         content_type: message?.content_type || null,
         _id: message?._id || null,
         timestamp: message?.timestamp || null,
       })),
       
     };
     userlist.push(newChatObject)
   })

const startIndex = (page - 1) * limit;
const endIndex = page * limit;

const paginatedUserlist = userlist.slice(startIndex, endIndex);


if (paginatedUserlist.length > 0) {
  return successJSONResponse(res, {
    message: 'success',
    totalItems: userlist.length,
    currentPage: page,
    totalPages: Math.ceil(userlist.length / limit),
    data: paginatedUserlist,
  });
} else {
  return successJSONResponse(res, {
    message: 'No data found',
  });
}

    // if (chat) {
    //   return successJSONResponse(res, {
    //     message: 'success',
    //     data: userlist,
    //   });
    // }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: 'something went wrong' });
  }
};


