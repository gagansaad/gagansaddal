const { json } = require("express");

const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
    isValidUrl,
    isValidlink,
  } = require(`../../../utils/validators`);

///-----------------------Dynamic Data---------------------------////

exports.getDnymicsData = async (req, res, next) => {
  const dynamicsData = {
    type: [`live`, `vanue based`],
  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validateEventAdsData = async (req, res, next) => {
  try {
    const {
      status,
      adsType,
      title,
      type,
      add_platform,
      details,
      ticket_price,
      location,
      link,
      image,
    } = req.body;
    if (isNaN(Number(status))) return failureJSONResponse(res, { message: `Please enter valid status` });
    else if (status < 1 || status > 3) failureJSONResponse(res, { message: `Please enter status between 1 to 3` });
    else if (status != 1 && status != 2 &&  status != 3)  return failureJSONResponse(res, { message: `Please enter status between 1 to 3` });
    if (!adsType) return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });

    if (!isValidString(title))
      return failureJSONResponse(res, {
        message: `Please provide valid title`,
      });
    if (!isValidString(type))
      return failureJSONResponse(res, {
        message: `Please provide valid type`,
      });
    if (!isValidString(add_platform))
      return failureJSONResponse(res, {
        message: `Please provide valid add_platform`,
      });
    if (!isValidString(details))
      return failureJSONResponse(res, {
        message: "Please provide valid details",
      });
    if (isNaN(Number(ticket_price)))
      return failureJSONResponse(res, {
        message: `please provide valid ticket_price`,
      });
    if (!isValidlink(link))
      return failureJSONResponse(res, { message: `please provide valid link` });
      
      if (!isValidString(location))
      return failureJSONResponse(res, { message: `please provide valid location` });
      

    return next();
  } catch (err) {
    console.log(err);
  }
};

exports.validateListerBasicinfo = async (req, res, next) => {
 
  try {
    const {
      emailAddress,
      // phoneNumber,
      // countryCode,
      hideAddress,
      preferableModeContact,
    } = req.body;
   
    // if (countryCode && isNaN(Number(countryCode)))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid country code`,
    // });
    console.log(parseInt(preferableModeContact))
    if (preferableModeContact && isNaN(Number(preferableModeContact))){
      return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
    }else if (parseInt(preferableModeContact) < 1 || parseInt(preferableModeContact) > 3 ){
      return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
    } else if (preferableModeContact != 1 && preferableModeContact != 2  && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });}
   
    if (emailAddress && !isValidEmailAddress(emailAddress)){
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
    }
      
      // console.log("isValidBoolean(hideAddress)",typeof isValidBoolean(hideAddress));

    if(["true","false"].includes(hideAddress) == false){
        return  failureJSONResponse(res, {
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



////-----------------------Create Event------------------------------//

exports.createEventAds = async (req, res, next) => {
  console.log(`ejhgjehf`)
  try {
    console.log(req.files,"dccdcdc");
    const {
      status,
      adsType,

      title,
      type,
      add_platform,
      details,
      ticket_price,
      link,
      image,
      location,

    } = req.body;

    const userId = req.userId;

    const imageArr = [];

    req.files.forEach((data) => {
      imageArr.push(data?.path);
    });

    const dataObj = {
      status: parseInt(status),
      adsType,
      adsInfo: {
        title,
        type,
        add_platform,
        details,
        ticket_price,
        link,
        image: imageArr,
        location,
      },
     
      userId: userId,
    };

    const newEventPost = await eventAd.create(dataObj);

    const postEventAdObjToSend = {};

    for (let key in newEventPost.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))&&(!listerBasicInfo.hasOwnProperty(String(key)))) {
        postEventAdObjToSend[key] = newEventPost[key];
      }
    }
    if (newEventPost) {
      return successJSONResponse(res, {
        message: `success`,
        postEventAdObjToSend:postEventAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        postEventAdObjToSend: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

///--------------------------Edit event-----------------------------///

exports.editEventAds = async (req, res, next) => {

  console.log(`hahhahahahahahha====================>>>>>>`,req.body);
  try {
    console.log(req.body);
    const eventId = req?.params?.eventId;
 
    const validate_id = await eventAd.findById(eventId)
    if (!validate_id){
    return failureJSONResponse(res, {
      message: `Failed to find your event id`,
    })}

    if (!eventId)
      return successJSONResponse(res, {
        message: `success`,
        newEventPost,
        status: 200,
      });

    const {
      status,
      adsType,
     
      title,
      type,
      add_platform,
      details,
      ticket_price,
      link,
      image,
      location,
      name,
      emailAddress,

      phoneNumber,
      countryCode,
      hideAddress,
      addressInfo,
      preferableModeContact,
    } = req.body;
    const imageArr = [];

    req.files.forEach((data) => {
      imageArr.push(data?.path);
    });

    console.log(`imageArr`, imageArr);

    const dataObj = {},
      adsInfoObj = {},
      listerBasicInfoObj = {};

    if (status) dataObj.status = parseInt(status);
    if (adsType) dataObj.adsType = adsType;

    if (title) adsInfoObj.title = title;
    if (type) adsInfoObj.type = type;
    if (add_platform) adsInfoObj.add_platform = add_platform;
    if (details) adsInfoObj.details = details;
    if (ticket_price) adsInfoObj.ticket_price = ticket_price;
    if (link) adsInfoObj.link = link;
    if (imageArr.length) adsInfoObj.image = imageArr;
    if (location) adsInfoObj.location = location;
    if (adsInfoObj && Object.keys(adsInfoObj).length) {
      dataObj.adsInfo = adsInfoObj;
    }

    const dataObjq = {
      adsInfo: adsInfoObj,
      listerBasicInfo: {
        
        name,
        emailAddress,
        phoneNumber,
        hideAddress,
        

        mobileNumber: {
          countryCode,
          phoneNumber: phoneNumber,
        },
        addressInfo,
        preferableModeContact: preferableModeContact,
      },
    };
    const updateEvent = await eventAd.findByIdAndUpdate(
      { _id: eventId },
      { $set: dataObjq },
      { new: true }
    );
    let updateEventAdObjToSend ={}
    for (let key in updateEvent.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updateEventAdObjToSend[key] = updateEvent[key];
      }
    }

    if (updateEvent) {
      return successJSONResponse(res, {
        message: `success`,
        updateEventAdObjToSend:updateEventAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updateEvent: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/////----------------------Update event Status -------------------/////

exports.editEventStatus = async (req, res, next) => {
  try {
    const eventId = req?.params?.eventId;

    if (!eventId)
      return successJSONResponse(res, {
        message: `success`,
        newJobPost,
        status: 200,
      });
    const dataObj = {};
    const { status } = req.body;

    if (status) dataObj.status = parseInt(status);

    const updateEvent = await eventAd.findByIdAndUpdate(
      { _id: eventId },
      { $set: dataObj },
      { new: true }
    );

    if (updateEvent) {
      return successJSONResponse(res, {
        message: `success`,
        updateEvent:updateEvent,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updateEvent: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};
