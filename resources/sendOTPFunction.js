const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const seriveSid = process.env.TWILIO_SERVICE_SID;
const smsNo = process.env.TWILIO_SMS_NO;
const client = require('twilio')(accountSid, authToken);


exports.MobileNumberVerificationOTP = (mobile_number = NaN, name = ``, code) => {
    try {
        try {
            // client.verify.v2.services
            // .create({friendlyName: 'OTP'})
            // .then(service => console.log(service.sid));
            const otp_code = Math.floor(100000 + Math.random() * 900000);
            client.messages
                .create({
                    body: `Your OTP Verification Code is: ${code}`,
                    from: smsNo,
                    to: '+91'+mobile_number
                })
                .then(message => console.log(message.sid));
            // const otpResponse = await client.verify.services(seriveSid)
            //         .verifications.create({to: "+919592407801",channel: 'sms'});
            // console.log(otpResponse);
            // console.log(Math.floor(100000 + Math.random() * 900000));
        } catch (error) {
            res.status(error?.status || 400).send(error?.message || 'something went wrong!');
        }
    // res.send(`hghjgj`)
    } catch (error) {
        console.log(error)
    }
};