const mongoose = require(`mongoose`)
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const msgSchema = new mongoose.Schema({
    senderId:{
        type:String,
        index:true,
        required:true
    },
    senderName:{
        type:String,
        required:true
    },
    recieverId:{
        type:String,
        index:true,
        required:true
    },
    message : {
        text : {
            type : String,
            default : ''
        },
        image : {
            type : String,
            default : ''
        }
    },
    status : {
        type : String,
        default : 'unseen'
    }
},{timestamps : true});


exports.module = mongoose.model(`message`, msgSchema);