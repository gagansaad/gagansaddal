const { json } = require("express");


const mongoose = require("mongoose"),
    postJobAd = mongoose.model("job"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`),
    { fieldsToExclude } = require(`../../../utils/mongoose`),
    {
        isValidString,
        isValidMongoObjId,
        isValidBoolean,
        isValidDate,
        isValidEmailAddress,
        isValidIndianMobileNumber
    } = require(`../../../utils/validators`);

///------------------Dynamic Data-------------------////
exports.getDnymicsData = async (req, res, next) => {
    const dynamicsData = {

        categories: [
            `employed`,
            `self employed`,
            `engineer`,
        ],
        role: [
            `male `,
            `female`,
            `couple`
        ],

        type: [
            `Enginner`,
            `Plumber`
        ],

        language: [
            `English`, `Hindi`,
        ],


        work_authorization: [
            `test`,
            `test1`
        ],
        preferred_gender: [
            `male`,
            `female`
        ]

    }
    return successJSONResponse(res, {
        message: `success`,
        data: dynamicsData
    })
}




///-----------------------Validate Data---------------------------//


exports.validateJobAdsData = async (req, res, next) => {
    //   console.log(req.body)
    try {
        const {

            title,
            descriptions,
            categories,
            type,
            role,
            experience,
            language,
            salary,
            no_of_opening,
            website,
            work_authorization,
            location,
            preferred_gender,
            image,
        } = req.body;

        if (!isValidString(categories)) return failureJSONResponse(res, { message: `Please provide valid jobCategory` });
        if (!isValidString(type)) return failureJSONResponse(res, { message: `Please provide valid jobType` });
        if (!isValidString(role)) return failureJSONResponse(res, { message: `Please provide valid jobRole` });
        if (!isValidString(title)) return failureJSONResponse(res, { message: "Pleae provide us your jobTitle" })
        if (!isValidString(descriptions)) return failureJSONResponse(res, { message: `please provide valid jobDescription` });
        if (isNaN(Number(experience))) return failureJSONResponse(res, { message: `Please provide us your experience` });
        if (!isValidString(language)) return failureJSONResponse(res, { message: `Please provide us the information about how many languages do you know` });
        if (!isValidString(salary)) return failureJSONResponse(res, { message: `please provide us salary` });
        if (isNaN(Number(no_of_opening))) return failureJSONResponse(res, { message: "number of jobs opening" });
        if (!isValidString(preferred_gender)) return failureJSONResponse(res, { message: "Please provide us your gender prefrences" });
        if (!isValidString(website)) return failureJSONResponse(res, { mesage: `Please provide us your website` });
        if (!isValidString(work_authorization)) return failureJSONResponse(res, { mesage: `Please provide us work authorization` });
        if (!isValidString(location)) return failureJSONResponse(res, { message: "Please let us know your current location" });

        return next();

    }
    catch (err) {
        console.log(err)
    }

}


////--------------------Create Job------------------------------//


exports.createJobAds = async (req, res, next) => {
      console.log(req.body)
    try {

        const {
            status,
            adsType,

            title,
            descriptions,
            categories,
            type,
            role,
            experience,
            language,
            salary,
            no_of_opening,
            website,
            work_authorization,
            location,
            preferred_gender,



            name,
            emailAddress,
            phoneNumber,
            hideAddress,
            preferableModeContact
        } = req.body;



        const userId = req.userId;

        const imageArr = [];



        req.files.forEach((data) => {
            imageArr.push(data?.path)
        })


        const dataObj = {
            status: parseInt(status),
            adsType,
            adsInfo: {
                title,
                descriptions,
                title,
                descriptions,
                categories,
                type,
                role,
                experience,
                language,
                salary,
                no_of_opening,
                website,
                work_authorization,
                location,
                preferred_gender: parseInt(preferred_gender),
                image: imageArr
            },
            listerBasicInfo: {
                name,
                emailAddress,
                phoneNumber,
                hideAddress,

                mobileNumber: {
                    countryCode: +91,
                    phoneNumber: phoneNumber
                },
                preferableModeContact: preferableModeContact

            },
            userId: userId
        }

        const newJobPost = await postJobAd.create(dataObj);



        const postJobAdObjToSend = {};

        for (let key in newJobPost.toObject()) {
            if (!fieldsToExclude.hasOwnProperty(String(key))) {
                postJobAdObjToSend[key] = newJobPost[key];
            }
        }


        return successJSONResponse(res, {
            message: `success`,
            postJobAdObjToSend,
            status: 200,
        })

    }
    catch (err) {
        console.log(err)
    }

}



///--------------------Edit Job------------------///
exports.editJobAds = async (req, res, next) => {


    try {
        console.log(req.files)
        const jobId = req?.params?.jobId;
        console.log(jobId)
        if (!jobId) return successJSONResponse(res, {
            message: `success`,
            newJobPost,
            status: 200,
        })


        const {
            status,
            adsType,
            title,
            descriptions,
            categories,
            type,
            role,
            experience,
            language,
            salary,
            no_of_opening,
            website,
            work_authorization,
            location,
            preferred_gender,


            name,
            emailAddress,
            phoneNumber,
            hideAddress,
            preferableModeContact

        } = req.body;
        const imageArr = [];

        req.files.forEach((data) => {
            imageArr.push(data?.path)
        })

        const dataObj = {},
            adsInfo = {},
            listerBasicInfoObj = {};

        if (status) dataObj.status = parseInt(status);
        if (adsType) dataObj.adsType = adsType;

        if (title) adsInfoObj.title = title;
        if (descriptions) adsInfoObj.descriptions = descriptions;
        if (type) adsInfoObj.type = type;
        if (categories) adsInfoObj.categories = categories;
        if (role) adsInfoObj.role = role;
        if (experience) adsInfoObj.experience = experience;
        if (language) adsInfoObj.language = language;
        if (salary) adsInfoObj.salary = salary;
        if (no_of_opening) adsInfoObj.no_of_opening = no_of_opening;
        if (website) adsInfoObj.website = website;
        if (work_authorization) adsInfoObj.work_authorization = work_authorization;
        if (location) adsInfoObj.location = location;
        if (preferred_gender) adsInfoObj.preferred_gender = preferred_gender;
        if ( imageArr.length) adsInfoObj.image = imageArr;


        if (name) listerBasicInfoObj.name = name;


        if (adsInfo && Object.keys(adsInfo).length) {
            dataObj.adsInfo = adsInfo
        }

        const dataObjq = {
            adsInfo: adsInfoObj,
            listerBasicInfo: {
                name,
                emailAddress,
                phoneNumber,
                hideAddress,

                mobileNumber: {
                    countryCode: +91,
                    phoneNumber: phoneNumber
                },
                preferableModeContact: preferableModeContact

            },
      
        }

        console.log(dataObjq)


        const updateJob = await postJobAd.findByIdAndUpdate({ _id: jobId }, { $set: dataObjq }, { new: true });

        console.log(updateJob)

        if (updateJob) {

            // console.log(updateRoomRents)
            return successJSONResponse(res, {
                message: `success`,
                updateJob,
            })
        } else {
            // console.log(updateRoomRents)
            return failureJSONResponse(res, {
                message: `Something went wrong`,
                updatejob: null,
            })
        }

    } catch (err) {
        console.log(err)
    }

}