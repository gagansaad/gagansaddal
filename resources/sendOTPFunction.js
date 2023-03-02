const accountSid = process.env.TWILIO_ACCOUNT_SID,
    authToken = process.env.TWILIO_AUTH_TOKEN,
    seriveSid = process.env.TWILIO_SERVICE_SID,
    client = require('twilio')(accountSid, authToken);


exports.MobileNumberVerificationOTP = (mobile_number = NaN, name = ``) => {
    try {
        // console.log(req.body);
        // const { countryCode, phoneNumber } = req.body;
        try {
            client.verify.v2.services(seriveSid)
                .verifications
                .create({ to: mobile_number, channel: 'sms' })
                .then((verification) => {
                    res.status(200).json({ data: verification })
                });
            // res.status(200).send(`OTP send successfully!:${json.stringify(otpResponse)}`);
        } catch (error) {
            res.status(error?.status || 400).send(error?.message || 'something went wrong!');
        }
    // res.send(`hghjgj`)
    } catch (error) {
        console.log(error)
    }
};