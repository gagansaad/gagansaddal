
const mongoose = require("mongoose"),
    User = mongoose.model("user"),
    OTP = mongoose.model("otp"),
    bcrypt = require("bcryptjs"),
    createJWT = require(`../../../utils/createJWT`),
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

        } catch (error) {
            console.log(error)
        }

    },

    // Standard signup with email.
    signup_with_email: async function (req, res) {
        try {
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
                    res.json({
                        status: 400,
                        invalidOTP: null,
                        message: `fail`
                    })
                }
            }
        } catch (err) {
            res.json({
                status: 400,
                invalidOTP: null,
                message: `fail`
            })
        }
    },
    // Standard login.
    login_with_email: async function (req, res) {
        console.log(`hjsdaghd`)
        try {


            // console.log(`req.body`, req.body)

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
                        country_code: checkUserDetail[0]?.userInfo?.mobile_number?.country_code || null,
                        is_active: checkUserDetail[0]?.userInfo?.is_active
                    }

                    delete data["password"]
                    delete data["mobile_number"]

                    if (!is_active) {
                        if (phone_number) {

                            OTP.create({
                                code: generateOTP(4),
                                user: checkUserDetail[0]._id,
                                for: 1

                            }).then((data) => {

                                MobileNumberVerificationOTP(checkUserDetail[0]?.userInfo?.mobile_number?.phone_number, checkUserDetail[0]?.userInfo?.name, data.code)
                            })

                            res.json({
                                status: 205,
                                data: data,
                                message: `success`,
                                token: createJWT(checkUserDetail[0]._id),
                            });

                        } else {

                            OTP.create({
                                code: generateOTP(4),
                                user: result._id,
                                for: 2

                            }).then((data) => {

                                EmailOTPVerification(checkUserDetail[0]?.userInfo?.email_address, checkUserDetail[0]?.userInfo?.name, data.code)
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
            res.json({
                status: 401,
                message: `something went wrong`,
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
                                    message: `fail`
                                })
                            }

                        }).catch((err) => {
                            return res.json({
                                status: 400,
                                invalidOTP,
                                message: `fail`
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

                console.log(`working2`)
                console.log(foundOTP)

                if (foundOTP) {

                    User.update({ _id: req.userId }, {
                        $set: {
                            "userInfo.is_active": true,
                        },
                    }).then((data) => {

                        if (data) {
                            return res.json({
                                status: 200,
                                invalidOTP: null,
                                message: `success!`
                            })
                        } else {
                            return res.json({
                                status: 400,
                                invalidOTP: null,
                                message: `fail`
                            })
                        }

                    }).catch((err) => {
                        return res.json({
                            status: 400,
                            invalidOTP,
                            message: `fail`
                        })
                    })

                } else {
                    return res.json({
                        status: 400,
                        invalidOTP: null,
                        message: `fail`
                    })
                }

            }).catch((err) => {
                res.json({
                    status: 400,
                    invalidOTP: null,
                    message: `fail`
                })
            })
        }

    },


    forget_password: async function (req, res, next) {
        console.log(req.body)
        const email_address = req?.body?.email_address;

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

        const email_address = req?.body?.email_address;

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
            `+91`,
            `+92`
        ]
        res.json({
            data: country_code_list
        })
    },

    check_email_already_exists: async function (req, res, next) {

        const dbQuery = { _id: { $ne: req.userId } };

        if (email_address) dbQuery[`userInfo.email_address`] = email_address;

        User.findOne(dbQuery)
            .then(async (foundUser) => {
                if (foundUser) {
                    return failureJSONResponse(res, {
                        message: `Account with that ${email_address} already exists`
                    });
                } else {
                    return next()
                }

            }).catch((err)=>{
                return failureJSONResponse(res, { message: `something went wrong` }); 
            })
    },


    update_profile: async function (req, res) {


        try {
            const userId = req.userId;

            const {
                name,
                date_of_birth,
                gender
            } = req.body;

            if (name && !isValidString(name)) return failureJSONResponse(res, { message: `Invalid Name` });
            // if (date_of_birth && !isValidDate(date_of_birth)) return failureJSONResponse(res, { message: `Invalid Date Of Birth` });
            if (gender && isNaN(Number(gender))) return failureJSONResponse(res, { message: `Invalid Gender` });



            let profileDataObj = {};


            if (name) profileDataObj = {
                ...profileDataObj,
                'userInfo.name': name,
            };

            if (date_of_birth) profileDataObj = {
                ...profileDataObj,
                'userInfo.date_of_birth': new Date(),
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


            var updatedProfileRes = await User.updateOne({ _id: userId }, { $set: profileDataObj });

            if (updatedProfileRes) {
                return successJSONResponse(res, {
                    message: `success`,
                });
            } else {
                return failureJSONResponse(res, { message: `something went wrong` });
            }


        } catch (err) {
            return failureJSONResponse(res, { message: `something went wrong` });
        }

    },


    // change email address 

    generate_otp_for_chnage_email_mobile: async function (req, res) {
        const userId = req.userId;

        const source = req?.body?.source,
            email_address = req?.body?.email_address,
            phone_number = req?.body?.phone_number;

        if (!source) return failureJSONResponse(res, { message: `something went wrong` });

        if (source === Number(1)){
            if (!email_address) return failureJSONResponse(res, { message: `please provide email address` });
            else if (!isValidEmailAddress(email_address)) return failureJSONResponse(res, { message: `please provide valid email address` });

            OTP.create({
                code: generateOTP(4),
                user: userId,
                for: 2

            }).then((foundOTP) => {

                if (!foundOTP){
                    return failureJSONResponse(res, { message: `something went wrong` });
                } else {
                    MobileNumberVerificationOTP(phone_number, result?.userInfo?.name, data.code)
                    return successJSONResponse(res, { message: `success` });
                }

            })

        } else if (source === Number(2)){
            if (!phone_number) return failureJSONResponse(res, { message: `something went wrong` });
            else if (!isValidEmailAddress(email_address)) return failureJSONResponse(res, { message: `please provide valid phone number` });

            OTP.create({
                code: generateOTP(4),
                user: userId,
                for: 2

            }).then((data) => {
                EmailOTPVerification(result?.userInfo?.mobile_number?.phone_number, result?.userInfo?.name, data.code)
            })

        }

       
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







