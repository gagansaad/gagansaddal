const mongoose = require("mongoose");
// const validator = require('validator');
const chatSchema = new mongoose.Schema({
  ads_id: { type: mongoose.Schema.Types.ObjectId, ref: `PostType` },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: `user` },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: `user` },
  ads_type: { type: mongoose.Schema.Types.ObjectId, ref: `PostType` },
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: `user` },
      content: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
