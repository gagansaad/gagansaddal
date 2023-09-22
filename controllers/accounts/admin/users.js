const users = require('../../../model/accounts/admin');
const mongoose = require('mongoose');
const Users = require('../../../model/accounts/users'),
{
    successJSONResponse,
        failureJSONResponse
} = require(`../../../handlers/jsonResponseHandlers`);
let Notification = require("../../../resources/sendEmailFunction");
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs")
let tokenSecret = 'AbCdEfGhIjKlMnOPYT'
const ObjectId = mongoose.Types.ObjectId;
exports.userList = async(req,res, next) => {
        try {
          const {
            sortBy,
          } = req.query;

          const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
          var perPage = parseInt(req.query.perpage) || 10;
          var page = parseInt(req.query.page) || 1;
          
          let records = await Users.find({}, { "userInfo.password": 0 })
            .sort(sortval)
            .skip(perPage * page - perPage)
            .limit(perPage);
            const totalCount = await Users.find();
            let responseModelCount = totalCount.length;
         
          if (records) {
            
            return successJSONResponse(res, {
              message: `success`,
              total: responseModelCount,
              perPage: perPage,
              totalPages: Math.ceil(responseModelCount / perPage),
              currentPage: page,
              records:records,
              status: 200,
            });
          } else {
            return failureJSONResponse(res, { message: `users not Available` });
          }
        } catch (err) {
          return failureJSONResponse(res, { message: `something went wrong` });
        }
      
};
exports.forget_password = async function (req, res, next) {
  try {
    const address = req.body.email_address;
    if (!address)
      return res.json({ status: 400, message: `Email not provided` });

    // Convert email address to lowercase
    const email_address = address.toLowerCase();

    users.findOne({
      "userInfo.email_address": email_address,
    })
      .then(async (foundUser) => {
        if (foundUser) {
          console.log(foundUser);

          const token = jwt.sign(
            {
              userId : foundUser._id,
            },
            tokenSecret,
            {
              expiresIn: "1m",
            }
          );
          let verify_url = `https://menehariya-admin.netscapelabs.com/reset-password/${token}`;
          const emailSubject = "Reset Password!";
          const emailFileName = "adminResetPassword"; // Replace with the correct template file name
          const replacements = {
            verify_url: verify_url,
          };

          await Notification.sendEmail(email_address, emailSubject, emailFileName, replacements);

          return res.json({
            status: 200,
            userId: foundUser._id,
            message: `Reset Password Link Successfully Sent Out To Your Email Address`,
          });
        } else {
          return res.json({
            status: 400,
            message: `Email Not Found`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.json({
          status: 400,
          message: `Failed to reset password`,
        });
      });
  } catch (error) {
    console.error(error);
    return res.json({
      status: 400,
      message: `Failed to reset password`,
    });
  }
}

exports.update_password = async function (req, res, next) {
  let newPassword = req.body.newPassword;

    let token = req.body.token
let userId
  if (!newPassword) {
    return res.json({
      status: 400,
      message: `Please Provide New Password and Confirm Password`,
    });
  }

  if (!token) {
    return res.json({
      status: 400,
      message: `Please Resent Forget Password Email`,
    });
  }
  let decodedPayload = jwt.verify(token, tokenSecret);
  if (!((decodedPayload && decodedPayload.userId))) {
    return res.status(401).json({
        status: 403,
        message: `unauthorized`,
    })
} else {

    userId = decodedPayload.userId.trim();

    const dbQuery = {
        // "userInfo.status": 1, //checking if user is active or not
        _id: userId
    };

    const user = await users.findOne(dbQuery);

    if (!user) return res.status(401).json({
        status: 404,
        message: `User  not found`
    });
    userId = user._id;
}

 

  newPassword = bcrypt.hashSync(newPassword, 8);

  users.updateOne(
    { "_id": userId },
    {
      $set: {
        "password": newPassword,
      },
    }
  ).then((data) => {
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
}


exports.fetchProfileDetails = async function (req, res) {
  try {
    const userId = req.userId;

    if (!userId)
      return failureJSONResponse(res, { message: `please provide your Id` });

      users.findById(userId)
      .then((user) => {
        console.log(user);
        if (!user)
          return failureJSONResponse(res, {
            message: `something went worng`,
          });
        else {
          const data = {
            name: user?.name || null,
            email_address: user?.email_address || null,
            mobile_number: user?.mobile_number || null,
            createdAt: user?.createdAt || null,
          };
          // console.log("haigi aaa ", data);
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
}

exports.update_profile= async function (req, res, next) {
  try {
    const userId = req.userId;
    console.log(userId);
    let data = await users.findById(userId)
    console.log(data,"vikaasssssss ki jai")
    if(!data){
      return res.status(401).json({
        msg:'Please provide your valid Id'
    })
    }
    const {
      name,
      email_address,
      mobile_number,
      old_password,
      new_password,
    } = req.body;
    console.log(req.body);
    const dataObj={}
    if (name && !isValidString(name))
      return failureJSONResponse(res, { message: `Invalid Name` });
    // if (date_of_birth && !vali(date_of_birth)) return failureJSONResponse(res, { message: `Invalid Date Of Birth` });
    if(name){
      dataObj.name= name
    }
  
   if(old_password && new_password){
    console.log("object");
    const result = await bcrypt.compare(old_password,data?.password);
    console.log(result,"-----------------------------------------------------");
    if (!result) {
      return res.status(401).json({
        msg: 'Please provide a valid old password'
      });
    }

      if(result){
        dataObj.password = bcrypt.hashSync(new_password, 8);
      }
   };
    var updatedProfileRes = await users.updateOne(
      { _id: userId },
      { $set: dataObj },
      { new: true }
    );

    if (updatedProfileRes) {
      return successJSONResponse(res, {
        message: `success`,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Failed to update profile`,
      });
    }
  } catch (err) {
    // console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
}