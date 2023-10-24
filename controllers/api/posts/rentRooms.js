const { json, query } = require("express");
const crypto = require("crypto");
const { listeners } = require("../../../model/posts/roomRents");
const { mongoose, ObjectId, modelNames } = require("mongoose"),
  RoomRentsAds = mongoose.model("rental"),
  PostViews = mongoose.model("Post_view"),
  Users = mongoose.model("user"),
  Media = mongoose.model("media"),
  Category = mongoose.model("adsCategory"),
  subCategory = mongoose.model("adsSubCategory"),
  
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
          deletedAt: new Date().toISOString()// Add your temporary field and its value here
        }
      };
  
      let records = await RoomRentsAds.update(dbQuery, updateFields, { new: true });
  
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
  
exports.fetchDynamicsData = async (req, res, next) => {
  let records;
  // const ads_type = req.query.ads_type;
  // const categories = await Category.aggregate([
  //   {
  //     $match: {
  //       status: "active", // Filter "adsCategory" documents with an "active" status
  //     }
  //   },
  //   {
  //     $lookup: {
  //       from: "adssubcategories", // Name of the "adsSubCategory" collection
  //       localField: "_id",       // Field from the "adsCategory" collection
  //       foreignField: "category", // Field from the "adsSubCategory" collection
  //       as: "subcategories"       // Name for the new field that holds the joined data
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       name: 1,
  //       subcategories: {
  //         $filter: {
  //           input: "$subcategories",
  //           as: "sub",
  //           cond: {
  //             $eq: ["$$sub.status", "active"] // Include only "active" subcategories
  //           }
  //         }
  //       }
  //     }
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       name: 1,
  //       "subcategories._id": 1,
  //       "subcategories.name": 1
  //     }
  //   }
  // ]);
// // console.log(categories[0].sub_categories);
//   // Step 2: Update categories with related subcategory IDs
//   for (const category of categories) {
//     // Step 3: Find subcategories for the category
//     const subCategories = await subCategory.find({ category: category._id });
  
//     // Step 4: Get an array of subcategory _ids
//     const subCategoryIds = subCategories.map(subCategory => subCategory._id);
  
//     // Step 5: Update the category's sub_categories field
//     category.sub_categories = subCategoryIds;
  
//     // Step 6: Save the updated category
//     await category.save();
//   }
  
// console.log(categories);
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
    rent_info: ["/month", "/week", "/day"],
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
    // categories
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
    const lalcount = [];
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
          status: "active",
          "plan_validity.expired_on": { $gte: currentISODate },
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
        const count = await RoomRentsAds.countDocuments(query);
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
    console.error("Error:", error);
    return failureJSONResponse(res, {
      message: "An error occurred",
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
      preferedGender,
      location_name,
      tagline,
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

    if (amount && isNaN(Number(amount)))
      return failureJSONResponse(res, {
        message: `please provide valid rent amount`,
      });

    return next();
  } catch (err) {
    console.log(err);
  }
};
////////////////////
exports.validateListerBasicinfo = async (req, res, next) => {
  try {
    const { email_address, hideAddress, preferableModeContact } = req.body;

    if (email_address && !isValidEmailAddress(email_address)) {
      return failureJSONResponse(res, {
        message: `Please provide valid email address`,
      });
    }

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
    preferedGender,
    location_name,
    tagline,
    latitude,
    longitude,
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

      preferedGender: preferedGender,
      location: {
        location_name: location_name,
        coordinates: [longitude, latitude],
      },
      tagline: taglines,
      image: imageArr,
    },

    userId: userId,
  };

  const newRoomRentPost = await RoomRentsAds.create(dataObj);
  const stringToHash = newRoomRentPost._id.toString();
  const hash = await crypto
    .createHash("sha256")
    .update(stringToHash)
    .digest("hex");
  const truncatedHash = hash.slice(0, 10);
  const numericHash = parseInt(truncatedHash, 16) % Math.pow(10, 10);
  let ad_Id = numericHash.toString().padStart(10, "0");

  await RoomRentsAds.findByIdAndUpdate(
    { _id: newRoomRentPost._id },
    { $set: { advertisement_id: ad_Id } }
  );
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
    longitude,
  } = req.body;
  let iscontact = false;
  if (is_contact == "true") {
    iscontact = true;
  }
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
  let imageArr = [];
  const existingRoomRents = await RoomRentsAds.findById(roomRentId);
  if (existingRoomRents) {
    imageArr = imageArr.concat(existingRoomRents.adsInfo.image || []);
  }
  let productImages;
  if (req.files && req.files.length > 0) {
  for (var i = 0; i < req.files.length; i++) {
    var thumbnail = req.files[i].path;

    productImages = await Media.create({ url: thumbnail });
    imageArr.push(productImages._id);
  }
  }
  
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
  } else {
    immidiate = false;
  }
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

  if (prefered_age) adsInfoObj.prefered_age = prefered_age;
  let locationobj = {};
  if (longitude && latitude) {
    locationobj = {
      coordinates: [longitude, latitude],
    };
  }
  if (location_name) locationobj.location_name = location_name;

  if (locationobj) adsInfoObj.location = locationobj;
  if (imageArr.length) adsInfoObj.image = imageArr;
  if (name) listerBasicInfoObj.name = name;

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
  const updateRoomRents = await RoomRentsAds.findByIdAndUpdate(
    { _id: roomRentId },
    { $set: dataObjq },
    { new: true }
  );
  let updateRoomAdObjToSend = {};
  for (let key in updateRoomRents.toObject()) {
    if (!fieldsToExclude.hasOwnProperty(String(key))) {
      updateRoomAdObjToSend[key] = updateRoomRents[key];
    }
  }
  if (updateRoomRents) {
    return successJSONResponse(res, {
      message: `success`,
      updateRoomAdObjToSend: updateRoomAdObjToSend,
    });
  } else {
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
    var perPage = parseInt(req.query.perpage) || 40;
    var page = parseInt(req.query.page) || 1;
    const sortval = sortBy === "Oldest" ? { 'plan_validity.active_on': 1 } : { 'plan_validity.active_on': -1 };
    let Distance;

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
      dbQuery["adsInfo.location.coordinates"] = {
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance,
        },
      };
    }

    if (amount) {
      // Add filter for rent amount
      dbQuery["adsInfo.rent.amount"] = { $lte: amount };
    }
    if (min_price && max_price) {
      dbQuery["adsInfo.rent.amount"] = {
        $gte: parseFloat(min_price),
        $lte: parseFloat(max_price),
      };
    }

    if (add_on) {
      dbQuery = {
        addons_validity: {
          $elemMatch: {
            name: add_on,
            expired_on: {
              $gte: new Date("2023-09-18").toISOString(), // Construct ISODate manually
            },
          },
        },
      };
    }
    if (custom_date) {
      // Add filter for availability custom_date
      dbQuery["adsInfo.availability.custom_date"] = custom_date;
    }
    if (negotiable !== undefined) {
      // Add filter for negotiable
      dbQuery["adsInfo.rent.negotiable"] =
        negotiable === true || negotiable === "true";
    }

    if (is_contact !== undefined) {
      // Add filter for is_contact
      dbQuery["adsInfo.rent.is_contact"] =
        is_contact === true || is_contact === "true";
    }
    if (immidiate !== undefined) {
      // Add filter for availability immidiate
      dbQuery["adsInfo.availability.immidiate"] =
        immidiate === "true" || immidiate === true;
    }
    if (isfeatured) dbQuery.isfeatured = isfeatured;
    
    if (adsType) dbQuery.adsType = adsType;
    if (category) dbQuery["adsInfo.rental_type"] = category;
    if (sub_category) dbQuery["adsInfo.category"] = sub_category;
    if (title) dbQuery["adsInfo.title"] = title;
    if (roomType) dbQuery["adsInfo.roomType"] = roomType;
    if (listerType) dbQuery["adsInfo.listerType"] = listerType;
    if (accommodates) dbQuery["adsInfo.accommodates"] = accommodates;
    if (furnished) dbQuery["adsInfo.furnished"] = furnished;
    if (attachedBath) dbQuery["adsInfo.attachedBath"] = attachedBath;
    if (isSmokingAllowed)
      dbQuery["adsInfo.isSmokingAllowed"] = isSmokingAllowed;
    if (isAlcoholAllowed)
      dbQuery["adsInfo.isAlcoholAllowed"] = isAlcoholAllowed;
    if (isPetFriendly) dbQuery["adsInfo.isPetFriendly"] = isPetFriendly;
    if (preferedGender) dbQuery["adsInfo.preferedGender"] = preferedGender;

    if (prefered_age) {
      // Convert prefered_age to an array if it's not already
      const preferedAgeArray = Array.isArray(prefered_age)
        ? prefered_age
        : [prefered_age];

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
    if (is_myad == "true" && !myid) {
      return failureJSONResponse(res, {
        message: "Please login to your account",
      });
    }
    if (is_myad != "true") {
      
      dbQuery["plan_validity.expired_on"] = { $gte: currentISODate };
      adOnsQuery.status = "active";
      adOnsQuery["plan_validity.expired_on"] = { $gte: currentISODate };
      
    } else {
      dbQuery.userId = myid;
      if (status == 0) {
        dbQuery.status = "active";
      }
      if (status == 1) {
        dbQuery.status = "inactive";
      }
      if (status == 2) {
        dbQuery.status = "draft";
      }
    }
    if (userId) dbQuery.userId = userId;
    let queryFinal = dbQuery;
    if (searchTerm) {
      queryFinal = {
        ...dbQuery,
        $or: [
          { "adsInfo.title": { $regex: searchTerm.trim(), $options: "i" } },
          { "adsInfo.tagline": { $regex: searchTerm.trim(), $options: "i" } },
        ],
      };
    }

    let notification = await Users.findOne({ _id: myid }).select(
      "userNotification.rental"
    );
    let valueofnotification = notification?.userNotification?.rental;
    let records = await RoomRentsAds.find({
      $or: [queryFinal],
    })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } })
      .populate({ path: "viewCount" })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      })
      .sort(sortval);

    const totalCount = await RoomRentsAds.find({
      $or: [queryFinal],
    });
    let responseModelCount = totalCount.length;
    if (records) {
      let jobData = records.map((job) => {
      // let addons_status=  job?.addons_validity?.map((date)=>{

      // })
        return {
          ...job._doc,
          // Add other job fields as needed
          view_count: job.viewCount,
          favorite_count: job.favoriteCount,
          is_favorite: !!job.isFavorite,
          Report_count: job.ReportCount,
          is_Reported: !!job.isReported,
        };
      }); //////
      const isFavoriteFilter = is_favorite === "true" ? true : undefined;
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
      if (is_myad != "true") {
        let FeaturedData = await RoomRentsAds.find({
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
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
          };
        });
        /////
        let BumpupData = await RoomRentsAds.find({
          ...adOnsQuery,
          "addons_validity.name": "Bump up",
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

        let bumpUpDates = BumpupData.map((data) => {
          // Filter addons_validity to get only the "Bump up" addon
          let bumpUpAddon = data.addons_validity.find(
            (addon) => addon.name === "Bump up"
          );
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

        while (
          pickedRecords.length < numberOfRecordsToPick &&
          recordsWithTodayDate.length > 0
        ) {
          const randomIndex = Math.floor(
            Math.random() * recordsWithTodayDate.length
          );
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
        });
      }
      let finalResponse = {
        message: `success`,
        total: totalCount,
        perPage: perPage,
        totalPages: Math.ceil(totalCount / perPage),
        currentPage: page,
        notification: valueofnotification,
        records: paginatedData,
        status: 200,
        ...(is_myad == "true"
          ? {}
          : { AdOnsData: { bumpupData, featuredData } }),
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
    let data_Obj;
    let checkId = await RoomRentsAds.findOne({ _id: adsId });
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
    let records = await RoomRentsAds.findOne(data_Obj)
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
