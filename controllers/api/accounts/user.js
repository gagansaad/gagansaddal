
const mongoose = require("mongoose"),
    User = mongoose.model("user"),
    OTP = mongoose.model("otp"),
    bcrypt = require("bcryptjs"),
    createJWT = require(`../../../utils/createJWT`),
    alertMessage = require(`../../../utils/alertMessage`),
    { generateOTP } = require(`../../../utils/generateOTP`),

    ObjectId = require("mongodb").ObjectID;

const { EmailOTPVerification } = require(`../../../resources/sendEmailFunction`);
const { MobileNumberVerificationOTP } = require(`../../../resources/sendOTPFunction`),
    { successJSONResponse, failureJSONResponse } = require(`../../../handlers/jsonResponseHandlers`);
const {
    isValidString,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber
} = require(`../../../utils/validators`);


const vali = (date) => {
    let dateformat = /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[1-2][0-9]|3[01])[\/]\d{4}$/;

    // Matching the date through regular expression      
    if (date.match(dateformat)) {
        let operator = date.split('/');

        // Extract the string into month, date and year      
        let datepart = [];
        if (operator.length > 1) {
            datepart = date.split('/');
        }
        let month = parseInt(datepart[0]);
        let day = parseInt(datepart[1]);
        let year = parseInt(datepart[2]);

        // Create a list of days of a month      
        let ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (month == 1 || month > 2) {
            if (day > ListofDays[month - 1]) {
                //to check if the date is out of range     
                return false;
            }
        } else if (month == 2) {
            let leapYear = false;
            if ((!(year % 4) && year % 100) || !(year % 400)) leapYear = true;
            if ((leapYear == false) && (day >= 29)) return false;
            else
                if ((leapYear == true) && (day > 29)) {
                    console.log('Invalid date format!');
                    return false;
                }
        }
    } else {
        console.log("Invalid date format!");
        return false;
    }
    return "Valid date";
}


module.exports = {

    validate_signup_data: async function (req, res, next) {

        try {
            const {
                email,
                password,
                name,
                phone_number,
                device_token,
                device_type,
            } = req.body;



            if (!isValidString(name.trim())) return failureJSONResponse(res,{message:`Please provide name`}) ;
            if (!isValidString(password.trim())) return failureJSONResponse(res, { message: `Please provide name` });

            if (!isValidString(device_token.trim())) return failureJSONResponse(res, { message: `Please provide device token` });
            if (!(device_type)) return failureJSONResponse(res, { message: `Please provide device type` });
            else if (isNaN(device_type)) return failureJSONResponse(res, { message: `Please provide valid device type` }); 

            if (!isValidString(email.trim())) return failureJSONResponse(res, { message: `Please provide email address` }); 
            else if (email.trim() && !isValidEmailAddress(email.trim())) return failureJSONResponse(res, { message: `Please provide valid email address` }); 

    
            return next();
            

        } catch (error) {
            console.log(error)
        }

    },

    // Standard signup with email.
    signup_with_email: async function (req, res) {
        try {
            var newUser = req.body;
            newUser.email = newUser.email.trim().toLowerCase();

            // Check If email is register with any user via other platforms like facebook,google or email.

            const checkUserEmail = await User.find(
                { "userInfo.email_address": (newUser.email).trim() },
                { userBasicInfo: 1, userInfo: 1 }
            );

            if (checkUserEmail.length) {
                //If user has signedup from fb
                if (
                    checkUserEmail[0].userBasicInfo.source == "Facebook" ||
                    checkUserEmail[0].userBasicInfo.source == "facebook"
                ) {
                    res.json({
                        status: 403,
                        message: alertMessage.facebookAccountExist,

                    });
                }
                //If user has signedup from google
                else if (checkUserEmail[0].userBasicInfo.source == "GoogleEmail") {
                    res.json({
                        status: 403,
                        message: `facebook account already exists with this email`,

                    });
                }
                //If user has signedup from Apple
                else if (checkUserEmail[0].userBasicInfo.source == "Apple") {
                    res.json({
                        status: 403,
                        message: alertMessage.appleAccountExist,
                    });
                }
                //If user has signedup from email
                else if (
                    checkUserEmail[0].userBasicInfo.source == "Email" ||
                    checkUserEmail[0].userBasicInfo.source == "email"
                ) {
                    res.json({
                        status: 403,
                        message: alertMessage.emailAccountExist
                    });
                }
            } else {
                try {

                    var newUserDetail = {};

                    newUser.password = bcrypt.hashSync(newUser.password, 8);

                    newUserDetail.user_status = {
                        user_action_Status: 1
                    }

                    newUserDetail.userStatus = {
                        userStatus: "Login",
                        appVersion: newUser.appVersion,
                    };
                    newUserDetail.userInfo = {
                        name: (newUser?.name).trim(),
                        is_active: false,
                        password: (newUser?.password).trim(),
                        email_address: (newUser?.email).trim(),
                        mobile_number: {
                            country_code: newUser?.country_code || 91,
                            phone_number: (newUser?.phone_number)
                        },
                    };
                    newUserDetail.user_device_info = {
                        device_version: newUser.device_version,
                        device_model: newUser.device_model,
                        device_name: newUser.device_name,
                        token: newUser.device_token,
                        device_type: newUser.device_type,
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
                                    is_active: result.userInfo.is_active
                                },
                                message: `User register successfully`,
                                token: createJWT(result._id),
                            });


                            if (result?.userInfo?.mobile_number?.phone_number) {
                                OTP.create({
                                    code: generateOTP(4),
                                    user: result._id,
                                    for: 1

                                }).then((data) => {
                                    console.log(data)
                                    MobileNumberVerificationOTP(result?.userInfo?.mobile_number?.phone_number, result?.userInfo?.name, data.code)
                                })

                            }

                            if (result?.userInfo?.email_address) {
                                OTP.create({
                                    code: generateOTP(4),
                                    user: result._id,
                                    for: 2

                                }).then((data) => {
                                    console.log(data)
                                    EmailOTPVerification(result?.userInfo?.email_address, result?.userInfo?.name, data.code)
                                })

                            }

                        }
                    });
                } catch (err) {
                    return failureJSONResponse(res, { message: `something went wrog` })
                }
            }
        } catch (err) {
            return failureJSONResponse(res,{message: `something went wrog`})
        }
    },

    // Standard signup with Google.
    login_signup_with_google: async function (req, res) {


        const emailAddress = (req?.body?.email_address).trim(),
            name = (req?.body?.name).trim(),
            deviceType = req?.body?.device_type,
            googleId = (req?.body?.google_id),
            googleToken = (req?.body?.google_token),
            deviceToken = (req?.body?.device_token);

        if (!isValidString(name.trim())) return failureJSONResponse(res, { message: `Please enter valid name` });
        if (!isValidString(googleId.trim())) return failureJSONResponse(res, { message: `google id missing` });
        if (!isValidString(googleToken.trim())) return failureJSONResponse(res, { message: `google token missing` });

        if (!isValidString(deviceToken.trim())) return failureJSONResponse(res, { message: `device token missing` });
        if (!(deviceType)) return failureJSONResponse(res, { message: `device type missing` });
        else if (isNaN(deviceType)) return failureJSONResponse(res, { message: `device type invalid;` });

        if (!isValidString(emailAddress.trim())) return failureJSONResponse(res, { message: `Please enter email address` });
        else if (emailAddress.trim() && !isValidEmailAddress(emailAddress.trim())) return failureJSONResponse(res, { message: `Please enter valid email address` });

        // Check If email is register with any user via other platforms like facebook,google or email.

        const foundUser = await User.findOne(
            { "userGoogleInfo.googleId": googleId },
            {
                _id: 1,
                userBasicInfo: 1,
                userStatus: 1,
                userInfo: 1,
                userDateInfo: 1
            }
        );

        if (foundUser && Object.keys(foundUser).length) {

            console.log(`case 1`)

            const updateDeviceInfo = await User.update({ _id: foundUser._id }, {
                $addToSet: {
                    user_device_info: {
                        token: deviceToken,
                        device_type: Number(deviceType)
                    },
                },
                $set: {
                    "user_status.user_action_Status": Number(2),
                    "user_status.lastLoginDate": new Date(),
                },
            });

            return successJSONResponse(res, {
                status: 200,
                data: {
                    userId: foundUser._id,
                    name: foundUser?.userInfo?.name || null,
                    email_address: foundUser?.userInfo?.email_address || null,
                    phone_number: foundUser?.userInfo?.mobile_number?.phone_number || null,
                    is_active: foundUser?.userInfo?.is_active
                },
                message: `success`,
                token: createJWT(foundUser._id),
            })

        } else {


            const foundUserWithEmailAddress = await User.findOne({
                "userInfo.email_address": emailAddress.toLowerCase(),
                "userGoogleInfo.googleId": null,
                "user_status.user_action_Status": 2,
            }, { userBasicInfo: 1, _id: 1, userStatus: 1, userInfo: 1, userDateInfo: 1 });


            if (foundUserWithEmailAddress && Object.keys(foundUserWithEmailAddress).length) {
                console.log(`case2 `)

                const updateDeviceInfo = await dbSchema.User.update({ _id: foundUserWithEmailAddress._id }, {
                    $set: {

                        "userGoogleInfo.googleId": googleId,
                        "userGoogleInfo.googleEmail": emailAddress.toLowerCase(),
                        "userGoogleInfo.googleToken": googleToken,

                        user_device_info: {
                            token: deviceToken,
                            device_type: Numbe(deviceType)
                        },
                    },
                    $set: {
                        "user_status.userActionStatus": 2
                    },
                });

                return successJSONResponse(res, {
                    status: 200,
                    data: {
                        userId: foundUserWithEmailAddress._id,
                        name: foundUserWithEmailAddress.userInfo.name || null,
                        email_address: foundUserWithEmailAddress?.userInfo?.email_address || null,
                        phone_number: foundUserWithEmailAddress?.userInfo?.mobile_number?.phone_number || null,
                        is_active: foundUserWithEmailAddress?.userInfo?.is_active
                    },
                    message: `success`,
                    token: createJWT(foundUserWithEmailAddress._id),
                })

            } else {
                console.log(`case3`)

                // Create a new user.
                var newUserDetail = {};
                var user_status = {
                    user_action_Status: 2,
                };
                var userGoogleInfo = {
                    googleId: googleId,
                    googleEmail: emailAddress.toLowerCase(),
                    googleToken: googleToken,
                };
                var userInfo = {
                    name: name,
                    is_active: true,
                    email_address: emailAddress.toLowerCase(),
                };
                var userBasicInfo = {
                    source: "GoogleEmail",
                };
                var user_device_info = {
                    token: deviceToken,
                    device_type: Number(deviceType),
                };

                newUserDetail.user_status = user_status;
                newUserDetail.userGoogleInfo = userGoogleInfo;
                newUserDetail.userInfo = userInfo;
                newUserDetail.userBasicInfo = userBasicInfo;
                newUserDetail.user_device_info = user_device_info;

                User(newUserDetail).save(function (err, result) {
                    if (err) {
                        res.json({
                            status: 401,
                            message: `fail`,
                            data: err,
                        });
                    } else {

                        return res.json({
                            status: 201,
                            data: {
                                userId: result._id,
                                name: result.userInfo.name || null,
                                email_address: result?.userInfo?.email_address || null,
                                phone_number: result?.userInfo?.mobile_number?.phone_number || null,
                                is_active: result?.userInfo?.is_active
                            },

                            message: `success`,
                            token: createJWT(result._id),
                        });

                    }

                });

            }
        }
    },

    // Standard signup with Google.
    login_signup_with_facebook: async function (req, res) {

  
        const emailAddress = (req?.body?.email_address),
            name = (req?.body?.name).trim(),
            deviceType = req?.body?.device_type,
            facebookId = (req?.body?.facebook_id),
            facebookToken = (req?.body?.facebook_token),
            deviceToken = (req?.body?.device_token);

        if (!isValidString(name.trim())) return failureJSONResponse(res, { message: `Please enter valid name` });
        if (!isValidString(facebookId.trim())) return failureJSONResponse(res, { message: `facebook id missing` });
        if (!isValidString(facebookToken.trim())) return failureJSONResponse(res, { message: `facebook token missing` });

        if (!isValidString(deviceToken.trim())) return failureJSONResponse(res, { message: `device token missing` });
        if (!(deviceType)) return failureJSONResponse(res, { message: `device type missing` });
        else if (isNaN(deviceType)) return failureJSONResponse(res, { message: `device type invalid;` });

        if (!isValidString(emailAddress.trim())) return failureJSONResponse(res, { message: `Please enter email address` });
        else if (emailAddress.trim() && !isValidEmailAddress(emailAddress.trim())) return failureJSONResponse(res, { message: `Please enter valid email address` });

        // Check If email is register with any user via other platforms like facebook,google or email.

        const foundUser = await User.findOne(
            { "userGoogleInfo.googleId": facebookId },
            {
                _id: 1,
                userBasicInfo: 1,
                userStatus: 1,
                userInfo: 1,
                userDateInfo: 1
            }
        );

        if (foundUser && Object.keys(foundUser).length) {

            console.log(`case 1`)

            const updateDeviceInfo = await User.update({ _id: foundUser._id }, {
                $addToSet: {
                    user_device_info: {
                        token: deviceToken,
                        device_type: Number(deviceType)
                    },
                },
                $set: {
                    "user_status.user_action_Status": Number(2),
                    "user_status.lastLoginDate": new Date(),
                },
            });

            return successJSONResponse(res, {
                status: 200,
                data: {
                    userId: foundUser._id,
                    name: foundUser?.userInfo?.name || null,
                    email_address: foundUser?.userInfo?.email_address || null,
                    phone_number: foundUser?.userInfo?.mobile_number?.phone_number || null,
                    is_active: foundUser?.userInfo?.is_active
                },
                message: `success`,
                token: createJWT(foundUser._id),
            })

        } else {

            console.log(`dvnavsndvsah`)

            const foundUserWithEmailAddress = await User.findOne({
                "userInfo.email_address": emailAddress.toLowerCase(),
                "userGoogleInfo.facebookId": null,
                "user_status.user_action_Status": 2,
            }, { userBasicInfo: 1, _id: 1, userStatus: 1, userInfo: 1, userDateInfo: 1 });


            if (foundUserWithEmailAddress && Object.keys(foundUserWithEmailAddress).length) {
                console.log(`case2 `)

                const updateDeviceInfo = User.update({ _id: foundUserWithEmailAddress._id }, {
                    $addToSet: {

                        "userGoogleInfo.facebookId": facebookId,
                        "userGoogleInfo.googleEmail": emailAddress.toLowerCase(),
                        "userGoogleInfo.googleToken": facebookToken,

                        user_device_info: {
                            token: deviceToken,
                            device_type: Number(deviceType)
                        },
                    },
                    $set: {
                        "user_status.userActionStatus": 2
                    },
                });

                return successJSONResponse(res, {
                    status: 200,
                    data: {
                        userId: foundUserWithEmailAddress._id,
                        name: foundUserWithEmailAddress.userInfo.name || null,
                        email_address: foundUserWithEmailAddress?.userInfo?.email_address || null,
                        phone_number: foundUserWithEmailAddress?.userInfo?.mobile_number?.phone_number || null,
                        is_active: foundUserWithEmailAddress?.userInfo?.is_active
                    },
                    message: `success`,
                    token: createJWT(foundUserWithEmailAddress._id),
                })

            } else {
                console.log(`case3`)

                // Create a new user.
                var newUserDetail = {};
                var user_status = {
                    user_action_Status: 2,
                };
                var userGoogleInfo = {
                    facebookId: facebookId,
                    googleEmail: emailAddress.toLowerCase(),
                    googleToken: facebookToken,
                };
                var userInfo = {
                    name: name,
                    is_active: true,
                    email_address: emailAddress.toLowerCase(),
                };
                var userBasicInfo = {
                    source: "Facebook",
                };
                var user_device_info = {
                    token: deviceToken,
                    device_type: Number(deviceType),
                };

                newUserDetail.user_status = user_status;
                newUserDetail.userGoogleInfo = userGoogleInfo;
                newUserDetail.userInfo = userInfo;
                newUserDetail.userBasicInfo = userBasicInfo;
                newUserDetail.user_device_info = user_device_info;

                User(newUserDetail).save(function (err, result) {
                    if (err) {
                        res.json({
                            status: 401,
                            message: `fail`,
                            data: err,
                        });
                    } else {

                        return res.json({
                            status: 201,
                            data: {
                                userId: result._id,
                                name: result.userInfo.name || null,
                                email_address: result?.userInfo?.email_address || null,
                                phone_number: result?.userInfo?.mobile_number?.phone_number || null,
                                is_active: result?.userInfo?.is_active
                            },

                            message: `success`,
                            token: createJWT(result._id),
                        });

                    }

                });

            }
        }
    },


     // Standard signup with Google.
    login_signup_with_apple: async function (req, res) {


        const emailAddress = (req?.body?.email_address).trim(),
            name = (req?.body?.name).trim(),
            deviceType = req?.body?.device_type,
            appleId = (req?.body?.apple_id),
            appleToken = (req?.body?.apple_token),
            deviceToken = (req?.body?.device_token);

        if (!isValidString(name.trim())) return failureJSONResponse(res, { message: `Please enter valid name` });
        if (!isValidString(appleId.trim())) return failureJSONResponse(res, { message: `apple id missing` });
        if (!isValidString(appleToken.trim())) return failureJSONResponse(res, { message: `apple token missing` });

        if (!isValidString(deviceToken.trim())) return failureJSONResponse(res, { message: `device token missing` });
        if (!(deviceType)) return failureJSONResponse(res, { message: `device type missing` });
        else if (isNaN(deviceType)) return failureJSONResponse(res, { message: `device type invalid;` });

        if (!isValidString(emailAddress.trim())) return failureJSONResponse(res, { message: `Please enter email address` });
        else if (emailAddress.trim() && !isValidEmailAddress(emailAddress.trim())) return failureJSONResponse(res, { message: `Please enter valid email address` });

        // Check If email is register with any user via other platforms like facebook,google or email.

        const foundUser = await User.findOne(
            { "userAppleInfo.appleId": appleId },
            {
                _id: 1,
                userBasicInfo: 1,
                userStatus: 1,
                userInfo: 1,
                userDateInfo: 1
            }
        );

        console.log()

        if (foundUser && Object.keys(foundUser).length) {

            console.log(`case 1`)

            const updateDeviceInfo = await User.update({ _id: foundUser._id }, {
                $addToSet: {
                    user_device_info: {
                        token: deviceToken,
                        device_type: Number(deviceType)
                    },
                },
                $set: {
                    "user_status.user_action_Status": Number(2),
                    "user_status.lastLoginDate": new Date(),
                },
            });

            return successJSONResponse(res, {
                status: 200,
                data: {
                    userId: foundUser._id,
                    name: foundUser?.userInfo?.name || null,
                    email_address: foundUser?.userInfo?.email_address || null,
                    phone_number: foundUser?.userInfo?.mobile_number?.phone_number || null,
                    is_active: foundUser?.userInfo?.is_active
                },
                message: `success`,
                token: createJWT(foundUser._id),
            })

        } else {


            const foundUserWithEmailAddress = await User.findOne({
                "userInfo.email_address": emailAddress.toLowerCase(),
                "userGoogleInfo.appleId": null,
                "user_status.user_action_Status": 2,
            }, { userBasicInfo: 1, _id: 1, userStatus: 1, userInfo: 1, userDateInfo: 1 });


            if (foundUserWithEmailAddress && Object.keys(foundUserWithEmailAddress).length) {
                console.log(`case2 `)

                const updateDeviceInfo = await User.update({ _id: foundUserWithEmailAddress._id }, {
                 
                    $set: {

                        "userAppleInfo.appleId": appleId,
                        "userAppleInfo.googleEmail": emailAddress.toLowerCase(),
                        "userAppleInfo.appleToken": appleToken,

                        user_device_info: {
                            token: deviceToken,
                            device_type: Number(deviceType)
                        },
                    },
                    $set: {
                        "user_status.userActionStatus": 2
                    },
                });

                return successJSONResponse(res, {
                    status: 200,
                    data: {
                        userId: foundUserWithEmailAddress._id,
                        name: foundUserWithEmailAddress.userInfo.name || null,
                        email_address: foundUserWithEmailAddress?.userInfo?.email_address || null,
                        phone_number: foundUserWithEmailAddress?.userInfo?.mobile_number?.phone_number || null,
                        is_active: foundUserWithEmailAddress?.userInfo?.is_active
                    },
                    message: `success`,
                    token: createJWT(foundUserWithEmailAddress._id),
                })

            } else {
                console.log(`case3`)

                // Create a new user.
                var newUserDetail = {};
                var user_status = {
                    user_action_Status: 2,
                };
                var userGoogleInfo = {
                    appleId: appleId,
                    appleEmail: emailAddress.toLowerCase(),
                    appleToken: appleToken,
                };
                var userInfo = {
                    name: name,
                    is_active: true,
                    email_address: emailAddress.toLowerCase(),
                };
                var userBasicInfo = {
                    source: "Apple",
                };
                var user_device_info = {
                    token: deviceToken,
                    device_type: Number(deviceType),
                };


                newUserDetail.user_status = user_status;
                newUserDetail.userAppleInfo = userGoogleInfo;
                newUserDetail.userInfo = userInfo;
                newUserDetail.userBasicInfo = userBasicInfo;
                newUserDetail.user_device_info = user_device_info;

                User(newUserDetail).save(function (err, result) {
                    if (err) {
                        res.json({
                            status: 401,
                            message: `fail`,
                            data: err,
                        });
                    } else {

                        return res.json({
                            status: 201,
                            data: {
                                userId: result._id,
                                name: result.userInfo.name || null,
                                email_address: result?.userInfo?.email_address || null,
                                phone_number: result?.userInfo?.mobile_number?.phone_number || null,
                                is_active: result?.userInfo?.is_active
                            },

                            message: `success`,
                            token: createJWT(result._id),
                        });

                    }

                });

            }
        }
    },


    // Standard login.
    login_with_email: async function (req, res) {

        try {

            var userData = req.body;
            if (!userData.email) return res.json({ message: "please provide a email" });

            userData.email = (userData?.email).trim().toLowerCase();

            // Check If email is register with any user via other platforms like facebook,google or email.

            const checkUserDetail = await User.find(
                { "userInfo.email_address": (userData.email).trim() },
                { userInfo: 1, userBasicInfo: 1, userStatus: 1, }
            );

            if (checkUserDetail?.length) {
                if (!checkUserDetail[0]?.userInfo?.password) {
                    return res.json({
                        status: 400,
                        message: `Incorrect password`,
                        Title: `Incorrect password`,
                    });
                }
                let passwordIsValid = bcrypt.compareSync(
                    userData?.password,
                    checkUserDetail[0].userInfo.password
                );

                if (passwordIsValid) {
                    // Update device information of user
                    try {
                        const updateDeviceInfo = await User.update({ _id: checkUserDetail[0]._id }, {

                            $set: {
                                "userStatus.userStatus": "Login",
                                "userStatus.userActionStatus": "Enable",
                                "userDateInfo.lastLoginDate": new Date(),
                            },
                        });

                        const email_address = checkUserDetail[0]?.userInfo?.email_address || null,
                            phone_number = checkUserDetail[0].userInfo.mobile_number?.phone_number || null,
                            is_active = checkUserDetail[0].userInfo.is_active;

                        const data = {
                            ...checkUserDetail[0].userInfo,
                            phone_number: checkUserDetail[0]?.userInfo?.mobile_number?.phone_number || null,
                            country_code: checkUserDetail[0]?.userInfo?.mobile_number?.country_code || null,
                            is_active: checkUserDetail[0]?.userInfo?.is_active
                        }

                        delete data["password"]
                        delete data["mobile_number"]

                        if (!is_active) {
                            if (phone_number && email_address) {

                                OTP.create({
                                    code: generateOTP(4),
                                    user: checkUserDetail[0]._id,
                                    for: 2

                                }).then((data) => {
                                    EmailOTPVerification(checkUserDetail[0]?.userInfo?.email_address, checkUserDetail[0]?.userInfo?.name, data.code)

                                }).catch((err) => {
                                    return failureJSONResponse(res, { message: `something went wrong` });
                                })

                                OTP.create({
                                    code: generateOTP(4),
                                    user: checkUserDetail[0]._id,
                                    for: 1

                                }).then((data) => {
                                    MobileNumberVerificationOTP(checkUserDetail[0]?.userInfo?.mobile_number?.phone_number, checkUserDetail[0]?.userInfo?.name, data.code)

                                }).catch((err) => {
                                    console.log(err)
                                    return failureJSONResponse(res, { message: `something went wrong` });
                                })

                                res.json({
                                    status: 205,
                                    data: data,
                                    message: `success`,
                                    token: createJWT(checkUserDetail[0]._id),
                                });

                            } else if (email_address) {

                                OTP.create({
                                    code: generateOTP(4),
                                    user: checkUserDetail[0]._id,
                                    for: 2

                                }).then((data) => {
                                    EmailOTPVerification(checkUserDetail[0]?.userInfo?.email_address, checkUserDetail[0]?.userInfo?.name, data.code)
                                }).catch((err) => {
                                    console.log(err)
                                    return failureJSONResponse(res, { message: `something went wrong!` });
                                })
                                res.json({
                                    status: 204,
                                    data: data,
                                    message: `success`,
                                    token: createJWT(checkUserDetail[0]._id),
                                });
                            }
                        } else {

                            res.json({
                                status: 200,
                                data: data,
                                message: `success`,
                                token: createJWT(checkUserDetail[0]._id),
                            });

                        }

                    } catch (Err) {
                        console.log(Err)
                    }

                } else {
                    res.json({
                        status: 401,
                        message: `Incorrect password`,
                    });
                }



            } else {
                res.json({
                    status: 404,
                    message: `email not registered`,
                });
            }
        } catch (err) {
            console.log(err)
            res.json({
                status: 400,
                message: `something went wrong!`,
            });
        }
    },

    verifiy_otps: async function (req, res, next) {

        const {
            otp_for_email,
            otp_for_mobile_number,
        } = req.body;

        if (otp_for_mobile_number) {

            OTP.findOne({
                code: otp_for_email,
                for: 2
            }).then((foundEmailOTP) => {

                let invalidOTP = 0

                if (!foundEmailOTP) {
                    invalidOTP = 1
                }

                OTP.findOne({
                    code: otp_for_mobile_number,
                    for: 1
                }).then((foundMobileOTP) => {

                    if (!foundMobileOTP) {
                        invalidOTP = 2
                    }

                    if (!foundEmailOTP && !foundMobileOTP) {
                        invalidOTP = 3
                    }

                    if (invalidOTP === 0) {

                        User.update({ _id: req.userId }, {
                            $set: {
                                "userInfo.is_active": true,
                            },
                        }).then((data) => {

                            if (data) {
                                return res.json({
                                    status: 200,
                                    invalidOTP,
                                    message: `success!`
                                })
                            } else {
                                return res.json({
                                    status: 400,
                                    invalidOTP,
                                    message: `something went wrong`
                                })
                            }

                        }).catch((err) => {
                            return res.json({
                                status: 400,
                                invalidOTP,
                                message: `Invalid OTP`
                            })
                        })
                    } else if (invalidOTP === 1) {
                        return res.json({
                            status: 200,
                            invalidOTP,
                            message: `success`
                        })
                    } else if (invalidOTP === 2) {
                        return res.json({
                            status: 200,
                            invalidOTP,
                            message: `success`
                        })
                    }

                    else if (invalidOTP === 3) {


                        return res.json({
                            status: 200,
                            invalidOTP,
                            message: `success`
                        })
                    }
                })


            })

        } else {

            OTP.findOne({
                code: otp_for_email
            }).then((foundOTP) => {


                if (foundOTP) {

                    User.update({ _id: req.userId }, {
                        $set: {
                            "userInfo.is_active": true,
                        },
                    }).then((data) => {

                        if (data) {
                            return res.json({
                                status: 200,
                                message: `success!`
                            })
                        } else {
                            return res.json({
                                status: 400,
                                message: `something went wrong`
                            })
                        }

                    }).catch((err) => {
                        return res.json({
                            status: 400,
                            message: `something went wrong`
                        })
                    })

                } else {
                    return res.json({
                        status: 400,
                        message: `Invalid OTP`
                    })
                }

            }).catch((err) => {
                res.json({
                    status: 400,
                    invalidOTP: null,
                    message: `something went wrong`
                })
            })
        }

    },


    forget_password: async function (req, res, next) {
        console.log(req.body)
        const email_address = req?.body?.email_address.toLowerCase();

        if (!email_address) return res.json({ status: 400, message: `Email not exist` });

        User.findOne({
            'userInfo.email_address': email_address,
        })
            .then((foundUser) => {

                if (foundUser) {

                    OTP.create({
                        code: generateOTP(4),
                        user: foundUser._id,
                        for: 1

                    }).then((data) => {
                        EmailOTPVerification(email_address, foundUser?.userInfo?.name, data.code)
                    })



                    return res.json({
                        status: 200,
                        userId: foundUser.userId,
                        message: `success`
                    })
                } else {
                    return res.json({
                        status: 400,
                        message: `Email Not Exists`
                    })
                }

            }).catch((err) => {
                return res.json({
                    status: 400,
                    message: `fail`
                })
            })
    },

    verify_forget_password_otp: async function (req, res, next) {
        const {
            otp
        } = req.body;

        if (!otp) {
            return res.json({
                status: 400,
                message: `Please enter valid otp`
            })
        }

        OTP.findOne({
            code: otp
        }).then((foundOTP) => {

            if (foundOTP) {
                return res.json({
                    status: 200,
                    userId: foundOTP.userId,
                    message: `success`
                })
            } else {
                return res.json({
                    status: 400,
                    message: `Please enter valid otp`
                })
            }

        }).catch((err) => {
            return res.json({
                status: 400,
                message: `Please enter valid otp`
            })
        })
    },


    update_password: async function (req, res, next) {
        let newPassword = req.body.newPassword;

        const email_address = req?.body?.email_address.toLowerCase();

        if (!newPassword) {
            return res.json({
                status: 400,
                message: `please provide password`
            })
        }

        if (!email_address) {
            return res.json({
                status: 400,
                message: `please provide email address`
            })
        }

        if (email_address && !isValidEmailAddress(email_address)) {
            return res.json({
                status: 400,
                message: `please provide email address`
            })
        }


        newPassword = bcrypt.hashSync(newPassword, 8);

        User.update({ "userInfo.email_address": email_address }, {
            $set: {
                "userInfo.password": newPassword,
            },
        }).then((data) => {

            if (data) {
                return res.json({
                    status: 200,
                    message: `success`
                })
            } else {
                return res.json({
                    status: 400,
                    message: `Something went wrong`
                })
            }

        }).catch((err) => {
            console.log(err)
            return res.json({
                status: 400,
                message: `fail`
            })
        })

    },


    country_code_lists: async function (req, res, next) {
        const country_code_list = [
            `+1`,
            `+92`,
            `+971`,
            `+86`
        ]
        return successJSONResponse(res, { message: `success`, countryCode: country_code_list });
    },

    check_email_already_exists: async function (req, res, next) {

        const dbQuery = { _id: { $ne: req.userId } };

        if (email_address) dbQuery[`userInfo.email_address`] = email_address.toLowerCase();

        User.findOne(dbQuery)
            .then(async (foundUser) => {
                if (foundUser) {
                    return failureJSONResponse(res, {
                        message: `Account with that ${email_address} already exists`
                    });
                } else {
                    return next()
                }

            }).catch((err) => {
                return failureJSONResponse(res, { message: `something went wrong` });
            })
    },

    update_profile: async function (req, res, next) {

        try {
            const userId = req.userId;

            const {
                name,
                date_of_birth,
                gender
            } = req.body;
            console.log(vali(Date(date_of_birth)))
            if (name && !isValidString(name)) return failureJSONResponse(res, { message: `Invalid Name` });
            // if (date_of_birth && !vali(date_of_birth)) return failureJSONResponse(res, { message: `Invalid Date Of Birth` });
            if (gender && isNaN(Number(gender))) return failureJSONResponse(res, { message: `Invalid Gender` });



            let profileDataObj = {};


            if (name) profileDataObj = {
                ...profileDataObj,
                'userInfo.name': name,
            };

            if (date_of_birth) profileDataObj = {
                ...profileDataObj,
                'userInfo.date_of_birth': Date(date_of_birth)
            };


            if (gender) profileDataObj = {
                ...profileDataObj,
                'userInfo.gender': gender,
            }

            if (req?.file?.path) {
                profileDataObj = {
                    ...profileDataObj,
                    'userBasicInfo.profile_image': req.file.path,
                }
            }

            var updatedProfileRes = await User.updateOne({ _id: userId }, { $set: profileDataObj }, { new: true });
            console.log(`updatedProfileRes`, updatedProfileRes)

            if (updatedProfileRes) {
                return successJSONResponse(res, {
                    message: `success`, data: {
                        name: name,
                        date_of_birth: date_of_birth,
                        gender: gender,
                        picture: req?.file?.path || null
                    }
                });
            } else {
                return failureJSONResponse(res, { message: `something went wrong` });
            }


        } catch (err) {
            console.log(err)
            return failureJSONResponse(res, { message: `something went wrong` });
        }

    },


    check_email_already_exists: async function (req, res, next) {

        try {
            const email_address = req?.body?.email_address?.toLowerCase();
            
            if (email_address && !isValidEmailAddress(email_address)) {
                return failureJSONResponse(res, { message: `please provide valid email` });
            }

            const dbQuery = { _id: { $ne: req.userId } };

            if (email_address) dbQuery[`userInfo.email_address`] = email_address;

            if (email_address) {
                User.findOne(dbQuery)
                    .then((foundUser) => {


                        console.log(`foundUser`, foundUser)
                        if (foundUser) {
                            return failureJSONResponse(res, {
                                message: `Account with that ${email_address} already exists`
                            }, statusCode = 409);
                        } else {
                            return next()
                        }

                    }).catch((err) => {
                        console.log(err)
                        return failureJSONResponse(res, { message: `something went wrong` });
                    })
            } else {
                return next()
            }
        } catch (err) {
            console.log(err)
            return failureJSONResponse(res, { message: `something went wrong` });
        }

    },

    // change email address 

    generate_otp_for_change_email_mobile: async function (req, res) {

        try {
            const userId = req.userId;

            const source = Math.abs(req?.body?.source),
                email_address = req?.body?.email_address?.toLowerCase(),
                phone_number = req?.body?.phone_number;

            if (!source) return failureJSONResponse(res, { message: `please provide soruce` });
            else if (source && isNaN(source)) return failureJSONResponse(res, { message: `please provide valid soruce ` });
            else if (source && (source < 1 || source > 2)) return failureJSONResponse(res, { message: `please provide source between 1-2` });

            if (Number(source) === Number(1)) {
                console.log(`working`)
                if (!phone_number) return failureJSONResponse(res, { message: `please provide phone number` });
                else if (!isValidIndianMobileNumber(phone_number)) return failureJSONResponse(res, { message: `please provide valid phone number` });

                OTP.create({
                    code: generateOTP(4),
                    phone_number: phone_number,
                    user: userId,
                    for: 1

                }).then((foundOTP) => {

                    if (!foundOTP) {
                        return failureJSONResponse(res, { message: `something went wrong` });
                    } else {
                        MobileNumberVerificationOTP(phone_number, `hi`, foundOTP?.code)
                        return successJSONResponse(res, { message: `success` });
                    }

                }).catch((err) => {
                    return failureJSONResponse(res, { message: `something went wrong` });
                })

            } else if (Number(source) === Number(2)) {
                if (!email_address) return failureJSONResponse(res, { message: `please provide email address` });
                else if (!isValidEmailAddress(email_address)) return failureJSONResponse(res, { message: `please provide valid phone number` });

                OTP.create({
                    code: generateOTP(4),
                    email_address: email_address.toLowerCase(),
                    user: userId,
                    for: 2

                }).then((foundOTP) => {
                    console.log(foundOTP)
                    if (!foundOTP) {
                        return failureJSONResponse(res, { message: `something went wrong` });

                    } else {
                        EmailOTPVerification(email_address, `Hi`, foundOTP?.code)
                        return successJSONResponse(res, { message: `success` });
                    }

                }).catch((err) => {
                    return failureJSONResponse(res, { message: `something went wrong` });
                })

            }
        } catch (err) {
            return failureJSONResponse(res, { message: `something went wrong` });
        }




    },

    update_email_or_phone_number: async function (req, res) {

        try {
            const userId = req.userId;

            const source = Math.abs(req?.body?.source),
                email_address = req?.body?.email_address?.toLowerCase(),
                otp = req?.body?.otp,
                phone_number = req?.body?.phone_number;



            if (!source) return failureJSONResponse(res, { message: `please provide soruce` });
            else if (source && isNaN(source)) return failureJSONResponse(res, { message: `please provide valid soruce ` });
            else if (source && (source < 1 || source > 2)) return failureJSONResponse(res, { message: `please provide sorurce between 1-2` });

            if (!otp) return failureJSONResponse(res, { message: `please provide otp` });

            if (Number(source) == Number(1)) {

                console.log(`working22qwqwq`)
                if (!phone_number) return failureJSONResponse(res, { message: `please provide phone number` });
                else if (!isValidIndianMobileNumber(phone_number)) return failureJSONResponse(res, { message: `please provide valid phone number` });


                OTP.findOne({
                    code: otp,
                    phone_number: phone_number,
                    for: 1
                }).then((foundOTP) => {

                    if (!foundOTP) {
                        return failureJSONResponse(res, { message: `Invalid OTP` });
                    } else if (foundOTP) {

                        User.updateOne(
                            { _id: userId },
                            { $set: { 'userInfo.mobile_number.phone_number': phone_number, } },
                            { new: true })
                            .then((updatedUser) => {

                                if (updatedUser) {
                                    return successJSONResponse(res, {
                                        message: `success`,
                                        data: { phone_number }
                                    });
                                } else {
                                    return failureJSONResponse(res, { message: `something went wrong` });
                                }

                            }).catch((err) => {
                                console.log(err)
                                return failureJSONResponse(res, { message: `something went wrong` });
                            })


                    }

                }).catch((err) => {
                    console.log(err)
                    return failureJSONResponse(res, { message: `something went wrong` });
                })


            } else if (Number(source) == Number(2)) {
                if (!email_address) return failureJSONResponse(res, { message: `please provide email address` });
                else if (!isValidEmailAddress(email_address)) return failureJSONResponse(res, { message: `please provide valid phone number` });



                OTP.findOne({
                    code: otp,
                    email_address: email_address.toLowerCase(),
                    for: 2
                }).then((foundOTP) => {

                    if (!foundOTP) {
                        return failureJSONResponse(res, { message: `Invalid OTP` });
                    } else if (foundOTP) {

                        User.updateOne(
                            { _id: userId },
                            { $set: { 'userInfo.email_address': email_address.toLowerCase(), } },
                            { new: true })
                            .then((updatedUser) => {
                                console.log(updatedUser)

                                if (updatedUser) {
                                    return successJSONResponse(res, {
                                        message: `success`,
                                        data: { email_address }
                                    });
                                } else {
                                    console.log(`working`)
                                    return failureJSONResponse(res, { message: `something went wrong` });
                                }

                            }).catch((err) => {
                                console.log(err)
                                return failureJSONResponse(res, { message: `something went wrong` });
                            })


                    }

                }).catch((err) => {
                    console.log(err)
                    return failureJSONResponse(res, { message: `something went wrong` });
                })

            }

        } catch (err) {
            console.log(err)
            return failureJSONResponse(res, { message: `something went wrong` });
        }

    },

    fetchProfileDetails: async function (req, res) {
        try {

            const userId = req.userId;

            if (!userId) return failureJSONResponse(res, { message: `please provide user id` });

            User.findById({ _id: userId })
                .select(`userInfo userBasicInfo`)
                .then((user) => {
                    if (!user) return failureJSONResponse(res, { message: `something went worng` });
                    else {

                        const data = {
                            name: user?.userInfo?.name || null,
                            email_address: user?.userInfo?.email_address || null,
                            phone_number: user?.userInfo?.mobile_number?.phone_number || null,
                            gender: user?.userInfo?.gender || null,
                            date_of_birth: user?.userInfo?.date_of_birth || null,
                            profile_image: user?.userBasicInfo?.profile_image || null,

                        }
                        return successJSONResponse(res, { user: data });
                    }
                }).catch((err) => {
                    return failureJSONResponse(res, { message: `please provide user id` });
                })
        } catch (error) {
            return failureJSONResponse(res, { message: `something went wrong` });
        }
    },

    logout: async function (req, res) {

        const deviceType = req?.body?.device_type,
            deviceToken = req?.body?.device_token;

        if (!isValidString(deviceToken.trim())) return failureJSONResponse(res, { message: `device token missing` });
        if (!(deviceType)) return failureJSONResponse(res, { message: `device type missing` });
        else if (isNaN(deviceType)) return failureJSONResponse(res, { message: `device type invalid;` });


        User.update({
            _id: req.userId,
        }, {
            $pull: {
                user_device_info: {
                    token: deviceToken,
                    device_type: Number(deviceType)
                },
            },
        },
            function (err, user) {
                if (err) {
                    return failureJSONResponse(res, { message: `something went wrong` });
                } else {
                    return successJSONResponse(res, { message: `logout successfully` });
                }
            }
        );
    }

}







