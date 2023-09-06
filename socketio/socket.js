  
const mongoose = require('mongoose')
const Message = require('../model/posts/message');
const User = require('../model/accounts/users');
const Admin = require('../model/accounts/admin');

//var user=0;
//const sockets = new Set();

const {
    addNewUser,
    removeUser,
    allUsersIds,
    userCount,
    allUsersSocketIds,
} = require('./controllers/user.controller');

// const{
// onDisconnect
// } = require('./controllers/event.controller');
//const online_users = new Map();

const socketio = (io)=>{

io.on('connection', async (socket)=>{
    // console.log("connected user num:",++user);
    // sockets.add(socket.id);
  console.log("heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
    //send geeting to new user and request his id
     io.to(socket.id).emit("greeting");

    //store my db id with socket id
    await new Promise(resolve=>{
      socket.on("myDataBaseId",(user_data)=>{
        if(user_data){
          addNewUser(user_data,socket.id); 
        //  console.log("online users count: ",[...allUsersIds().keys()]);
          resolve(user_data)
        }
    });
  });   
      
      //emit active users to all users
       await new Promise(resolve=>{
        const activeUsersIds =  [...allUsersIds().keys()];
        io.emit("get_active_users",activeUsersIds,answer=>{
          resolve(answer);
        })
      });
        
   
    //handle sendding private message 
   socket.on("sendPrivateMessage",async(data)=>{
    if(data.message && data.message !== undefined){
      const newMessage = Message({
        senderId:data.senderId,
        senderName:data.senderName,
        recieverId:data.recieverId,
        message:{
            text:data.message,
            image:''
        }
      });
      const saveMessage = await newMessage.save();
  }

   
  if(allUsersSocketIds().has(data.recieverId))
    io.to(allUsersSocketIds().get(data.recieverId)).emit("message-sent-success",{
      message : data.message,
      senderId : data.senderId,
      recieverId : data.recieverId
    });
    
    io.to(allUsersSocketIds().get(data.senderId)).emit("message-sent-success",{
      message : data.message,
      senderId : data.senderId,
      recieverId : data.recieverId
    });

  });
 
/*
   socket.on("file_uploading",(data)=>{
     console.log("file-uploaded data: ",data);
 
   });*/
 
   //typingmessage...
   socket.on("typingMessage",(data)=>{
    // console.log("typing message ,",data);
     if(allUsersSocketIds().get(data.recieverId)){
       io.to(allUsersSocketIds().get(data.recieverId)).emit("typingMessageGet",{
         senderId:data.senderId,
         recieverId:data.recieverId,
         message:data.message
       });
     }
   });
  
   //get friends
   await new Promise(resolve=>{
    socket.on("getFriends",async(myid)=>{
      try{
      const id = mongoose.Types.ObjectId(myid);
      const friends = await User.find({_id:{$ne:id}}).limit(100)
                      .select('-password -__v');
         
      console.log("friendssss ",friends.length)
    
     socket.emit("getFriends_success",friends);
      }catch(err){
        console.log(err.message)
      }
      resolve(myid)
     });
   });
   

   //get conversation between you and you friend
   socket.on("getConversation",async(data)=>{
    const senderId=data.senderId;
    const recieverId=data.recieverId;
    
      const allMessage = await Message.find({
        $and:[
          { $or:[{senderId:senderId},{senderId:recieverId}]},
          { $or:[{recieverId:senderId},{recieverId:recieverId}]}
        ]
       }).limit(30).select('-__v -_id').sort({createdAt:-1});
  

       //send message to both sender and reciver
       if(allUsersSocketIds().has(data.recieverId) ){
        io.to(allUsersSocketIds().get(data.recieverId)).emit("Messages-Get-Success",{
          senderId:data.senderId,
          recieverId:data.recieverId,
          message:Array.from(allMessage).reverse()
        });
      }

      if( allUsersSocketIds().has(data.senderId)){
        io.to(allUsersSocketIds().get(data.senderId)).emit("Messages-Get-Success",{
          senderId:data.senderId,
          recieverId:data.recieverId,
          message:Array.from(allMessage).reverse()
        });
      }  

   });
 

     //handle disconnection 
     socket.on('disconnect',()=>{

         if(userCount()>0){
             removeUser(socket.id);
             const activeUsersIds =  [...allUsersIds().keys()];
             //after any of users become online update active users again
             io.emit("get_active_users",activeUsersIds); 
         }
     });
 });
}

module.exports = {socketio};
