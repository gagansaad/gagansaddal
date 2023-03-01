const nodemailer = require('nodemailer'),
    { generateOTP } = require(`../utils/generateOTP`);

exports.EmailOTPVerification = (email_address = ``, name = ``) => {


    const mailTransporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "20a5c3b7c9ba76",
            pass: "c848c886a56f96"
        }
    });
    const mailDetails = {
        from: 'mohammad.sahil@netscapelabs.com',
        to: email_address,
        subject: 'Test mail',
        text: `${name} your top is ${generateOTP(6)}`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    });
};
