// const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_SERVICE_SID } = process.env;
// const client = require('twilio')(TWILIO_ACCOUNT_SID  , TWILIO_AUTH_TOKEN,  {
//     lazyLoading:true
// })

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const seriveSid = process.env.TWILIO_SERVICE_SID;
const smsNo = process.env.TWILIO_SMS_NO;
const client = require('twilio')(accountSid, authToken);


exports.sendOTP = async(req,res, next) => {
    // console.log(req.body);
    try {
        // client.verify.v2.services
        // .create({friendlyName: 'OTP'})
        // .then(service => console.log(service.sid));
        const otp_code = Math.floor(100000 + Math.random() * 900000);
        client.messages
            .create({
                body: `Your OTP Verification Code is: ${otp_code}`,
                from: smsNo,
                to: '+919592407801'
            })
            .then(message => console.log(message.sid));
        // const otpResponse = await client.verify.services(seriveSid)
        //         .verifications.create({to: "+919592407801",channel: 'sms'});
        // console.log(otpResponse);
        // console.log(Math.floor(100000 + Math.random() * 900000));
    } catch (error) {
        res.status(error?.status || 400 ).send(error?.message || 'something went wrong!');
    }
    
};


exports.verifyOTP = async(req,res, next) => {

    try {   
        client.verify.v2.services(seriveSid)
            .verificationChecks
            .create({to: '+919592407801', code: '475716'})
            .then(verification_check => {
                res.status(200).json({data:verification_check})
            });
    } catch (error) {
        res.status(error?.status || 400 ).send(error?.message || 'something went wrong!');
    }
};
