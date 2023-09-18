const users = require('../../../model/accounts/admin');
const Users = require('../../../model/accounts/users'),
{
    successJSONResponse,
        failureJSONResponse
} = require(`../../../handlers/jsonResponseHandlers`);
let Notification = require("../../../resources/sendEmailFunction");
const jwt = require('jsonwebtoken');

let tokenSecret = 'this is dummy text'

exports.userList = async(req,res, next) => {
        try {
          const {
            sortBy,
          } = req.query;

          const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
          var perPage = parseInt(req.query.perpage) || 10;
          var page = parseInt(req.query.page) || 1;
          
          let records = await users.find({}, { "userInfo.password": 0 })
            .sort(sortval)
            .skip(perPage * page - perPage)
            .limit(perPage);
            const totalCount = await users.find();
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
              expiresIn: "10m",
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
