const { json, query } = require("express");

const {mongoose,ObjectId} = require("mongoose"),
  RoomRentsAds = mongoose.model("rental"),
  PostViews = mongoose.model("Post_view"),
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
  let adtype = req.query.adsType;
  let records = await tagline_keywords
    .find({ adType: adtype })
    .select({ keywords: 1, _id: 1 });

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
      // occupation,
      preferedGender,
      location,
      tagline,
    } = req.body;
    console.log(req.body);
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
    if (!isValidString(location))
      return failureJSONResponse(res, {
        message: `Please provide valid location`,
      });
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
    console.log(typeof hideAddress, "yyyyyyyyyyyyyyyyyyyyyy");
    console.log(
      "isValidBoolean(hideAddress)isValidBoolean(hideAddress)isValidBoolean(hideAddress)",
      isValidBoolean(hideAddress)
    );
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
    currency,
    negotiable,
    is_contact,
    prefered_age,
    isSmokingAllowed,
    isAlcoholAllowed,
    isPetFriendly,
    // occupation,
    preferedGender,
    location,
    tagline,
  } = req.body;
  console.log(tagline, "tagggggggggggg");
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
  } else if (is_contact == "false") {
    iscontact = false;
  }
  let negotible = false;
  if (negotiable == "true") {
    negotible = true;
  } else if (negotiable == "false") {
    negotible = false;
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
      isSmokingAllowed: isSmokin,
      isAlcoholAllowed: isAlcoho,
      isPetFriendly: isPetFr,
      // occupation,
      preferedGender: preferedGender,
      location,
      tagline: taglines,
      image: imageArr,
    },

    userId: userId,
  };
  console.log(dataObj, "jdnjd");
  const newRoomRentPost = await RoomRentsAds.create(dataObj);

  const roomtRentObjToSend = {};

  for (let key in newRoomRentPost.toObject()) {
    if (
      !fieldsToExclude.hasOwnProperty(String(key)) &&
      !listerBasicInfo.hasOwnProperty(String(key))
    ) {
      roomtRentObjToSend[key] = newRoomRentPost[key];
    }
  }

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
    negotiable,
    prefered_age,
    isSmokingAllowed,
    isAlcoholAllowed,
    isPetFriendly,
    // occupation,
    preferedGender,
    location,
    tagline,
    name,
    email_address,
    primary_phone_number,
    secondary_phone_number,
    website_link,
    hide_my_phone,
    hide_my_secondary_phone,
    hide_my_email,
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
  const imageArr = [];
  let productImages;

  for (var i = 0; i < req.files.length; i++) {
    var thumbnail = req.files[i].path;

    productImages = await Media.create({ url: thumbnail });
    imageArr.push(productImages._id);
    console.log(productImages);
  }
  console.log(productImages, "fvhfbbbbbbbbbbbvvbfhvfbhvbfhbvf");
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
    console.log(1);
  } else {
    immidiate = false;
    console.log(2);
  }
  console.log(immidiate);
  let rent = {};
  let availability = {};
  if (status) dataObj.status = status;
  if (adsType) dataObj.adsType = adsType;

  if (rental_type) adsInfoObj.rental_type = rental_type;
  if (category) adsInfoObj.category = category;
  if (title) adsInfoObj.title = title;
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
  if (negotiable) rent.negotiable = negotible;
  if (amount) adsInfoObj.rent = rent;
  if (isSmokingAllowed) adsInfoObj.isSmokingAllowed = isSmokin;
  if (isAlcoholAllowed) adsInfoObj.isAlcoholAllowed = isAlcoho;
  if (isPetFriendly) adsInfoObj.isPetFriendly = isPetFr;

  // if (occupation) adsInfoObj.occupation = occupation;
  if (prefered_age) adsInfoObj.prefered_age = prefered_age;

  if (location) adsInfoObj.location = location;
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
      location,
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

  const updateRoomRents = await RoomRentsAds.findByIdAndUpdate(
    { _id: roomRentId },
    { $set: dataObjq },
    { new: true }
  );
  console.log(updateRoomRents, "ebdhebhefcebcfheb");
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
    let searchTerm = req.body.searchTerm || "";
    let dbQuery = {};
    const {
      userId,
      isfeatured,
      status,
      adsType,
      rental_type,
      category,
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
      location,
      tagline,
    } = req.query;
    var perPage = parseInt(req.query.perpage) || 6;
    var page = parseInt(req.query.page) || 1;

if (isfeatured) dbQuery.isfeatured = isfeatured;
if (status) dbQuery.status = status;
if (adsType) dbQuery.adsType = adsType;
if (rental_type) dbQuery["adsInfo.rental_type"] = rental_type;
if (category) dbQuery["adsInfo.category"] = category;
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
    dbQuery.status = "active";
    dbQuery["plan.expire_on"] = { $gte: new Date() };
    if (userId) dbQuery.userId = userId;
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
console.log(queryFinal);
    let myid = req.userId;
    let records = await RoomRentsAds.find({
      $or: [queryFinal],
    })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage);
    const responseModelCount = await RoomRentsAds.countDocuments({
      $or: [queryFinal],
    });
   
      
    if (records) {
      const jobData = records.map((job) => {
        return {
          ...job._doc,
          // Add other job fields as needed
          favoriteCount: job.favoriteCount,
          isFavorite: !!job.isFavorite, 
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
    let myid = req.userId
    let records = await RoomRentsAds.findById({"_id": adsId })
    .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
    .populate({ path: "favoriteCount", select: "_id" })
    .populate({ path: "viewCount" })
    .populate({ path: 'isFavorite', select: 'user', match: { user: myid } });
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
    if (records) {
      if(!checkview){
      let data=  await PostViews.create(dbQuery)
      console.log(data,"billo ni tere kale kalle naina ");
      }
      const jobData = {
        ...records._doc,
        viewCount: records.viewCount,
        favoriteCount: records.favoriteCount,
        isFavorite: !!records.isFavorite
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
