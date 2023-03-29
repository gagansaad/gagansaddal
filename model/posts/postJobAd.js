const mongoose = require("mongoose");
const {
    defaultStringConfig,
} = require(`../../utils/mongoose`);

const postJobSchema = new mongoose.Schema({
    
    jobCategory: {
        title: {
            ...defaultStringConfig,
            required: true
        },
        jobTypes: {
            ...defaultStringConfig,
            required: true
        },
        jobRoles: {
            ...defaultStringConfig,
            required: true
        },
        jobTitle: {
            ...defaultStringConfig,
            required: true

        },
        jobDescription: {
            ...defaultStringConfig,
            required: true
        },
        experience: {
            type: Number,
            required: true
        },
        language: {
            ...defaultStringConfig,
            required: true
        },
        },
        salary: {
            ...defaultStringConfig,
            required: true
        },
        noOfJobOpening: {
            type: Boolean,
            required: true
        },
        genderPrefrence: {
            ...defaultStringConfig,
            required: true
        },
        website: {
            ...defaultStringConfig,
            required: true
        },
        workAuthorization: {
            ...defaultStringConfig,
            required: true
        },
        location: {
            ...defaultStringConfig,
            required: true
        },
        is_active: {
            type: Boolean,
            required: true
        },
        
        name: {
            type: String,
            required: true
        },
    
        image: [{
            ...defaultStringConfig,
            required: true
        }]

    },
    { timestamps: true });

module.exports = mongoose.model('postJobAd', postJobSchema);