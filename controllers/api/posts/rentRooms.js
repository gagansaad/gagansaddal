const { json, query } = require("express");
const crypto = require('crypto');
const { listeners } = require("../../../model/posts/roomRents");
const {mongoose,ObjectId, modelNames} = require("mongoose"),
  RoomRentsAds = mongoose.model("rental"),
  PostViews = mongoose.model("Post_view"),
  Users = mongoose.model("user"),
  Media = mongoose.model("media"),
  tagline_keywords = mongoose.model("keywords"),
  {
    successJSONResponse,
    failureJSONResponse,
    ModelNameByAdsType
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
  } = require(`../../../utils/validators`);

exports.fetchDynamicsData = async (req, res, next) => {
 
  let records;
  
   records = await tagline_keywords
    .find()
    .select({ keywords: 1, _id: 1 });
  
  // console.log(records,"tere tag tag tere");
  const objtSend = {
    tagline: records,
    rental_type: [
      "Rooms for Rent",
      "Commercial Property for Rent",
      "Other Rentals",
    ],
    category_Room: ["Apartment", "Condo", "Townhouse", "House", "Basement"],
    category_Commercial_Property: [
      "Commercial Building",
      "Office",
      "Parking Space",
      "Warehouse",
      "Venues",
    ],
    category_Other: [
      "Limousine",
      "Trucks",
      "Wedding Appliances",
      "Wedding Clothes",
      "Cars",
      "DJ Equipment",
      "Event Decorations",
      "Other",
    ],
    currency: ["USD", "AED", "AUD", "AWG", "CAD", "EUR", "GBP", "INR", "USN"],
    rent_info: [
      "/month",
      "/week",
      "/day", 
    ],
    roomType: [`Single`, `Double`, `Triple`, `Quad`],
    occupation: [`employed`, `self employed`, `engineer`],
    gender: ["Male", "Female", "Any Gender"],
    prefered_age: ["18-30", "18-50", "18-Any"],
    whoAreU: [`Owner`, `Broker`, `Company`],
    Accommodates: [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`],
    attachedBathRoom: [`1`, `2`, `3`, `4`, `5`, `6`, `7`, `8`, `9`],
    furnished: ["Not Furnished", "Semi Furnished", "Fully Furnished"],
  };

  return successJSONResponse(res, {
    message: `success`,
    data: objtSend,
  });
};

exports.fetchRoomData = async (req, res, next) => {
  try {
    const { longitude, latitude } = req.query; // Get longitude and latitude from the request query parameters
    let maxDistance = req.query.maxDistance || 200;
    const sub_categories = {
      "Rooms for Rent": [
        "Apartment", 
        "Condo",
        "Townhouse",
        "House",
        "Basement",
      ],
      "Commercial Property for Rent": [
        "Commercial Building",
        "Office",
        "Parking Space",
        "Warehouse",
        "Venues",
      ],
      "Other Rentals": [
        "Limousine",
        "Trucks",
        "Wedding Appliances",
        "Wedding Clothes",
        "Cars",
        "DJ Equipment",
        "Event Decorations",
        "Other",
      ],
    };
    
    const responseArray = [];
    const lalcount = []
    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];

      for (const subCategory of subCategoryArray) {
        const currentDate = new Date();
        // Convert the date to ISO 8601 format
        const currentISODate = currentDate.toISOString();
        // Extract only the date portion
        const currentDateOnly = currentISODate.substring(0, 10);
       
       
        const query = {
          "adsInfo.rental_type": category,
          "adsInfo.category": subCategory,
          "status": "active",
          "plan_validity.expired_on": { $gte: currentDateOnly },
        };
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
        const count = await RoomRentsAds.countDocuments(query);
        subcategoryData.push({ sub_category_name: subCategory, count });
      }

      const totalCount = subcategoryData.reduce((total, item) => total + item.count, 0);
      lalcount.push(totalCount)
   
      responseArray.push({
        name: category,
        count: totalCount,
        sub_categories: subcategoryData,
      });
    }

    let RedZone = lalcount.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return successJSONResponse(res, {
      message: `success`,
      totalCount:RedZone,
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









exports.validateRoomRentsAdsData = async (req, res, next) => {
  try {
    const {
      status,
      adsType,
      rental_type,
      category,
      title,
      descriptions,
      roomType,
      listerType,
      accommodates,
      furnished,
      attachedBath,
      amount,
      prefered_age,
      negotiable,
      isSmokingAllowed,
      isAlcoholAllowed,
      isPetFriendly,
      latitude,
      longitude,
      // occupation,
      preferedGender,
      location_name,
      tagline,
    } = req.body;
    // console.log(req.body);
    // accommodates: '',
    // attachedBath: '',
    // amount: '',
    // negotiable: '',
    // prefered_age: '',
    // isSmokingAllowed: '',
    // isAlcoholAllowed: '',
    // isPetFriendly: '',
    // occupation: ''

    if (
      status &&
      status != `active` &&
      status != `inactive` &&
      status != `draft`
    )
      return failureJSONResponse(res, {
        message: `Please enter status active inactive or draft`,
      });
    if (!adsType)
      return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (adsType && !isValidMongoObjId(mongoose, adsType))
      return failureJSONResponse(res, {
        message: `Please provide valid ads type`,
      });
    if (!isValidString(rental_type))
      return failureJSONResponse(res, {
        message: `Please provide valid rental type`,
      });
      if (!latitude && !longitude) {
        return failureJSONResponse(res, {
          message: `Please provide both latitude and longitude`,
        });
      }
    if (!isValidString(category))
      return failureJSONResponse(res, {
        message: `Please provide valid category`,
      });
    if (!isValidString(title))
      return failureJSONResponse(res, {
        message: `Please provide valid title`,
      });
    if (!isValidString(descriptions))
      return failureJSONResponse(res, {
        message: `Please provide valid descriptions`,
      });
    // if (!isValidString(listerType)) return failureJSONResponse(res, { message: `Please provide valid listerType` });
    // if (!isValidString(roomType)) return failureJSONResponse(res, { message: `Please provide valid roomType` });
    // if (!attachedBath) return failureJSONResponse(res, { message: `Please provide valid attachedBath` });
    // if (isNaN(Number(attachedBath))) return failureJSONResponse(res, { message: `Please provide valid no. of attached Bath` });
    // if (!accommodates) return failureJSONResponse(res, { message: `Please provide valid accommodates` });
    // if (isNaN(Number(accommodates))) return failureJSONResponse(res, { message: `Please provide valid no. of accommodates` });
    // if (!isValidString(furnished)) return failureJSONResponse(res, { message: `Please provide valid furnished` });
    // if (!isValidString(location_name))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid location`,
    //   });
    // if (!isValidString(tagline)) return failureJSONResponse(res, { message: `Please provide valid tagline` });
    // if (!isValidString(preferedGender)) return failureJSONResponse(res, { message: `Please provide valid preferredGender` });
    // else if (preferedGender != `Male` && preferedGender != `Female` && preferedGender != "Any Gender") return failureJSONResponse(res, { message: `Please enter preferred_gender Male,Female or Any Gender` });
    // if (!amount) return failureJSONResponse(res, { message: `Please provide valid amount` });
    if (amount && isNaN(Number(amount)))
      return failureJSONResponse(res, {
        message: `please provide valid rent amount`,
      });
    // if (!negotiable) return failureJSONResponse(res, { message: `Please provide valid negotiable (true/false)` });
    // else if (negotiable != `true` && negotiable != `false`) return failureJSONResponse(res, { message: `Please provide valid negotiable (true/false)` });

    //  if (!isValidBoolean(isSmokingAllowed)) return failureJSONResponse(res, { message: `Please provide boolean value for Smoking Allowed` });
    //  if (!isValidBoolean(isAlcoholAllowed)) return failureJSONResponse(res, { message: `Please provide boolean value for Alcohol Allowed` });
    //  if (!isValidBoolean(isPetFriendly)) return failureJSONResponse(res, { message: `Please provide boolean value for PetFriendly` });

    return next();
  } catch (err) {
    console.log(err);
  }
};
////////////////////
exports.validateListerBasicinfo = async (req, res, next) => {
  try {
    const {
      email_address,
      // phoneNumber,
      // countryCode,
      hideAddress,
      preferableModeContact,
    } = req.body;
    // console.log(typeof hideAddress, "yyyyyyyyyyyyyyyyyyyyyy");
    // console.log(
    //   "isValidBoolean(hideAddress)isValidBoolean(hideAddress)isValidBoolean(hideAddress)",
    //   isValidBoolean(hideAddress)
    // );
    // if (countryCode && isNaN(Number(countryCode)))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid country code`,
    // });
    // if (preferableModeContact) {
    //     if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".")) {
    //         return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
    //     } else if (preferableModeContact != 1 && preferableModeContact != 2 && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` }); }
    // }
    // if (preferableModeContact && isNaN(Number(preferableModeContact))) {
    //     return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
    // }
    if (email_address && !isValidEmailAddress(email_address)) {
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
    }

    // console.log("isValidBoolean(hideAddress)",typeof isValidBoolean(hideAddress));

    // if (["true", "false"].includes(hideAddress) == false) {
    //     return failureJSONResponse(res, {
    //         message: `Please provide us hide/show address (true/false)`
    //     })
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

////////////////////

exports.creatingRoomRentsAds = async (req, res, next) => {
  const {
    isfeatured,
    status,
    adsType,
    rental_type,
    category,
    title,
    descriptions,
    roomType,
    custom_date,
    listerType,
    accommodates,
    furnished,
    attachedBath,
    amount,
    rent_info,
    currency,
    negotiable,
    is_contact,
    prefered_age,
    isSmokingAllowed,
    isAlcoholAllowed,
    isPetFriendly,
    // occupation,
    preferedGender,
    location_name,
    tagline,
    latitude,
    longitude
  } = req.body;
  // console.log(negotiable,is_contact,"----------------------------------------------------------------------------------------------------------");
  // console.log(req.body,"+++++++++++++++++++++++++++++++++++++++++++{++++++++++++++++++++");
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

  const userId = req.userId;

  const imageArr = [];

  if (req.files) {
    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;
      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
    }
  }

  let iscontact = false;
  if (is_contact == "true") {
    iscontact = true;
  }
  let negotible = false;
  if (negotiable == "true") {
    negotible = true;
  } 
  let isSmokin = false;
  let isAlcoho = false;
  let isPetFr = false;

  if (isSmokingAllowed == "true") {
    isSmokin = true;
  } else if (isSmokingAllowed == "false") {
    isSmokin = false;
  }
  if (isAlcoholAllowed == "true") {
    isAlcoho = true;
  } else if (isAlcoholAllowed == "false") {
    isAlcoho = false;
  }
  if (isPetFriendly == "true") {
    isPetFr = true;
  } else if (isPetFriendly == "false") {
    isPetFr = false;
  }
  let immidiate = false;
  if (!custom_date) {
    immidiate = true;
  } else {
    immidiate = false;
  }
  // let prefered_ag;
  // if (prefered_age) {
  //     prefered_ag= JSON.parse(prefered_age)
  // }
  const dataObj = {
    isfeatured,
    status: status,
    adsType,
    adsInfo: {
      rental_type,
      category,
      title,
      descriptions,
      roomType,
      furnished,
      availability: {
        custom_date,
        immidiate,
      },
      prefered_age,
      listerType,
      accommodates,
      attachedBath,
      rent: {
        amount: amount,
        negotiable: negotible,
        is_contact: iscontact,
        currency: currency,
      },
      rent_info,
      isSmokingAllowed: isSmokin,
      isAlcoholAllowed: isAlcoho,
      isPetFriendly: isPetFr,
      // occupation,
      preferedGender: preferedGender,
      location:{
        location_name:location_name,
        coordinates:[longitude,latitude]
      },
      tagline: taglines,
      image: imageArr,
    },

    userId: userId,
  };

  // console.log(dataObj, "jdnjd---------------------------------");
  const newRoomRentPost = await RoomRentsAds.create(dataObj);
  const stringToHash = newRoomRentPost._id.toString();
  // console.log(stringToHash,"hbvhjd xb hdbhd vhdb hnd  ddb nhd nhdb nd  b cn dn n",newRoomRentPost._id);
  const hash = await crypto.createHash('sha256').update(stringToHash).digest('hex');
  const truncatedHash = hash.slice(0, 10);
  const numericHash = parseInt(truncatedHash, 16) % (Math.pow(10, 10));
  let ad_Id = numericHash.toString().padStart(10, '0') 

 await RoomRentsAds.findByIdAndUpdate({_id:newRoomRentPost._id},{$set:{advertisement_id:ad_Id}})
  // console.log(hahyekalu,"dkvjdvdvjds jdfnmv jdfm nmdsvj mfj m  mj fdj mn vfm ");
  const roomtRentObjToSend = {};

  for (let key in newRoomRentPost.toObject()) {
    if (
      !fieldsToExclude.hasOwnProperty(String(key)) &&
      !listerBasicInfo.hasOwnProperty(String(key))
    ) {
      roomtRentObjToSend[key] = newRoomRentPost[key];
    }
  }
// console.log(roomtRentObjToSend);
  return successJSONResponse(res, {
    message: `success`,
    roomtRentObjToSend,
    status: 200,
  });
};
exports.editRoomRentAds = async (req, res, next) => {
  const roomRentId = req?.params?.roomRentId;

  if (!roomRentId)
    return successJSONResponse(res, {
      message: `success`,
      newRoomRentPost,
      status: 200,
    });

  const {
    status,
    adsType,
    rental_type,
    category,
    title,
    descriptions,
    roomType,
    custom_date,
    listerType,
    accommodates,
    furnished,
    attachedBath,
    amount,
    currency,
    rent_info,
    negotiable,
    prefered_age,
    isSmokingAllowed,
    isAlcoholAllowed,
    isPetFriendly,
    // occupation,
    preferedGender,
    location_name,
    tagline,
    name,
    email_address,
    primary_phone_number,
    secondary_phone_number,
    website_link,
    hide_my_phone,
    hide_my_secondary_phone,
    hide_my_email,
    latitude,
    is_contact,
    longitude
  } = req.body;
  let iscontact = false;
  if (is_contact == "true") {
    iscontact = true;
  }
  // console.log(req.body,"-----------09999999999999999900000000000000000999999999999090");
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
  const imageArr = [];
  let productImages;

  for (var i = 0; i < req.files.length; i++) {
    var thumbnail = req.files[i].path;

    productImages = await Media.create({ url: thumbnail });
    imageArr.push(productImages._id);
    // console.log(productImages);
  }
  // console.log(productImages, "fvhfbbbbbbbbbbbvvbfhvfbhvbfhbvf");
  // console.log(imageArr.map());
  const dataObj = {},
    adsInfoObj = {},
    listerBasicInfoObj = {};
  let isSmokin = false;
  let isAlcoho = false;
  let isPetFr = false;
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

  if (isSmokingAllowed == "true") {
    isSmokin = true;
  } else if (isSmokingAllowed == "false") {
    isSmokin = false;
  }
  if (isAlcoholAllowed == "true") {
    isAlcoho = true;
  } else if (isAlcoholAllowed == "false") {
    isAlcoho = false;
  }
  if (isPetFriendly == "true") {
    isPetFr = true;
  } else if (isPetFriendly == "false") {
    isPetFr = false;
  }

  let negotible = false;
  if (negotiable == "true") {
    negotible = true;
  } else {
    negotible = false;
  }
  let immidiate = false;
  if (!custom_date) {
    immidiate = true;
    // console.log(1);
  } else {
    immidiate = false;
    // console.log(2);
  }
  // console.log(immidiate);
  let rent = {};
  let availability = {};
  if (status) dataObj.status = status;
  if (adsType) dataObj.adsType = adsType;

  if (rental_type) adsInfoObj.rental_type = rental_type;
  if (category) adsInfoObj.category = category;
  if (title) adsInfoObj.title = title;
  if (rent_info) adsInfoObj.rent_info = rent_info;
  if (tagline) adsInfoObj.tagline = tagline;
  if (custom_date) availability.custom_date = custom_date;
  if (!custom_date) availability.immidiate = immidiate;
  if (availability) adsInfoObj.availability = availability;
  if (preferedGender) adsInfoObj.preferedGender = preferedGender;
  if (descriptions) adsInfoObj.descriptions = descriptions;
  if (roomType) adsInfoObj.roomType = roomType;
  if (furnished) adsInfoObj.furnished = furnished;
  if (listerType) adsInfoObj.listerType = listerType;
  if (accommodates) adsInfoObj.accommodates = accommodates;
  if (attachedBath) adsInfoObj.attachedBath = attachedBath;
  if (amount) rent.amount = amount;
  if (currency) rent.currency = currency;
  if (negotiable) rent.negotiable = negotible;
  if (is_contact) rent.is_contact = iscontact;
  if (rent) adsInfoObj.rent = rent;
  if (isSmokingAllowed) adsInfoObj.isSmokingAllowed = isSmokin;
  if (isAlcoholAllowed) adsInfoObj.isAlcoholAllowed = isAlcoho;
  if (isPetFriendly) adsInfoObj.isPetFriendly = isPetFr;

  // if (occupation) adsInfoObj.occupation = occupation;
  if (prefered_age) adsInfoObj.prefered_age = prefered_age;
let locationobj={}
if(longitude && latitude){
  locationobj={
    coordinates:[longitude,latitude]
  }
}
  if (location_name) locationobj.location_name = location_name;
  // if (longitude) locationobj.longitude = longitude;
  // if (latitude) locationobj.latitude = latitude;
  if (locationobj) adsInfoObj.location = locationobj;
  if (imageArr.length) adsInfoObj.image = imageArr;
  if (name) listerBasicInfoObj.name = name;

  // if (adsInfoObj && Object.keys(adsInfoObj).length) {
  //     dataObj.adsInfo = adsInfoObj
  // }

  const dataObjq = {
    adsInfo: adsInfoObj,
    lister_basic_info: {
      name,
      email_address,
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
  // console.log(dataObjq,"----------------------------------------");
  const updateRoomRents = await RoomRentsAds.findByIdAndUpdate(
    { _id: roomRentId },
    { $set: dataObjq },
    { new: true }
  );
  // console.log(updateRoomRents, "ebdhebhefcebcfheb");
  let updateRoomAdObjToSend = {};
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
    });
  } else {
    // console.log(updateRoomRents)
    return failureJSONResponse(res, {
      message: `Something went wrong`,
      updateRoomRents: null,
    });
  }
};

exports.fetchAll = async (req, res, next) => {
  try {
    let searchTerm = req.query.search_term || "";
    let dbQuery = {};
    const {
      userId,
      isfeatured,
      status,
      adsType,
      category,
      sub_category,
      title,
      roomType,
      listerType,
      accommodates,
      furnished,
      attachedBath,
      isSmokingAllowed,
      isAlcoholAllowed,
      isPetFriendly,
      preferedGender,
      sortBy,
      tagline,
      longitude,
      latitude,
      maxDistance,
      prefered_age,
      amount,
      negotiable,
      is_contact,
      immidiate,
      custom_date,
      add_on,
      min_price,
      max_price,
      is_favorite,
      is_myad,
    } = req.query;
    let adOnsQuery = {};
    // console.log(req.query,"aayi");
    var perPage = parseInt(req.query.perpage) || 40;
    var page = parseInt(req.query.page) || 1;
    const sortval = sortBy === "Oldest" ? { createdAt: 1 } : { createdAt: -1 };
    // console.log(longitude, latitude,'longitude, latitude');
    let Distance
    
    if(maxDistance === "0" || !maxDistance){
    
      Distance =  200000
    }else{
      Distance =maxDistance*1000
    }
  if (longitude && latitude && Distance) {
      const targetPoint = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
      adOnsQuery["adsInfo.location.coordinates"] = {
       
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance
        }
  }
      dbQuery["adsInfo.location.coordinates"] = {
       
          $near: {
            $geometry: targetPoint,
            $maxDistance: Distance
          }
        
    }
  }
  
  // console.log(dbQuery);
  // let recordss = await RoomRentsAds.find(dbQuery)
  // console.log(recordss);
  // return successJSONResponse(res, {
  //   message: `success`,
  //   total: recordss,})
  if (amount) {
    // Add filter for rent amount
    dbQuery["adsInfo.rent.amount"] = { $lte: amount };
  }
  if (min_price && max_price) {
    dbQuery["adsInfo.rent.amount"] = {
      $gte: parseFloat(min_price),
      $lte: parseFloat(max_price)
    };
  }
  
  if (add_on){
    dbQuery = {
      "addons_validity": {
        $elemMatch: {
          "name": add_on,
          "expired_on": {
            $gte: new Date("2023-09-18").toISOString() // Construct ISODate manually
          }
        }
      }
    };
  }
  if (custom_date) {
    // Add filter for availability custom_date
    dbQuery["adsInfo.availability.custom_date"] = custom_date;
  }
  if (negotiable !== undefined) {
    // Add filter for negotiable
    dbQuery["adsInfo.rent.negotiable"] = negotiable === true || negotiable === "true";
  }
  
  if (is_contact !== undefined) {
    // Add filter for is_contact
    dbQuery["adsInfo.rent.is_contact"] = is_contact === true || is_contact === "true";
  }
  if (immidiate !== undefined) {
    // Add filter for availability immidiate
    dbQuery["adsInfo.availability.immidiate"] = immidiate === "true" || immidiate === true;
  }
if (isfeatured) dbQuery.isfeatured = isfeatured;
if (status) dbQuery.status = status;
if (adsType) dbQuery.adsType = adsType;
if (category) dbQuery["adsInfo.rental_type"] = category;
if (sub_category) dbQuery["adsInfo.category"] = sub_category;
if (title) dbQuery["adsInfo.title"] = title;
if (roomType) dbQuery["adsInfo.roomType"] = roomType;
if (listerType) dbQuery["adsInfo.listerType"] = listerType;
if (accommodates) dbQuery["adsInfo.accommodates"] = accommodates;
if (furnished) dbQuery["adsInfo.furnished"] = furnished;
if (attachedBath) dbQuery["adsInfo.attachedBath"] = attachedBath;
if (isSmokingAllowed) dbQuery["adsInfo.isSmokingAllowed"] = isSmokingAllowed;
if (isAlcoholAllowed) dbQuery["adsInfo.isAlcoholAllowed"] = isAlcoholAllowed;
if (isPetFriendly) dbQuery["adsInfo.isPetFriendly"] = isPetFriendly;
if (preferedGender) dbQuery["adsInfo.preferedGender"] = preferedGender;


if (prefered_age) {
  // Convert prefered_age to an array if it's not already
  const preferedAgeArray = Array.isArray(prefered_age) ? prefered_age : [prefered_age];

  // Add $in query to filter based on prefered_age
  dbQuery["adsInfo.prefered_age"] = {
    $in: preferedAgeArray,
  };
}
    // Get the current date
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    let myid = req.userId;
    if(is_myad != 'true'){
    dbQuery.status = "active";
    dbQuery["plan_validity.expired_on"] = { $gte: currentDateOnly };
    adOnsQuery.status = "active";
    adOnsQuery["plan_validity.expired_on"] = { $gte: currentDateOnly };
    }else{
      dbQuery.userId = myid;
     }
    if (userId) dbQuery.userId = userId;
    let queryFinal = dbQuery;
    if (searchTerm) {
      queryFinal = {
        ...dbQuery,
        $or: [
          { "adsInfo.title": { $regex: searchTerm.trim(), $options: "i" } },
          { "adsInfo.tagline": { $regex: searchTerm.trim(), $options: "i" } }
        ]
      };
    }
    // console.log(sortval);
    
    let notification = await Users.findOne({_id:myid}).select('userNotification.rental')
    let valueofnotification = notification?.userNotification?.rental;
    let records = await RoomRentsAds.find({
      $or: [queryFinal],
    })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
      .populate({ path: "viewCount" })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({ path: 'isReported', select: 'userId', match: { userId: myid } })
      .sort(sortval)
   
      // console.log(records);
     
      const totalCount = await RoomRentsAds.find({
        $or: [queryFinal],
      });
      let responseModelCount = totalCount.length;
      // console.log(responseModelCount);
      if (records) {
        let jobData = records.map((job) => {
          return {
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite, 
            Report_count: job.ReportCount,
            is_Reported: !!job.isReported, 
          };
        });//////
        const isFavoriteFilter = is_favorite === 'true' ? true : undefined;
        if (isFavoriteFilter) {
          jobData = jobData.filter((job) => job.is_favorite === true);
        }
      
        // Pagination
        const totalCount = jobData.length;
        const perPage = parseInt(req.query.perpage) || 40;
        const page = parseInt(req.query.page) || 1;
      
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
      
        const paginatedData = jobData.slice(startIndex, endIndex);
        let featuredData;
        let bumpupData;
        if(is_myad != 'true'){
        let FeaturedData = await RoomRentsAds.find({...adOnsQuery, "addons_validity": {
          $elemMatch: {
            "name": "Featured",
            "expired_on": {
              $gte: currentDateOnly // Construct ISODate manually
            }
          }
        },})
        .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
        .populate({ path: "favoriteCount", select: "_id" })
        .populate({ path: "viewCount" })
        .populate({ path: 'isFavorite', select: 'user', match: { user: myid } });
      
      const featuredRecordsToPick = 6;
      const FeaturedpickedRecords = [];
      
      while (FeaturedpickedRecords.length < featuredRecordsToPick && FeaturedData.length > 0) {
        const randomIndex = Math.floor(Math.random() * FeaturedData.length);
        const randomRecord = FeaturedData.splice(randomIndex, 1)[0]; // Remove and pick the record
        FeaturedpickedRecords.push(randomRecord);
      }
      
        
         
          featuredData = FeaturedpickedRecords.map((job) => {
            return {
              ...job._doc,
              // Add other job fields as needed
              view_count: job.viewCount,
              favorite_count: job.favoriteCount,
              is_favorite: !!job.isFavorite,
            };
          })
        /////
        let BumpupData = await RoomRentsAds.find({...adOnsQuery, "addons_validity.name": "Bump up" })
        .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
        .populate({ path: "favoriteCount", select: "_id" })
        .populate({ path: "viewCount" })
        .populate({ path: 'isFavorite', select: 'user', match: { user: myid } });
      
      let bumpUpDates = BumpupData.map((data) => {
        // Filter addons_validity to get only the "Bump up" addon
        let bumpUpAddon = data.addons_validity.find((addon) => addon.name === "Bump up");
        if (bumpUpAddon) {
          return {
            active_on: bumpUpAddon.active_on,
            expired_on: bumpUpAddon.expired_on,
            interval: bumpUpAddon.days, // Add the interval property
          };
        }
        return null; // If "Bump up" addon is not found, return null
      }).filter((dates) => dates !== null);
      
      const resultDates = [];
      
      for (const dateRange of bumpUpDates) {
        const { active_on, expired_on, interval } = dateRange;
        const startDate = new Date(active_on);
        const endDate = new Date(expired_on);
        const recordDates = []; // Create a separate array for each record
      
        while (startDate <= endDate) {
          recordDates.push(startDate.toISOString().split("T")[0]);
          startDate.setDate(startDate.getDate() + interval);
        }
      
        resultDates.push(recordDates); // Push the record's dates array into the result array
      }
      
      
      
      const today = new Date().toISOString().split("T")[0]; // Get today's date in the format "YYYY-MM-DD"
      
      // Filter adonsData to find records where resultDates array contains today's date
      const recordsWithTodayDate = BumpupData.filter((data, index) => {
        const recordDates = resultDates[index]; // Get the resultDates array for the current record
        return recordDates.includes(today);
      });
      
      const numberOfRecordsToPick = 3;
      const pickedRecords = [];
      
      while (pickedRecords.length < numberOfRecordsToPick && recordsWithTodayDate.length > 0) {
        const randomIndex = Math.floor(Math.random() * recordsWithTodayDate.length);
        const randomRecord = recordsWithTodayDate.splice(randomIndex, 1)[0]; // Remove and pick the record
        pickedRecords.push(randomRecord);
      }
      
      
       
         bumpupData = pickedRecords.map((job) => {
          return {
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
          };
        })}
        let finalResponse = {
          message: `success`,
          total: totalCount,
          perPage: perPage,
          totalPages: Math.ceil(totalCount / perPage),
          currentPage: page,
          notification: valueofnotification,
          records: paginatedData,
          status: 200,
          ...((is_myad == 'true') ? {} : { AdOnsData: {bumpupData, featuredData } })
        };
        return successJSONResponse(res, finalResponse);
        
      } else {
      return failureJSONResponse(res, { message: `ads not Available` });
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
    let checkId = await RoomRentsAds.findOne({_id:adsId})
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
    let records = await RoomRentsAds.findOne(data_Obj)
    .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
    .populate({ path: "favoriteCount", select: "_id" })
    .populate({ path: "viewCount" })
    .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
    .populate({ path: "ReportCount", select: "_id" })
    .populate({ path: 'isReported', select: 'userId', match: { userId: myid } })
    
    if (records) {
      const ads_type =records.adsType.toString();
    
    let {ModelName,Typename}= await ModelNameByAdsType(ads_type)
    // console.log(Typename,"nfjdnfcjed");
    let dbQuery ={
      userId:myid,
      ad:records._id,
      ads_type:ads_type,
      adType:Typename
    } 
    
     let checkview = await PostViews.findOne({ $and: [{ userId: dbQuery.userId }, { ad: dbQuery.ad }] })
    //  console.log(checkview,"tere nakhre maare mainu ni mai ni jan da  tainu ni");
      if(!checkview){
      let data=  await PostViews.create(dbQuery)
      // console.log(data,"billo ni tere kale kalle naina ");
      }
      const jobData = {
        ...records._doc,
        view_count: records.viewCount,
        favorite_count: records.favoriteCount,
        is_favorite: !!records.isFavorite,
        Report_count: records.ReportCount,
        is_Reported: !!records.isReported, 
      };
      return successJSONResponse(res, {
        message: `success`,
        ads_details: jobData,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `Ads plan expired` });
    }
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
