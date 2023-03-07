const nodemailer = require('nodemailer');

exports.EmailOTPVerification = (email_address = ``, name = ``, code) => {

    let mailTransporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a165c441b7db27",
            pass: "b347427170f314"
        }
    });
    let mailDetails = {
        from: 'mohammad.sahil@netscapelabs.com',
        to: 'sahil.seraphic@gmail.com',
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
