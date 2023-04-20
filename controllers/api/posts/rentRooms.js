const { json } = require("express");

const mongoose = require("mongoose"),
    RoomRentsAds = mongoose.model("RoomRent"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`),
    { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
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


        if (status && (status != `active` && status != `inactive` && status != `draft`)) return failureJSONResponse(res, { message: `Please enter status active inactive or draft` });
        if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
        else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });

        if (!isValidString(title)) return failureJSONResponse(res, { message: `Please provide valid title` });
        if (!isValidString(descriptions)) return failureJSONResponse(res, { message: `Please provide valid descriptions` });
        if (!isValidString(listerType)) return failureJSONResponse(res, { message: `Please provide valid listerType` });
        if (!isValidString(roomType)) return failureJSONResponse(res, { message: `Please provide valid roomType` });

        if (isNaN(Number(attachedBath))) return failureJSONResponse(res, { message: `Please provide valid attachedBath` });
        if (isNaN(Number(accommodates))) return failureJSONResponse(res, { message: `Please provide valid accommodates` });
        if (!isValidString(furnished)) return failureJSONResponse(res, { message: `Please provide valid furnished` });
        if (isNaN(Number(rent)))
            return failureJSONResponse(res, {
                message: `please provide valid ticket_price`,
            });
        // if (!( isfeatured)) return failureJSONResponse(res, { message: `Please provide valid isfeatured (true/false)` });
        // else if (typeof  isfeatured == "boolean") return failureJSONResponse(res, { message: `Please provide boolean value for isfeatured` });

        // if (!(isSmokingAllowed)) return failureJSONResponse(res, { message: `Please provide valid isSmokingAllowed` });
        // else if (!isValidBoolean(isSmokingAllowed)) return failureJSONResponse(res, { message: `Please provide boolean value for Smoking Allowed` });



        // if (!rent) {
        //     return failureJSONResponse(res, { message: `Please provide rent` });
        // }
        // else {
        //     const amount = rent?.amount,
        //         currency = rent?.currency;

        //     if (!amount) missingData.push(`purchase price`);
        //     else if (amount && isNaN(amount)) invalidData.push(`purchase price`);


        return next();
    }
    catch (err) {
        console.log(err)
    }

}
////////////////////
exports.validateListerBasicinfo = async (req, res, next) => {

    try {
        const {
            emailAddress,
            // phoneNumber,
            // countryCode,
            hideAddress,
            preferableModeContact,
        } = req.body;
        console.log(typeof (hideAddress), "yyyyyyyyyyyyyyyyyyyyyy");
        console.log("isValidBoolean(hideAddress)isValidBoolean(hideAddress)isValidBoolean(hideAddress)", isValidBoolean(hideAddress))
        // if (countryCode && isNaN(Number(countryCode)))
        // return failureJSONResponse(res, {
        //   message: `Please provide valid country code`,
        // });
        if (preferableModeContact) {
            if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".")) {
                return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
            } else if (preferableModeContact != 1 && preferableModeContact != 2 && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` }); }
        }
        if (preferableModeContact && isNaN(Number(preferableModeContact))) {
            return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
        }
        if (emailAddress && !isValidEmailAddress(emailAddress)) {
            return failureJSONResponse(res, {
                message: `Please provide valid email address`,
            });
        }

        // console.log("isValidBoolean(hideAddress)",typeof isValidBoolean(hideAddress));

        if (["true", "false"].includes(hideAddress) == false) {
            return failureJSONResponse(res, {
                message: `Please provide us hide/show address (true/false)`
            })
        }

        // if (phoneNumber && !isValidIndianMobileNumber(phoneNumber))
        // return failureJSONResponse(res, {
        //   message: `Please provide valid phone number`,
        // });

        return next();
    } catch (err) {
        console.log(err);
    }
};

////////////////////

exports.creatingRoomRentsAds = async (req, res, next) => {

    const {
        isfeatured,
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



    } = req.body;

    const userId = req.userId;

    const imageArr = [];



    for(var i = 0; i < req.files.length; i++){
        var thumbnail = JSON.stringify(req.files[i]);
       
        productImages =  await Media.create({image:thumbnail});            
        imageArr.push(productImages._id);
        
    }
  


    const dataObj = {
        isfeatured,
        status: status,
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

        userId: userId
    }

    const newRoomRentPost = await RoomRentsAds.create(dataObj);



    const roomtRentObjToSend = {};

    for (let key in newRoomRentPost.toObject()) {
        if (!fieldsToExclude.hasOwnProperty(String(key)) && !listerBasicInfo.hasOwnProperty(String(key))) {
            roomtRentObjToSend[key] = newRoomRentPost[key];
        }
    }


    return successJSONResponse(res, {
        message: `success`,
        roomtRentObjToSend,
        status: 200,
    })

}

exports.fetchAll = async (req, res, next) => {

    try {
        const isFeatured = req.query.isfeatured;
        let dbQuery = {
            status: 1
        };

        if (isFeatured) dbQuery.isfeatured = isFeatured;
        let records = await RoomRentsAds.find(dbQuery);
        if (records) {
            return successJSONResponse(res, {
                message: `success`,
                total: Object.keys(records).length,
                records,
                status: 200,
            })
        } else {
            return failureJSONResponse(res, { message: `Room not Available` })
        }
    } catch (err) {
        return failureJSONResponse(res, { message: `something went wrong` })
    }
}

exports.editRoomRentAds = async (req, res, next) => {
    const roomRentId = req?.params?.roomRentId;

    if (!roomRentId) return successJSONResponse(res, {
        message: `success`,
        newRoomRentPost,
        status: 200,
    })


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
        image,
        name,
        emailAddress,
        countryCode,
        phoneNumber,
        hideAddress,
        preferableModeContact

    } = req.body;
    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
        var thumbnail = JSON.stringify(req.files[i]);

        productImages = await Media.create({ image: thumbnail });
        imageArr.push(productImages._id);

    }


    const dataObj = {},
        adsInfoObj = {},
        listerBasicInfoObj = {};

    if (status) dataObj.status = status;
    if (adsType) dataObj.adsType = adsType;

    if (title) adsInfoObj.title = title;

    if (preferredGender) adsInfoObj.preferredGender = preferredGender;
    if (descriptions) adsInfoObj.descriptions = descriptions;
    if (roomType) adsInfoObj.roomType = roomType;
    if (furnished) adsInfoObj.furnished = furnished;
    if (listerType) adsInfoObj.listerType = listerType;
    if (accommodates) adsInfoObj.accommodates = accommodates;
    if (attachedBath) adsInfoObj.attachedBath = attachedBath;
    if (rent) adsInfoObj.rent = rent;
    if (isSmokingAllowed) adsInfoObj.isSmokingAllowed = isSmokingAllowed;
    if (isAlcoholAllowed) adsInfoObj.isAlcoholAllowed = isAlcoholAllowed;
    if (isPetFriendly) adsInfoObj.isPetFriendly = isPetFriendly;
    if (occupation) adsInfoObj.occupation = occupation;
    if (isPetFriendly) adsInfoObj.isPetFriendly = isPetFriendly;
    if (isPetFriendly) adsInfoObj.isPetFriendly = isPetFriendly;
    if (location) adsInfoObj.location = location;
    if (imageArr.length) adsInfoObj.image = imageArr;
    if (name) listerBasicInfoObj.name = name;


    if (adsInfoObj && Object.keys(adsInfoObj).length) {
        dataObj.adsInfo = adsInfoObj
    }

    const dataObjq = {
        adsInfo: adsInfoObj,
        listerBasicInfo: {
            name,
            emailAddress,
            phoneNumber,
            hideAddress,
            mobileNumber: {
                countryCode: countryCode || ``,
                phoneNumber: phoneNumber || ``,
            },
            preferableModeContact: preferableModeContact,
        },
    };

    console.log(dataObj)

    const updateRoomRents = await RoomRentsAds.findByIdAndUpdate({ _id: roomRentId }, { $set: dataObjq }, { new: true })
    let updateRoomAdObjToSend = {}
    for (let key in updateRoomRents.toObject()) {
        if (!fieldsToExclude.hasOwnProperty(String(key))) {
            updateRoomAdObjToSend[key] = updateRoomRents[key];
        }
    }
    if (updateRoomRents) {

        // console.log(updateRoomRents)
        return successJSONResponse(res, {
            message: `success`,
            updateRoomAdObjToSend: updateRoomAdObjToSend,
        })
    } else {
        // console.log(updateRoomRents)
        return failureJSONResponse(res, {
            message: `Something went wrong`,
            updateRoomRents: null,
        })
    }


}









