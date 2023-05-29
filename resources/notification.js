var FCM = require("fcm-node");
const mongoose = require('mongoose'),
Notification = mongoose.model(`notification`);
module.exports = {

    sendAndroidNotifications: function (deviceToken, data) {

        try {

            // var serverKey = 'AIzaSyDU4gUw30sn0KluoAbVDq01C-wMNsnxsW0'; //put your server key here
            var serverKey =
                "AAAAZ59K9-c:APA91bFM-82iCWfjpPlNfsE2EUtfst5ZXeoJ1jy0Q3U18H5-V_zJWpzEvvK47uQIIkcLB9_UPoWye6CIF_QwrKL2zp-7G1xlftWK9VanbDQNleceoTdw3ooOXyYdAb-sfHISB-WqYIJW"; //put your server key here
            var fcm = new FCM(serverKey);
            var message = {
                to: deviceToken,
                data: {
                    title: 'Title of your push notification', 
                    body: data,
                },
            };

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
    },

    sendAppleNotification: function (deviceToken, data) {

        try {
            var FCM = require("fcm-node");
            var serverKey =
                "AAAAZ59K9-c:APA91bFM-82iCWfjpPlNfsE2EUtfst5ZXeoJ1jy0Q3U18H5-V_zJWpzEvvK47uQIIkcLB9_UPoWye6CIF_QwrKL2zp-7G1xlftWK9VanbDQNleceoTdw3ooOXyYdAb-sfHISB-WqYIJW"; //put your server key here
            var fcm = new FCM(serverKey);
            var message = {
                to: deviceToken,
                notification: {
                    title: data.title,
                    body: data.displayMsg

                },

                data: {
                    //you can send only notification or only data(or include both)
                    title: data.title,
                    sender: data.otherUserId,
                    reciever: data.userId,
                },

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
    },

};
