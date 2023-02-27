const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userInfo: {
        name: {
            type: String,
            required: true
        },
        email_address: {
            type: String,
            required: true,
            index: { unique: true }
        },
        password: { type: String },
        mobile_number: {
            country_code: {
                type: String
            },
            phone_number: {
                type: String
            }
        },
    },

    userDateInfo: {
        loginDate: { type: Date, default: Date.now() },
        lastLoginDate: { type: Date, default: Date.now() },
        LastUpdate: { type: Date, default: Date.now() },
        userDisableDate: { type: Date },
    },
    userFacebookInfo:{
        fbId: { type: String },
        fbToken: { type: String },
        loginOn: { type: Date, default: Date.now() },
    },
    userGoogleInfo: {
        googleId: { type: String },
        googleEmail: { type: String },
        googleToken: { type: String },
        loginOn: { type: Date, default: Date.now() },
    },

    userAppleInfo: {
        appleId: { type: String },
        appleToken: { type: String },
        loginOn: { type: Date, default: Date.now() },
    },
    userStatus: {
        blocked: { type: Boolean, default: false },
        appVersion: { type: String, default: "0.01" },
        userActionStatus: { type: String, default: "Enable" },
        userLoginStatusForFbGmail: { type: String, default: "SignUp" },
        userStatus: { type: String, possibleValues: ['Login', 'Logout'] },
    },

}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);