const mongoose = require("mongoose");

const {
    defaultStringConfig,
} = require(`../../utils/mongoose`);

const roomRentsSchema = new mongoose.Schema({

    entity: {
        ...defaultStringConfig,
        default: `adsCategories`,
        required: true,
        immutable: true
    },

    status: {
        type: String,
        enum: [1, 2],
        required: true,
        default: 1

        // 1 = active
         // 2 = inactive
    },

    name:{
        ...defaultStringConfig,
        required: true,
    },

    ads_type:{
        type: mongoose.Schema.Types.ObjectId,
        ref: `PostType`
    }
 
}, { timestamps: true });

module.exports = mongoose.model('adsCategory', roomRentsSchema);
