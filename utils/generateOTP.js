exports.generateOTP = (length) => {
    /* not using 0 as mongoose cuts it out if it's found as the first digit of a number (in this case, OTP).
    That would result in the OTP being 5 digit long, which would result in mongoose error */
    const digits = '123456789A1B2C3D4E5F6GHI7JK8LMAN';
    let OTP = ``;

    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 24)];
    }
    return OTP;
}