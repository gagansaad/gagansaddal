
const mongoose = require("mongoose"),
    RoomRentsAds = mongoose.model("RoomRent"),
    {
        successJSONResponse,
        failureJSONResponse
    } = require(`../../../handlers/jsonResponseHandlers`),
    {
        isValidString,
        isValidDate,
        isValidEmailAddress,
        isValidIndianMobileNumber
    } = require(`../../../utils/validators`);


exports.fetchDynamicsData = async (req, res, next) => {

   const objtSend={
        roomType:[
            `Single`,
           `Double`,
           `Triple`,
           `Quad`
        ],

        whoAreU:[
            `owner`,
            `broker`
        ],
       Accommodates: [
        `1`,`2`,`3`,`4`,`5`,`6`,`7`,`8`,`9`
       ],
       attachedBathRoom: [
           `1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`
       ],
       furnished :[
           `Semi-furnished`,
           `furnished`,
           `fully-furnished` 
       ]
   }

   return successJSONResponse(res,{
       message: `success`,
       data: objtSend
   })

}

exports.validateRoomRentsAdsData = async (req, res, next) => {
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



    if (isNaN(Number(status))) return failureJSONResponse(res, { message: `Please enter status name` });
    if (isValidString(adsType)) return failureJSONResponse(res, { message: `Please enter status name` });

    if (!isValidString(googleId.trim())) return failureJSONResponse(res, { message: `google id missing` });
    if (!isValidString(googleToken.trim())) return failureJSONResponse(res, { message: `google token missing` });



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



    req.files.forEach((data)=>{
        imageArr.push(data?.path)
    })


    const dataObj = {
        status: parseInt(status),
        adsType,
        adsInfo:{
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
        listerBasicInfo:{
            name,
            emailAddress,
            phoneNumber,
            hideAddress,

            mobileNumber: {
                countryCode: +91,
                phoneNumber:phoneNumber
            },
            preferableModeContact: preferableModeContact
            
        }
    }

    const newRoomRentPost = await RoomRentsAds.create(dataObj);


    return successJSONResponse(res, {
        message: `success`,
        newRoomRentPost,
        status: 200,
    })

}




