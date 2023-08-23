// const { json } = require("express");
// const http = require("http").createServer(app);
// const io = require("socket.io")(http);
// const crypto = require('crypto');
// const mongoose = require("mongoose"),
//   message = mongoose.model("message"),
//   Media = mongoose.model("media"),
//   {
//     successJSONResponse,
//     failureJSONResponse,
//     ModelNameByAdsType,
//   } = require(`../../../handlers/jsonResponseHandlers`),
//   { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
//   {
//     isValidString,
//     isValidMongoObjId,
//     isValidUrl,
//     isValidBoolean,
//     isValidDate,
//     isValidEmailAddress,
//     isValidIndianMobileNumber,
//     isValidNumber,
//   } = require(`../../../utils/validators`);
//   io.on("connection", (socket) => {
//     console.log("new user Connected...");
//     socket.on("chat message", function ({ message, sender_id, receiver_id, file_upload }) {
//         const single_message = new Msg({ message, sender_id, receiver_id, file_upload });
//         single_message.save().then(() => {
//           createdAt = single_message.createdAt;
//           id = single_message._id;
//           receiverData(sender_id).then((receiverData) => {
//             const receiverName = receiverData.name;
//             const receiverImage = receiverData.image;
//             let myid;
//             for (const key in users) {
//               if (receiver_id == users[key]) {
//                 myid = sender_id;
//                 io.to(key).emit("chat message", ({ id, message, sender_id, receiver_id, file_upload, createdAt, receiverName, receiverImage, myid }));
//               }
//               if (sender_id == users[key]) {
//                 myid = receiver_id;
//                 io.to(key).emit("chat message", ({ id, message, sender_id, receiver_id, file_upload, createdAt, receiverName, receiverImage, myid }));
//               }
//             }
//           });
    
//           Contact.findOneAndUpdate({ "user_id": sender_id }, { "last_msg_date": createdAt }, { new: true }).then((res) => {
//             return res;
//           });
//           Contact.findOneAndUpdate({ "user_id": receiver_id }, { "last_msg_date": createdAt }, { new: true }).then((res) => {
//             return res;
//           });
    
//           receiverMessage(receiver_id).then((message) => {
//             io.to(socket.id).emit('receiverMessageInfo', { users: message });
//           });
//         });
    
//       });
//   })  