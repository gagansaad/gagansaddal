const nodemailer = require('nodemailer'),
    { generateOTP } = require(`../utils/generateOTP`);

exports.EmailOTPVerification = (email_address = ``, name = ``, code) => {


    const mailTransporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "a165c441b7db27",
            pass: "b347427170f314"
        }
    });
    const mailDetails = {
        from: 'kaushlender.verma@netscapelabs.com',
        to: email_address,
        subject: 'Test mail',
        text: `${name} your top is ${code}`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    });
};
