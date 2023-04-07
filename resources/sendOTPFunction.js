const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const seriveSid = process.env.TWILIO_SERVICE_SID;
const smsNo = process.env.TWILIO_SMS_NO;
const client = require('twilio')(accountSid, authToken);
const mongoose = require("mongoose"),
    User = mongoose.model("user"),
    OTP = mongoose.model("otp"),
    { generateOTP } = require(`../utils/generateOTP`);

const MobileNumberVerificationOTP = (mobile_number = NaN, name = ``, code) => {
    
    try {
        // client.verify.v2.services
        // .create({friendlyName: 'OTP'})
        // .then(service => console.log(service.sid));
        const otp_code = Math.floor(100000 + Math.random() * 900000);
        client.messages
            .create({
                body: `Your OTP Verification Code is: ${code}`,
                from: smsNo,
                to: mobile_number
            })
            .then(message => console.log(message.sid))
            .catch((error) => {
                // console.log(`dfsfds`)
                console.log('something went wrong1!');

            });
        // const otpResponse = await client.verify.services(seriveSid)
        //         .verifications.create({to: "+919592407801",channel: 'sms'});
        // console.log(otpResponse);
        // console.log(Math.floor(100000 + Math.random() * 900000));
    } catch (error) {
        console.log(`Enter Only Verified Mobile Number`)
    }

};

const MobileNumberVerificationOTPByUserId = (userId) => {

    try {
        console.log('----------------------------------------------------')
        console.log(userId)
        User.findById({
            _id: userId
        })

            .then((foundUser) => {
                console.log(foundUser)

                // console.log(foundUser.userInfo.mobile_number);
                const fullNumber = '+' + foundUser.userInfo.mobile_number.country_code + foundUser.userInfo.mobile_number.phone_number;
                // console.log(fullNumber);
                if (foundUser) {
                    OTP.create({
                        is_active: true,
                        code: generateOTP(4),
                        used_for: 2,
                        phone_number: foundUser?.userInfo?.mobile_number?.phone_number,
                        user: userId,
                        for: 1
                    }).then((data) => {
                        // console.log(foundUser)
                        MobileNumberVerificationOTP(fullNumber, name = ``, data.code)
                    })
                        .catch((error) => {
                            console.log('something went wrong2!');
                        })
                }

                // console.log(foundUser)
                // MobileNumberVerificationOTP()
            })
            .catch((error) => {
                console.log('something went wrong3!');

            })

    } catch (error) {
        console.log(`dfsfds`)
    }
    // res.send(`hghjgj`)

};

module.exports = {
    MobileNumberVerificationOTP,
    MobileNumberVerificationOTPByUserId
}