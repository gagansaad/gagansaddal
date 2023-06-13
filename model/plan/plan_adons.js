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
         amount:defaultPriceProperty,
         currency: defaultCurrencyProperty,
         duration:{type:Number},    
       }],
    plan_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: `plan`,
    },
    example_title:defaultStringConfig,
    example_description:defaultStringConfig,
    example_image:defaultStringConfig,
}, { timestamps: true });

module.exports = mongoose.model('plan_addons', addPlanSchema);