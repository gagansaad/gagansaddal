const mongoose = require("mongoose");
const {
    defaultStringConfig,
    nonEmptyArrayValidator,
    defaultPriceProperty,
    defaultCurrencyProperty,
    getAlphaNumID,
    defaultBooleanConfig
} = require(`../../utils/mongoose`);

const babysitter_Schema = new mongoose.Schema({

    status: {
        type: String,
        enum: [`active`, `inactive`, `draft`],
        required: true,
        default: "draft"

        //1 = active
        //2 = inactive
        //3 = draft 
    },
    plan_validity:{
        plan_id:{type: String,trim:true},
        active_on:{type:String,trim:true},
        expired_on:{type:String,trim:true},
    },
    addons_validity:[{
        
    }],
    isfeatured: {
        type: Boolean,
        required: true,
        default: false
    },

    ads_type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: `PostType`,
        required: true
    },
    ads_info: {
        category: {
            category_value:{
                type:Number,
                required: true
            },
            category_name:{
            ...defaultStringConfig,
            required: true
           }
           
        },
        work_type:{
            ...defaultStringConfig,
        },
        care_service: [{
            ...defaultStringConfig,
        }],
        age_group: [{
            ...defaultStringConfig,
            required: true
        }],
        prefered_language:[{
            ...defaultStringConfig,
        }],
        prefered_gender:{
            ...defaultStringConfig,
            required: true
        },
        service_from_date:{
            ...defaultStringConfig,
        },
        transport_facilty:{
            type: Boolean,
            default: false
        },
        expected_salary_amount:{
            amount:{type:Number},
            currency:{type:String,default:"USD"},
        },
      expected_salary_rate:{
        ...defaultStringConfig,
        required: true
      },

        description:{
            ...defaultStringConfig,
            required: true
        },
        location:{
            ...defaultStringConfig,
            required: true
        },
        tagline:{
            type:Array
        },
        image: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: `media`,
        }],
    },
    lister_basic_info: {

        name: defaultStringConfig,
        email_address: defaultStringConfig,
        // website_link: defaultStringConfig,
        primary_mobile_number: {
            country_code: defaultStringConfig,
            primary_phone_number:defaultStringConfig,
  
          },
          secondary_mobile_number: {
            country_code: defaultStringConfig,
            secondary_phone_number:defaultStringConfig,
  
          },
        hide_my_email: defaultBooleanConfig,
        hide_my_phone: defaultBooleanConfig,
        hide_my_secondary_phone: defaultBooleanConfig,
        // preferable_contact_mode: {
        //     type: Number,
        //     enum: [1, 2, 3]
        //     //   1:  Phone Number
        //     //   2:  email Address
        //     //   3:
        // }

    

    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }

}, { timestamps: true });
babysitter_Schema.virtual("favoriteCount", {
    ref: "FavoriteAd",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });
  babysitter_Schema.virtual("isFavorite", {
    ref: "FavoriteAd",
    localField: "_id",
    foreignField: "ad",
    justOne: true,  
    match: function () {
        return { user: this.userId };
      },
  });
  babysitter_Schema.virtual("viewCount", {
    ref: "Post_view",
    localField: "_id",
    foreignField: "ad",
    count: true,
  });
module.exports = mongoose.model('babysitter & nannie', babysitter_Schema);
