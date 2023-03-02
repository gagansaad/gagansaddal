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

    user_status: {
        user_action_Status: {
            type: Number,
            required: true,
            enum: [1, 2]
        },
    },

    userBasicInfo: {
        source: { type: String, possibleValues: ['Facebook', 'Instagram', 'Email', 'Apple'] },
    },

    user_device_info: [{
        token: {
            type: String,
            required: true
         },
        device_type: {
            type: Number,
            required: true,
            enum: [1, 2, 3]
            // 1=iphone
            // 2=android
            // 3=web
        },
        device_name: {
            type: String,
            required: true
        },
        device_model: {
            type: String,
            required: true
        },
        device_version: {
            type: String,
            required: true
        }
    }],
    

    userDateInfo: {
        loginDate: { type: Date, default: Date.now() },
        lastLoginDate: { type: Date, default: Date.now() },
        LastUpdate: { type: Date, default: Date.now() },
        userDisableDate: { type: Date },
    },
    userFacebookInfo: {
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


}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);