const mongoose = require('mongoose');
// const validator = require('validator');
const chatSchema = new mongoose.Schema({
    adId: mongoose.Schema.Types.ObjectId,
    buyer: {
      userId: mongoose.Schema.Types.ObjectId,
    },
    seller: {
      userId: mongoose.Schema.Types.ObjectId,
    },
    ads_type:{type:String},
    messages: [
      {
        senderId: mongoose.Schema.Types.ObjectId,
        content: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
  });
  
  const Chat = mongoose.model('Chat', chatSchema);
  
  module.exports = Chat;