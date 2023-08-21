const mongoose = require("mongoose");
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const BannerSchema = new mongoose.Schema({
    status:{
        type:Boolean,
        default:false,
    },
    image: {
        type:String
    },
    caption: {
        type:String
    },
    target_url:{
        type:String
    },
    img_type:{
        type: String,
        enum: [`topbanner`, `sidebanner`],
        required: true,
        default: "topbanner"
    }
})
module.exports = mongoose.model('Banner', BannerSchema);
