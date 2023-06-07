const mongoose = require("mongoose"),
  User = mongoose.model("user"),
  OTP = mongoose.model("otp"),
  bcrypt = require("bcryptjs"),
  Notification = require("../../../resources/notification");
(createJWT = require(`../../../utils/createJWT`)),
  (alertMessage = require(`../../../utils/alertMessage`)),
  ({ generateOTP } = require(`../../../utils/generateOTP`)),
  (ObjectId = require("mongodb").ObjectID);

const { errorMonitor } = require("connect-mongo");
const {
  EmailOTPVerification,
  WelcomeEmail,
  AccountDeleteEmail,
  PasswordChange,
} = require(`../../../resources/sendEmailFunction`);
const {
    MobileNumberVerificationOTP,
  } = require(`../../../resources/sendOTPFunction`),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`);
const {
  MobileNumberVerificationOTPByUserId,
} = require(`../../../resources/sendOTPFunction`);
const {
  isValidString,
  isValidDate,
  isValidEmailAddress,
  isValidIndianMobileNumber,
} = require(`../../../utils/validators`);

module.exports = {
  validate_signup_data: async function (req, res, next) {
    try {
      const { email, password, name, phone_number, device_token, device_type } =
        req.body;

      if (!isValidString(name.trim()))
        return failureJSONResponse(res, { message: `Please provide name` });
      if (!isValidString(password.trim()))
        return failureJSONResponse(res, { message: `Please provide name` });

      if (!isValidString(device_token.trim()))
        return failureJSONResponse(res, {
          message: `Please provide device token`,
        });
      if (!device_type)
        return failureJSONResponse(res, {
          message: `Please provide device type`,
        });
      else if (isNaN(device_type))
        return failureJSONResponse(res, {
          message: `Please provide valid device type`,
        });

      if (!isValidString(email.trim()))
        return failureJSONResponse(res, {
          message: `Please provide email address`,
        });
      else if (email.trim() && !isValidEmailAddress(email.trim()))
        return failureJSONResponse(res, {
          message: `Please provide valid email address`,
        });

      return next();
    } catch (error) {
      console.log(error);
    }
  },

  // Standard signup with email.
  signup_with_email: async function (req, res) {
    try {
      var newUser = req.body;
      console.log(newUser, "eh haigi aa body");
      newUser.email = newUser.email.trim().toLowerCase();

      // Check If email is register with any user via other platforms like facebook,google or email.

      const checkUserEmail = await User.find(
        { "userInfo.email_address": newUser.email.trim() },
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
            message: alertMessage.emailAccountExist,
          });
        }
      } else {
        try {
          var newUserDetail = {};

          newUser.password = bcrypt.hashSync(newUser.password, 8);

          newUserDetail.user_status = {
            user_action_Status: 1,
          };

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
              phone_number: newUser?.phone_number,
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
              console.log(err);
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
                  source: result?.userBasicInfo?.source || null,
                  email_address: result?.userInfo?.email_address || null,
                  phone_number:
                    result?.userInfo?.mobile_number?.phone_number || null,
                  is_active: result.userInfo.is_active,
                },
                message: `User register successfully`,
                token: createJWT(result._id),
              });

              if (result?.userInfo?.mobile_number?.phone_number) {
                MobileNumberVerificationOTPByUserId(result._id, null);
                console.log(`kjasjhkasdgasjgd`);
                // OTP.create({
                //     code: generateOTP(4),
                //     user: result._id,
                //     for: 1

                // }).then((data) => {
                //     console.log(data)
                //     MobileNumberVerificationOTP(result?.userInfo?.mobile_number?.phone_number, result?.userInfo?.name, data.code)
                // })
              }

              if (result?.userInfo?.email_address) {
                OTP.create({
                  is_active: true,
                  code: generateOTP(4),
                  user: result._id,
                  used_for: 2,
                  email_address:
                    (result?.userInfo?.email_address).toLowerCase(),
                  for: 2,
                }).then((data) => {
                  console.log(data);
                  EmailOTPVerification(
                    result?.userInfo?.email_address,
                    result?.userInfo?.name,
                    data.code
                  );
                });
              }
            }
          });
        } catch (err) {
          return failureJSONResponse(res, { message: `something went wrog` });
        }
      }
    } catch (err) {
      return failureJSONResponse(res, { message: `something went wrog` });
    }
  },

  // Standard signup with Google.
  login_signup_with_google: async function (req, res) {
    console.log(req.body);

    const emailAddress = req?.body?.email_address,
      name = req?.body?.name,
      deviceType = req?.body?.device_type,
      googleId = req?.body?.google_id,
      googleToken = req?.body?.google_token,
      deviceToken = req?.body?.device_token;

    if (!isValidString(name.trim()))
      return failureJSONResponse(res, { message: `Please enter valid name` });
    if (!isValidString(googleId.trim()))
      return failureJSONResponse(res, { message: `google id missing` });
    if (!isValidString(googleToken.trim()))
      return failureJSONResponse(res, { message: `google token missing` });

    if (!isValidString(deviceToken.trim()))
      return failureJSONResponse(res, { message: `device token missing` });
    if (!deviceType)
      return failureJSONResponse(res, { message: `device type missing` });
    else if (isNaN(deviceType))
      return failureJSONResponse(res, { message: `device type invalid;` });

    if (!isValidString(emailAddress.trim()))
      return failureJSONResponse(res, {
        message: `Please enter email address`,
      });
    else if (emailAddress.trim() && !isValidEmailAddress(emailAddress.trim()))
      return failureJSONResponse(res, {
        message: `Please enter valid email address`,
      });

    // Check If email is register with any user via other platforms like facebook,google or email.

    const foundUser = await User.findOne(
      { "userGoogleInfo.googleId": googleId },
      {
        _id: 1,
        userBasicInfo: 1,
        userStatus: 1,
        userInfo: 1,
        userDateInfo: 1,
      }
    );

    if (foundUser && Object.keys(foundUser).length) {
      console.log(`case 1`);

      const updateDeviceInfo = await User.update(
        { _id: foundUser._id },
        {
          $addToSet: {
            user_device_info: {
              token: deviceToken,
              device_type: Number(deviceType),
            },
          },
          $set: {
            "user_status.user_action_Status": Number(2),
            "user_status.lastLoginDate": new Date(),
          },
        }
      );

      return successJSONResponse(res, {
        status: 200,
        data: {
          userId: foundUser._id,
          source: foundUser?.userBasicInfo.source || null,
          name: foundUser?.userInfo?.name || null,
          email_address: foundUser?.userInfo?.email_address || null,
          phone_number:
            foundUser?.userInfo?.mobile_number?.phone_number || null,
          is_active: foundUser?.userInfo?.is_active,
        },
        message: `success`,
        token: createJWT(foundUser._id),
      });
    } else {
      const foundUserWithEmailAddress = await User.findOne(
        {
          "userInfo.email_address": emailAddress.toLowerCase(),
          "userGoogleInfo.googleId": null,
          "user_status.user_action_Status": 2,
        },
        {
          userBasicInfo: 1,
          _id: 1,
          userStatus: 1,
          userInfo: 1,
          userDateInfo: 1,
        }
      );

      if (
        foundUserWithEmailAddress &&
        Object.keys(foundUserWithEmailAddress).length
      ) {
        console.log(`case2 `);

        const updateDeviceInfo = await dbSchema.User.update(
          { _id: foundUserWithEmailAddress._id },
          {
            $set: {
              "userGoogleInfo.googleId": googleId,
              "userGoogleInfo.googleEmail": emailAddress.toLowerCase(),
              "userGoogleInfo.googleToken": googleToken,

              user_device_info: {
                token: deviceToken,
                device_type: Numbe(deviceType),
              },
            },
            $set: {
              "user_status.userActionStatus": 2,
            },
          }
        );

        return successJSONResponse(res, {
          status: 200,
          data: {
            userId: foundUserWithEmailAddress._id,
            source: foundUserWithEmailAddress?.userBasicInfo.source || null,
            name: foundUserWithEmailAddress.userInfo.name || null,
            email_address:
              foundUserWithEmailAddress?.userInfo?.email_address || null,
            phone_number:
              foundUserWithEmailAddress?.userInfo?.mobile_number
                ?.phone_number || null,
            is_active: foundUserWithEmailAddress?.userInfo?.is_active,
          },
          message: `success`,
          token: createJWT(foundUserWithEmailAddress._id),
        });
      } else {
        console.log(`case3`);

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
            if (result?.userInfo?.email_address) {
              WelcomeEmail(
                result?.userInfo?.email_address,
                result?.userInfo?.name
              );
            }

            return res.json({
              status: 201,
              data: {
                userId: result._id,
                name: result.userInfo.name || null,
                source: result?.userBasicInfo.source || null,
                email_address: result?.userInfo?.email_address || null,
                phone_number:
                  result?.userInfo?.mobile_number?.phone_number || null,
                is_active: result?.userInfo?.is_active,
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
    const emailAddress = req?.body?.email_address,
      name = (req?.body?.name).trim(),
      deviceType = req?.body?.device_type,
      facebookId = req?.body?.facebook_id,
      facebookToken = req?.body?.facebook_token,
      deviceToken = req?.body?.device_token;

    if (!isValidString(name.trim()))
      return failureJSONResponse(res, { message: `Please enter valid name` });
    if (!isValidString(facebookId.trim()))
      return failureJSONResponse(res, { message: `facebook id missing` });
    if (!isValidString(facebookToken.trim()))
      return failureJSONResponse(res, { message: `facebook token missing` });

    if (!isValidString(deviceToken.trim()))
      return failureJSONResponse(res, { message: `device token missing` });
    if (!deviceType)
      return failureJSONResponse(res, { message: `device type missing` });
    else if (isNaN(deviceType))
      return failureJSONResponse(res, { message: `device type invalid;` });

    if (!isValidString(emailAddress.trim()))
      return failureJSONResponse(res, {
        message: `Please enter email address`,
      });
    else if (emailAddress.trim() && !isValidEmailAddress(emailAddress.trim()))
      return failureJSONResponse(res, {
        message: `Please enter valid email address`,
      });

    // Check If email is register with any user via other platforms like facebook,google or email.

    const foundUser = await User.findOne(
      { "userGoogleInfo.googleId": facebookId },
      {
        _id: 1,
        userBasicInfo: 1,
        userStatus: 1,
        userInfo: 1,
        userDateInfo: 1,
      }
    );

    if (foundUser && Object.keys(foundUser).length) {
      console.log(`case 1`);

      const updateDeviceInfo = await User.update(
        { _id: foundUser._id },
        {
          $addToSet: {
            user_device_info: {
              token: deviceToken,
              device_type: Number(deviceType),
            },
          },
          $set: {
            "user_status.user_action_Status": Number(2),
            "user_status.lastLoginDate": new Date(),
          },
        }
      );

      return successJSONResponse(res, {
        status: 200,
        data: {
          userId: foundUser._id,
          source: foundUser?.userBasicInfo?.source || null,
          name: foundUser?.userInfo?.name || null,
          email_address: foundUser?.userInfo?.email_address || null,
          phone_number:
            foundUser?.userInfo?.mobile_number?.phone_number || null,
          is_active: foundUser?.userInfo?.is_active,
        },
        message: `success`,
        token: createJWT(foundUser._id),
      });
    } else {
      console.log(`dvnavsndvsah`);

      const foundUserWithEmailAddress = await User.findOne(
        {
          "userInfo.email_address": emailAddress.toLowerCase(),
          "userGoogleInfo.facebookId": null,
          "user_status.user_action_Status": 2,
        },
        {
          userBasicInfo: 1,
          _id: 1,
          userStatus: 1,
          userInfo: 1,
          userDateInfo: 1,
        }
      );

      if (
        foundUserWithEmailAddress &&
        Object.keys(foundUserWithEmailAddress).length
      ) {
        console.log(`case2 `);

        const updateDeviceInfo = User.update(
          { _id: foundUserWithEmailAddress._id },
          {
            $addToSet: {
              "userGoogleInfo.facebookId": facebookId,
              "userGoogleInfo.googleEmail": emailAddress.toLowerCase(),
              "userGoogleInfo.googleToken": facebookToken,

              user_device_info: {
                token: deviceToken,
                device_type: Number(deviceType),
              },
            },
            $set: {
              "user_status.userActionStatus": 2,
            },
          }
        );

        return successJSONResponse(res, {
          status: 200,
          data: {
            userId: foundUserWithEmailAddress._id,
            source: foundUserWithEmailAddress?.userBasicInfo?.source || null,
            name: foundUserWithEmailAddress.userInfo.name || null,
            email_address:
              foundUserWithEmailAddress?.userInfo?.email_address || null,
            phone_number:
              foundUserWithEmailAddress?.userInfo?.mobile_number
                ?.phone_number || null,
            is_active: foundUserWithEmailAddress?.userInfo?.is_active,
          },
          message: `success`,
          token: createJWT(foundUserWithEmailAddress._id),
        });
      } else {
        console.log(`case3`);

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
        newUserDetail.userFacebookInfo = userGoogleInfo;
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
            if (result?.userInfo?.email_address) {
              WelcomeEmail(
                result?.userInfo?.email_address,
                result?.userInfo?.name
              );
            }
            return res.json({
              status: 201,
              data: {
                userId: result._id,
                name: result.userInfo.name || null,
                source: result?.userBasicInfo?.source || null,
                email_address: result?.userInfo?.email_address || null,
                phone_number:
                  result?.userInfo?.mobile_number?.phone_number || null,
                is_active: result?.userInfo?.is_active,
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
      name = req?.body?.name || ``,
      deviceType = req?.body?.device_type,
      appleId = req?.body?.apple_id,
      appleToken = req?.body?.apple_token,
      deviceToken = req?.body?.device_token;

    console.log(`req.body`, req.body);

    // if (!isValidString(name.trim())) return failureJSONResponse(res, { message: `Please enter valid name` });
    if (!isValidString(appleId.trim()))
      return failureJSONResponse(res, { message: `apple id missing` });
    if (!isValidString(appleToken.trim()))
      return failureJSONResponse(res, { message: `apple token missing` });

    if (!isValidString(deviceToken.trim()))
      return failureJSONResponse(res, { message: `device token missing` });
    if (!deviceType)
      return failureJSONResponse(res, { message: `device type missing` });
    else if (isNaN(deviceType))
      return failureJSONResponse(res, { message: `device type invalid;` });

    if (!isValidString(emailAddress.trim()))
      return failureJSONResponse(res, {
        message: `Please enter email address`,
      });
    else if (emailAddress.trim() && !isValidEmailAddress(emailAddress.trim()))
      return failureJSONResponse(res, {
        message: `Please enter valid email address`,
      });

    // Check If email is register with any user via other platforms like facebook,google or email.

    const foundUser = await User.findOne(
      { "userAppleInfo.appleId": appleId },
      {
        _id: 1,
        userBasicInfo: 1,
        userStatus: 1,
        userInfo: 1,
        userDateInfo: 1,
      }
    );

    if (foundUser && Object.keys(foundUser).length) {
      console.log(`case 1`);

      const updateDeviceInfo = await User.update(
        { _id: foundUser._id },
        {
          $addToSet: {
            user_device_info: {
              token: deviceToken,
              device_type: Number(deviceType),
            },
          },
          $set: {
            "user_status.user_action_Status": Number(2),
            "user_status.lastLoginDate": new Date(),
          },
        }
      );

      return successJSONResponse(res, {
        status: 200,
        data: {
          userId: foundUser._id,
          source: foundUser?.userBasicInfo?.source || null,
          name: foundUser?.userInfo?.name || null,
          email_address: foundUser?.userInfo?.email_address || null,
          phone_number:
            foundUser?.userInfo?.mobile_number?.phone_number || null,
          is_active: foundUser?.userInfo?.is_active,
        },
        message: `success`,
        token: createJWT(foundUser._id),
      });
    } else {
      const foundUserWithEmailAddress = await User.findOne(
        {
          "userInfo.email_address": emailAddress.toLowerCase(),
          "userGoogleInfo.appleId": null,
          "user_status.user_action_Status": 2,
        },
        {
          userBasicInfo: 1,
          _id: 1,
          userStatus: 1,
          userInfo: 1,
          userDateInfo: 1,
        }
      );

      if (
        foundUserWithEmailAddress &&
        Object.keys(foundUserWithEmailAddress).length
      ) {
        console.log(`case2 `);

        const updateDeviceInfo = await User.update(
          { _id: foundUserWithEmailAddress._id },
          {
            $set: {
              "userAppleInfo.appleId": appleId,
              "userAppleInfo.appleId": emailAddress.toLowerCase(),
              "userAppleInfo.appleToken": appleToken,

              user_device_info: {
                token: deviceToken,
                device_type: Number(deviceType),
              },
            },
            $set: {
              "user_status.userActionStatus": 2,
            },
          }
        );

        return successJSONResponse(res, {
          status: 200,
          data: {
            userId: foundUserWithEmailAddress._id,
            source: foundUserWithEmailAddress?.userBasicInfo?.source || null,
            name: foundUserWithEmailAddress.userInfo.name || null,
            email_address:
              foundUserWithEmailAddress?.userInfo?.email_address || null,
            phone_number:
              foundUserWithEmailAddress?.userInfo?.mobile_number
                ?.phone_number || null,
            is_active: foundUserWithEmailAddress?.userInfo?.is_active,
          },
          message: `success`,
          token: createJWT(foundUserWithEmailAddress._id),
        });
      } else {
        console.log(`case3`);

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
            if (result?.userInfo?.email_address) {
              WelcomeEmail(
                result?.userInfo?.email_address,
                result?.userInfo?.name
              );
            }

            return res.json({
              status: 201,
              data: {
                userId: result._id,
                source: result?.userBasicInfo?.source || null,
                name: result.userInfo.name || null,
                email_address: result?.userInfo?.email_address || null,
                phone_number:
                  result?.userInfo?.mobile_number?.phone_number || null,
                is_active: result?.userInfo?.is_active,
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
    // Notification.sendNotifications(['642e738ce74d24affcccf8d9','642e9194c77cfa7d49482241','642ea8aa723c7bc5459036b1'], 'welcome', 'menehariya user', {
    //   model: 'post',
    //   model_id: '86798767987987687',
    // });
    try {
      var userData = req.body;
      if (!userData.email)
        return res.json({ message: "please provide a email address" });

      userData.email = (userData?.email).trim().toLowerCase();

      // Check If email is register with any user via other platforms like facebook,google or email.

      const checkUserDetail = await User.find(
        { "userInfo.email_address": userData.email.trim() },
        { userInfo: 1, userBasicInfo: 1, userStatus: 1 }
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
            const updateDeviceInfo = await User.update(
              { _id: checkUserDetail[0]._id },
              {
                $addToSet: {
                  user_device_info: {
                    token: userData.device_token,
                    device_type: Number(userData.device_type),
                  },
                },
                $set: {
                  "userStatus.userStatus": "Login",
                  "userStatus.userActionStatus": "Enable",
                  "userDateInfo.lastLoginDate": new Date(),
                },
              }
            );

            const email_address =
                checkUserDetail[0]?.userInfo?.email_address || null,
              phone_number =
                checkUserDetail[0].userInfo.mobile_number?.phone_number || null,
              is_active = checkUserDetail[0].userInfo.is_active;

            const data = {
              ...checkUserDetail[0].userInfo,
              phone_number:
                checkUserDetail[0]?.userInfo?.mobile_number?.phone_number ||
                null,
              source: checkUserDetail[0]?.userBasicInfo?.source || null,
              country_code:
                checkUserDetail[0]?.userInfo?.mobile_number?.country_code ||
                null,
              is_active: checkUserDetail[0]?.userInfo?.is_active,
            };

            delete data["password"];
            delete data["mobile_number"];

            if (!is_active) {
              if (phone_number && email_address) {
                console.log(`sjdfhkjdshfkjs sdkjbfdshbfsd `);
                OTP.create({
                  is_active: true,
                  code: generateOTP(4),
                  used_for: 2,
                  user: checkUserDetail[0]._id,
                  email_address: email_address.toLowerCase(),
                  for: 2,
                })
                  .then((data) => {
                    EmailOTPVerification(
                      checkUserDetail[0]?.userInfo?.email_address,
                      checkUserDetail[0]?.userInfo?.name,
                      data.code
                    );

                    MobileNumberVerificationOTPByUserId(
                      checkUserDetail[0]._id,
                      null
                    );

                    return res.json({
                      status: 205,
                      data: data,
                      message: `A new OTP has successfully sent out to your phone number`,
                      token: createJWT(checkUserDetail[0]._id),
                    });
                  })
                  .catch((err) => {
                    console.log(err);
                    return failureJSONResponse(res, {
                      message: `something went wrong`,
                    });
                  });

                // OTP.create({
                //     code: generateOTP(4),
                //     user: checkUserDetail[0]._id,
                //     for: 1

                // }).then((data) => {
                //     MobileNumberVerificationOTP(checkUserDetail[0]?.userInfo?.mobile_number?.phone_number, checkUserDetail[0]?.userInfo?.name, data.code)

                // }).catch((err) => {
                //     console.log(err)
                //     return failureJSONResponse(res, { message: `something went wrong` });
                // })
              } else if (email_address) {
                OTP.create({
                  is_active: true,
                  code: generateOTP(4),
                  user: checkUserDetail[0]._id,
                  used_for: 2,
                  email_address: email_address.toLowerCase(),
                  for: 2,
                })
                  .then((data) => {
                    EmailOTPVerification(
                      checkUserDetail[0]?.userInfo?.email_address,
                      checkUserDetail[0]?.userInfo?.name,
                      data.code
                    );
                  })
                  .catch((err) => {
                    console.log(err);
                    return failureJSONResponse(res, {
                      message: `something went wrong!`,
                    });
                  });
                return res.json({
                  status: 204,
                  data: data,
                  message: `success`,
                  token: createJWT(checkUserDetail[0]._id),
                });
              }
            } else {
              return res.json({
                status: 200,
                data: data,
                message: `success`,
                token: createJWT(checkUserDetail[0]._id),
              });
            }
          } catch (Err) {
            console.log(Err);
          }
        } else {
          return res.json({
            status: 401,
            message: `Incorrect password`,
          });
        }
      } else {
        return res.json({
          status: 404,
          message: `Email address not registered`,
        });
      }
    } catch (err) {
      console.log(err);
      return res.json({
        status: 400,
        message: `something went wrong!`,
      });
    }
  },

  verifiy_otps: async function (req, res, next) {
    const { otp_for_email, otp_for_new_email, otp_for_mobile_number } =
      req.body;

    if (otp_for_mobile_number && otp_for_email) {
      OTP.findOne({
        $and: [
          { is_active: true },
          { user: req.userId },
          { used_for: 2 },
          { code: otp_for_email },
          { for: 2 },
        ],

        // is_active: true,
        // user: req.userId,
        // code: otp_for_email,
        // for: 2,
      }).then((foundEmailOTP) => {
        let invalidOTP = 0;

        if (!foundEmailOTP) {
          invalidOTP = 1;
        }

        OTP.findOne({
          user: req.userId,
          used_for: 2,
          code: otp_for_mobile_number,
          for: 1,
        }).then(async (foundMobileOTP) => {
          if(foundMobileOTP){
            invalidOTP = 0;
          }
          if (!foundMobileOTP) {
            invalidOTP = 2;
          }

          if (!foundEmailOTP && !foundMobileOTP) {
            invalidOTP = 3;
          }

          if (invalidOTP === 0) {
          let success = await OTP.deleteMany({
              _id: { $in: [foundMobileOTP._id, foundEmailOTP._id] },
            });
            if(success){
              console.log(success,"done");
            }
            User.updateOne(
              { _id: req.userId },
              {
                $set: {
                  "userInfo.is_active": true,
                  "userInfo.mobile_number.is_verified": true,
                  "userInfo.is_verified_email": true,
                },
              }
            )
              .then(async (data) => {
                if (data) {
                  let foundUser = await User.findById(
                    { _id: req.userId },
                    { userInfo: 1 }
                  );

                  if (foundUser && Object.keys(foundUser).length) {
                    WelcomeEmail(
                      foundUser.userInfo.email_address,
                      foundUser.userInfo.name
                    );
                  }

                  return res.json({
                    status: 200,
                    invalidOTP,
                    message: `success!`,
                  });
                } else {
                  return res.json({
                    status: 400,
                    invalidOTP,
                    message: `something went wrong`,
                  });
                }
              })
              .catch((err) => {
                return res.json({
                  status: 400,
                  invalidOTP,
                  message: `Invalid OTP`,
                });
              });
          } else if (invalidOTP === 1) {
            return res.json({
              status: 200,
              invalidOTP,
              message: `success`,
            });
          } else if (invalidOTP === 2) {
            return res.json({
              status: 200,
              invalidOTP,
              message: `success`,
            });
          } else if (invalidOTP === 3) {
            return res.json({
              status: 200,
              invalidOTP,
              message: `success`,
            });
          }
        });
      });
    } else {
      OTP.findOne({
        $and: [
          { is_active: true },
          { user: req.userId },
          { used_for: 2 },
          { code: otp_for_email },
          { for: 2 },
        ],
        // is_active: true,
        // user: req.userId,
        // code: otp_for_email,
        // source: 2
      })
        .then(async (foundOTP) => {
          if (foundOTP) {
            console.log("object",foundOTP);
            await OTP.findByIdAndDelete({ _id: foundOTP._id });

            User.updateOne(
              { _id: req.userId },
              {
                $set: {
                  "userInfo.is_active": true,
                  "userInfo.is_verified_email": true,
                },
              }
            )
              .then(async (data) => {
                if (data) {
                  let foundUser = await User.findById(
                    { _id: req.userId },
                    { userInfo: 1 }
                  );

                  if (foundUser && Object.keys(foundUser).length) {
                    WelcomeEmail(
                      foundUser.userInfo.email_address,
                      foundUser.userInfo.name
                    );
                  }

                  return res.json({
                    status: 200,
                    invalidOTP: 0,
                    message: `success!`,
                  });
                } else {
                  return res.json({
                    status: 400,
                    invalidOTP: 1,
                    message: `something went wrong`,
                  });
                }
              })
              .catch((err) => {
                return res.json({
                  status: 400,
                  invalidOTP: 1,
                  message: `something went wrong`,
                });
              });
          } else {
            return res.json({
              status: 400,
              invalidOTP: 1,
              message: `Invalid OTP`,
            });
          }
        })
        .catch((err) => {
          res.json({
            status: 400,
            invalidOTP: 3,
            message: `something went wrong`,
          });
        });
    }
  },
  ///////

  ////new api by gagan
  verifiy_otp_for_email_change: async function (req, res, next) {
    const secretid = req?.query?.secret;

    let getVerficationdetails = await OTP.findById({ _id: secretid });
    if (
      getVerficationdetails.code &&
      getVerficationdetails.email_address &&
      getVerficationdetails.user
    ) {
      const foundUser = await User.findByIdAndUpdate(
        { _id: getVerficationdetails.user },
        {
          $set: {
            "userInfo.email_address": getVerficationdetails.email_address,
          },
        }
      );
      let title = "Email succesfully change";
      let body = "your email address change successfull";
      let UserId = foundUser?._id;
      if (!foundUser) {
        return failureJSONResponse(res, { message: `email change failed` });
      } else {
        let deleteOtp = await OTP.findByIdAndDelete({ _id: secretid });
        if (deleteOtp) {
          Notification.sendNotifications(
            [UserId],
            title,
            body,
            { model_id: UserId, model: "user" },
            false,
            {
              subject: "Email Address changed successfully",
              email_template: "emailVerifiedSuccess",
              data: {},
            }
          );
          return successJSONResponse(res, {
            message: `email change successfully`,
            status: 200,
          });
        }
      }
    } else {
      return faiuleJSONResponse(res, {
        message: `verfication link not valid`,
        status: 400,
      });
    }
  },
  ////////////
  //////////////
  verifiy_otp_for_email_phone_change: async function (req, res, next) {
    const userId = req.userId,
      source = Number(Math.abs(req?.body?.source)),
      newEmailOTP = req?.body?.new_email_otp,
      oldEmailOTP = req?.body?.old_email_otp,
      countryCode = req?.body?.country_code,
      phoneNumberOTP = req?.body?.phone_number_otp,
      newEmailAddress = String(req?.body?.email_address).toLowerCase(),
      phoneNumber = req?.body?.phone_number;

    const foundUser = await User.findById({ _id: userId });
    if (!foundUser)
      return failureJSONResponse(res, { message: `User not found` });
    else if (foundUser && !foundUser?.userInfo?.email_address)
      return failureJSONResponse(res, { message: `Old  email not found` });

    /*
    source :-
  
    1: phone number
    2: phone number
    */

    if (!source)
      return failureJSONResponse(res, { message: `Please provide soruce` });
    else if (source && isNaN(source))
      return failureJSONResponse(res, {
        message: `please provide valid source`,
      });
    else if (source && (source < 1 || source > 2))
      return failureJSONResponse(res, {
        message: `please provide source between 1-2`,
      });

    if (source === 1) {
      if (!phoneNumber)
        return failureJSONResponse(res, {
          message: `please provide phone number`,
        });
      else if (phoneNumber && isNaN(phoneNumber))
        return failureJSONResponse(res, {
          message: `please provide valid phone number`,
        });
      if (!phoneNumberOTP)
        return failureJSONResponse(res, {
          message: `please provide otp for phone number`,
        });
      if (!isValidString(countryCode))
        return failureJSONResponse(res, {
          message: `please provide country code`,
        });

      OTP.findOne({
        user: req.userId,
        phone_number: phoneNumber,
        used_for: 3,
        code: phoneNumberOTP,
        for: 1,
      })
        .then(async (foundMobileOTP) => {
          if (!foundMobileOTP)
            return failureJSONResponse(res, { message: `invalid OTP` });
          else {
            await OTP.deleteMany({ _id: { $in: [foundMobileOTP._id] } });
            await User.findByIdAndUpdate(
              { _id: userId },
              {
                "userInfo.mobile_number": {
                  phone_number: phoneNumber,
                  country_code: countryCode,
                },
              }
            );
            return successJSONResponse(res, {
              message: "Phone number change successfully",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return failureJSONResponse(res, { message: `Something went wrong` });
        });
    } else if (source === 2) {
      const oldEmailAddress = foundUser?.userInfo?.email_address?.toLowerCase();

      if (!oldEmailAddress)
        return failureJSONResponse(res, {
          message: `please provide old email address`,
        });
      else if (!isValidEmailAddress(oldEmailAddress))
        return failureJSONResponse(res, {
          message: `please provide valid old email address`,
        });

      if (!newEmailAddress)
        return failureJSONResponse(res, {
          message: `please provide new email address`,
        });
      else if (!isValidEmailAddress(newEmailAddress))
        return failureJSONResponse(res, {
          message: `please provide valid new email address`,
        });

      if (!oldEmailOTP)
        return failureJSONResponse(res, {
          message: `please provide old email otp`,
        });
      if (!newEmailOTP)
        return failureJSONResponse(res, {
          message: `please provide new email otp`,
        });

      OTP.findOne({
        $and: [
          { is_active: true },
          { user: req.userId },
          { email_address: oldEmailAddress },
          { used_for: 3 },
          { code: oldEmailOTP },
          { for: 2 },
        ],
      }).then((foundEmailOTP) => {
        let invalidOTP = 0;

        if (!foundEmailOTP) {
          invalidOTP = 1;
        }

        OTP.findOne({
          $and: [
            { is_active: true },
            { user: req.userId },
            { email_address: newEmailAddress },
            { used_for: 3 },
            { code: newEmailOTP },
            { for: 2 },
          ],
        }).then(async (foundNewEmailOTP) => {
          if (!foundNewEmailOTP) {
            invalidOTP = 2;
          }

          if (!foundEmailOTP && !foundNewEmailOTP) {
            invalidOTP = 3;
          }

          if (invalidOTP === 0) {
            await OTP.deleteMany({
              _id: { $in: [foundNewEmailOTP._id, foundEmailOTP._id] },
            });
            await User.findByIdAndUpdate(
              { _id: userId },
              { "userInfo.email_address": newEmailAddress }
            );
            return res.json({
              status: 200,
              invalidOTP,
              message: `success`,
            });
          } else if (invalidOTP === 1) {
            return res.json({
              status: 200,
              invalidOTP,
              message: `please provide valid old email otp`,
            });
          } else if (invalidOTP === 2) {
            return res.json({
              status: 200,
              invalidOTP,
              message: `please provide valid new email otp`,
            });
          } else if (invalidOTP === 3) {
            return res.json({
              status: 200,
              invalidOTP,
              message: `please provide valid old email & new email otp`,
            });
          }
        });
      });
    }
  },
  /////

  ///// new api for verify old email /////
  verifiy_otp_for_old_email: async function (req, res, next) {
    const userId = req.userId,
      oldEmailOTP = req?.body?.old_email_otp,
      newEmailAddress = String(req?.body?.new_email_address).toLowerCase();

    const foundUser = await User.findById({ _id: userId });
    if (!foundUser)
      return failureJSONResponse(res, { message: `User not found` });
    else if (foundUser && !foundUser?.userInfo?.email_address)
      return failureJSONResponse(res, { message: `Old  email not found` });

    const oldEmailAddress = foundUser?.userInfo?.email_address?.toLowerCase();

    if (!oldEmailAddress)
      return failureJSONResponse(res, {
        message: `please provide old email address`,
      });
    else if (!isValidEmailAddress(oldEmailAddress))
      return failureJSONResponse(res, {
        message: `please provide valid old email address`,
      });

    OTP.findOne({
      $and: [
        { is_active: true },
        { user: req.userId },
        { email_address: oldEmailAddress },
        { used_for: 3 },
        { code: oldEmailOTP },
        { for: 2 },
      ],
    }).then(async (foundEmailOTP) => {
      console.log(foundEmailOTP, "bchdbc nj");
      if (foundEmailOTP) {
        await OTP.deleteOne({ _id: foundEmailOTP._id });

        OTP.create({
          is_active: true,
          code: generateOTP(4),
          email_address: newEmailAddress.toLowerCase(),
          used_for: 3,
          user: userId,
          for: 2,
        })
          .then((foundOTP) => {
            if (!foundOTP) {
              return failureJSONResponse(res, {
                message: `something went wrong`,
              });
            } else {
              let title = "Email verification";
              let body = "Please check your new email and click to verify";
              let verifiy_url = `https://menehariya.netscapelabs.com/change-emailaddress?secret=${foundOTP?._id}`;
              Notification.sendNotifications(
                [userId],
                title,
                body,
                { model_id: userId, model: "user" },
                false,
                {
                  subject: "Email Verification",
                  email_template: "emailverification",
                  data: {
                    verify_url: verifiy_url,
                    newEmailAddress: newEmailAddress,
                  },
                }
              );
              return successJSONResponse(res, {
                message: `success`,
              });
            }
          })
          .catch((err) => {
            console.log(err);
            return failureJSONResponse(res, {
              message: `something went wrong`,
            });
          });
      } else {
        return failureJSONResponse(res, {
          message: `please provide valid old email otp`,
        });
      }
    });
  },
  /////

  ////////////
  forget_password: async function (req, res, next) {
    console.log(req.body);
    const email_address = (req?.body?.email_address).toLowerCase();

    if (!email_address)
      return res.json({ status: 400, message: `Email not exist` });

    User.findOne({
      "userInfo.email_address": email_address,
    })
      .then((foundUser) => {
        if (foundUser) {
          OTP.create({
            is_active: true,
            code: generateOTP(4),
            used_for: 1,
            user: foundUser._id,
            email_address: email_address.toLowerCase(),
            for: 2,
          }).then((data) => {
            EmailOTPVerification(
              email_address,
              foundUser?.userInfo?.name,
              data.code
            );
          });

          return res.json({
            status: 200,
            userId: foundUser._id,
            message: `A new OTP has successfully sent out to your email address`,
          });
        } else {
          return res.json({
            status: 400,
            message: `Email Not Exists`,
          });
        }
      })
      .catch((err) => {
        return res.json({
          status: 400,
          message: `fail`,
        });
      });
  },

  verify_forget_password_otp: async function (req, res, next) {
    // console.log(`req.body`);
    console.log(req.body);

    const { otp, user_id } = req.body;

    if (!otp) {
      return res.json({
        status: 400,
        message: `Please enter valid otp`,
      });
    }

    OTP.findOne({
      $and: [
        { is_active: true },
        { code: otp },
        { used_for: 1 },
        { email_address: req?.body?.email_address.toLowerCase() },
        { for: 2 },
      ],
      // is_active: true,
      // code: otp,
      // email_address: req?.body?.email_address
    })
      .then(async (foundOTP) => {
        if (foundOTP) {
          await OTP.findByIdAndDelete({ _id: foundOTP._id });

          return res.json({
            status: 200,
            userId: foundOTP.userId,
            message: `success`,
          });
        } else {
          return res.json({
            status: 400,
            message: `Please enter valid otp`,
          });
        }
      })
      .catch((err) => {
        return res.json({
          status: 400,
          message: `Please enter valid otp`,
        });
      });
  },

  update_password: async function (req, res, next) {
    let newPassword = req.body.newPassword;

    const email_address = req?.body?.email_address.toLowerCase();

    if (!newPassword) {
      return res.json({
        status: 400,
        message: `please provide password`,
      });
    }

    if (!email_address) {
      return res.json({
        status: 400,
        message: `please provide email address`,
      });
    }

    if (email_address && !isValidEmailAddress(email_address)) {
      return res.json({
        status: 400,
        message: `please provide email address`,
      });
    }

    newPassword = bcrypt.hashSync(newPassword, 8);

    User.update(
      { "userInfo.email_address": email_address },
      {
        $set: {
          "userInfo.password": newPassword,
        },
      }
    )
      .then((data) => {
        if (data) {
          return res.json({
            status: 200,
            message: `success`,
          });
        } else {
          return res.json({
            status: 400,
            message: `Something went wrong`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          status: 400,
          message: `fail`,
        });
      });
  },

  country_code_lists: async function (req, res, next) {
    const country_code_list = [`+1`, `+91`, `+971`, `+86`];
    return successJSONResponse(res, {
      message: `success`,
      countryCode: country_code_list,
    });
  },

  update_profile: async function (req, res, next) {
    console.log(`anmsbdnas`, req.body);
    console.log(`sSas`, req.file);

    try {
      const userId = req.userId;
      let data = {
        location: {
          address: req.body.location,
          coordinates: [req.body.lat, req.body.long],
        },
      };
      const {
        name,
        date_of_birth,
        gender,
        short_bio,
        my_website,
        phone_number,
        location,
      } = req.body;
      // console.log(vali(Date(date_of_birth)));
      let picture = req?.file?.path;
      console.log(picture);

      if (name && !isValidString(name))
        return failureJSONResponse(res, { message: `Invalid Name` });
      // if (date_of_birth && !vali(date_of_birth)) return failureJSONResponse(res, { message: `Invalid Date Of Birth` });
      if (gender && isNaN(Number(gender)))
        return failureJSONResponse(res, { message: `Invalid Gender` });

      let profileDataObj = {};

      const dataObj = {
        "userInfo.name": name,
        "userInfo.date_of_birth": date_of_birth,
        "userInfo.gender": gender,
        "userInfo.mobile_number.phone_number": phone_number,
        "userBasicInfo.short_bio": short_bio,
        "userBasicInfo.my_website": my_website,
        "userBasicInfo.location": data.location,
      };

      if (req.file && Object.keys(req.file).length) {
        dataObj["userBasicInfo.profile_image"] = picture;
      } else {
        dataObj["userBasicInfo.profile_image"] = req?.body?.picture;
      }

      // const pictureUrl = req?.body?.picture;
      // console.log(`pictureUrl`,pictureUrl )

      // if(!pictureUrl){

      // // }

      // if (picture) {
      //   userBasicInfo = {
      //     ...userBasicInfo,
      //     "profile_image": picture,
      //   };
      // }

      // profileDataObj.userInfo = userInfo

      // profileDataObj.userBasicInfo = userBasicInfo

      // userInfo = {
      //   ...profileDataObj,
      //   "userInfo.name": name,

      // }

      // profileDataObj = {
      //   ...profileDataObj,
      //   "userInfo.date_of_birth": Date(date_of_birth),
      // }

      // profileDataObj = {
      //   ...profileDataObj,
      //   "userInfo.gender": gender,
      // }

      // profileDataObj = {
      //   ...profileDataObj,
      //   "userBasicInfo.short_bio": short_bio,
      // };

      // profileDataObj = {
      //   ...profileDataObj,
      //   "userBasicInfo.my_website": my_website,
      // }

      // profileDataObj = {
      //   ...profileDataObj,
      //   "userBasicInfo.location": data.location,
      // };

      // // console.log(profileDataObj, "gfgfgsss");

      // profileDataObj = {
      //   ...profileDataObj,
      //   'userBasicInfo.data': data,
      // }
      // profileDataObj = {
      //   ...profileDataObj,
      //   'coordinates': lat,
      // }

      // profileDataObj = {
      //   ...profileDataObj,
      //   'coordinates': long,
      // }

      var updatedProfileRes = await User.updateOne(
        { _id: userId },
        { $set: dataObj },
        { new: true }
      );

      if (updatedProfileRes) {
        return successJSONResponse(res, {
          message: `success`,
          data: {
            name: name,
            date_of_birth: date_of_birth,
            gender: gender,
            short_bio: short_bio,
            my_website: my_website,
            address: data.location.address,
            lat: data.location.coordinates[0],
            long: data.location.coordinates[1],
            picture: profileDataObj?.userBasicInfo?.profile_image,
          },
        });
      } else {
        return failureJSONResponse(res, {
          message: `Failed to update profile`,
        });
      }
    } catch (err) {
      console.log(err);
      return failureJSONResponse(res, { message: `something went wrong` });
    }
  },
  
  //   const dbQuery = { _id: { $ne: req.userId } };

  //   if (email_address)
  //     dbQuery[`userInfo.email_address`] = email_address.toLowerCase();

  //   User.findOne(dbQuery)
  //     .then(async (foundUser) => {
  //       if (foundUser) {
  //         return failureJSONResponse(res, {
  //           message: `Account with that ${email_address} already exists`,
  //         });
  //       } else {
  //         return next();
  //       }
  //     })
  //     .catch((err) => {
  //       return failureJSONResponse(res, { message: `something went wrong` });
  //     });
  // },
  check_email_already_exists: async function (req, res, next) {
    try {
      const email_address = req?.body?.email_address?.toLowerCase();

      if (email_address && !isValidEmailAddress(email_address)) {
        return failureJSONResponse(res, {
          message: `please provide valid email`,
        });
      }

      const dbQuery = { _id: { $ne: req.userId } };

      if (email_address) dbQuery[`userInfo.email_address`] = email_address;

      if (email_address) {
        User.findOne(dbQuery)
          .then((foundUser) => {
            console.log(`foundUser`, foundUser);
            if (foundUser) {
              return failureJSONResponse(
                res,
                {
                  message: `Account with that ${email_address} already exists`,
                },
                (statusCode = 403)
              );
            } else {
              return next();
            }
          })
          .catch((err) => {
            console.log(err);
            return failureJSONResponse(res, {
              message: `something went wrong`,
            });
          });
      } else {
        return next();
      }
    } catch (err) {
      console.log(err);
      return failureJSONResponse(res, { message: `something went wrong` });
    }
  },
 

  // change email address

  generate_otp_for_change_email_mobile: async function (req, res) {
    try {
      const userId = req.userId,
        source = Number(Math.abs(req?.body?.source)),
        emailType = req?.body?.emailType,
        newEmailAddress = String(req?.body?.email_address).toLowerCase(),
        phoneNumber = req?.body?.phone_number;

      const foundUser = await User.findById({ _id: userId });
      if (!foundUser)
        return failureJSONResponse(res, { message: `User not found` });
      else if (foundUser && !foundUser?.userInfo?.email_address)
        return failureJSONResponse(res, { message: `Old  email not found` });

      /*
      source :-

      1: phone number
      2: phone number
      */

      if (!source)
        return failureJSONResponse(res, { message: `Please provide soruce` });
      else if (source && isNaN(source))
        return failureJSONResponse(res, {
          message: `please provide valid source`,
        });
      else if (source && (source < 1 || source > 2))
        return failureJSONResponse(res, {
          message: `please provide source between 1-2`,
        });

      if (source === 1) {
        if (!phoneNumber)
          return failureJSONResponse(res, {
            message: `please provide phone number`,
          });
        else {
          MobileNumberVerificationOTPByUserId(foundUser?._id, phoneNumber, 3);
          return successJSONResponse(res, {
            message: `A new OTP has successfully sent out to your phone number`,
          });
        }
      } else if (source === 2) {
        const oldEmailAddress =
          foundUser?.userInfo?.email_address?.toLowerCase();

        if (!oldEmailAddress)
          return failureJSONResponse(res, {
            message: `please provide old email address`,
          });
        else if (!isValidEmailAddress(oldEmailAddress))
          return failureJSONResponse(res, {
            message: `please provide valid old email address`,
          });

        if (!newEmailAddress)
          return failureJSONResponse(res, {
            message: `please provide new email address`,
          });
        else if (!isValidEmailAddress(newEmailAddress))
          return failureJSONResponse(res, {
            message: `please provide valid new email address`,
          });
        /*
        emailType :-
        1: Old Email
        2: New Email
        3: Both
        */
        if (!emailType)
          return failureJSONResponse(res, {
            message: `Please provide email type`,
          });
        else if (emailType && isNaN(emailType))
          return failureJSONResponse(res, {
            message: `please provide valid email type`,
          });
        else if (emailType && (emailType < 1 || emailType > 3))
          return failureJSONResponse(res, {
            message: `please provide email type between 1-3`,
          });

        if (emailType === 1) {
          OTP.create({
            is_active: true,
            code: generateOTP(4),
            email_address: newEmailAddress.toLowerCase(),
            used_for: 3,
            user: userId,
            for: 2,
          })
            .then((foundOTP) => {
              if (!foundOTP) {
                return failureJSONResponse(res, {
                  message: `something went wrong`,
                });
              } else {
                EmailOTPVerification(newEmailAddress, `Hi`, foundOTP?.code);
                return successJSONResponse(res, {
                  message: `OTP send successfully on ${newEmailAddress}`,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              return failureJSONResponse(res, {
                message: `something went wrong`,
              });
            });
        } else if (emailType === 2) {
          OTP.create({
            is_active: true,
            code: generateOTP(4),
            email_address: oldEmailAddress.toLowerCase(),
            used_for: 3,
            user: userId,
            for: 2,
          })
            .then((foundOTP) => {
              console.log(`foundOTP`, foundOTP);

              if (!foundOTP)
                return failureJSONResponse(res, {
                  message: `something went wrong`,
                });
              else {
                EmailOTPVerification(newEmailAddress, `Hi`, foundOTP?.code);
                return successJSONResponse(res, {
                  message: `OTP send successfully on ${oldEmailAddress}`,
                });
              }
            })
            .catch((err) => {
              console.log(err);
              return failureJSONResponse(res, {
                message: `something went wrong`,
              });
            });
        } else if (emailType === 3) {
          let OTPCreatedForBoth = false;

          const newOTPForNewEmail = await OTP.create({
            is_active: true,
            code: generateOTP(4),
            email_address: newEmailAddress.toLowerCase(),
            used_for: 3,
            user: userId,
            for: 2,
          });

          console.log(`OTPForOldEmail`, newOTPForNewEmail);
          let verifiy_url = `https://menehariya.netscapelabs.com/verifiy_email?secret=${newOTPForNewEmail?._id}`;
          if (!newOTPForNewEmail) {
            OTPCreatedForBoth = false;
            return failureJSONResponse(res, {
              message: `something went wrong`,
            });
          } else {
            OTPCreatedForBoth = true;
            EmailOTPVerification(newEmailAddress, `Hi`, verifiy_url);
            // return successJSONResponse(res, { message: `OTP send successfully on ${newOTPForNewEmail}` });
          }

          const OTPForOldEmail = await OTP.create({
            is_active: true,
            code: generateOTP(4),
            email_address: oldEmailAddress.toLowerCase(),
            used_for: 3,
            user: userId,
            for: 2,
          });

          console.log(`OTPForOldEmail`, OTPForOldEmail);

          if (!OTPForOldEmail) {
            OTPCreatedForBoth = false;
            return failureJSONResponse(res, {
              message: `something went wrong`,
            });
          } else {
            OTPCreatedForBoth = true;
            EmailOTPVerification(oldEmailAddress, `Hi`, OTPForOldEmail?.code);
          }

          if (OTPCreatedForBoth)
            return successJSONResponse(res, {
              message: `OTP send successfully`,
            });
          else
            return failureJSONResponse(res, {
              message: `something went wrong`,
            });
          // OTP.create({
          //   is_active: true,
          //   code: generateOTP(4),
          //   email_address: newEmailAddress.toLowerCase(),
          //   used_for: 3,
          //   user: userId,
          //   for: 2,
          // })
          //   .then((foundOTP) => {
          //     if (!foundOTP) {
          //       return failureJSONResponse(res, {
          //         message: `something went wrong`,
          //       });
          //     } else {

          //       EmailOTPVerification(newEmailAddress `Hi`, foundOTP?.code);
          //       // return successJSONResponse(res, { message: `success` });

          //       OTP.create({
          //         is_active: true,
          //         code: generateOTP(4),
          //         email_address: old_email_address.toLowerCase(),
          //         used_for: 2,
          //         user: userId,
          //         for: 2,
          //       })
          //         .then((foundOTP) => {
          //           console.log(foundOTP);
          //           if (!foundOTP) {
          //             console.log("1");
          //             return failureJSONResponse(res, {
          //               message: `something went wrong`,
          //             });
          //           } else {
          //             EmailOTPVerification(user?.userInfo?.email_address, `Hi`, foundOTP?.code);
          //             return successJSONResponse(res, { message: `success` });
          //           }
          //         })
          //         .catch((err) => {
          //           console.log(err);
          //           console.log("2");
          //           return failureJSONResponse(res, {
          //             message: `something went wrong`,
          //           });
          //         });
          //     }
          //   })
          //   .catch((err) => {
          //     console.log(err);
          //     console.log("3");
          //     return failureJSONResponse(res, {
          //       message: `something went wrong`,
          //     });
          //   });
        }
      }
    } catch (err) {
      console.log(err);
      console.log("4");
      return failureJSONResponse(res, { message: `something went wrong` });
    }
  },
  // new by gagan
  generate_otp_for_change_email: async function (req, res) {
    try {
      const userId = req.userId,
        newEmailAddress = String(req?.body?.new_email_address).toLowerCase();
      if (!newEmailAddress)
        return failureJSONResponse(res, {
          message: `please provide new email address`,
        });
      if (newEmailAddress && !isValidEmailAddress(newEmailAddress)) {
        return failureJSONResponse(res, {
          message: `please provide valid email`,
        });
      }
      let Checkmail = await User.findOne({
        "userInfo.email_address": newEmailAddress,
      });
      if (Checkmail) {
        return failureJSONResponse(res, {
          message: `email already exists`,
        });
      }
      const foundUser = await User.findById({ _id: userId });
      if (!foundUser)
        return failureJSONResponse(res, { message: `User not found` });
      else if (foundUser && !foundUser?.userInfo?.email_address)
        return failureJSONResponse(res, { message: `Old  email not found` });

      let oldEmailAddress = foundUser?.userInfo?.email_address;
      OTP.create({
        is_active: true,
        code: generateOTP(4),
        email_address: oldEmailAddress.toLowerCase(),
        used_for: 3,
        user: userId,
        for: 2,
      })
        .then((foundOTP) => {
          console.log(`foundOTP`, foundOTP);

          if (!foundOTP)
            return failureJSONResponse(res, {
              message: `something went wrong`,
            });
          else {
            EmailOTPVerification(oldEmailAddress, `Hi`, foundOTP?.code);
            return successJSONResponse(res, {
              message: `OTP send successfully on ${oldEmailAddress}`,
            });
          }
        })
        .catch((err) => {
          console.log(err);
          return failureJSONResponse(res, {
            message: `something went wrong`,
          });
        });
    } catch (err) {
      console.log(err);
      console.log("4");
      return failureJSONResponse(res, { message: `something went wrong` });
    }
  },
  //
  update_email_or_phone_number: async function (req, res) {
    try {
      const userId = req.userId;

      const source = Math.abs(req?.body?.source),
        email_address = req?.body?.email_address?.toLowerCase(),
        otp = req?.body?.otp,
        phone_number = req?.body?.phone_number;

      if (!source)
        return failureJSONResponse(res, { message: `please provide soruce` });
      else if (source && isNaN(source))
        return failureJSONResponse(res, {
          message: `please provide valid soruce `,
        });
      else if (source && (source < 1 || source > 2))
        return failureJSONResponse(res, {
          message: `please provide sorurce between 1-2`,
        });

      if (!otp)
        return failureJSONResponse(res, { message: `please provide otp` });

      if (Number(source) == Number(1)) {
        if (!phone_number)
          return failureJSONResponse(res, {
            message: `please provide phone number`,
          });

        OTP.findOne({
          is_active: true,
          used_for: 2,
          code: otp,
          phone_number: phone_number,
          user: req.userId,
          for: 1,
        })
          .then(async (foundOTP) => {
            if (!foundOTP) {
              return failureJSONResponse(res, { message: `Invalid OTP` });
            } else if (foundOTP) {
              await OTP.findByIdAndDelete({ _id: foundOTP._id });
              User.updateOne(
                { _id: userId },
                {
                  $set: { "userInfo.mobile_number.phone_number": phone_number },
                },
                { new: true }
              )
                .then((updatedUser) => {
                  if (updatedUser) {
                    return successJSONResponse(res, {
                      message: `A new OTP has successfully sent out to your phone number`,
                      data: { phone_number },
                    });
                  } else {
                    return failureJSONResponse(res, {
                      message: `something went wrong`,
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  return failureJSONResponse(res, {
                    message: `something went wrong`,
                  });
                });
            }
          })
          .catch((err) => {
            console.log(err);
            return failureJSONResponse(res, {
              message: `something went wrong`,
            });
          });
      } else if (Number(source) == Number(2)) {
        if (!email_address)
          return failureJSONResponse(res, {
            message: `please provide email address`,
          });
        else if (!isValidEmailAddress(email_address))
          return failureJSONResponse(res, {
            message: `please provide valid phone number`,
          });

        OTP.findOne({
          $and: [
            { is_active: true },
            { user: req.userId },
            { code: otp },
            { email_address: email_address.toLowerCase() },
            { for: 2 },
            { used_for: 2 },
          ],
          // is_active: true,
          // code: otp,
          // user: req.userId,
          // email_address: email_address.toLowerCase(),
          // for: 2,
        })
          .then(async (foundOTP) => {
            if (!foundOTP) {
              return failureJSONResponse(res, { message: `Invalid OTP` });
            } else if (foundOTP) {
              await OTP.findByIdAndDelete({ _id: foundOTP._id });

              User.updateOne(
                { _id: userId },
                {
                  $set: {
                    "userInfo.email_address": email_address.toLowerCase(),
                  },
                },
                { new: true }
              )
                .then((updatedUser) => {
                  console.log(updatedUser);

                  if (updatedUser) {
                    return successJSONResponse(res, {
                      message: `success`,
                      data: { email_address },
                    });
                  } else {
                    console.log(`working`);
                    return failureJSONResponse(res, {
                      message: `something went wrong`,
                    });
                  }
                })
                .catch((err) => {
                  console.log(err);
                  return failureJSONResponse(res, {
                    message: `something went wrong`,
                  });
                });
            }
          })
          .catch((err) => {
            console.log(err);
            return failureJSONResponse(res, {
              message: `something went wrong`,
            });
          });
      }
    } catch (err) {
      console.log(err);
      return failureJSONResponse(res, { message: `something went wrong` });
    }
  },

  fetchProfileDetails: async function (req, res) {
    try {
      const userId = req.userId;

      if (!userId)
        return failureJSONResponse(res, { message: `please provide user id` });

      User.findById({ _id: userId })
        .select(`userInfo userBasicInfo createdAt`)
        .then((user) => {
          console.log(user);
          if (!user)
            return failureJSONResponse(res, {
              message: `something went worng`,
            });
          else {
            const data = {
              name: user?.userInfo?.name || null,
              email_address: user?.userInfo?.email_address || null,
              phone_number: user?.userInfo?.mobile_number?.phone_number || null,
              gender: user?.userInfo?.gender || null,
              date_of_birth: user?.userInfo?.date_of_birth || null,
              profile_image: user?.userBasicInfo?.profile_image || null,
              short_bio: user?.userBasicInfo?.short_bio || null,
              my_website: user?.userBasicInfo?.my_website || null,
              address: user?.userBasicInfo?.location?.address || null,
              lat:
                user?.userBasicInfo?.location?.coordinates?.coordinates?.[0] ||
                null,
              long:
                user?.userBasicInfo?.location?.coordinates?.coordinates?.[1] ||
                null,
              createdAt: user?.createdAt || null,
            };
            console.log("haigi aaa ", data);
            return successJSONResponse(res, { user: data });
          }
        })
        .catch((err) => {
          console.log(err);
          return failureJSONResponse(res, {
            message: `something went wrong`,
          });
        });
    } catch (error) {
      return failureJSONResponse(res, { message: `something went wrong` });
    }
  },

  logout: async function (req, res) {
    const deviceType = req?.body?.device_type;
    const deviceToken = req?.body?.device_token;
  
    if (!isValidString(deviceToken?.trim())) {
      return failureJSONResponse(res, { message: 'Device token missing.' });
    }
  
    if (!deviceType) {
      return failureJSONResponse(res, { message: 'Device type missing.' });
    } else if (isNaN(deviceType)) {
      return failureJSONResponse(res, { message: 'Invalid device type.' });
    }
  
    try {
      const user = await User.updateOne(
        { _id: req.userId },
        {
          $pull: {
            user_device_info: {
              token: deviceToken,
              device_type: Number(deviceType),
            },
          },
        }
      );
  
      if (user.modifiedCount === 1) {
        return successJSONResponse(res, { message: 'Logout successful.' });
      } else {
        return failureJSONResponse(res, { message: 'Device token not found.' });
      }
    } catch (error) {
      return failureJSONResponse(res, { message: 'Something went wrong.' });
    }
  },

  ///////////////////////////////////////////////////
  account_delete: async function (req, res) {
    try {
      const userId = req.userId;
      if (!userId)
        return failureJSONResponse(res, { message: `please provide user id` });

      const checkUserDetail = await User.findById(
        { _id: userId },
        { userInfo: 1, userBasicInfo: 1 }
      );

      if (checkUserDetail.userBasicInfo.source === "email") {
        let Password = req.body.password;
        if (!Password) {
          return res.json({
            status: 400,
            message: `please Provide Your password`,
          });
        }
        let passwordIsValid = await bcrypt.compare(
          Password,
          checkUserDetail?.userInfo?.password
        );

        if (passwordIsValid) {
          let found_user = await User.findByIdAndDelete({ _id: userId });
          if (!found_user) {
            return failureJSONResponse(res, {
              message: `Failed to delete Your Account`,
            });
          } else {
            if (found_user && Object.keys(found_user).length) {
              AccountDeleteEmail(
                found_user.userInfo.email_address,
                found_user.userInfo.name
              );
            }
            return successJSONResponse(res, {
              message: "Account deleted successfully",
            });
          }
        } else {
          return res.json({
            status: 400,
            message: `The password you entered is incorrect. Please try again.`,
          });
        }
      } else if (checkUserDetail.userBasicInfo.source !== "email") {
        let Password = req.body.password;
        if (!Password) {
          return res.json({
            status: 400,
            message: `please Provide Your password`,
          });
        }
        let isPassword = Password.trim().toLowerCase();
        if (isPassword === "menehariya") {
          let found_user = await User.findByIdAndDelete({ _id: userId });
          if (!found_user) {
            return failureJSONResponse(res, {
              message: `Failed to delete Your Account`,
            });
          } else {
            if (found_user && Object.keys(found_user).length) {
              AccountDeleteEmail(
                found_user.userInfo.email_address,
                found_user.userInfo.name
              );
            }
            return successJSONResponse(res, {
              message: "Account deleted successfully",
            });
          }
        } else {
          return res.json({
            status: 400,
            message: `The password you entered is incorrect. Please Enter (menehariya) As a password and try again.`,
          });
        }
      } else {
        return res.json({
          status: 400,
          message: `Failed to delete Your Account`,
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        status: 404,
        message: "Something went wrong",
        err: err.message,
      });
    }
  },

  ////////---------------------chaNGE pASSwORD---------/////////////////

  change_password: async function (req, res, next) {
    try {
      const userId = req.userId;
      if (!userId)
        return failureJSONResponse(res, { message: `please provide user id` });

      const checkUserDetail = await User.findById(
        { _id: userId },
        { userInfo: 1, userBasicInfo: 1 }
      );

      if (checkUserDetail.userBasicInfo.source === "email") {
        let newPassword = req.body.newPassword;
        let oldPassword = req.body.password;

        if (
          newPassword.trim().toLowerCase() === oldPassword.trim().toLowerCase()
        ) {
          return failureJSONResponse(res, {
            message: `old password and new password can't be same`,
          });
        }

        console.log(checkUserDetail, "jcbnhchyegc");
        if (!oldPassword) {
          return res.json({
            status: 400,
            message: `please Provide Current password`,
          });
        }
        if (!newPassword) {
          return res.json({
            status: 400,
            message: `please provide New password`,
          });
        }

        console.log(checkUserDetail?.userInfo?.password, "hvegcvgd");
        let passwordIsValid = await bcrypt.compare(
          oldPassword,
          checkUserDetail?.userInfo?.password
        );

        if (passwordIsValid) {
          let password = await bcrypt.hash(newPassword, 8);
          // Update device information of user

          const updatePassword = await User.findByIdAndUpdate(
            { _id: userId },
            { $set: { "userInfo.password": password } },
            { new: true }
          );

          if (updatePassword) {
            if (checkUserDetail && Object.keys(checkUserDetail).length) {
              PasswordChange(
                checkUserDetail?.userInfo?.email_address,
                checkUserDetail?.userInfo.name
              );
            }
            return res.json({
              status: 200,
              message: `password change Successfully`,
            });
          } else {
            return res.json({
              status: 400,
              message: `failed to change password`,
            });
          }
        } else {
          return res.json({
            status: 400,
            message: `wrong current password`,
          });
        }
      } else {
        return res.json({
          status: 400,
          message: `can't change password of social login account`,
        });
      }
    } catch (err) {
      console.log(err);
      res.json({
        status: 404,
        message: err.message,
      });
    }
  },

  ///////////////////////////////
  generate_otp_for_signup_email_mobile: async function (req, res) {
    try {
      const userId = req.userId;
      console.log(req.body, "body hai ye");
      // let new_email = req?.body?.new_email_address?.toLowerCase()
      // console.log(new_email);
      // let find_new_email = await User.findOne({"userInfo.email_address":new_email})
      // return console.log(find_new_email,"cfhbchf");
      // if(find_new_email) return failureJSONResponse(res, {
      //     message: `email address already exist`,
      //   });

      find_old_email = await User.findById({ _id: userId });
      //  return console.log(find_old_email.userInfo.email_address,"dnxdjdnj");
      const source = Math.abs(req?.body?.source),
            email_address = req?.body?.email_address?.toLowerCase(),
            phone_number = req?.body?.phone_number;
console.log(source,"------------------------------------------------------------------------------------------------------------------------------------------");
      if (!source)
        return failureJSONResponse(res, { message: `please provide soruce` });
      else if (source && isNaN(source))
        return failureJSONResponse(res, {
          message: `please provide valid source `,
        });
      else if (source && (source < 1 || source > 2))
        return failureJSONResponse(res, {
          message: `please provide source between 1-2`,
        });

      User.findById({ _id: userId })
        .then( async (user) => {
          if (!user)
            return failureJSONResponse(res, { message: `User not exits` });

          if (source === 1) {
            console.log(`working`);
            if (!phone_number)
              return failureJSONResponse(res, {
                message: `please provide phone number`,
              });

            MobileNumberVerificationOTPByUserId(user?._id, null);
            return successJSONResponse(res, {
              message: `A new OTP has successfully sent out to your phone number`,
            });
          } 
           if (source === 2) {
            if (!email_address) {
              // console.log("yes i am error !");
              return failureJSONResponse(res, {
                message: `please provide email address`,
              });
            } else if (email_address && !isValidEmailAddress(email_address))
              return failureJSONResponse(res, {
                message: `please provide valid  email address`,
              });
            // let oldOtp = await OTP.findOne({
            //     $and: [
            //       { is_active: true },
            //       { user: req.userId },
            //       { used_for: 2 },
            //       { code: otp_for_email },
            //       { for: 2 },
            //     ],
            //   })
            
              // await OTP.findByIdAndDelete({ user: req.userId });
            OTP.create({
              is_active: true,
              code: generateOTP(4),
              email_address: email_address.toLowerCase(),
              used_for: 2,
              user: userId,
              for: 2,
            })
              .then((foundOTP) => {
                console.log(foundOTP);
                if (!foundOTP) {
                  return failureJSONResponse(res, {
                    message: `something went wrong`,
                  });
                } else {
                  EmailOTPVerification(
                    user?.userInfo?.email_address,
                    `Hi`,
                    foundOTP?.code
                  );
                  return successJSONResponse(res, {
                    message: `A new OTP has successfully sent out to your email address`,
                  });
                }
              })
              .catch((err) => {
                console.log(err);
                console.log("3");
                return failureJSONResponse(res, {
                  message: `something went wrong`,
                });
              });
          }
        })
        .catch((err) => {
          console.log(err,"njvbdhbvhdbvhdbvhdfs vnj,bvnhjzxvnhiiujkfkjnvkjjk");
          return failureJSONResponse(res, { message: `something went wrong` });
        });
    } catch (err) {
      console.log(err);
      return failureJSONResponse(res, { message: `something went wrong` });
    }
  },
};
