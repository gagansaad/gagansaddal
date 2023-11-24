const mongoose = require("mongoose");
// const validator = require('validator');
const chatSchema = new mongoose.Schema({
  ads_id: { type: mongoose.Schema.Types.ObjectId, ref: `PostType`,required:true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: `user`,required:true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: `user` ,required:true},
  ads_type: { type: mongoose.Schema.Types.ObjectId, ref: `PostType`,required:true },
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: `user` ,required:true},
      content: {type:String,required:true},
      content_type: {
        type: String,
        enum: [`text`, `file`],
        default: "text",
      },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
