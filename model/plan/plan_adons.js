const mongoose = require("mongoose");
const {
    defaultStringConfig,
    defaultPriceProperty,
    defaultCurrencyProperty,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);


const addPlanSchema = new mongoose.Schema({
    name: defaultStringConfig,
    price: [{
         isfree:defaultBooleanConfig,
         amount: {type:Number},
         currency: defaultCurrencyProperty,
         duration:{type:String},
         
       }],
    plan_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: `plan`,
    },
}, { timestamps: true });

module.exports = mongoose.model('plan_addons', addPlanSchema);