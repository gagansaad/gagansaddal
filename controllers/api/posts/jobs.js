const { json } = require("express");
const { isValidString } = require("../../../utils/validators");

const mongoose = require("mongoose"),
postJobAd = mongoose.model("postJobAd"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`);


exports.getDnymicsData = async (req, res, next) => {
        const dynamicsData = {

            jobCategory: [
                `employed`,
                `self employed`,
                `engineer`,
            ],
            jobRoles: [
                `male `,
                `female`,
                `couple`
            ],

            jobTypes: [
                `Enginner`,
                `Plumber`
            ],
        
            Language: [
                `English`, `Hindi`,
            ],
           
            
            workAuthorization: [
                `test`,
                `test1`
            ],
            gender: [
                `male`,
                `female`
            ]

        }
        return successJSONResponse(res, {
            message: `success`,
            data: dynamicsData
        })
    }

    exports.createJob = async (req, res, next) => {
    //   console.log(req.body)
            try {
                const {
                 jobCategory,
                 jobType,
                 jobRoles,
                 jobTitle,
                 jobDescription,
                 experience,
                 language,
                 salary,
                 noOfJobOpening,
                 genderPrefrences,
                 website,
                 workAuthorization,
                 location,
                 uploadPhoto
                } = req.body;
        
                if (!isValidString(jobCategory)) return failureJSONResponse(res, { message: `Please provide valid jobCategory` });
                if (!isValidString(jobType)) return failureJSONResponse(res, { message: `Please provide valid jobType` });
                if (!isValidString(jobRoles)) return failureJSONResponse(res, { message: `Please provide valid jobRole` });
                if(!isValidString(jobTitle)) return failureJSONResponse(res,{message:"Pleae provide us your jobTitle"})
                if (!isValidString(jobDescription)) return failureJSONResponse(res, { message: `please provide valid jobDescription` });
                if (isNaN(Number(experience))) return failureJSONResponse(res, { message: `Please provide us your experience` });
                if (!isValidString(language)) return failureJSONResponse(res, { message: `Please provide us the information about how many languages do you know` });
                if(!isValidString(salary)) return failureJSONResponse(res,{message:`please provide us salary`});
                if(isNaN(Number(noOfJobOpening))) return failureJSONResponse(res,{message:"number of jobs opening"});
                if(!isValidString(genderPrefrences)) return failureJSONResponse(res,{message:"Please provide us your gender prefrences"});
                if(!isValidString(website)) return failureJSONResponse(res,{mesage:`Please provide us your website`});
                if(!isValidString(workAuthorization)) return failureJSONResponse (res,{mesage:`Please provide us work authorization`});
                if(!isValidString(location)) return failureJSONResponse (res,{message:"Please let us know your current location"});
                
                // return next();
                res.json({
                    message: `success`
                })
            }
            catch (err) {
                console.log(err)
            }
        
        }
        
