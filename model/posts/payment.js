const mongoose = require("mongoose");

const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const roomRentsSchema = new mongoose.Schema({

    status: {
        type: String,
        enum: ["pending","success","rejected"],
        required: true,
        default: "pending"
        //1 = pending
        //2 = success
        //3 = rejected
    },  
    plan:{  
        type: mongoose.Schema.Types.ObjectId,
        ref: `adsplan`,
        required: true
      
    },
    total_amount:{
        type: Number,
    },
    price:{
        featured_price:{
            amount:{type:Number},
            currency:{type:String},
        },
        post_price:{
            amount:{type:Number},
            currency:{type:String},
        }
            },
    
    ads:{
        type:mongoose.Schema.Types.ObjectId,
    },
    ads_type:{...defaultStringConfig},
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: `user`,
        required: true
    },
    payment_intent:{

    }
    

}, { timestamps: true });

module.exports = mongoose.model('payment', roomRentsSchema);
