const accountSid = process.env.TWILIO_ACCOUNT_SID,
    authToken = process.env.TWILIO_AUTH_TOKEN,
    seriveSid = process.env.TWILIO_SERVICE_SID,
    client = require('twilio')(accountSid, authToken);

exports.MobileNumberVerificationOTP = (mobile_number = NaN, name = ``) => {
    try {
        client.verify.v2.services(seriveSid)
            .verifications
            .create({ to: "+91" + mobile_number, channel: 'sms' })
            .then((verification) => {
                console.log(verification)
            });
        // res.status(200).send(`OTP send successfully!:${json.stringify(otpResponse)}`);
    } catch (error) {
        console.log(error)
    }
};