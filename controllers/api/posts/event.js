const { json } = require("express");
const crypto = require("crypto");
const { find } = require('geo-tz')
const { DateTime } = require('luxon');
const { mongoose, ObjectId, modelNames } = require("mongoose"),
  eventAd = mongoose.model("event"),
  Media = mongoose.model("media"),
  Users = mongoose.model("user"),
  PostViews = mongoose.model("Post_view"),
  tagline_keywords = mongoose.model("keywords"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType,
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
    isValidPlink,
  } = require(`../../../utils/validators`);


  exports.fetchOneUpdate = async (req, res, next) => {
    try {
      if (!req.query.ads_id) {
        return failureJSONResponse(res, { message: "Please provide adsId" });
      }
      if (!req.userId) {
        return failureJSONResponse(res, { message: "Please provide UserId" });
      }
  
      let dbQuery = {
        $and: [
          { _id: req.query.ads_id },
          { userid: req.userId }
        ]
      };
  
      let updateFields = {
        $set: {
          status: "deleted",
          deletedAt: new Date().toISOString(),
          "plan_validity.expired_on": new Date().toISOString(), // Set the plan validity expiry date
          "addons_validity.$[].expired_on": new Date().toISOString(), 
          "active_on_bumpup_at" :null// Add your temporary field and its value here
        }
      };
  
      let records = await eventAd.update(dbQuery, updateFields, { new: true });
  
      if (records) {
        return successJSONResponse(res, {
          message: "Success",
          status: 200,
          
        });
      } else {
        return failureJSONResponse(res, { message: "Ad not available" });
      }
    } catch (err) {
      return failureJSONResponse(res, { message: "Something went wrong" });
    }
  };
  
///-----------------------Dynamic Data---------------------------////

exports.getDnymicsData = async (req, res, next) => {
  let records = await tagline_keywords.find().select({ keywords: 1, _id: 1 });

  const dynamicsData = {
    tagline: records,
    type: [
      "Venue Based Event",
      "Live Event",
      "Both Venue based and Live Streaming Event",
    ],
    category: [
      "Sport event",
      "Festival",
      "Religious",
      "Political gatherings",
      "Community Gatherings",
      "Music concert",
      "Night party",
      "Health care advisor",
      "Education",
      "Training",
      "Food & drink",
      "Fund Raising",
      "Candlelight Vigil",
      "Drama",
      "Theatre",
      "Movie",
      "Wedding",
      "Funneral",
      "Anniversary",
      "Welcome",
      "Farewell",
      "Markets & Auction",
      "Spritual",
      "Valentines day",
      "Exhibition",
      "Seminar",
      "Aerobics",
      "Webinar",
      "Other",
    ],
    platform: [
      "Facebook",
      "Instagram",
      "Zoom",
      "Youtube",
      "Tiktok",
      "Google Meet",
      "Microsoft Teams",
      "other",
    ],
    recurring_type: ["Daily", "Weekly", "Monthly"],
    time_zone: [
      "Hawaii Standard Time",
      "Hawaii-Aleutian Daylight Time",
      "Alaska Daylight Time",
      "Pacific Daylight Time",
      "Mountain Standard Time",
      "Mountain Daylight Time",
      "Central Daylight Time",
      "Eastern Daylight Time",
    ],
    currency: ["USD", "AED", "AUD", "AWG", "CAD", "EUR", "GBP", "INR", "USN"],
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
      details,
      regular_ticket_price,
      vip_ticket_price,
      no_of_regular_ticket,
      no_of_vip_ticket,
      location_name,
      time_zone,
      start_date,
      end_date,
      start_time,
      end_time,
      recurring_type,
      image,
      venue_name,
      live_platform,
      video,
      facebook_platform,
      instagram_platform,
      zoom_platform,
      youtube_platform,
      tiktok_platform,
      other_platform,
      tagline,
      latitude,
      longitude,
    } = req.body;
    if (
      status &&
      status != `active` &&
      status != `inactive` &&
      status != `draft`
    )
      return failureJSONResponse(res, {
        message: `Please enter status active inactive or draft`,
      });
    if (!latitude && !longitude) {
      return failureJSONResponse(res, {
        message: `Please provide both latitude and longitude`,
      });
    }
    if (!adsType)
      return failureJSONResponse(res, { message: `Please provide ads type` });
    // else if (adsType && !isValidMongoObjId(mongoose, adsType)) return failureJSONResponse(res, { message: `Please provide valid ads type` });

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

    if (!isValidString(details))
      return failureJSONResponse(res, {
        message: "Please provide valid details",
      });

    if (venue_name && !isValidString(venue_name))
      return failureJSONResponse(res, {
        message: `Please provide valid  venue name`,
      });
    if (live_platform && !isValidString(live_platform))
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
    if (
      new Date(start_date) > new Date(end_date) ||
      new Date(end_date) < new Date(start_date)
    ) {
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

    // if (!isValidString(recurring_type))
    //   return failureJSONResponse(res, {
    //     message: "Please provide valid recurring type",
    //   });
    if (regular_ticket_price && isNaN(Number(regular_ticket_price)))
      return failureJSONResponse(res, {
        message: `please provide valid regular_ticket_price`,
      });
    if (vip_ticket_price && isNaN(Number(vip_ticket_price)))
      return failureJSONResponse(res, {
        message: `please provide valid vip_ticket_price`,
      });
    // if (isNaN(Number(vip_ticket)))
    //   return failureJSONResponse(res, {
    //     message: `please provide valid no. of vip ticket`,
    //   });
    // if (isNaN(Number(regular_ticket)))
    //   return failureJSONResponse(res, {
    //     message: `please provide valid no. of regular ticket`,
    //   });
    // if (isNaN(Number(vip_ticket_price)))
    //   return failureJSONResponse(res, {
    //     message: `please provide valid valid vip ticket price`,
    //   });
    if (facebook_platform && !isValidPlink(facebook_platform))
      return failureJSONResponse(res, {
        message: `please provide valid facebook link`,
      });
    if (youtube_platform && !isValidPlink(youtube_platform))
      return failureJSONResponse(res, {
        message: `please provide valid youtube link`,
      });
    if (instagram_platform && !isValidPlink(instagram_platform))
      return failureJSONResponse(res, {
        message: `please provide valid instagram link`,
      });
    if (zoom_platform && !isValidPlink(zoom_platform))
      return failureJSONResponse(res, {
        message: `please provide valid zoom link`,
      });
    if (tiktok_platform && !isValidPlink(tiktok_platform))
      return failureJSONResponse(res, {
        message: `please provide valid tiktok link`,
      });
    if (other_platform && !isValidPlink(other_platform))
      return failureJSONResponse(res, {
        message: `please provide valid other link`,
      });

    // if (link&&(!isValidlink(link)))
    //   return failureJSONResponse(res, { message: `please provide valid link` });
    // if (!isValidString(location_name))
    //   return failureJSONResponse(res, {
    //     message: `please provide valid location`,
    //   });
    // if (!isValidString(tagline))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us tagline`,
    //   });
    // if (!video && (!isValidUrl(video)))return failureJSONResponse(res, {
    //   message: `Please provide valid video link`,
    // });
    return next();
  } catch (err) {
    console.log(err);
  }
};

exports.validateListerBasicinfo = async (req, res, next) => {
  try {
    const {
      organization_name,
      hosted_by,

      emailAddress,
    } = req.body;
    if (organization_name && !isValidString(organization_name))
      return failureJSONResponse(res, {
        message: `Please provide valid organization name`,
      });
    if (hosted_by && !isValidString(hosted_by))
      return failureJSONResponse(res, {
        message: `Please provide valid hosted by`,
      });

    if (emailAddress && !isValidEmailAddress(emailAddress)) {
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
    }

    return next();
  } catch (err) {
    console.log(err);
  }
};

////-----------------------Create Event------------------------------//

exports.createEventAds = async (req, res, next) => {
  try {
    const {
      isfeatured,
      status,
      adsType,
      title,
      type,
      category,
      details,
      regular_ticket_price,
      vip_ticket_price,
      no_of_regular_ticket,
      no_of_vip_ticket,
      currency,
      time_zone,
      start_date,
      end_date,
      start_time,
      end_time,
      recurring_type,
      tagline,
      image,
      location_name,
      longitude,
      latitude,
      venue_name,
      video,
      facebook_platform,
      instagram_platform,
      zoom_platform,
      youtube_platform,
      tiktok_platform,
      other_platform,
      other_platform_name,
    } = req.body;
    // console.log(currency,"000000000",req.body);
    let taglines = tagline;
    console.log("object");
    if (taglines) {
      for (i = 0; i < taglines.length; i++) {
        let tags = await tagline_keywords.findOne({ keywords: taglines[i] });
        if (!tags) {
          let tag = {
            keywords: taglines[i],
            ads_type: adsType,
          };
          await tagline_keywords.create(tag);
        }
      }
    }

    const livePlatform = [
      "Facebook",
      "Instagram",
      "Zoom",
      "Youtube",
      "Tiktok",
      "other",
    ];
    let platforms = [];
    if (facebook_platform) {
      platforms.push({
        live_platform: livePlatform[0],
        platform_link: facebook_platform,
      });
    }
    if (instagram_platform) {
      platforms.push({
        live_platform: livePlatform[1],
        platform_link: instagram_platform,
      });
    }
    if (zoom_platform) {
      platforms.push({
        live_platform: livePlatform[2],
        platform_link: zoom_platform,
      });
    }
    if (youtube_platform) {
      platforms.push({
        live_platform: livePlatform[3],
        platform_link: youtube_platform,
      });
    }
    if (tiktok_platform) {
      platforms.push({
        live_platform: livePlatform[4],
        platform_link: tiktok_platform,
      });
    }
    // console.log(other_platform_name,other_platform,"-----------------------------------------");
    if (other_platform) {
      console.log(other_platform,other_platform.length,"abiske ka er");
      for (let i = 0; i < other_platform.length; i++) {
      platforms.push({
        live_platform: other_platform_name[i],
        platform_link: other_platform[i],
      });
    }
    }

    const userId = req.userId;

    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
    }
    function createDateTimeObject(dateString, timeString) {
      // Parse date string
      console.log(dateString, timeString,"vrkjnvjfdnvkjsdfnv kjsfnvkjsfdss");
      const dateComponents = dateString.split('/');
      const month = parseInt(dateComponents[0], 10) - 1; // Months are zero-based
      const day = parseInt(dateComponents[1], 10);
      const year = parseInt(dateComponents[2], 10);
    
      // Parse time string with AM/PM indicator
      const timeRegex = /(\d+):(\d+) (AM|PM)/i;
      const [, hoursStr, minutesStr, ampm] = timeString.match(timeRegex);
      let hours = parseInt(hoursStr, 10);
    
      // Adjust hours for PM
      if (ampm.toUpperCase() === 'PM' && hours !== 12) {
        hours += 12;
      }
    
      // Create Date object with time set to 00:00:00 and formatted as "YYYY-MM-DDTHH:mm:ssZ"
      const dateTimeObject = new Date(Date.UTC(year, month, day, hours, parseInt(minutesStr, 10), 0, 0));
    
      return dateTimeObject.toISOString();
    }
  
    const startDateObject = createDateTimeObject(start_date, start_time);
    const endDateObject = createDateTimeObject(end_date, end_time);
    let zone =find(latitude,longitude) ;
    
    let zones ;
    if(zone.length >= 0){
  zones = zone[0];
    }
    const dataObj = {
      isfeatured,
      status: status,
      adsType,
      active_on_bumpup_at:endDateObject,
      adsInfo: {
        title,
        type,
        category,
        descriptions:details,
        ticket_price: {
          regular_ticket_price,
          currency:currency,
          vip_ticket_price,
        },

        no_of_ticket: {
          no_of_regular_ticket,
          no_of_vip_ticket,
        },
        recurring_type,
        image: imageArr,
        location: {
          location_name: location_name,
          coordinates: [longitude, latitude],
        },
        venue_name,
        date_time: {
          time_zone,
          start_date:startDateObject,
          end_date:endDateObject,
          start_time,
          end_time,
        },

        live_event: platforms,
        video,
      },
      location_timezone:zones,
      tagline: taglines,
      userId: userId,
    };
    const newEventPost = await eventAd.create(dataObj);
    const stringToHash = newEventPost._id.toString();
    const hash = await crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % Math.pow(10, 10);
    let ad_Id = numericHash.toString().padStart(10, "0");

    await eventAd.findByIdAndUpdate(
      { _id: newEventPost._id },
      { $set: { advertisement_id: ad_Id } }
    );
    const postEventAdObjToSend = {};

    for (let key in newEventPost.toObject()) {
      if (
        !fieldsToExclude.hasOwnProperty(String(key)) &&
        !listerBasicInfo.hasOwnProperty(String(key))
      ) {
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

    const validate_id = await eventAd.findById(eventId);
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your event id`,
      });
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
      details,
      regular_ticket_price,
      vip_ticket_price,
      currency,
      no_of_regular_ticket,
      no_of_vip_ticket,
      time_zone,
      start_date,
      end_date,
      start_time,
      end_time,
      recurring_type,
      tagline,
      image,
      location_name,
      longitude,
      latitude,
      venue_name,
      facebook_platform,
      instagram_platform,
      zoom_platform,
      youtube_platform,
      tiktok_platform,
      other_platform,
      other_platform_name,
      video,
      organization_name,
      hosted_by,
      emailAddress,
      website_link,
      hide_my_phone,
      hide_my_email,
      hide_my_secondary_phone,
      primary_phone_number,
      secondary_phone_number,
    } = req.body;
    
// console.log(start_date, start_time, time_zone);
function createDateTimeObject(dateString, timeString) {
  // Parse date string
  const dateComponents = dateString.split('/');
  const month = parseInt(dateComponents[0], 10) - 1; // Months are zero-based
  const day = parseInt(dateComponents[1], 10);
  const year = parseInt(dateComponents[2], 10);

  // Parse time string with AM/PM indicator
  const timeRegex = /(\d+):(\d+) (AM|PM)/i;
  const [, hoursStr, minutesStr, ampm] = timeString.match(timeRegex);
  let hours = parseInt(hoursStr, 10);

  // Adjust hours for PM
  if (ampm.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }

  // Create Date object with the exact same date and time as provided
  const dateTimeObject = new Date(year, month, day, hours, parseInt(minutesStr, 10), 0, 0);

  return dateTimeObject.toISOString();
}

console.log(start_date);
  
    const startDateObject = createDateTimeObject(start_date, start_time);
    const endDateObject = createDateTimeObject(end_date, end_time);
    console.log(endDateObject,"Formatted Date with Time Zone:",startDateObject);
// console.log(currency,"000000000");
    let taglines = tagline;
    if (taglines) {
      for (i = 0; i < taglines.length; i++) {
        let tags = await tagline_keywords.findOne({ keywords: taglines[i] });
        if (!tags) {
          let tag = {
            keywords: taglines[i],
            ads_type: adsType,
          };
          await tagline_keywords.create(tag);
        }
      }
    }

    const livePlatform = [
      "Facebook",
      "Instagram",
      "Zoom",
      "Youtube",
      "Tiktok",
      "other",
    ];
    let platforms = [];
    if (facebook_platform) {
      platforms.push({
        live_platform: livePlatform[0],
        platform_link: facebook_platform,
      });
    }
    if (instagram_platform) {
      platforms.push({
        live_platform: livePlatform[1],
        platform_link: instagram_platform,
      });
    }
    if (zoom_platform) {
      platforms.push({
        live_platform: livePlatform[2],
        platform_link: zoom_platform,
      });
    }
    if (youtube_platform) {
      platforms.push({
        live_platform: livePlatform[3],
        platform_link: youtube_platform,
      });
    }
    if (tiktok_platform) {
      platforms.push({
        live_platform: livePlatform[4],
        platform_link: tiktok_platform,
      });
    }
    if (other_platform) {
      for (let i = 0; i < other_platform.length; i++) {
      platforms.push({
        live_platform: other_platform_name[i],
        platform_link: other_platform[i],
      });
    }
    }
    let imageArr = [];
    const existingRoomRents = await eventAd.findById(eventId);
      if (existingRoomRents) {
        imageArr = imageArr.concat(existingRoomRents.adsInfo.image || []);
      }
    if (req.files && req.files.length > 0) {
      for (var i = 0; i < req.files.length; i++) {
        var thumbnail = req.files[i].path;
    
        productImages = await Media.create({ url: thumbnail });
        imageArr.push(productImages._id);
      }
      }
      
    const dataObj = {},
      adsInfoObj = {},
      ticketPrice = {},
      listerBasicInfoObj = {};
    let no_of_ticket = {};
    let date_time = {};
    let my_phone = false;
    let my_email = false;
    let secondary_phone = false;

    if (hide_my_secondary_phone == "true") {
      secondary_phone = true;
    } else if (hide_my_secondary_phone == "false") {
      secondary_phone = false;
    }
    if (hide_my_phone == "true") {
      my_phone = true;
    } else if (hide_my_phone == "false") {
      my_phone = false;
    }

    if (hide_my_email == "true") {
      my_email = true;
    } else if (hide_my_email == "false") {
      my_email = false;
    }
    if (status) dataObj.status = status;
    if (adsType) dataObj.adsType = adsType;

    if (title) adsInfoObj.title = title;
    if (type) adsInfoObj.type = type;
    if (category) adsInfoObj.category = category;
    if (details) adsInfoObj.descriptions = details;
    if (time_zone) date_time.time_zone = time_zone;
    if (start_date) date_time.start_date = startDateObject;
    if (end_date) date_time.end_date = endDateObject;
    if (start_time) date_time.start_time = start_time;
    if (end_time) date_time.end_time = end_time;
    if (date_time) adsInfoObj.date_time = date_time;
    if (recurring_type) adsInfoObj.recurring_type = recurring_type;
    // if (acuurency) adsInfoObj.acuurency = acuurency;
    if (venue_name) adsInfoObj.venue_name = venue_name;
    if (regular_ticket_price)
      ticketPrice.regular_ticket_price = regular_ticket_price;
    if (no_of_vip_ticket) no_of_ticket.no_of_vip_ticket = no_of_vip_ticket;
    if (no_of_regular_ticket)
      no_of_ticket.no_of_regular_ticket = no_of_regular_ticket;
    if (no_of_ticket) adsInfoObj.no_of_ticket = no_of_ticket;
    if (vip_ticket_price) ticketPrice.vip_ticket_price = vip_ticket_price;
    if (currency) ticketPrice.currency = currency;
    if (ticketPrice) adsInfoObj.ticket_price = ticketPrice;
    if (imageArr.length) adsInfoObj.image = imageArr;
    if (platforms.length) adsInfoObj.live_event = platforms;
    let locationobj = {};
    if (longitude && latitude) {
      locationobj = {
        coordinates: [longitude, latitude],
      };
    }
    if (location_name) locationobj.location_name = location_name;
    if (locationobj) adsInfoObj.location = locationobj;
    if (tagline) adsInfoObj.tagline = taglines;
    if (video) adsInfoObj.video = video;
    // if (adsInfoObj && Object.keys(adsInfoObj).length) {
    //   dataObj.adsInfo = adsInfoObj;
    // }
    let zone =find(latitude,longitude) ;
   
    let zones ;
    if(zone.length >= 0){
  zones = zone[0];
    }
    const dataObjq = {
      active_on_bumpup_at:endDateObject,
      adsInfo: adsInfoObj,
      lister_basic_info: {
        organization_name,
        name: hosted_by,
        emailAddress,
        website_link,
        hide_my_phone: my_phone,
        hide_my_email: my_email,
        hide_my_secondary_phone: secondary_phone,
        primary_mobile_number: {
          country_code: +91,
          primary_phone_number: primary_phone_number,
        },
        secondary_mobile_number: {
          country_code: +91,
          secondary_phone_number: secondary_phone_number,
        },
      },
      location_timezone:zones,
    };
    const updateEvent = await eventAd.findByIdAndUpdate(
      { _id: eventId },
      { $set: dataObjq },
      { new: true }
    );
    let updateEventAdObjToSend = {};
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
    let searchTerm = req.query.search_term || "";
    let dbQuery = {};
    const {
      status,
      title,
      type,
      category,
      details,
      recurring_type,
      start_date,
      end_date,
      start_time,
      end_time,
      time_zone,
      regular_ticket_price,
      min_price,
      max_price,
      tagline,
      location,
      venue_name,
      sortBy,
      longitude,
      latitude,
      maxDistance,
      add_on,
      is_favorite,
      is_myad,
      is_homepage
    } = req.query;
    let adOnsQuery = {};
    if (add_on) {
      dbQuery = {
        addons_validity: {
          $elemMatch: {
            name: add_on,
            expired_on: {
              $gte: new Date().toISOString(), // Construct ISODate manually
            },
          },
        },
      };
    }
    const sortval = sortBy === "Oldest" ? { 'plan_validity.active_on': 1 } : { 'plan_validity.active_on': -1 };
    let Distance;
    if (regular_ticket_price) {
      dbQuery["adsInfo.ticket_price.regular_ticket_price"] = {
        $lte: parseFloat(regular_ticket_price), // Parse the input as a float if it's not already
      };
    }
    if (min_price && max_price) {
      dbQuery["adsInfo.ticket_price.regular_ticket_price"] = {
        $gte: parseFloat(min_price),
        $lte: parseFloat(max_price),
      };
    }

    if (recurring_type) {
      dbQuery["adsInfo.recurring_type"] = recurring_type;
    }

    if (start_time && end_time) {
      dbQuery["adsInfo.date_time.start_time"] = {
        $gte: start_time,
      };
      dbQuery["adsInfo.date_time.end_time"] = {
        $lte: end_time,
      };
    } else if (start_time) {
      dbQuery["adsInfo.date_time.start_time"] = {
        $gte: start_time,
      };
    } else if (end_time) {
      dbQuery["adsInfo.date_time.end_time"] = {
        $lte: end_time,
      };
    }
    if (time_zone) {
      dbQuery["adsInfo.date_time.time_zone"] = time_zone;
    }
    time_zone;
    if (start_date && end_date) {
      dbQuery["adsInfo.date_time.start_date"] = {
        $gte: start_date,
      };
      dbQuery["adsInfo.date_time.end_date"] = {
        $lte: end_date,
      };
    } else if (start_date) {
      dbQuery["adsInfo.date_time.start_date"] = {
        $gte: start_date,
      };
    } else if (end_date) {
      dbQuery["adsInfo.date_time.end_date"] = {
        $lte: end_date,
      };
    }

    if (maxDistance === "0" || !maxDistance) {
      Distance = 200000;
    } else {
      Distance = maxDistance * 1000;
    }
    if (longitude && latitude && Distance) {
      const targetPoint = {
        type: "Point",
        coordinates: [longitude, latitude],
      };

      adOnsQuery["adsInfo.location.coordinates"] = {
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance,
        },
      };

      // dbQuery["adsInfo.location.coordinates"] = {
      //   $near: {
      //     $geometry: targetPoint,
      //     $maxDistance: Distance,
      //   },
      // };
    }
    let locationQuery = {}; // Separate object for location filter

    if (longitude && latitude && Distance) {
      const targetPoint = {
        type: "Point",
        coordinates: [longitude, latitude],
      };
      locationQuery["adsInfo.location.coordinates"] = {
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance,
        },
      };
    }
    let addOnsQuery = {}; // Separate object for add_on filter

    if (add_on) {
      addOnsQuery = {
        addons_validity: {
          $elemMatch: {
            name: add_on,
            expired_on: {
              $gte: new Date().toISOString(),
            },
          },
        },
      };
    }

    var perPage = parseInt(req.query.perpage) || 40;
    var page = parseInt(req.query.page) || 1;

   

    if (title) {
      dbQuery["adsInfo.title"] = title;
    }

    if (type) {
      dbQuery["adsInfo.type"] = type;
    }

    if (category) {
      dbQuery["adsInfo.category"] = category;
      adOnsQuery["adsInfo.category"] = category;
    }

    if (details) {
      dbQuery["adsInfo.descriptions"] = details;
    }

    if (recurring_type) {
      dbQuery["adsInfo.recurring_type"] = recurring_type;
    }

    if (tagline) {
      dbQuery["adsInfo.tagline"] = tagline;
    }

    if (location) {
      dbQuery["adsInfo.location"] = location;
    }

    if (venue_name) {
      dbQuery["adsInfo.venue_name"] = venue_name;
    }
    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    let myid = req.userId;
    if (is_myad == "true" && !myid) {
      return failureJSONResponse(res, {
        message: "Please login to your account",
      });
    }
    if (is_myad != "true") {
      dbQuery.status = "active";
      dbQuery["plan_validity.expired_on"] = { $gte: currentISODate };
      adOnsQuery.status = "active";
      adOnsQuery["plan_validity.expired_on"] = { $gte: currentISODate };
    } else {
      if (status == 0) {
        dbQuery.status = "active";
      }
      if (status == 1) {
        dbQuery.status = { $in: ["inactive", "deleted"] };
      }
      if (status == 2) {
        dbQuery.status = "draft";
      }
      dbQuery.userId = myid;
    }
    dbQuery ={  ...dbQuery,
      ...locationQuery,
      ...addOnsQuery,}
    let queryFinal = dbQuery;
    if (searchTerm) {
      const searchTermsArray = searchTerm.trim().split(/\s+/);

// Create an array of regular expressions for each term
const regexArray = searchTermsArray.map(term => new RegExp(term, 'i'));
      adOnsQuery.$or = [
        // { "adsInfo.title": { $regex: `^${searchTerm.trim()}`, $options: "i" } },
        { "adsInfo.title": { $regex: searchTerm.trim(), $options: "i" } },
        { "adsInfo.tagline": { $elemMatch: { $regex: searchTerm.trim(), $options: "i" } } },
        { "adsInfo.category":  { $regex: searchTerm.trim(), $options: "i" }},
        { "advertisement_id": searchTerm },
      ];
      queryFinal = {
        ...dbQuery,
        $or: [
          { "adsInfo.title": { $in: regexArray } },
          // { "adsInfo.tagline": { $regex: searchTerm.trim(), $options: "i" } },
          { "adsInfo.tagline": { $elemMatch: { $regex: searchTerm.trim(), $options: "i" } } },
          { "adsInfo.category":  { $regex: searchTerm.trim(), $options: "i" }},
          {"advertisement_id":searchTerm}
        ],
      };
    }

    let notification = await Users.findOne({ _id: myid }).select(
      "userNotification.event"
    );
    let valueofnotification = notification?.userNotification?.event;

      let featuredData;
      let excludedIds;
      let commonId;
      if(is_favorite != "true"){
      if (is_myad != "true") {
        let FeaturedData = await eventAd
          .find({
            ...adOnsQuery,
            addons_validity: {
              $elemMatch: {
                name: "Featured",
                expired_on: {
                  $gte: currentDateOnly, // Construct ISODate manually
                },
              },
            },
          })
          .populate({
            path: "adsInfo.image",
            strictPopulate: false,
            select: "url",
          })
          .populate({ path: "favoriteCount", select: "_id" })
          .populate({ path: "viewCount" })
          .populate({
            path: "isFavorite",
            select: "user",
            match: { user: myid },
          });
          if(FeaturedData){
            FeaturedData = FeaturedData.map(FeaturedData => FeaturedData.toObject({ virtuals: true }));
          }
        const featuredRecordsToPick = 6;
        const FeaturedpickedRecords = [];

        while (
          FeaturedpickedRecords.length < featuredRecordsToPick &&
          FeaturedData.length > 0
        ) {
          const randomIndex = Math.floor(Math.random() * FeaturedData.length);
          const randomRecord = FeaturedData.splice(randomIndex, 1)[0]; // Remove and pick the record
          FeaturedpickedRecords.push(randomRecord);
        }
        
        featuredData = FeaturedpickedRecords.map((job) => {
          return {
            ...job,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
          };
        });
        featuredData.sort((a, b) => {
          // Assuming active_on_virtual is a date, modify the comparison accordingly
          const dateA = new Date(a.active_on_virtual);
          const dateB = new Date(b.active_on_virtual);
          
          return dateB - dateA;// Ascending order, use dateB - dateA for descending
      });
         excludedIds = featuredData.map(featuredItem => featuredItem._id)
        // commonId = [...bumpId]
      }}
      let query = {
        $or: [queryFinal]
      };
      
      if(is_homepage == "true"){
        if (excludedIds && excludedIds.length > 0) {
          query._id = { $nin: excludedIds };
        }
      }
    

      let records = await eventAd
      .find(query)
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      })
      .sort(sortval);

    // const totalCount = await eventAd.find({
    //   $or: [queryFinal],
    // });
    // let responseModelCount = totalCount.length;
    records = records.map(record => record.toObject({ virtuals: true }));

    if (records) {
      
      let jobData = records.map((job) => {
        return {
          ...job,
          // Add other job fields as needed
          view_count: job.viewCount,
          favorite_count: job.favoriteCount,
          is_favorite: !!job.isFavorite,
          Report_count: job.ReportCount,
          is_Reported: !!job.isReported,
        };
      });
      const isFavoriteFilter = is_favorite === "true" ? true : undefined;
      if (isFavoriteFilter) {
        jobData = jobData.filter((job) => job.is_favorite === true);
      }
      jobData.sort((a, b) => {
        // Assuming active_on_virtual is a date, modify the comparison accordingly
        const dateA = new Date(a.active_on_virtual);
        const dateB = new Date(b.active_on_virtual);
        
        return dateB - dateA; // Ascending order, use dateB - dateA for descending
    });
      // Pagination
        let totalCount = jobData.length; 
        let totalresult;
        let paginationlength = req.query.perpage || 40
        let freedata
        // if(is_myad == "true" || searchTerm || is_favorite == "true"){
        //   totalresult = totalCount
        //   freedata = JSON.parse(paginationlength)
        // }else{
        //   console.log(totalCount);
          totalresult = totalCount 
        //   adodata =featuredData.length
        //   freedata = paginationlength - adodata
        //   freedata=Math.abs(freedata);
          paginationlength= JSON.parse(paginationlength)
        // }
      const perPage = parseInt(paginationlength) || 40;
      const page = parseInt(req.query.page) || 1;

      let paginatedData
      if (perPage === 0) {
        paginatedData = []; // Create an empty array
      } else {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
      
        paginatedData = jobData.slice(startIndex, endIndex);
      }

      let finalResponse = {
        message: `success`,
        total: totalresult,
        perPage: paginationlength,
        totalPages: Math.ceil(totalresult / perPage),
        currentPage: page,
        notification: valueofnotification,
        records: paginatedData,
        status: 200,
        ...(is_myad == "true" ? {} : { AdOnsData: { featuredData } }),
      };
      return successJSONResponse(res, finalResponse);
    } else {
      return failureJSONResponse(res, { message: `Room not Available` });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.fetchonead = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    let data_Obj;
    let checkId = await eventAd.findOne({ _id: adsId });
    if (!checkId) {
      return failureJSONResponse(res, {
        message: `Please provide valid ad id`,
      });
    }
    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    if (adsId) {
      data_Obj = {
        _id: adsId,
       
      };
    }
    let myid = req.userId;
    let records = await eventAd
      .findOne(data_Obj)
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      });
      records = records.toObject({ virtuals: true });
    if (records) {
      const ads_type = records.adsType.toString();

      let { ModelName, Typename } = await ModelNameByAdsType(ads_type);
      let dbQuery = {
        userId: myid,
        ad: records._id,
        ads_type: ads_type,
        adType: Typename,
      };

      let checkview = await PostViews.findOne({
        $and: [{ userId: dbQuery.userId }, { ad: dbQuery.ad }],
      });
      if (!checkview) {
        let data = await PostViews.create(dbQuery);
      }
      let userDetails = await Users.findById(records.userId)
      const profileImageValue = userDetails?.userBasicInfo?.profile_image;
      const profile_img = profileImageValue !== "null" ? profileImageValue : null;
      const jobData = {
        ...records,
        view_count: records.viewCount,
        favorite_count: records.favoriteCount,
        is_favorite: !!records.isFavorite,
        Report_count: records.ReportCount,
        is_Reported: !!records.isReported,
        userDetails:{
          name:userDetails.userInfo.name,
          profile_img:profile_img,
          createdAt:userDetails.createdAt
        },
      };
      return successJSONResponse(res, {
        message: `success`,
        ads_details: jobData,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `ad not Available` });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};

exports.fetchEventData = async (req, res, next) => {
  try {
    let maxDistance = req.query.maxDistance || 200;
    const sub_categories = {
      Events: [
        "Sport event",
        "Festival",
        "Religious",
        "Political gatherings",
        "Community Gatherings",
        "Music concert",
        "Night party",
        "Health care advisor",
        "Education",
        "Training",
        "Food & drink",
        "Fund Raising",
        "Candlelight Vigil",
        "Drama",
        "Theatre",
        "Movie",
        "Wedding",
        "Funneral",
        "Anniversary",
        "Welcome",
        "Farewell",
        "Markets & Auction",
        "Spritual",
        "Valentines day",
        "Exhibition",
        "Seminar",
        "Aerobics",
        "Webinar",
        "Other",
      ],
    };

    const responseArray = [];
    const lalcount = [];
    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];
      const currentDate = new Date();
      // Convert the date to ISO 8601 format
      const currentISODate = currentDate.toISOString();
      // Extract only the date portion
      const currentDateOnly = currentISODate.substring(0, 10);
      for (const subCategory of subCategoryArray) {
        const query = {
          "adsInfo.category": subCategory,
          status: "active",
          ["plan_validity.expired_on"]: { $gte: currentISODate },
        };
        if (req.query.longitude && req.query.latitude) {
          // Assuming you have longitude and latitude fields in your data
          query["adsInfo.location.coordinates"] = {
            $geoWithin: {
              $centerSphere: [
                [
                  parseFloat(req.query.longitude),
                  parseFloat(req.query.latitude),
                ],
                maxDistance / 6371, // 6371 is the Earth's radius in kilometers
              ],
            },
          };
        }
        const count = await eventAd.countDocuments(query);
        subcategoryData.push({ sub_category_name: subCategory, count });
      }

      const totalCount = subcategoryData.reduce(
        (total, item) => total + item.count,
        0
      );
      lalcount.push(totalCount);
      responseArray.push({
        name: category,
        count: totalCount,
        sub_categories: subcategoryData,
      });
    }

    let RedZone = lalcount.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    );

    return successJSONResponse(res, {
      message: `success`,
      totalCount: RedZone,
      data: responseArray,
    });
  } catch (error) {
    return failureJSONResponse(res, {
      message: "An error occurred",
      error: error.message,
    });
  }
};
