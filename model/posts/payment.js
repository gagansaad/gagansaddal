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
        enum: [`active`,`inactive`,`draft`],
        required: true,
        default: "draft"
      
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
