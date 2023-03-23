const mongoose = require("mongoose");
const PostType = mongoose.model("PostType");
const { ObjectId, String, Number } = mongoose.Schema.Types;   

const adminConfigurationsSchema = new mongoose.Schema({

    adsType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PostType"
    },
    post_15: {
        package:{
            currency:{
                type: String,
                required: true
            },
            ammount:{
                type: Number,
                required: true
            }
        }
    },
    post_30: {
        package:{
            currency:{
                type: String,
                required: true
            },
            ammount:{
                type: Number,
                required: true
            }
        }
    },
    featured_15: {
        package:{
            currency:{
                type: String,
                required: true
            },
            ammount:{
                type: Number,
                required: true
            }
        }
    },
    featured_30: {
        package:{
            currency:{
                type: String,
                required: true
            },
            ammount:{
                type: Number,
                required: true
            }
        }
    },
    is_active: {
        type: Boolean,
        required: true
    },
    

}, { timestamps: true });

module.exports = mongoose.model('adminConfigurations', adminConfigurationsSchema);