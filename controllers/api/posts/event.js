const { json } = require("express");
const crypto = require('crypto');
const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  Media = mongoose.model("media"),
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

///-----------------------Dynamic Data---------------------------////

exports.getDnymicsData = async (req, res, next) => {
 
  let records = await tagline_keywords
    .find()
    .select({ keywords: 1, _id: 1 });

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
    // console.log(req.body, "is validate ki body");
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
    console.log(req.body, "dccdcdc");
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
      platforms.push({
        live_platform: other_platform_name,
        platform_link: other_platform,
      });
    }

    const userId = req.userId;

    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
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
        details,
        ticket_price: {
          regular_ticket_price,
          currency,
          vip_ticket_price,
        },

        no_of_ticket: {
          no_of_regular_ticket,
          no_of_vip_ticket,
        },
        recurring_type,
        image: imageArr,
        location:{
          location_name:location_name,
          coordinates:[longitude,latitude]
        },
        venue_name,
        date_time: {
          time_zone,
          start_date,
          end_date,
          start_time,
          end_time,
        },

        live_event: platforms,
        video,
      },
      tagline: taglines,
      userId: userId,
    };

    const newEventPost = await eventAd.create(dataObj);
    const stringToHash = newEventPost._id.toString();
    const hash = await crypto.createHash('sha256').update(stringToHash).digest('hex');
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % (Math.pow(10, 10));
    let ad_Id = numericHash.toString().padStart(10, '0') 
  
   await eventAd.findByIdAndUpdate({_id:newEventPost._id},{$set:{advertisement_id:ad_Id}})
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
  console.log(req.body, "body hai je body");
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
      platforms.push({
        live_platform: other_platform_name,
        platform_link: other_platform,
      });
    }

    let imageArr = [];
    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
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
    if (details) adsInfoObj.details = details;
    if (time_zone) date_time.time_zone = time_zone;
    if (start_date) date_time.start_date = start_date;
    if (end_date) date_time.end_date = end_date;
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
    let locationobj={}
    if(longitude && latitude){
      locationobj={
        coordinates:[longitude,latitude]
      }
    }
    if (location_name) locationobj.location_name = location_name;
    if (locationobj) adsInfoObj.location = locationobj;
    if (tagline) adsInfoObj.tagline = taglines;
    if (video) adsInfoObj.video = video;
    // if (adsInfoObj && Object.keys(adsInfoObj).length) {
    //   dataObj.adsInfo = adsInfoObj;
    // }
    const dataObjq = {
      adsInfo: adsInfoObj,
      lister_basic_info: {
        organization_name,
        name:hosted_by,
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
    };
    console.log(dataObjq,"66666666666666666666666666666666666666s");
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
    let searchTerm = req.body.searchTerm;
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
      regular_ticket_price,
      tagline,
      location,
      venue_name,
      sortBy,
      longitude,
      latitude,
      maxDistance,
      add_on
    } = req.query;
    if (add_on){
      // Add filter for rent amount
      dbQuery["addons_validity.name"] = add_on;
    }
    console.log(req.query,"--------------------------------");
    const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
    // console.log(longitude, latitude,'longitude, latitude');
    let Distance
    if (regular_ticket_price) {
      dbQuery["adsInfo.ticket_price.regular_ticket_price"] = {
        $lte: parseFloat(regular_ticket_price) // Parse the input as a float if it's not already
      };
    }
    
    if (recurring_type) {
      dbQuery["adsInfo.recurring_type"] = recurring_type;
    }
    

if (start_date && end_date) {
  dbQuery["adsInfo.date_time.start_date"] = {
    $gte: start_date
  };
  dbQuery["adsInfo.date_time.end_date"] = {
    $lte: end_date
  };
} else if (start_date) {
  dbQuery["adsInfo.date_time.start_date"] = {
    $gte: start_date
  };
} else if (end_date) {
  dbQuery["adsInfo.date_time.end_date"] = {
    $lte: end_date
  };
}


    if(maxDistance === "0" || !maxDistance){
      console.log("bol");
      Distance =  200000
    }else{
      Distance =maxDistance*1000
    }
  if (longitude && latitude && Distance) {
      const targetPoint = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
      dbQuery["adsInfo.location.coordinates"] = {
       
          $near: {
            $geometry: targetPoint,
            $maxDistance: Distance
          }
        
    }
  }
    var perPage = parseInt(req.query.perpage) || 40;
    var page = parseInt(req.query.page) || 1;

    if (status) {
      dbQuery.status = status;
    }

    if (title) {
      dbQuery["adsInfo.title"] = title;
    }

    if (type) {
      dbQuery["adsInfo.type"] = type;
    }

    if (category) {
      dbQuery["adsInfo.category"] = category;
    }

    if (details) {
      dbQuery["adsInfo.details"] = details;
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
     dbQuery.status = "active";
     dbQuery["plan_validity.expired_on"] = { $gte: currentDateOnly };

    let queryFinal = dbQuery;
    if (searchTerm) {
      queryFinal = {
        ...dbQuery,
        $or: [
          { "adsInfo.title": { $regex: searchTerm, $options: "i" } },
          { "adsInfo.tagline": { $regex: searchTerm, $options: "i" } }
        ]
      };
    }
    let myid = req.userId;
    let records = await eventAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
      .sort(sortval)
      .skip(perPage * page - perPage)
      .limit(perPage);
      const totalCount = await eventAd.find({
        $or: [queryFinal],
      });
      let responseModelCount = totalCount.length;
   
    if (records) {
        const jobData = records.map((job) => {
          return {
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite, 
          };
        });
      return successJSONResponse(res, {
        message: `success`,
        total: responseModelCount,
        perPage: perPage,
        totalPages: Math.ceil(responseModelCount / perPage),
        currentPage: page,
        records:jobData,
        status: 200,
      });
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
    let data_Obj
    let checkId = await eventAd.findOne({_id:adsId})
    if(!checkId){
        return failureJSONResponse(res, { message: `Please provide valid ad id` });
    }
     // Get the current date
     const currentDate = new Date();
     // Convert the date to ISO 8601 format
     const currentISODate = currentDate.toISOString();
     // Extract only the date portion
     const currentDateOnly = currentISODate.substring(0, 10);
     if(adsId){
      data_Obj = {
          _id:adsId,
          status :"active" ,
          "plan_validity.expired_on" :{ $gte: currentDateOnly }
      }
    }
    let myid = req.userId
    let records = await eventAd.findOne(data_Obj)
    .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
    .populate({ path: "favoriteCount", select: "_id" })
    .populate({ path: "viewCount" })
    .populate({ path: 'isFavorite', select: 'user', match: { user: myid } });
    
    if (records) {
      const ads_type =records.adsType.toString();
    
    let {ModelName,Typename}= await ModelNameByAdsType(ads_type)
    console.log(Typename,"nfjdnfcjed");
    let dbQuery ={
      userId:myid,
      ad:records._id,
      adType:Typename
    } 
    
     let checkview = await PostViews.findOne({ $and: [{ userId: dbQuery.userId }, { ad: dbQuery.ad }] })
     console.log(checkview,"tere nakhre maare mainu ni mai ni jan da  tainu ni");
      if(!checkview){
      let data=  await PostViews.create(dbQuery)
      console.log(data,"billo ni tere kale kalle naina ");
      }
      const jobData = {
        ...records._doc,
        view_count: records.viewCount,
        favorite_count: records.favoriteCount,
        is_favorite: !!records.isFavorite
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
      "Events": [
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

    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];
      const currentDate = new Date();
      // Convert the date to ISO 8601 format
      const currentISODate = currentDate.toISOString();
      // Extract only the date portion
      const currentDateOnly = currentISODate.substring(0, 10);
      for (const subCategory of subCategoryArray) {
        const query = {"adsInfo.category": subCategory ,"status" :"active",["plan_validity.expired_on"]:{ $gte: currentDateOnly }};
        if (req.query.longitude && req.query.latitude) {
          // Assuming you have longitude and latitude fields in your data
          query["adsInfo.location.coordinates"] = {
            $geoWithin: {
              $centerSphere: [
                [parseFloat(req.query.longitude), parseFloat(req.query.latitude)],
                maxDistance / 6371 // 6371 is the Earth's radius in kilometers
              ]
            }
          };
        }
        const count = await eventAd.countDocuments(query);
        subcategoryData.push({ sub_category_name: subCategory, count });
      }

      const totalCount = subcategoryData.reduce((total, item) => total + item.count, 0);

      responseArray.push({
        name: category,
        count: totalCount,
        sub_categories: subcategoryData,
      });
    }

    console.log(responseArray);

    return successJSONResponse(res, {
      message: `success`,
      data: responseArray,
    });
  } catch (error) {
    console.error('Error:', error);
    return failureJSONResponse(res, {
      message: 'An error occurred',
      error: error.message,
    });
  }
};