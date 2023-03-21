const { json } = require("express");

const mongoose = require("mongoose"),
    RoomRentsAds = mongoose.model("RoomRent"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`),
    { fieldsToExclude} = require(`../../../utils/mongoose`),
    {
        isValidString,
        isValidMongoObjId,
        isValidDate,
        isValidEmailAddress,
        isValidIndianMobileNumber
    } = require(`../../../utils/validators`);


exports.fetchDynamicsData = async (req, res, next) => {

    const objtSend = {
        roomType: [
            `Single`,
            `Double`,
            `Triple`,
            `Quad`
        ],

        whoAreU: [
            `owner`,
            `broker`
        ],
        Accommodates: [
            `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`
        ],
        attachedBathRoom: [
            `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`
        ],
        furnished: [
            `Semi-furnished`,
            `furnished`,
            `fully-furnished`
        ]
    }

    return successJSONResponse(res, {
        message: `success`,
        data: objtSend
    })

}

exports.validateRoomRentsAdsData = async (req, res, next) => {
    try {
        const {
            status,
            adsType,
            title,
            descriptions,
            roomType,
            listerType,
            accommodates,
            furnished,
            attachedBath,
            rent,
            isSmokingAllowed,
            isAlcoholAllowed,
            isPetFriendly,
            occupation,
            preferredGender,
            location,

            name,
            emailAddress,
            phoneNumber,
            hideAddress,
            preferableModeContact

        } = req.body;



        if (isNaN(Number(status))) return failureJSONResponse(res, { message: `Please enter valid status` });
        else if (status < 1 || status > 3) failureJSONResponse(res, { message: `Please enter status bwtween 1 to 3` });

        // if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
        // else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });

        if (!isValidString(title)) return failureJSONResponse(res, { message: `Please provide valid title` });
        if (!isValidString(descriptions)) return failureJSONResponse(res, { message: `Please provide valid descriptions` });
        if (!isValidString(listerType)) return failureJSONResponse(res, { message: `Please provide valid listerType` });
        if (!isValidString(roomType)) return failureJSONResponse(res, { message: `Please provide valid roomType` });

        return json({
            data: `working`
        })
    }
    catch (err) {
        console.log(err)
    }

}


exports.creatingRoomRentsAds = async (req, res, next) => {

    const {
        status,
        adsType,
        title,
        descriptions,
        roomType,
        listerType,
        accommodates,
        furnished,
        attachedBath,
        rent,
        isSmokingAllowed,
        isAlcoholAllowed,
        isPetFriendly,
        occupation,
        preferredGender,
        location,

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


    const dataObj = {
        status: parseInt(status),
        adsType,
        adsInfo: {
            title,
            descriptions,
            roomType,
            furnished,
            listerType,
            accommodates,
            attachedBath,
            rent,
            isSmokingAllowed,
            isAlcoholAllowed,
            isPetFriendly,
            occupation,
            preferredGender: parseInt(preferredGender),
            location,
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

        }
    }

    const newRoomRentPost = await RoomRentsAds.create(dataObj);



    const roomtRentObjToSend = {};

    for (let key in newRoomRentPost.toObject()) {
        if (!fieldsToExclude.hasOwnProperty(String(key))) {
            roomtRentObjToSend[key] = newRoomRentPost[key];
        }
    }


    return successJSONResponse(res, {
        message: `success`,
        roomtRentObjToSend,
        status: 200,
    })

}


exports.editRoomRentAds  = async (req, res, next) => {
    const roomRentId = req?.params?.roomRentId;

    if (!roomRentId) return successJSONResponse(res, {
        message: `success`,
        newRoomRentPost,
        status: 200,
    })

}









