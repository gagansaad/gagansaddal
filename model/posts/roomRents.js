const mongoose = require("mongoose");

const roomRentsSchema = new mongoose.Schema({

    status: {
        type: Number,
        enum:[1,2,3],
        required: true

        //1 = active
        //2 = inactive
        //3 = draft 
    },

    adsType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `PostType`,
        required: true
    },
    adsInfo: {
        title: { 
            type: String,
            required: true
        },
        descriptions : {
            type: String,
            required: true
        },
        roomType: {
            type: String,
            required: true
        },
        listerType: {
            type: String,
            required: true

        },
        accommodates:{
            type: String,
            required: true
        },
        accommodates: {
            type: String,
            required: true
        },
        attachedBath:{
            type: String,
            required: true
        },
        rent :{
            type: Number,
            required: true
        },
        isSmokingAllowed: {
            type: Boolean,
            required: true
        },
        isAlcoholAllowed: {
            type: Boolean,
            required: true
        },
         isPetFriendly: {
            type: Boolean,
            required: true
        },
         occupation: {
            type: String,
            required: true
        },
        preferredGender :{
            type: Number,
            required: true
        },
        furnished:{
            type: String,
            required: true 
        },
        location:{
            type: String,
            required: true
        },
        image: [{
            type: String,
            required: true
        }]

    },
    listerBasicInfo :{ 
        name: {
            type: String,
            required: true
        },
        emailAddress: {
            type: String,
            required: true
        },
        mobileNumber: {
            countryCode: {
                type: String,
                required: true
            },
            phoneNumber: {
                type: String,
                required: true
            }
        },
        hideAddress:{
            type: Boolean,
            required: true
        },

        preferableModeContact: {
            type: Number,
            enum:[1,2]
        }
        
    }

}, { timestamps: true });

module.exports = mongoose.model('RoomRent', roomRentsSchema);