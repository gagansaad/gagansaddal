var FCM = require("fcm-node");
var serverKey =
    "AAAAZ59K9-c:APA91bFM-82iCWfjpPlNfsE2EUtfst5ZXeoJ1jy0Q3U18H5-V_zJWpzEvvK47uQIIkcLB9_UPoWye6CIF_QwrKL2zp-7G1xlftWK9VanbDQNleceoTdw3ooOXyYdAb-sfHISB-WqYIJW"; //put your server key here
var fcm = new FCM(serverKey);
let fs = require("fs");
const {
    sendEmail
} = require(`../resources/sendEmailFunction`);
const mongoose = require('mongoose'),
    User = mongoose.model("user"),
    Notification = mongoose.model(`notification`);
module.exports = {
    sendNotifications: async function (userIds = [], title, body, data = null, saveNotification = false, sendEmailNotification = []) {
        try {
            if (userIds.length == 0)
                return;
            let notificationData
            let emailData;
            const convertedIds = userIds.map(id => mongoose.Types.ObjectId(id));
            let androidTokens;
            let iosTokens;
            let webTokens;
            notificationData = convertedIds.map(userId => ({
                title: title,
                body: body,
                data: JSON.stringify(data),
                user_id: userId,
            }));

            if (saveNotification == true) {
                await Notification.insertMany(notificationData);
            }
            console.log((sendEmailNotification.length > 0));
            console.log(sendEmailNotification);
            if (sendEmailNotification.length > 0) {
                console.log('ssss1');
                convertedIds.map(async userId => {
                    let UserDetails = await User.findById({ "_id": userId })
                    //   let subject = 'Thank you for Use Menehariya!'
                    let replacements = { 'name': UserDetails.userInfo.name };
                    replacements.concat(sendEmailNotification.data);
                    sendEmail(UserDetails.userInfo.email_address, sendEmailNotification.subject, sendEmailNotification.email_template, replacements)
                });

            }
            consol.log('ssss222222222');
            const userDeviceTypes = await User.aggregate([
                { $match: { "_id": { $in: convertedIds } } }, // match ids data only
                { $unwind: "$user_device_info" }, // Unwind the user_device_info array
                {
                    $group: {
                        _id: "$user_device_info.device_type",
                        devices: { $push: "$user_device_info" }
                    }
                },
            ]);
            androidTokens = userDeviceTypes.find(type => type._id === 1)?.devices || [];
            iosTokens = userDeviceTypes.find(type => type._id === 2)?.devices || [];
            webTokens = userDeviceTypes.find(type => type._id === 3)?.devices || [];
            if (androidTokens.length) {
                androidTokens = androidTokens.map(user => user.token);
                sendAndroidNotifications(androidTokens, title, body, data);
            }
            if (iosTokens.length) {
                iosTokens = iosTokens.map(user => user.token);
                sendAppleNotification(iosTokens, title, body, data);
            }
            // if (deviceType3Array.length) {
            //     webTokens = androidTokens.map(user => user.token);
            //     sendAndroidNotifications(androidTokens, title, body, data, true);
            // }
            //   console.log("Device Type 1 Array:", androidTokens);
            //   console.log("Device Type 2 Array:",iosTokens)
            //   console.log("Device Type 3 Array:", webTokens);
            return;
        } catch (err) {
            console.log(err)
            return console.log("Something has gone wrong!");
        }

    },


};
let sendAndroidNotifications = (deviceTokens, title, body, data = null) => {
    console.log(deviceTokens);
    try {
        var message = {
            registration_ids: deviceTokens,
            notification: {
                title: title,
                body: body,
            }
        };
        if (data != null)
            message.data = data

        fcm.send(message, function (err, response) {
            if (err) {
                console.log(err)
                console.log("Something has gone wrong!   test");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    } catch (err) {
        console.log(err)
    }
}

let sendAppleNotification = (deviceTokens, title, body, data = null) => {
    console.log(deviceTokens);
    try {
        var message = {
            registration_ids: deviceTokens,
            notification: {
                title: title,
                body: body,
            }
        };
        fcm.send(message, function (err, response) {
            if (err) {
                console.log(err)
                console.log("Something has gone wrong! apple test");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    } catch (err) {
        console.log(err)
    }
}