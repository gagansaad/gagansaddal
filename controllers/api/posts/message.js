const { json } = require("express");

const crypto = require('crypto');
const mongoose = require("mongoose"),
  Message = mongoose.model("message"),
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
  
  exports.sendMessage =  async(req,res,next)=>{
    try {
        const senderId = req.userId;

        const{
            senderName,
            recieverId,
            message,
        } = req.body;

        //console.log(req.body,"cur id: ", senderId);
        const newMessage = Message({
            senderId,
            senderName,
            recieverId,
            message:{
                text:message,
                image:''
            }
        });
     
        const saveMessage = await newMessage.save();

        return successJSONResponse(res, {
            message: `success`,
            data:saveMessage,
        })
    } catch (err) {
        console.log(err);
        return failureJSONResponse(res, { message: `something went wrong` });
    }
}

// exports.allFriends = async(req,res,next)=>{

//     try {
//         const current_id = req.user.id;

//         const allUsers = await User.find({}).limit(10)
//                         .select('-password -__v -timestamp');
//         const friends =  allUsers.filter(usr=>usr._id!=current_id);                

//         return successReponse(res,200,"successfull!",friends);
//     } catch (err) {
//         return ThrowError(res,500,err.message);
//     }
// }
// exports.getLastMessage = async (req,res,next)=>{
//     try{
//         const cur_id=req.user.id;
//         const frndId=req.params.id;

//         const allMessage = await Message.find({
//             $and:[
//               { $or:[{senderId:cur_id},{senderId:frndId}]},
//               { $or:[{recieverId:cur_id},{recieverId:frndId}]}
//             ]
//         }).limit(1).select('-__v').sort({createdAt:-1});

//     }catch(err){

//     }
// }

// exports.getMessage = async(req,res,next)=>{
//     try {
//        // console.log("paarms: ",req.params.id)

//         const cur_id=req.user.id;
//         const frndId=req.params.id;
// //{ $or: [ { quantity: { $lt: 20 } }, { price: 10 } ] }
//         const allMessage = await Message.find({
//             $and:[
//               { $or:[{senderId:cur_id},{senderId:frndId}]},
//               { $or:[{recieverId:cur_id},{recieverId:frndId}]}
//             ]
//         }).limit(30).select('-__v -_id');

//         return successReponse(res,200,"msg got successfully",allMessage);
//     } catch (err) {
//         return ThrowError(res,500,err.message);
//     }
// }

// exports.sendImage =  async(req,res,next)=>{
//     try {
//         const formData = formidable();

//         const formFields = await new Promise((fill,reject)=>{
//             formData.parse(req,async(err,fields,files)=>{
//                 if(err){
//                     reject("something went wrong");
//                     return;
//                 }
//                 fill({
//                     fields,
//                     files
//                 });
//             });
//         });
//         const {image} =formFields.files;
//         const{
//             senderName,
//             senderId,
//             recieverId,
//         } = formFields.fields;
        
//         if(!senderName||!senderId||!recieverId||!image){
//             return ThrowError(res,400,"fill all fields");
//         }      
//        //filter image
//         if(!image.mimetype.startsWith('image')){
//             return ThrowError(res,400,"invalid image");
//         } 
//         if(image.size>1024*1024*5){
//             return ThrowError(res,400,"image size greater than 5 migabyte");
//         }
//         //generate random number
//         const random = Math.floor(Math.random()*10e9);
//         //new unique name
//         image.newFilename =  random+'-'+image.originalFilename;
//         //new path
//         const newPath  = __dirname+'/../client/build/uploads/sentImages/'+image.newFilename;
       
//         const fileCopying = await new Promise((fill,reject)=>{
//             fs.copyFile(image.filepath,newPath,(err)=>{
//                 if(err){
//                     reject("image uploading error");
//                 }
//                 else
//                   fill("copied successfully");
//             })
//            });

//         const newImgaeMessage = Message({
//             senderId : senderId,
//             senderName : senderName,
//             recieverId : recieverId,
//             message:{
//                 text:'',
//                 image:image.newFilename
//             }
//         });
//         const save = await newImgaeMessage.save(); 

//      return successReponse(res,200,"image uploaded suceessfully ",save);   
//     } catch (err) {
//         return ThrowError(res,500,err.message);
//     }
// }