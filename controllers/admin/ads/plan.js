const { json } = require("express");

const mongoose = require("mongoose"),
    RoomRentsAds = mongoose.model("RoomRent"),
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


exports.fetchDynamicsData = async (req, res, next) => {

    const objtSend = {
        roomType: [
            `Single`,
            `Double`,
            `Triple`,
            `Quad`
        ],
        occupation: [
            `employed`,
            `self employed`,
            `engineer`,
        ],
        gender: [
            `male `,
            `female`,
            `couple`
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






