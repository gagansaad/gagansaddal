const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    userInfo: {

        name: {
            type: String,
        },
        date_of_birth:{ type: Date, default: Date.now() },
        gender: {
            type: Number,
            enum:[1,2,3]

            // 1 = male
            // 2 = female
            // 3 = other
            
        },
        email_address: {
            type: String,
           
        },
        is_verified_email:{
            type: Boolean,
            default: false
        },
        password: { type: String },

        mobile_number: {
            country_code: {
                type: String
            },
            phone_number: {
                type: String,
            },
            is_verified:{
                type: Boolean,
                default: false
            }
        },
        is_active:{
            type: Boolean,
            default: false,
        }
    },

    user_status: {
        user_action_Status: {
            type: Number,
            required: true,
            enum: [1, 2]
        },

        // 1 disable
        // 2 enable
        // 3 enable

    },

    userBasicInfo: {
        source: { type: String, possibleValues: ['Facebook', 'Instagram', 'Email', 'Apple', 'GoogleEmail'] },
        profile_image: { type: String },

        short_bio:{
            type: String
        }, 
        my_website:{
            type: String
        }, 
        location: {
            address: { type: String },
            coordinates: [{
                type: String
            }]
        },
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
        googleId: { type: String, default: null },
        googleEmail: { type: String },
        googleToken: { type: String },
        loginOn: { type: Date, default: Date.now() },
    },

    userAppleInfo: {
        appleId: { type: String },
        appleToken: { type: String },
        appleEmail: { type: String },
        loginOn: { type: Date, default: Date.now() },
    },


}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);