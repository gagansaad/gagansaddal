const users = require('../../../model/accounts/admin');
const Users = require('../../../model/accounts/users'),
{
    successJSONResponse,
        failureJSONResponse
} = require(`../../../handlers/jsonResponseHandlers`);
let Notification = require("../../../resources/sendEmailFunction");
const jwt = require('jsonwebtoken');



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
exports.forget_password= async function (req, res, next) {
  // console.log(req.body);
  const address = req.body.email_address

  if (!address)
    return res.json({ status: 400, message: `Email not exist` });
  let email_address = address.toLowerCase();
    let verifiy_url = `https://menehariya-admin.netscapelabs.com/reset-password/?secret`;
  users.findOne({
    "userInfo.email_address": email_address,
  })
    .then(async(foundUser) => {
      if (foundUser) {
        console.log(foundUser);
        const token = jwt.sign({
          "email_address":foundUser.email_address,

      },
      'this is dummy text',
      {
          expiresIn:"10m"
      });
        await Notification.sendEmail(
          foundUser.email_address,
          {
            subject: "Reset Password!",
            email_template: "adminResetPassword",
            verify_url: verifiy_url,
          }
        );
        return res.json({
          status: 200,
          userId: foundUser._id,
          message: `Reset Password Link Successfully Sent Out To Your Email Address`,
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
}


