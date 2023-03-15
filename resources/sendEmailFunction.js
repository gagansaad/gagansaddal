const nodemailer = require('nodemailer');

exports.EmailOTPVerification = (email_address = ``, name = ``, code) => {

    let mailTransporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "7b0d4ef3a7805a",
            pass: "fd00eb2dce2636"
        }
    });
    let mailDetails = {
        from: 'dtestthird@gmail.com',
        to: 'mohammad.sahil@netscapelabs.com',
        subject: 'Test mail',
        text: `${name} your otp is ${code}`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    });
};
