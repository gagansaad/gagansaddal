require(`dotenv`).config({ path: `process.env` });

const express = require(`express`),
  cors = require("cors"),
  app = express(),
  helmet = require(`helmet`),
  morgan = require(`morgan`),
  mongoose = require(`mongoose`),
  centralErrorHandlers = require(`./utils/centralErrorHandlers`),
  expressSession = require(`express-session`),
  MongoStore = require(`connect-mongo`);
const { EmailOTPVerification } = require("./resources/sendEmailFunction");
// DB Setup
// const {
//   UserEmailMatch,
//   contactEmail,
//   contactListByUserId,
//   contactList,
//   searchContactData,
//   lastMsg,
//   contactDelete,
//   allMessageDelete,
//   allSenderMessageDelete,
//   messageSearchData,
//   receiverData,
//   sendUnreadMsg,
//   receiverMessage,
//   messageUpdate,
//   EditlastMsg,
//   userJoin,
//   userMessage,
//   updateUnreadMsg,
//   groupById,
//   groupContactsList,
//   groupData,
//   messageDelete,
//   searchGroupData,
//   groupSearchData,
//   unreadGroupUser,
//   updateUnreadGroupUser,
//   groupsMessage,
//   groupMessageUpdate,
//   contactListByUser,
//   updateUnreadGroupMessage,
//   updateAllUnreadGroupMessage,
//   groupFileDelete,
//   groupDelete,
//   groupMemberDelete,
//   groupMsgDelete,
//   groupDeleteMember,
//   deleteGroupUser,
//   allGroupMessageDelete,
//   singleGroupMessageDelete,
//   groupSenderMessage,
//   currentUser,
//   userNameUpdate,
//   receiverNameUpdate,
//   groupNameUpdate,
//   notificationUpdate,
//   notificationMutedUpdate,
//   profileUpdate,
//   userLeave
// } = require('./utils/users');
const { DateTime } = require('luxon');
// const moment = require('moment-timezone');
const connection = require(`./config/dbConnection`);
connection(mongoose);
//chat
require("./model/posts/message");
require("./model/posts/chat_conversation");

require(`./model/accounts/users`);
require(`./model/accounts/admin`);
require(`./model/otp`);
require("./model/posts/banner");
// post
require(`./model/posts/Types`);
require(`./model/posts/roomRents`);
//Event
require(`./model/posts/event`);

// configuration
require(`./model/configurations/privacy`);
require(`./model/configurations/termAndCondition`);
require(`./model/configurations/aboutUs`);
require(`./model/plan/plan`);
require(`./model/plan/plan copy`);
require(`./model/plan/plan_adons`);
require(`./model/posts/jobs`);
require(`./model/posts/buy&sell`);
require(`./model/posts/bizAndServices`);
require(`./model/posts/babbysitter & nannis`);
require(`./model/image/image`);
require(`./model/posts/paymentEvent`);
require(`./model/posts/payment`);
require("./model/posts/tagline");
require("./model/posts/skills");
require("./model/posts/report");
require("./model/posts/notificationAlert");
require(`./model/posts/adsCategories`);
require("./model/posts/adsSubCategories");
require("./model/posts/notification");
require("./model/posts/favoriteAds");
require("./model/posts/viewsCount");
require("./controllers/api/posts/cronjob")

// admin configuration
require(`./model/accounts/admin/configuration`);

app.use(cors());

// const http = require("http").createServer(app);
app.set(`view engine`, `ejs`);
// DB Setup

const signUp = require("./routes/api/accounts/user");

const adminSignIp = require("./routes/accounts/admin/admin_login");
const adminconfigurationsRoute = require("./routes/api/accounts/admin/configurations");
const adminconfigurationsRoute2 = require("./routes/api/accounts/admin/configurations copy");
const dashboardRoute = require("./routes/admin/dashboard");
const usercontrol = require("./routes/accounts/admin/users_control");
const configurationsRoute = require("./routes/api/configurations");
const adminconfigurationsRoute1 = require("./routes/admin/configurations");
const postTypeRoutes = require("./routes/api/ads/types");
const postTypeAdminRoutes = require("./routes/admin/types");
const roomRentsRoutes = require("./routes/api/ads/roomRents");
const bizRoutes = require("./routes/api/ads/bizAndServices");
const jobsRoutes = require("./routes/api/ads/jobs");
const messageRoutes = require("./routes/api/ads/chat_conversation");

const buySellRoutes = require("./routes/api/ads/buysell");
const babysitterRoutes = require("./routes/api/ads/babbysitter & nannis");
const eventRoutes = require(`./routes/api/ads/event`);
const paymentRoutes = require(`./routes/api/ads/payment`);
const planRoutes = require(`./routes/api/ads/plans copy`);
const planRt = require(`./routes/api/ads/plans`);
const AllAdsRoutes = require(`./routes/api/ads/fetchAllAds`);
const All_Tags = require(`./routes/api/ads/tagline`);
const favorite = require(`./routes/api/ads/favoriteAd`);
const Report = require(`./routes/api/ads/report`);
const NotificationAlert = require(`./routes/api/ads/notificationAlert`);

//admin
const adsCategoriesRoutes = require("./routes/admin/categories");
const adsSubCategoriesRoutes = require("./routes/admin/sub_categories");
const adminroomRentsRoutes = require("./routes/admin/roomRents");
const adminbizRoutes = require("./routes/admin/bizAndServices");
const adminbannerRoutes = require("./routes/admin/banner");
const adminjobsRoutes = require("./routes/admin/jobs");
const adminbuySellRoutes = require("./routes/admin/buysell");
const adminbabysitterRoutes = require("./routes/admin/babbysitter & nannis");
const admineventRoutes = require(`./routes/admin/event`);
//
const loadHelmet = require(`./loaders/helmets`),
  loadExpressSession = require(`./loaders/expressSession`);

loadHelmet(app, helmet);
loadExpressSession(app, expressSession, MongoStore);

// body parser
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({ message: `msbdhsmb` });
});

app.use("/v1/api/", signUp);
app.use("/admin", adminSignIp);
app.use("/api/admin/users", usercontrol);

app.use("/v1/api/configurations", configurationsRoute);
app.use("/admin/v1/api/configurations1", adminconfigurationsRoute);
app.use("/admin/v1/api/configurations", adminconfigurationsRoute1);
app.use("/admin/v1/api/configurations", adminconfigurationsRoute2);
app.use("/admin/v1/api/ads/dashboard", dashboardRoute);
app.use("/admin/v1/api/ads/room-rents", adminroomRentsRoutes);
app.use("/admin/v1/api/ads/biz", adminbizRoutes);
app.use("/admin/v1/api/ads/banner", adminbannerRoutes);
app.use("/admin/v1/api/ads/jobs", adminjobsRoutes);
app.use("/admin/v1/api/ads/buysell", adminbuySellRoutes);
app.use("/admin/v1/api/ads/babysitter", adminbabysitterRoutes);
app.use("/admin/v1/api/ads/events", admineventRoutes);
app.use("/admin/v1/api/ads/categories", adsCategoriesRoutes);
app.use("/admin/v1/api/ads/sub-categories", adsSubCategoriesRoutes);

app.use("/v1/api/posts/", All_Tags);
app.use("/v1/api/chat/", messageRoutes);
app.use("/v1/api/posts/types", postTypeRoutes);
app.use("/admin/v1/api/posts/types", postTypeAdminRoutes);
app.use("/v1/api/posts/room-rents", roomRentsRoutes);
app.use("/v1/api/posts/events", eventRoutes);
app.use("/v1/api/posts/jobs", jobsRoutes);
app.use("/v1/api/posts/buysell", buySellRoutes);
app.use("/v1/api/posts/babysitter", babysitterRoutes);
app.use("/v1/api/posts/biz", bizRoutes);
app.use("/v1/api/posts/payment", paymentRoutes);
app.use("/v1/api/posts/ads", AllAdsRoutes);
app.use("/v1/api/posts/ads", planRoutes);
app.use("/v1/api/posts/ads", planRt);
app.use("/v1/api/posts/ads", favorite);
app.use("/v1/api/posts/ads", Report);
app.use("/v1/api/posts/ads", NotificationAlert);

// logging http activity
if (process.env.MODE.toLowerCase() === `dev`) {
  app.use(morgan("tiny"));
}
app.post("/demo", (req, res) => {
  EmailOTPVerification();
  res.json({
    data: `working`,
  });
});

// Routes
const routes = require(`./routes/_all`);
app.use(routes);

// add the error handler middleware function to the app
app.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    // handle the error in a custom way
    res.status(400).send({
      status: 400,
      error: "Invalid JSON",
    });
  }
});

// Error handling
// handle 404 errors
app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "Sorry,end point not found.",
  });
});

// Error handling
// for (let key in centralErrorHandlers) {
//     app.use(centralErrorHandlers[key]);
// }

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ error: "seriously something went wrong " });
});
let Notification = require("./resources/notification");

//////////////////////////////////////////////////////////
let Chat = mongoose.model("Chat")
const httpServer = require("http").createServer(app);
try {
    const io = require("socket.io")(3001, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        }
    });
    io.on("connect_error", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    io.on("connect_timeout", (err) => {
        console.log(`connect_error due to ${err.message}`);
    });
    console.log('status of chat');
    io.on("*", function (event, data) {
        console.log(event,'=======event>');
        console.log(data,'=======data>');
    });
    const onlineUsers = {};
    io.on("connection", async (socket) => {
        // console.log("socket.handshake.query", socket);
        console.log("socket Connected ", socket.id)

        setTimeout(function(){
            socket.send('Sent a message 4seconds after connection!');
         }, 4000);

         console.log("socket Connected ", socket.id);

  // Get user ID from query parameters (you may need to modify this based on your authentication)
  const userId = socket.handshake.query.userId;
  console.log(userId,"/////////////");
//   let chat = await Chat.find({
//     $or: [
//       { 'buyer': userId },
//       { 'seller': userId },
//     ],
//   })
// console.log(chat,"evfndejndjvnnvjdnjdenvjden");
//   // Set user as online
  onlineUsers[userId] = true;
  
  // Emit online status to other users
  const filteredOnlineUsers = Object.entries(onlineUsers)
  .filter(([userId, status]) => status === true)
  .reduce((result, [userId]) => {
    result[userId] = true;
    return result;
  }, {});
  let onlineUserIds = Object.keys(filteredOnlineUsers);
console.log(onlineUserIds);
  io.emit("user-status", { userId:onlineUserIds});
         socket.on('join-room', (chat_id) => {
          console.log(chat_id,"tu meri jaan ");
          socket.join(chat_id);
        });
        //  console.log(`Socket ${socket.id} joined room: chat-${adId}`);
        socket.on('like-by', async (data) => {
          try {
              const {msg_id,chatId,status,userId } = data;
      
              let chatting = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $pull: { is_like: { msg_id: msg_id, likeby: userId } },
                    $push: {
                        is_like: {
                            msg_id: chatId,
                            status,
                            likeby: userId,
                        },
                    },
                },
                { upsert: true }
            );
      
              if (chatting) {
                  // Emit the updated chat details or specific information related to the like_by event
                  io.emit('update-like', { msg_id,chatId, status, userId });
              }
          } catch (error) {
              console.error(error);
          }
      });
      socket.on('delete-chat', async (data) => {
        try {
            const { chatId } = data;
    console.log(chatId,"hhhhhhjjjjj");
            let chatting = await Chat.findByIdAndDelete(chatId);
    
            if (chatting) {
                // Emit the updated chat details or specific information related to the delete_msg event
                io.emit('deleted-chat', { chatId});
            }
        } catch (error) {
            console.error(error);
        }
    });
      socket.on('delete-msg', async (data) => {
        try {
            const { chatId, messageId } = data;
    
            let chatting = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $pull: { messages: { _id: { $in: messageId }  } },
                },
                { upsert: true }
            );
    
            if (chatting) {
                // Emit the updated chat details or specific information related to the delete_msg event
                io.emit('update-delete-msg', { chatId, messageId });
            }
        } catch (error) {
            console.error(error);
        }
    });
         socket.on('send-message', async (data) => {
          try {
            // console.log(data,"hoja 22 bnke yr");
            const { ads_id,sellerId,buyerId,senderId,ads_type,content,content_type } = data;
            
            // Check if a chat already exists for the given adId
            console.log(ads_id,sellerId,buyerId,senderId,ads_type,content);
            let chat = await Chat.findOne({
              $and: [
                { ads_id: ads_id },
                // {
                //   $: [
                    { 'buyer': buyerId },
                    { 'seller': sellerId },
                //   ],
                // },
              ],
            });
    
            if (!chat) {
              // If no chat exists, initiate a new chat
              chat = new Chat({
                ads_id,
                buyer:  buyerId ,
                seller: sellerId ,
                ads_type,
              });
    
              let data = await chat.save();
             let chatid = data?._id;
             console.log("ho");
             io.emit('join-room', chatid);
             socket.join(chatid);
              // Notify the seller about the new chat
              console.log("baba ve kla mrod ni nikkiye lgade jor baba maar na daaba awe hoju khon kharaba dhakka laundi da sah ah ah ah chdgya ve");
            }

            
// return;

            const newMessage = {
              senderId,
              content,
              content_type:content_type || "text",
           

            };
    console.log(newMessage,"cdlck");
          let createmsg = await Chat.findOneAndUpdate(
              {
                $and: [
                  { ads_id: ads_id },
                  // {
                  //   $or: [
                      { 'buyer': buyerId },
                      { 'seller': sellerId },
                  //   ],
                  // },
                ],
              },
              { $push: { messages: newMessage } },
              { new: true, upsert: true }
            );
            console.log(chat._id,"gagan");
            let chatting = await Chat.findById({"_id":chat._id}).populate({
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
    // console.log("kjv dsnkivniujv dsziunb jkdjm bdfi1",createmsg?.length - 1)
    let chatid = chatting?._id
   // Assuming this code is part of a function or a block
// where 'chatting' is defined

let count = 0;

chatting.messages.map((message) => {
  console.log(message.senderId._id.toString() === senderId.toString() && message.status === "unseen",message.senderId._id.toString() ,senderId.toString());
  if (message.senderId._id.toString() === senderId.toString() && message.status === "unseen") {
      count++
console.log("Count of unseen messages:", count);
      
  }

});



// console.log("Unseen messages:", unseenMessages);

    console.log(count,"nvjernvkjsrnvkswnvksndkjvnsdkjvn jvnfjv djnvjd vidv  dj vdn vikdv dn vdkindnv kjnnd kdfmk kjf");
   let newChatObject = {
      _id: chatting?._id || null,
      messageCount: count || 0,
      buyer_name: chatting?.buyer?.userInfo?.name || null,
      buyer_image: chatting?.buyer?.userBasicInfo?.profile_image || null,

      buyerId: chatting?.buyer?._id || null,
      seller_name: chatting?.seller?.userInfo?.name || null,
      seller_image: chatting?.seller?.userBasicInfo?.profile_image || null,
      sellerId: chatting?.seller?._id || null,
      ads_name: chatting?.ads_id?.adsInfo?.title || null,
      ads_image: chatting?.ads_id?.adsInfo?.image || null,
      ads_id: chatting?.ads_id?._id || null,
      ads_type: chatting?.ads_type || null,
      messages: chatting?.messages?.slice(-1).map(message => ({
        sender_name: message?.senderId?.userInfo?.name || null,
        senderId: message?.senderId?._id || null,
        content: message?.content || null,
        status: message?.status || null,
        content_type: message?.content_type || null,
        _id: message?._id || null,
        timestamp: message?.timestamp || null,
      })),
      
    };
    let newChatObject1 = {
      _id: chatting?._id || null,
      // messageCount: chatting.messages ? chatting.messages.filter(message => message.senderId !== senderId).length : 0,
      buyer_name: chatting?.buyer?.userInfo?.name || null,
      buyer_image: chatting?.buyer?.userBasicInfo?.profile_image || null,

      buyer_id: chatting?.buyer?._id || null,
      seller_name: chatting?.seller?.userInfo?.name || null,
      seller_image: chatting?.seller?.userBasicInfo?.profile_image || null,
      seller_id: chatting?.seller?._id || null,
      ads_name: chatting?.ads_id?.adsInfo?.title || null,
      ads_image: chatting?.ads_id?.adsInfo?.image || null,
      ads_id: chatting?.ads_id?._id || null,
      ads_type: chatting?.ads_type || null,
      messages: chatting?.messages?.slice(-1).map(message => ({
        senderId: message?.senderId|| null,
        content: message?.content || null,
        status: message?.status || null,
        content_type: message?.content_type || null,
        _id: message?._id || null,
        timestamp: message?.timestamp || null,
      })),
      
    };
    const lastMessageSender = newChatObject1.messages[0]?.senderId?._id || null;
console.log(lastMessageSender,newChatObject1.seller_id);
    // Determine the otherUserId based on the sender of the last message
    const otherUserId = lastMessageSender.toString() === newChatObject1.buyer_id.toString()
      ? newChatObject1.seller_id.toString()
      : lastMessageSender.toString() === newChatObject1.seller_id.toString()
      ? newChatObject1.buyer_id.toString()
      : null;
    
    console.log(otherUserId,"mila tu milaackdnvkjenvjkefvkfnvkndsfkvnsdfkvnksdfnvksdnvksd");
    io.emit('new-chat', newChatObject);
    io.emit('receive-message', newChatObject1);
            // console.log(`Emitted 'receive-message' to room chat-$`,);
            await Notification.sendNotifications(
              [otherUserId],
              newChatObject1.ads_name,
              newChatObject1.messages[0].content,
              { model_id:newChatObject1._id, model: "chat_details" },
              
            );
          } catch (error) {
            console.error(error);
          }


        });
     // Modify the 'is-read-message' event handler
     socket.on("is-read-message", async (data) => {
      try {
        console.log(data, "fesgdnftyhjsthfgdfgdfgdfgdfg");
        const { chatId, userId, isread } = data;
    
        if (isread === "true") {

          let chatting = await Chat.findById(chatId);
    
          if (chatting) {
            const newStatus = 'seen';
    
            for (const message of chatting.messages) {
              // Check if the status is not already 'seen'
              if (message.senderId.toString() !== userId.toString() && message.status !== newStatus) {
                message.status = newStatus;
                console.log("jaadu");
    
                // Save only if there are messages to update
                await chatting.save();
                console.log(chatting.messages, "ejnvjsdfnvjdfsnvj");
              }
            }
          }
    
        }
      } catch (error) {
        console.error(error);
      }
    });
    
        // socket.on('new-chat', (data) => {
        //   console.log(`new chat recieved:`, data);
        //   // Further processing or handling of the received message
        // });
        //socket.on('receive-message', (data) => {
        //   console.log(`Received message from socket ${socket.id}:`, data);
        //   // Further processing or handling of the received message
        // });
        //gagan

       
       
        socket.on("disconnect", () => {
            console.log("socket is disconnect");
            onlineUsers[userId] = false;
            const filteredOnlineUsers = Object.entries(onlineUsers)
            .filter(([userId, status]) => status === true)
            .reduce((result, [userId]) => {
              result[userId] = true;
              return result;
            }, {});
          
          
          let onlineUserIds = Object.keys(filteredOnlineUsers);
          
          console.log(onlineUserIds,"vrdvnrdvrdmvrdvrdvdrkm");
            // Emit offline status to other users
            io.emit("user-status", {userId:onlineUserIds});
        })
    });

    console.log('status of chat end');


} catch (error) {
    console.error("error ==================>", error);
}



 


// console.log(zone,"jnmczjnvjkszdnvkjxcfn kjxfdnv kjndxfk")
/////////////////////////////////////////////////////////
app.listen(process.env.PORT, () =>
  console.log(`[ MENEHARIYA API ] on ${process.env.PORT}`)
);
