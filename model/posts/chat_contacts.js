const mongoose = require('mongoose');
// const validator = require('validator');
const chatSchema = new mongoose.Schema({
    adId:{type:String},
    buyer: {
      userId: {type:String},
    },
    seller: {
      userId: {type:String},
    },
    ads_type:{type:String},
    messages: [
      {
        senderId: {type:String},
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  });
  
  const Chat = mongoose.model('Chat', chatSchema);
  
  module.exports = Chat;