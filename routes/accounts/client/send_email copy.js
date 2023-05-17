
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/',(req,res,next)=>{
    // console.log('ss')
    let mailTransporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "20a5c3b7c9ba76",
          pass: "c848c886a56f96"
        }
      });
    let mailDetails = {
        from: 'mohammad.sahil@netscapelabs.com',
        to: 'sahil.seraphic@gmail.com',
        subject: 'Test mail',
        text: 'Node.js testing mail for GeeksforGeeks'
    };
     
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            res.status(500).json({message:'Something Went Wrong'})
        } else {
            res.status(200).json({message:'Email Send Successfully!', mailDetails:mailDetails,data:data})
        }
    });
 
})

module.exports = router