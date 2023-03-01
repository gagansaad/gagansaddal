
const mongoose = require("mongoose"),
    User = mongoose.model("user"),
    bcrypt = require("bcryptjs"),
    createJWT = require(`../../../utils/createJWT`),
    ObjectId = require("mongodb").ObjectID;

const { EmailOTPVerification } = require(`../../../resources/sendEmailFunction`);
const { MobileNumberVerificationOTP } = require(`../../../resources/sendOTPFunction`);

module.exports = {

    // Standard signup with email.
    signupWithEmail: async function (req, res) {
        var newUser = req.body;
        newUser.email = newUser.email.toLowerCase();

        // Check If email is register with any user via other platforms like facebook,google or email.

        const checkUserEmail = await User.find(
            { "userInfo.email_address": newUser.email },
            { userBasicInfo: 1, userInfo: 1 }
        );

        if (checkUserEmail.length) {
            //If user has signedup from fb
            if (
                checkUserEmail[0].userBasicInfo.source == "Facebook" ||
                checkUserEmail[0].userBasicInfo.source == "facebook"
            ) {
                res.json({
                    status: 400,
                    message: `fail`,

                });
            }
            //If user has signedup from google
            else if (checkUserEmail[0].userBasicInfo.source == "GoogleEmail") {
                res.json({
                    status: 400,
                    message: `fail`,

                });
            }
            //If user has signedup from Apple
            else if (checkUserEmail[0].userBasicInfo.source == "Apple") {
                res.json({
                    status: 400,
                    message: `fail`,
                });
            }
            //If user has signedup from email
            else if (
                checkUserEmail[0].userBasicInfo.source == "Email" ||
                checkUserEmail[0].userBasicInfo.source == "email"
            ) {
                res.json({
                    status: 400,
                    message: `email aready exist.......`,
                });
            }
        } else {
            try {

                var newUserDetail = {};

                newUser.password = bcrypt.hashSync(newUser.password, 8);

                newUserDetail.user_status ={
                    user_action_Status: 1
                }

         
                newUserDetail.userStatus = {
                    userStatus: "Login",
                    appVersion: newUser.appVersion,
                };
                newUserDetail.userInfo = {
                    name: newUser.name,
                    password: newUser.password,
                    email_address: newUser.email,
                    mobile_number: {
                        country_code: 91,
                        phone_number: newUser.phone_number
                    },
                };
                newUserDetail.userBasicInfo = {
                    source: "email",

                };


                User(newUserDetail).save(function (err, result) {
                    if (err) {
                        console.log(err)
                        res.json({
                            status: 400,
                            message: `fail`,
                        });
                    } else {

                        res.json({
                            status: 201,
                            data: {
                                userId: result._id,
                                name: result.userInfo.name || null,
                                email_address: result?.userInfo?.email_address || null,
                                phone_number: result?.userInfo?.mobile_number?.phone_number || null,
                            },
                            message: `User register successfully`,
                            token: createJWT(result._id),
                        });

                        // MobileNumberVerificationOTP(result?.userInfo?.mobile_number?.phone_number, result?.userInfo?.name)
                        EmailOTPVerification(result?.userInfo?.email_address, result?.userInfo?.name)
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    },
    // Standard login.
    loginWithEmail: async function (req, res) {
  
        var userData = req.body;
        if (!userData.email) return res.json({ message: "please provide a email" });

        userData.email = userData.email.toLowerCase();

        // Check If email is register with any user via other platforms like facebook,google or email.

        const checkUserDetail = await User.find(
            { "userInfo.email_address": userData.email },
            { userInfo: 1, userBasicInfo: 1, userStatus: 1, userDateInfo: 1 }
        );

        if (checkUserDetail.length) {
            if (!checkUserDetail[0].userInfo.password) {
                return res.json({
                    status: 202,
                    message: `Incorrect password`,
                    Title: `Incorrect password`,
                });
            }
            let passwordIsValid = bcrypt.compareSync(
                userData.password,
                checkUserDetail[0].userInfo.password
            );

            if (passwordIsValid) {
                // Update device information of user
                const updateDeviceInfo = await User.update({ _id: checkUserDetail[0]._id }, {
               
                    $set: {
                        "userStatus.userStatus": "Login",
                        "userStatus.userActionStatus": "Enable",
                        "userDateInfo.lastLoginDate": new Date(),
                    },
                });

                const data ={
                    ...checkUserDetail[0].userInfo,
                    mobile_number: checkUserDetail[0].userInfo.mobile_number.phone_number,
                    country_code: checkUserDetail[0].userInfo.mobile_number.country_code
                }

                delete data["password"]


                res.json({
                    status: 200,
                    data: data,
                    message: `success`,
                    token: createJWT(checkUserDetail[0]._id),
                });

            } else {
                res.json({
                    status: 202,
                    message: `Incorrect password`,
                    Title: `Incorrect password`,
                });
            }
        } else {
            res.json({
                status: 202,
                message: `Incorrect password`,
                Title: `Incorrect password`,
            });
        }
    },
},









function verifyqJWT(token) {
    jwt.verify(token, `AbCdEfGhIjKlMnOPYT`, function (err, decoded) {
        if (err) {
            return err;
        } else {
            return decoded.userId;
        }
    });
}







