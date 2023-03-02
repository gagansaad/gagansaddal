
const mongoose = require("mongoose"),
    User = mongoose.model("user"),
    OTP = mongoose.model("otp"),
    bcrypt = require("bcryptjs"),
    createJWT = require(`../../../utils/createJWT`),
    { generateOTP } = require(`../../../utils/generateOTP`)
ObjectId = require("mongodb").ObjectID;

const { EmailOTPVerification } = require(`../../../resources/sendEmailFunction`);
const { MobileNumberVerificationOTP } = require(`../../../resources/sendOTPFunction`);
const {
    isValidString,
    isValidEmailAddress,
    isValidIndianMobileNumber
} = require(`../../../utils/validators`);

module.exports = {

    validate_signup_data: async function (req, res, next) {

        const {
            email,
            password,
            name,
            phone_number,
            device_token,
            device_type,
        } = req.body;

        console.log(req.body)

        const missingData = [],
            invalidData = [];

        if (!isValidString(name)) missingData.push(`name`);
        if (!isValidString(password)) missingData.push(`password`);

        if (!isValidString(device_token)) missingData.push(`device token`);
        if (!(device_type)) missingData.push(`device type`);
        else if (isNaN(device_type)) invalidData.push(`device type`);

        if (!isValidString(email)) missingData.push(`email address`);
        else if (email && !isValidEmailAddress(email)) invalidData.push(`email address`);

        if (phone_number && !isValidIndianMobileNumber(phone_number)) invalidData.push(`phone number`);

        if (missingData.length || invalidData.length) {
            const data = {};

            if (missingData.length) data.missing = missingData;
            if (invalidData.length) data.invalid = invalidData;

            return res.json({
                status: 400,
                message: `Some data is missing/invalid`
            });
        } else {
            return next();
        }

    },

    // Standard signup with email.
    signup_with_email: async function (req, res) {
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
                    message: `email aready exist`
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
                    name: newUser.name,
                    is_active: false,
                    password: newUser.password,
                    email_address: newUser.email,
                    mobile_number: {
                        country_code: 91,
                        phone_number: newUser.phone_number
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

                        OTP.create({
                            code: generateOTP(6),
                            user: result._id,
                            for: 1

                        }).then((data) => {
                            console.log(data)
                            MobileNumberVerificationOTP(result?.userInfo?.email_address, result?.userInfo?.name, data.code)
                        })

                        // MobileNumberVerificationOTP(result?.userInfo?.mobile_number?.phone_number, result?.userInfo?.name)
                        // EmailOTPVerification(result?.userInfo?.email_address, result?.userInfo?.name)
                    }
                });
            } catch (err) {
                console.log(err);
            }
        }
    },
    // Standard login.
    login_with_email: async function (req, res) {
        console.log(`hjsdaghd`)
        try{

        

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
                    status: 400,
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

                const email_address = checkUserDetail[0]?.userInfo?.email_address || null,
                    phone_number = checkUserDetail[0].userInfo.mobile_number?.phone_number || null,
                    is_active = checkUserDetail[0].userInfo.is_active;

                const data = {
                    ...checkUserDetail[0].userInfo,
                    phone_number: checkUserDetail[0]?.userInfo?.mobile_number?.phone_number || null,
                    country_code:  checkUserDetail[0]?.userInfo?.mobile_number?.country_code || null,
                    is_active: checkUserDetail[0]?.userInfo?.is_active
                }

                delete data["password"]

                if (!is_active) {
                    if (phone_number) {

                        res.json({
                            status: 205,
                            data: data,
                            message: `success`,
                            token: createJWT(checkUserDetail[0]._id),
                        });

                    } else  {
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
    }catch(err){
        console.log(err)
    }
    },

    verifiy_otps: async function (req, res, next) {

        const {
            otp_for_email,
            otp_for_mobile_number,
            userId
        } = req.body;

        if (otp_for_mobile_number) {

            OTP.find({
                user: userId,
                code: otp_for_email
            }).then((foundEmailOTP) => {

                let invalidOTP = 0

                if (!foundEmailOTP) {
                    invalidOTP = 1
                }

                OTP.find({
                    user: userId,
                    code: otp_for_email
                }).then((foundMobileOTP) => {

                    if (!foundMobileOTP) {
                        invalidOTP = 2
                    }

                    if (!(foundEmailOTP && foundMobileOTP)) {
                        invalidOTP = 3
                    }

                    if (invalidOTP === 0) {
                        res.json({
                            status: 200,
                            invalidOTP,
                            message: `success`
                        })
                    } else if (invalidOTP === 1) {
                        res.json({
                            status: 204,
                            invalidOTP,
                            message: `success`
                        })
                    } else if (invalidOTP === 2) {
                        res.json({
                            status: 205,
                            invalidOTP,
                            message: `success`
                        })
                    } 

                    else if (invalidOTP === 3) {
                        res.json({
                            status: 206,
                            invalidOTP,
                            message: `success`
                        })
                    } 
                })


            })

        } else {
            OTP.find({
                user: userId,
                code: otp_for_email
            }).then((foundOTP) => {
                res.json({
                    status: 200,
                    invalidOTP: 0,
                    message: `success`
                })
            })
        }

    },


    forget_password: async function(req,res,next){
        const email_address = req?.body?.email_address;

        if(!email_address) return res.json({status:400, message: `Email not exist`});

        User.find({ 'userInfo.email_address': email_address})
        .then((foundUser)=>{
            res.json({
                status: 200,
                message: `success`
            })
        }).catch((err)=>{
            res.json({
                status: 400,
                message: `fail`
            })
        })
    },

    // verify_forget_password_otp: async function (req,res,next)=>{

    // }


    country_code_lists: async function (req, res, next) {
        const country_code_list = [
            `+91`,
            `+92`
        ]
        res.json({
            data: country_code_list
        })
    }

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







