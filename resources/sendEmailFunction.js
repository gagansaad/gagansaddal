const nodemailer = require('nodemailer');

exports.EmailOTPVerification = (email_address = ``, name = ``, code) => {

    let mailTransporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: "mohammad.sahil@netscapelabs.com",
            pass: "xsmtpsib-6b110cbae84bbcc85a6611bf2ad11cb5e1a7b39080c01a1b4eb8241dff7b45fc-Tat3NJ1hVj6CKmsX"
        }
    });
    
    let mailDetails = {
        from: 'support@menehariya.com',
        to: `${email_address}`,
        subject: 'Welcome To Menehariya',
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



exports.WelcomeEmail = (email_address = ``, name = ``) => {

    let mailTransporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: "mohammad.sahil@netscapelabs.com",
            pass: "xsmtpsib-6b110cbae84bbcc85a6611bf2ad11cb5e1a7b39080c01a1b4eb8241dff7b45fc-Tat3NJ1hVj6CKmsX"
        }
    });
    
    let mailDetails = {
        from: 'support@menehariya.com',
        to: `${email_address}`,
        subject: 'Welcome to Menehariya!',
        text: `Welcome to Menehariya!`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    });
};



exports.PasswordChange = (email_address = ``, name = ``) => {

    let mailTransporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: "mohammad.sahil@netscapelabs.com",
            pass: "xsmtpsib-6b110cbae84bbcc85a6611bf2ad11cb5e1a7b39080c01a1b4eb8241dff7b45fc-Tat3NJ1hVj6CKmsX"
        }
    });
    
    let mailDetails = {
        from: 'support@menehariya.com',
        to: `${email_address}`,
        subject: 'Password Change!',
        text: `Your account password change successfully`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    });
};


exports.AccountDeleteEmail = (email_address = ``, name = ``) => {

    let mailTransporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: "mohammad.sahil@netscapelabs.com",
            pass: "xsmtpsib-6b110cbae84bbcc85a6611bf2ad11cb5e1a7b39080c01a1b4eb8241dff7b45fc-Tat3NJ1hVj6CKmsX"
        }
    });
    
    let mailDetails = {
        from: 'support@menehariya.com',
        to: `${email_address}`,
        subject: 'Thank you for Use Menehariya!',
        text: `Your menehariya account is deleted as per your request.`
    };

    mailTransporter.sendMail(mailDetails, function (err, data) {
        if (err) {
            console.log(err)
        } else {
            console.log(data)
        }
    });
};
