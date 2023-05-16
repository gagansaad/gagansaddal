const mongoose = require("mongoose");
const {
    defaultStringConfig,
} = require(`../../utils/mongoose`);

const adsSubCategoriesSchema = new mongoose.Schema({

    entity: {
        ...defaultStringConfig,
        default: `adsSubCategories`,
        required: true,
        immutable: true
    },

    status: {
        type: String,
        enum: [`active`, `inactive`],
        required: true,
        default: "active"
    },

    name:{
        ...defaultStringConfig,
        required: true,
    },

    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: `adsCategory`
    }
 
}, { timestamps: true });

module.exports = mongoose.model('adsSubCategory', adsSubCategoriesSchema);
