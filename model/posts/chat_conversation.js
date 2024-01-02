const mongoose = require("mongoose");
// const autopopulate = require('mongoose-autopopulate');
// const validator = require('validator');
const chatSchema = new mongoose.Schema({
  
  ads_id: { type: mongoose.Schema.Types.ObjectId, refPath:'ads_type',required:true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: `user`,required:true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: `user` ,required:true},
  // is_like:[{
  //   msg_id:{type: mongoose.Schema.Types.ObjectId, ref: `chat`},
  //   status:{type:String,enum:['true', 'false']},
  //   likeby:{ type: mongoose.Schema.Types.ObjectId, ref: `user` }
  // }],

  // replied_content:[{msg_id:{type: mongoose.Schema.Types.ObjectId, ref: `chat`},
  // replied_msg:{type:String},
  // repliedby:{type: mongoose.Schema.Types.ObjectId, ref: `user`}}],


  ads_type: { type: String, // Field to store the model name
  enum: ['job', 'rental','event','Buy & Sell',"babysitter & nannie","Local_biz & Service"], },
  type_name:{ type: String,},// Add your model names here },
  messages: [
    {
      senderId: { type: mongoose.Schema.Types.ObjectId, ref: `user` ,required:true},
      content: {type:String},
      content_type: {
        type: String,
        enum: [`text`, `file`],
        default: "text",
      },
      status:{
        type: String,
        enum: [`seen`, `unseen`,"deleted"],
        default: "unseen",},
      timestamp: { type: Date, default: Date.now },
    },
  ],
},{ timestamps: true });
// chatSchema.plugin(autopopulate);
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
