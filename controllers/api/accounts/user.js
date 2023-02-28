
const mongoose = require("mongoose"),
    User = mongoose.model("user"),
    bcrypt = require("bcryptjs"),
    jwt = require("jsonwebtoken"),
    ObjectId = require("mongodb").ObjectID;

module.exports = {

    // Standard signup with email.
    signupWithEmail: async function (req, res) {
        var newUser = req.body;
        newUser.email = newUser.email.toLowerCase();

        console.log(req.body)

        // Check If email is register with any user via other platforms like facebook,google or email.
        if (newUser.screen == 1) {
            const checkUserEmail = await User.find(
                { "userInfo.email": newUser.email },
                { userBasicInfo: 1, userInfo: 1 }
            );

            if (checkUserEmail.length) {
                //If user has signedup from fb
                if (
                    checkUserEmail[0].userBasicInfo.source == "Facebook" ||
                    checkUserEmail[0].userBasicInfo.source == "facebook"
                ) {
                    res.json({
                        status: 202,
                        message: `fail`,
   
                    });
                }
                //If user has signedup from google
                else if (checkUserEmail[0].userBasicInfo.source == "GoogleEmail") {
                    res.json({
                        status: 202,
                        message: `fail`,
                    
                    });
                }
                //If user has signedup from Apple
                else if (checkUserEmail[0].userBasicInfo.source == "Apple") {
                    res.json({
                        status: 202,
                        message: `fail`,
                  
                    });
                }
                //If user has signedup from email
                else if (
                    checkUserEmail[0].userBasicInfo.source == "Email" ||
                    checkUserEmail[0].userBasicInfo.source == "email"
                ) {
                    res.json({
                        status: 202,
                        message: `fail`,
                      
                    });
                }
            } else {
                res.json({ status: 200, message: `success` });
            }
        } else {
            // Create a new user.
            try {

                var newUserDetail = {};

                newUser.password = bcrypt.hashSync(newUser.password, 8);

                newUserDetail.userStatus = {
                    userStatus: "Login",
                    appVersion: newUser.appVersion,
                };
                newUserDetail.userInfo = {
                    name: newUser.name,
                    password: newUser.password,
                    email_address: newUser.email,
                };
                newUserDetail.userBasicInfo = {
                    source: "email",

                };


                User(newUserDetail).save(function (err, result) {
                    if (err) {
                        res.json({
                            status: 201,
                            message: `fail`,
                            data: err,
                        });
                    } else {

                        res.json({
                            status: 200,
                            data: {
                                userId: result._id,
                            },
                            action: "signUp",
                            message: `success`,
                            token: createJWT(result._id),
                        });

                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    },


    // Standard login.
    loginWithEmail: async function (req, res) {
        console.log(req.body);
        var userData = req.body;
        if (!userData.email) return res.json({ message: "please provide a email" });

        userData.email = userData.email.toLowerCase();

        // Check If email is register with any user via other platforms like facebook,google or email.

        const checkUserDetail = await User.find(
            { "userInfo.email": userData.email },
            { userInfo: 1, userBasicInfo: 1, userStatus: 1, userDateInfo: 1 }
        );

        if (checkUserDetail.length) {
            if (!checkUserDetail[0].userInfo.password) {
                return res.json({
                    status: 202,
                    message: alertMessages.PasswordIncorrect,
                    Title: alertMessages.PasswordIncorrectTitle,
                });
            }
            let passwordIsValid = bcrypt.compareSync(
                userData.password,
                checkUserDetail[0].userInfo.password
            );

            if (passwordIsValid) {
                // Update device information of user
                const updateDeviceInfo = await User.update({ _id: checkUserDetail[0]._id }, {
                    $addToSet: {
                        userDeviceInfo: {
                            deviceVersion: userData.deviceInfo.deviceVersion,
                            deviceModel: userData.deviceInfo.deviceModel,
                            deviceName: userData.deviceInfo.deviceName,
                            token: userData.deviceInfo.token,
                            deviceType: userData.deviceInfo.deviceType,
                        },
                    },
                    $set: {
                        "userStatus.userStatus": "Login",
                        "userStatus.appVersion": userData.appVersion,
                        "userStatus.userActionStatus": "Enable",
                        "userDateInfo.lastLoginDate": new Date(),
                    },
                });


                res.json({
                    status: 200,
                    data: checkUserDetail[0],
                    message: alertMessages.success,
                    token: createJWT(checkUserDetail[0]._id),
                });

            } else {
                res.json({
                    status: 202,
                    message: alertMessages.PasswordIncorrect,
                    Title: alertMessages.PasswordIncorrectTitle,
                });
            }
        } else {
            res.json({
                status: 202,
                message: alertMessages.EmailIncorrect,
                Title: alertMessages.EmailIncorrectTitle,
            });
        }
    },

}


function createJWT(userId) {
    return jwt.sign({ userId: userId }, `AbCdEfGhIjKlMnOPYT`, { expiresIn: "240h" }); // expires in 240 hours
}

function verifyqJWT(token) {
    jwt.verify(token, `AbCdEfGhIjKlMnOPYT`, function (err, decoded) {
        if (err) {
            return err;
        } else {
            return decoded.userId;
        }
    });
}