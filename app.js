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

const connection = require(`./config/dbConnection`);
connection(mongoose);
//chat
require("./model/posts/message");
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
const messageRoutes = require("./routes/api/ads/message");

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

//////////////////////////////////////////////////////////

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
    
    io.on("connection", async (socket) => {
        // console.log("socket.handshake.query", socket);
        console.log("socket Connected ", socket.id)
        setTimeout(function(){
            socket.send('Sent a message 4seconds after connection!');
         }, 4000);
        socket.on("joinroom", async (data) => {
            console.log("room is joined", data)
            if (data.type == "single") {
                let ifNotExixts = await Group.findOne({ senderId: data.senderId, receiverId: data.receiverId, type: "single" });
                console.log("roomid  ===========================>", ifNotExixts);
                if (ifNotExixts != null) {
                    await ChatHistory.update({
                        recieverId: data.senderId,
                        roomId: ifNotExixts.roomId,
                    }, { isRead: true });
                    socket.join(ifNotExixts.roomId)
                } else {
                    let roomId = (Math.random() + 1).toString(36).substring(7) + data.senderId;
                    let group = await Group.create({
                        senderId: data.senderId,
                        receiverId: data.receiverId,
                        roomId: roomId,
                        type: "single",
                    })
                    await Group.create({
                        senderId: data.receiverId,
                        receiverId: data.senderId,
                        roomId: group.roomId,
                        type: "single",
                    })
                    await GroupJoinUser.create({
                        groupId: group._id,
                        userId: data.senderId,
                    })
                    await GroupJoinUser.create({
                        groupId: group._id,
                        userId: data.receiverId,
                    })
                    socket.join(roomId)
                }
            } else {
                // let groupRoomId = await Group.findOne({ roomId: data.roomId, type: "group" });
                let groupRoomId = await Group.findOne({ _id: data.groupId, type: "group" });
                socket.join(groupRoomId.roomId);
            }
        })

        socket.on("message", async (data) => {
            // console.log("data", data)
            console.log("data ===================", data)
            //create connection start here
            //make vice versa connection save sender id in both senderId and receiverId and vice versa
            // let roomId = (Math.random() + 1).toString(36).substring(7) + data.senderId;
            // if (data.type == "single") {
            //     // let ifNotExixts = await Group.findOne({ $and: [{ $or: [{ senderId: data.senderId }, { receiverId: data.receiverId }] }, { $or: [{ senderId: data.receiverId }, { receiverId: data.senderId }] }] });
            //     let ifNotExixts = await Group.findOne({ senderId: data.senderId, receiverId: data.receiverId, type: "single" });
            //     console.log("ifNotExixt ==========>", ifNotExixts);
            //     let groupId
            //     if (ifNotExixts == null) {
            //         let ifExists = await Group.findOne({ senderId: data.receiverId, receiverId: data.senderId, type: "single" });
            //         // console.log("ifExists ================", ifExists);
            //         if (ifExists != null) {
            //             groupId = ifExists._id;
            //         }
            //     } else {
            //         groupId = ifNotExixts._id;
            //     }


                // console.log("groupId", groupId)
                //     // console.log("ifNotExixts ====================", ifNotExixts)
                // if (groupId == undefined) {
                //     let group = await Group.update({
                //         senderId: data.senderId,
                //         receiverId: data.receiverId,
                //         roomId: roomId,
                //         type: "single",
                //         lastChat: data.message
                //     })
                //     await Group.create({
                //         senderId: data.receiverId,
                //         receiverId: data.senderId,
                //         roomId: group.roomId,
                //         type: "single",
                //         lastChat: data.message
                //     })
                //     await GroupJoinUser.create({
                //         groupId: group._id,
                //         userId: data.senderId,
                //     })
                //     await GroupJoinUser.create({
                //         groupId: group._id,
                //         userId: data.receiverId,
                //     })
                //     await ChatHistory.create({
                //         senderId: data.senderId,
                //         groupId: group._id,
                //         roomId: group.roomId,
                //         message: data.message,
                //         jsonMessage: data
                //     })
                //     socket.join(group.roomId);
                //     // socket.to(group.roomId).emit('message', data);                        
                //     // socket.broadcast.emit('message', data);
                //     // socket.to(connectedgroupId).emit('message', data);
                // } else {
                // console.log("groupId ===============", groupId);
            //     let group = await Group.findOne({ _id: groupId });
            //     await Group.update({ roomId: group.roomId }, {
            //         lastChat: data.message
            //     })
            //     await Group.update({ _id: group._id }, {
            //         lastChat: data.message,
            //         mediaType: data.mediaType,
            //     })
            //     await ChatHistory.create({
            //         senderId: data.senderId,
            //         receiverId: data.receiverId,
            //         groupId: group._id,
            //         roomId: group.roomId,
            //         message: data.message,
            //         mediaType: data.mediaType,
            //         jsonMessage: data
            //     })

            //     await ChatHistory.update({
            //         recieverId: data.senderId,
            //         roomId: group.roomId,
            //     }, { isRead: true });

            //     socket.join(group.roomId);
            //     // socket.to(group.roomId).emit('message', data);
            //     // socket.broadcast.emit('message', data);
            //     // socket.to(connectedgroupId).emit('message', data);
            //     // }
            //     socket.to(group.roomId).emit('message', data);

            //     let userDeviceToken = await User.find({ _id: data.receiverId }).select("userInfo userDeviceInfo");
            //     console.log("userDeviceToken ========================>", userDeviceToken);
            //     let senderName = await User.findOne({ _id: data.senderId }).select("userInfo");
            //     let bodyPayload = {
            //         notification: {
            //             title: senderName.userInfo.firstName,
            //             body: data.message,
            //             receiverId: data.receiverId,
            //             senderId: data.senderId,
            //         },
            //         data: {
            //             userName: senderName.userInfo.firstName,
            //             receiverId: data.receiverId,
            //             senderId: data.senderId,
            //             groupId: groupId,
            //             type: "chat",
            //             chatType: "single",
            //         }
            //     }
            //     if (group.muteNotification == "false") {
            //         const cp = require("child_process");
            //         const child = cp.fork("notificationChildProcess.js");
            //         child.send({ "userDeviceToken": userDeviceToken, "bodyPayload": bodyPayload });
            //         console.log("bodyPayload =====================>", bodyPayload)
            //     }
            //     // userDeviceToken.userDeviceInfo.forEach(element => {
            //     //     SendNotification.sendAndroidNotifications(element.token, bodyPayload)
            //     // })
            // } else {
            //     let group = await Group.findOne({ _id: data.groupId });
            //     await Group.update({ _id: data.groupId }, {
            //         lastChat: data.message,
            //         mediaType: data.mediaType
            //     })
            //     console.log("group ===================>", group);
            //     await ChatHistory.create({
            //         // senderId: data.senderId,
            //         senderId: group.senderId,
            //         receiverId: data.receiverId,
            //         roomId: group.roomId,
            //         groupId: group.groupId,
            //         message: data.message,
            //         mediaType: data.mediaType,
            //         jsonMessage: data
            //     })

            //     await ChatHistory.update({
            //         // recieverId: data.senderId,
            //         recieverId: group.senderId,
            //         roomId: group.roomId,
            //     }, { isRead: true });
            //     // socket.join("room join");
            //     // socket.to("room join").emit('message', data);
            //     // socket.join(group.roomId);
            //     socket.to(group.roomId).emit('message', data);

            //     // socket.broadcast.emit('message', data);
            //     // socket.emit('message', data);


            //     let groupUser = await Group.find({ roomId: group.roomId, muteNotification: "false" }).select('senderId');
            //     let userId = groupUser.map(group => group.senderId);
            //     console.log("userId ==========================>", userId);
            //     for (var i = 0; i < userId.length; i++) {
            //         if (userId[i] == data.senderId) {
            //             delete userId[i];
            //         }
            //     }

            //     console.log("userId ==========================>", userId);
            //     let userDeviceToken = await User.find({ _id: { $in: userId } }).select("userInfo userDeviceInfo");
            //     // let senderName = await User.findOne({ _id: data.senderId }).select("userInfo userDeviceToken");
            //     let bodyPayload = {
            //         notification: {
            //             // title: senderName.userInfo.firstName,
            //             title: group.name,
            //             body: data.message,
            //             receiverId: userDeviceToken._id,
            //             senderId: data.receiverId,
            //         },
            //         data: {
            //             userName: group.name,
            //             receiverId: data.receiverId,
            //             senderId: data.senderId,
            //             groupId: data.groupId,
            //             type: "chat",
            //             chatType: "group",
            //         }
            //     }

            //     console.log("bodyPayload =====================>", bodyPayload)
            //     const cp = require("child_process");
            //     const child = cp.fork("notificationChildProcess.js");
            //     child.send({ "userDeviceToken": userDeviceToken, "bodyPayload": bodyPayload });
            // }
        })

        socket.on("broadcastData", (data) => {
            console.log("broadcastData ===================================================>", data);
            socket.broadcast.emit("broadcastData", data)
        })

        socket.on("typing", async (data) => {
            if (data.type == "single") {
                let ifNotExixts = await Group.findOne({ senderId: data.senderId, receiverId: data.receiverId, type: "single" });
                socket.to(ifNotExixts.roomId).emit('typing', data);
                console.log("typing")
            } else {
                let group = await Group.findOne({ _id: data.groupId });
                socket.to(group.roomId).emit('typing', data);
                console.log("typing")
            }
        })
        socket.on("removeTyping", async (data) => {
            if (data.type == "single") {
                let ifNotExixts = await Group.findOne({ senderId: data.senderId, receiverId: data.receiverId, type: "single" });
                socket.to(ifNotExixts.roomId).emit('removeTyping', data);
                console.log("removeTyping")
            } else {
                let group = await Group.findOne({ _id: data.groupId });
                socket.to(group.roomId).emit('removeTyping', data);
                console.log("removeTyping")
            }
        })

        socket.on("online", async (data) => {
            console.log("online data ===>", data)
            socket.broadcast.emit("online", data)
            console.log("online")
        })
        socket.on("offline", async (data) => {
            console.log("offline data ===>", data)
            socket.broadcast.emit("offline", data)
            console.log("offline")
        })

        socket.on("disconnect", () => {
            console.log("socket is disconnect");
        })
    });

    console.log('status of chat end');


} catch (error) {
    console.error("error ==================>", error);
}

/////////////////////////////////////////////////////////
app.listen(process.env.PORT, () =>
  console.log(`[ MENEHARIYA API ] on ${process.env.PORT}`)
);
