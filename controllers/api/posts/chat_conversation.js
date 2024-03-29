const { json } = require("express");

const crypto = require("crypto");
const {io} = require('../../../app'); 
const mongoose = require("mongoose"),
  Chat = mongoose.model("Chat"),
  User = mongoose.model("user"),
  postType = mongoose.model("user"),
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
      const { ads_id ,sellerId,buyerId,senderId,ads_type} = req.query;
      console.log(ads_id ,sellerId,buyerId,senderId,ads_type);
      let userId = req.userId;
      let totalItems
      let chat = await Chat.findOne({
        $and: [
          { ads_id: ads_id },
          // {
          //   $or: [
              { 'buyer': buyerId },
              { 'seller': sellerId },
          //   ],
          // },
        ],
      })
      .populate({
        path: 'ads_id',
        select: 'adsInfo.title status adsInfo.image',
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
  // console.log(chat);
  let customResponse
      if (!chat) {
        let sender;
        let buyer;
        let seller;
        let ad;
        let adtype;
        if(sellerId){
          seller = await User.findById(sellerId)
        }
        if(buyerId){
          buyer = await User.findById(buyerId)
        }
       if(senderId){
        sender = await User.findById(senderId)
       }
       if(ads_id){
        let Model = mongoose.model(ads_type)
        ad = await Model.findById(ads_id).populate("adsInfo.image")
       }
       console.log(sender,buyer,seller,ad);
       customResponse = {
        _id: "252525",
        ads_id: ad._id || null,
        ads_name: ad.adsInfo.title || null,
        ads_image: ad.adsInfo.image || null,
        buyer_id: buyer._id || null,
        buyer_name: buyer.userInfo.name || null,
        buyer_image: buyer.userBasicInfo.profile_image || null,
        seller_id: seller._id || null,
        seller_name: seller.userInfo.name || null,
        seller_image: seller.userBasicInfo.profile_image || null,
        ads_type: ads_type || null,
        messages: null,
        
      };
        return successJSONResponse(res, {
          message: 'success',
          data: customResponse,
          chat
        });
      }
      else{
        const newStatus = 'seen';
        for (const message of chat.messages) {
          console.log(message.senderId._id !== userId,message.senderId._id, userId);
          if (message.senderId._id.toString() !== userId.toString()) {
              message.status = newStatus;
          }
      }
  
      // // Save only if there are messages to update
      if (chat.messages.length > 0) {
          await chat.save();
      }
        
    
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
    
        let paginatedMessages = [];
        totalItems = chat.messages.length;
    
        if (chat.messages && totalItems > 0) {
          chat.messages.reverse();
          paginatedMessages = chat.messages.slice(startIndex, endIndex);
        }
      
  
       customResponse = {
          _id: chat._id,
          status:chat?.ads_id?.status,
          ads_id: chat?.ads_id?._id || null,
          ads_name: chat?.ads_id?.adsInfo?.title || null,
          ads_image: chat?.ads_id?.adsInfo?.image || null,
          buyer_id: chat.buyer._id || null,
          buyer_name: chat.buyer.userInfo.name || null,
          buyer_image: chat.buyer.userBasicInfo.profile_image || null,
          seller_id: chat.seller._id || null,
          seller_name: chat.seller.userInfo.name || null,
          seller_image: chat.seller.userBasicInfo.profile_image || null,
          ads_type: chat.ads_type || null,
          messages: paginatedMessages || null,
          
        };
      }
      
  
      return successJSONResponse(res, {
        message: 'success',
        totalItems: totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        data: customResponse,
        chat
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
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.perpage) || PAGE_SIZE;
  
      let chat = await Chat.find({
        $or: [
          { 'buyer': userId },
          { 'seller': userId },
        ],
      }).populate({
        path: 'ads_id',
        select: 'adsInfo.title status',
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
      }).sort({ updatedAt: -1 });
  
      const userlist = await Promise.all(chat.map(async (chat) => {
        let count = chat.messages.filter((message) => {
          return (
            message.senderId._id.toString() !== userId.toString() &&
            message.status === "unseen"
          );
        });
  
  
        return {
          _id: chat?._id || null,
          status :chat?.ads_id?.status,
          messageCount: count.length || 0,
          buyer_name: chat?.buyer?.userInfo?.name || null,
          buyer_image: chat?.buyer?.userBasicInfo?.profile_image == "null" ? null : chat?.buyer?.userBasicInfo?.profile_image || null,
          buyerId: chat?.buyer?._id || null,
          seller_name: chat?.seller?.userInfo?.name || null,
          seller_image: chat?.seller?.userBasicInfo?.profile_image || null,
          sellerId: chat?.seller?._id || null,
          ads_name: chat?.ads_id?.adsInfo?.title || null,
          ads_image: chat?.ads_id?.adsInfo?.image || null,
          ads_id:  chat?.ads_id?._id || null,
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
      }));
  
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
  
    } catch (err) {
      console.log(err);
      return failureJSONResponse(res, { message: 'something went wrong' });
    }
  };
  




exports.uploadfile = async (req, res, next) => {
  try {
    let file = req.file
   

    return successJSONResponse(res, {
      message: 'success',
      url: file.path,
      
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: 'something went wrong' });
  }
};

