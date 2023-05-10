const slug = require(`slug`); 



const toExport = {
    defaultSort: {
        createdAt: -1,
        status: 1
    },

    defaultStringConfig: {
        type: String,
        default: ``,
        trim: true
    },

    defaultBooleanConfig: {
        type: Boolean,
        default: false
    },

    defaultPriceProperty: {
        // All price amounts to be stored in smallest unit of the current we're using. So if we're using INR, then store price amount in Indian paisa
        type: Number,
        default: 0,
        // required: true,
        min: 0
    },

    get defaultCurrencyProperty() {
        return {
            ...this.defaultStringConfig,
            // required: true,
            uppercase: true,
            enum: [`INR`],
            default: `INR`, // must be ISO code
            // must be ISO codes
        }
    },

    nonEmptyArrayValidator: {
        validator: (value) => Boolean(Array.isArray(value) && (value.length > 0)),
        message: `{PATH} cannot be an empty array`
    },

    // getAlphaNumID() {
    //     return customAlphabet(charactersForShortID, 12)();
    //     /**
    //      * At rate of 10000 IDs/second; ~9 days needed, in order to have a 1% probability of at least one collision.
    //      * Checked at: https://zelark.github.io/nano-id-cc/
    //      */
    // },

    fieldsToExclude: {
        createdAt: false,
        updatedAt: false,
        __v: false
    },
    listerBasicInfo:{
        listerBasicInfo:false,
       
    },
    get fieldsToExcludeAsString() {
        return Object.keys(this.fieldsToExclude).map((key) => '-' + key).join(` `);
    },

    get mongooseEditOperationOptions() {
        return {
            new: true,
            fields: this.fieldsToExclude
        }
    },

    // getSlug(providedString = ``, charCount = 6) {
    //     return slug(String(providedString)) + `-` + customAlphabet(charactersForShortID, charCount)();
    //     /**
    //      * At rate of 500 IDs/hour; ~1 hour needed, in order to have a 1% probability of at least one collision.
    //      * Checked at: https://zelark.github.io/nano-id-cc/
    //      */
    // },

    getDefaultAddressObj(mandatoryFields = true) {
        return {
            line_1: {
                ...toExport.defaultStringConfig,
                required: mandatoryFields ? true : false
            },
            line_2: toExport.defaultStringConfig,
            city: {
                ...toExport.defaultStringConfig,
                lowercase: true,
                required: mandatoryFields ? true : false
            },
            state: {
                // Store state ISO codes
                ...toExport.defaultStringConfig,
                lowercase: true,
                required: mandatoryFields ? true : false,
                enum: [
                    null, // null value also accepted
                    ...stateList.map((stateObj) => stateObj.iso_code.toLowerCase().trim())
                ]
            },
            pincode: {
                ...toExport.defaultStringConfig,
                required: mandatoryFields ? true : false
            },
            country: {
                ...toExport.defaultStringConfig,
                lowercase: true,
                required: mandatoryFields ? true : false
            },
            landmark: toExport.defaultStringConfig
        }
    },
};


module.exports = toExport;