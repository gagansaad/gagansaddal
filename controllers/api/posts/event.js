const { json } = require("express");

const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  Media = mongoose.model("media"),
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
    isValidPlink
  } = require(`../../../utils/validators`);

///-----------------------Dynamic Data---------------------------////

exports.getDnymicsData = async (req, res, next) => {
  const dynamicsData = {
    type: ["Venue Based Event", "Live Event", "Both Venue based and Live Streaming Event"],
    category: ["Sport event", "Festival", "Religious", "Music concert", "Night party", "Health care advisor", "Food & drink", "Drama", "Markets & Auction", "Spritual", "Valantines day", "Exhibition", "Seminar", "Aerobics", "Webinar", "Other"],
    platform: ["Facebook", "Instagram", "Zoom", "Youtube", "Tiktok", "other"],
    recurring_type:["Daily", "Weekly", "Monthly"],
    time_zone:[
      'America/Santiago',
      'America/Punta_Arenas',
      'America/Bogota',
      'America/Costa_Rica',
      'America/Havana',
      'America/Curacao',
      'America/Santo_Domingo',
      'America/Guayaquil',
      'America/Cayenne',
      'America/Jamaica',
      'America/Martinique',
      'America/Mexico_City',
      'America/New_York',
      'America/Los_Angeles',
    ],
    
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
      category,
      add_platform,
      details,
      ticket_price,
      vip_ticket_price,
      regular_ticket,
      vip_ticket,
      location,
      link,
      time_zone,
      start_date,
      end_date,
      start_time,
      end_time,
      recurring_type,
      image,
      venue_name,
      live_platform,
      platform_link,
      organization_name,
      hosted_by,
      host_countryCode,
      host_phoneNumber,
      video

    } = req.body;
    if (status && (status != `active` && status != `inactive` && status != `draft`)) return failureJSONResponse(res, { message: `Please enter status active inactive or draft` });
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
      if (!isValidString(category))
      return failureJSONResponse(res, {
        message: `Please provide valid category`,
      });
    if (!isValidString(add_platform))
      return failureJSONResponse(res, {
        message: `Please provide valid add_platform`,
      });
    if (!isValidString(details))
      return failureJSONResponse(res, {
        message: "Please provide valid details",
      });
      
      if (venue_name && (!isValidString(venue_name)))
      return failureJSONResponse(res, {
        message: `Please provide valid  venue name`,
      });
      if (live_platform && (!isValidString(live_platform)))
      return failureJSONResponse(res, {
        message: `Please provide valid live platform`,
      });
      if (!isValidString(time_zone))
      return failureJSONResponse(res, {
        message: "Please provide valid time zone",
      });
      if (!isValidString(start_date))
      return failureJSONResponse(res, {
        message: "Please provide valid start date",
      });
      if (!isValidString(end_date))
      return failureJSONResponse(res, {
        message: "Please provide valid end date",
      });
      if ((new Date(start_date) > new Date(end_date)) || (new Date(end_date) < new Date(start_date))) {
        return failureJSONResponse(res, {
          message: "End date should be greater than Start date",
        });
    }
      if (!isValidString(start_time))
      return failureJSONResponse(res, {
        message: "Please provide valid start time",
      });
      if (!isValidString(end_time))
      return failureJSONResponse(res, {
        message: "Please provide valid end time",
      });
      
      if (!isValidString(recurring_type))
      return failureJSONResponse(res, {
        message: "Please provide valid recurring type",
      });
    if (isNaN(Number(ticket_price)))
      return failureJSONResponse(res, {
        message: `please provide valid regular ticket price`,
      });
    if (isNaN(Number(vip_ticket)))
      return failureJSONResponse(res, {
        message: `please provide valid no. of vip ticket`,
      });
    if (isNaN(Number(regular_ticket)))
      return failureJSONResponse(res, {
        message: `please provide valid no. of regular ticket`,
      });
    if (isNaN(Number(vip_ticket_price)))
      return failureJSONResponse(res, {
        message: `please provide valid valid vip ticket price`,
      });
    if (platform_link && (!isValidPlink(platform_link))) return failureJSONResponse(res, { message: `please provide valid platform link` });
     
    if (!isValidlink(link))
      return failureJSONResponse(res, { message: `please provide valid link` });
    if (!isValidString(location))
      return failureJSONResponse(res, { message: `please provide valid location` });
    if (!isValidString(organization_name))
      return failureJSONResponse(res, {
        message: `Please provide valid organization name`,
      });
    if (!isValidString(hosted_by))
      return failureJSONResponse(res, {
        message: `Please provide valid hosted by`,
      });

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
    // if(preferableModeContact){
    //   if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".") ){
    //     return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
    //   } else if (preferableModeContact != 1 && preferableModeContact != 2  && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });}
    // }
    // if (preferableModeContact && isNaN(Number(preferableModeContact))){
    //   return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
    // }

    if (emailAddress && !isValidEmailAddress(emailAddress)) {
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
    }

    // console.log("isValidBoolean(hideAddress)",typeof isValidBoolean(hideAddress));

    // if (["true", "false"].includes(hideAddress) == false) {
    //   return failureJSONResponse(res, {
    //     message: `Please provide us hide/show address (true/false)`
    //   })
    // }

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
  try {
    console.log(req.files, "dccdcdc");
    const {
      isfeatured,
      status,
      adsType,

      title,
      type,
      category,
      add_platform,
      details,
     
      ticket_price,
      vip_ticket_price,
      regular_ticket,
      vip_ticket,
      link,
      time_zone,
      start_date,
      end_date,
      start_time,
      end_time,
      recurring_type,
      image,
      location,
      venue_name,
      live_platform,
      platform_link,
      organization_name,
      hosted_by,
      host_countryCode,
      host_phoneNumber,
      video

      

    } = req.body;

    const userId = req.userId;

    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path

      productImages = await Media.create({ image: thumbnail });
      imageArr.push(productImages._id);

    }

    const dataObj = {
      isfeatured,
      status: status,
      adsType,
      adsInfo: {
        title,
        type,
        category,
        add_platform,
        details,
        ticket_price,
        vip_ticket_price,
        no_of_ticket:{
          regular_ticket,
          vip_ticket,
        },
        recurring_type,
        image: imageArr,
        location,
        venue_name,
        date_time:{time_zone,
        start_date,
        end_date,
        start_time,
        end_time,},
        live_event:{
        live_platform,
        platform_link,
        },
        video
        
      },
      contactInfo:{
        organization_name,
        hosted_by,
        host_Number: {
          host_countryCode,
          host_phoneNumber,
          },
          link,
      },

      userId: userId,
    };

    const newEventPost = await eventAd.create(dataObj);

    const postEventAdObjToSend = {};

    for (let key in newEventPost.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key)) && (!listerBasicInfo.hasOwnProperty(String(key)))) {
        postEventAdObjToSend[key] = newEventPost[key];
      }
    }
    if (newEventPost) {
      return successJSONResponse(res, {
        message: `success`,
        postEventAdObjToSend: postEventAdObjToSend,
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

  try {

    const eventId = req?.params?.eventId;

    const validate_id = await eventAd.findById(eventId)
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your event id`,
      })
    }

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
      category,
      add_platform,
      details,
      ticket_price,
      vip_ticket_price,
      regular_ticket,
      vip_ticket,
      link,
      time_zone,
      start_date,
      end_date,
      start_time,
      end_time,
      recurring_type,
      image,
      location,
      venue_name,
      live_platform,
      platform_link,
      organization_name,
      hosted_by,
      host_countryCode,
      host_phoneNumber,
      video,
      name,
      emailAddress,
      phoneNumber,
      countryCode,
      hideAddress,
      addressInfo,
      preferableModeContact,
    } = req.body;

    let imageArr = []
    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path

      productImages = await Media.create({ image: thumbnail });
      imageArr.push(productImages._id);

    }

    console.log(imageArr, "bahar wala")
    const dataObj = {},
      adsInfoObj = {},
   
      listerBasicInfoObj = {};

    if (status) dataObj.status = status;
    if (adsType) dataObj.adsType = adsType;

    if (title) adsInfoObj.title = title;
    if (type) adsInfoObj.type = type;
    if (category) adsInfoObj.category = category;
    if (add_platform) adsInfoObj.add_platform = add_platform;
    if (details) adsInfoObj.details = details;
    if (time_zone) adsInfoObj.date_time.time_zone = time_zone;
    if (start_date) adsInfoObj.date_time.start_date = start_date;
    if (end_date) adsInfoObj.date_time.end_date = end_date;
    if (start_time) adsInfoObj.date_time.start_time = start_time;
    if (end_time) adsInfoObj.date_time.end_time = end_time;
    if (recurring_type) adsInfoObj.recurring_type = recurring_type;
    if (venue_name) adsInfoObj.venue_name = venue_name;
    if (live_platform) adsInfoObj.live_platform = live_platform;
    if (platform_link) adsInfoObj.platform_link = platform_link;
    if (ticket_price) adsInfoObj.ticket_price = ticket_price;
    if (vip_ticket) adsInfoObj.no_of_ticket.vip_ticket = vip_ticket;
    if (regular_ticket) adsInfoObj.no_of_ticket.regular_ticket = regular_ticket;
    if (vip_ticket_price) adsInfoObj.vip_ticket_price = vip_ticket_price;
    if (imageArr.length) adsInfoObj.image = imageArr;
    if (location) adsInfoObj.location = location;
    if (video) adsInfoObj.video = video;
    if (adsInfoObj && Object.keys(adsInfoObj).length) {
      dataObj.adsInfo = adsInfoObj;
    }

    const dataObjq = {
      adsInfo: adsInfoObj,
      contactInfo:{
        organization_name,
        hosted_by,
        host_Number: {
        host_countryCode,
        host_phoneNumber,
        },
        link,
      },
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
    let updateEventAdObjToSend = {}
    for (let key in updateEvent.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updateEventAdObjToSend[key] = updateEvent[key];
      }
    }

    if (updateEvent) {
      return successJSONResponse(res, {
        message: `success`,
        updateEventAdObjToSend: updateEventAdObjToSend,
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
        updateEvent: updateEvent,
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



////////////////
exports.fetchAll = async (req, res, next) => {
  try {
    const isFeatured = req.query.isfeatured;
    let dbQuery = {
      status: 1
    };

    if (isFeatured) dbQuery.isfeatured = isFeatured;
    let records = await eventAd.find(dbQuery);
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