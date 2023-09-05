
const online_users_info = new Map();
const online_users_ids = new Map();
const online_users_sockets = new Map();

exports.addNewUser = (data,socketId)=>{
    if(data&&data!==undefined){
        online_users_info.set(data.id,data);

        online_users_ids.set(data.id,data.userName);

        online_users_sockets.set(data.id,socketId);

        console.log("user: {",data.userName,"} become online");

    }
}

exports.removeUser = (socketId)=>{
    const socketIds = [...online_users_sockets.values()];
    if(socketIds.includes(socketId) ){

        for(let [k,v] of online_users_sockets.entries()){
            if(v==socketId){
               console.log("user: {",online_users_ids.get(k),"} become offline");
               online_users_sockets.delete(k);
               online_users_info.delete(k);
               online_users_ids.delete(k);
                break;
            }
        }
    }
}

exports.allUsersInfo = ()=>{
    return online_users_info;
}

exports.allUsersIds = ()=>{
    return online_users_ids;
}
exports.allUsersSocketIds = ()=>{
    return online_users_sockets;
}

exports.userCount = ()=>{
    try {
        return online_users_info.size;
    } catch (err) {
        console.log(err.message)
        return 0;
    }
}