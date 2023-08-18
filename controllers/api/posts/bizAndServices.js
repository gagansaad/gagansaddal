const { json } = require("express");
const crypto = require('crypto');
const mongoose = require("mongoose"),
  Media = mongoose.model("media"),
  postbizAndServicesAd = mongoose.model("Local_biz & Service"),
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
  } = require(`../../../utils/validators`);

///-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
  // let adtype = req.query.adsType;
  let records = await tagline_keywords
    .find()
    .select({ keywords: 1, _id: 1 });

  const dynamicsData = {
    tagline: records,
    categories: [
      "Business & Office",
      "Childcare",
      "Clothing",
      "Computers & Telecoms",
      "Entertainment",
      "Finance & Legal",
      "Food & Drink",
      "Goods Suppliers & Retailers",
      "Health & Beauty",
      "Automotive Services",
      "Property Maintenance and Construction",
      "Transport",
      "Travel & Tourism",
      "Tuition & Classes",
      "Weddings",
      "Funneral Services",
      "Photography & Video",
      "Pets",
      "Other",
    ],
    business_Office: [
      "Accounting",
      "Advertising Agencies",
      "Courier services",
      "Funeral directors",
      "Tax Service",
      "Insurance Agencies",
      "Translation Service",
      "Realestate",
      "Realtor",
      "Marketing",
      "Printing",
      "Recuriment",
      "Shipping",
      "Shredding service",
      "Sign makers",
      "Storage",
      "Writing and litterature",
      "Other bussines and office service",
    ],
    childcare: [
      "Daycare",
      "Kindergarton",
      "Childeren's activity",
      "Child care agencies",
      "Nursery school",
      "Parent support",
      "Other childeren service",
    ],
    clothing: [
      "Dry cleaning and loundery",
      "Fashion designers",
      "Printing",
      "Seamstress/tailors",
      "Stylists",
      "Other Clothing Services",
    ],
    computers_Telecoms: [
      "Computer network",
      "Computer repair",
      "Computer services",
      "Computer support",
      "Online content providers",
      "Phone and tablet repair",
      "Software application development",
      "Telecom and internet service provider",
      "Web development",
      "Web service",
      "Website design",
      "Other computer service",
    ],
    entertainment: [
      "Bands and  musicians",
      "Cake makers",
      "Catering",
      "DJ and disco hire",
      "Cultural music",
      "Entertainers",
      "Venues and nightclubs",
      "Other entertainments",
    ],
    finance_Legal: [
      "Loan Service",
      "Financial Advice",
      "Insolvency Practitioners",
      "Insurance",
      "Legal Service",
      "Money transfer",
      "Mortgage brokers",
      "Solicitors and conveyancing",
      "Visa and immigration",
      "Other finance and legal Service",
    ],
    food_Drink: [
      "Bakery",
      "Bars and Restaurants",
      "Cafes",
      "Takeaways",
      "Other foods and drinks",
    ],
    suppliers_Retailers: [
      "Grocery Store",
      "Wholesale Distributors",
      "Accessories",
      "Bike shops",
      "Clotheing Stores",
      "Electrical",
      "Florists",
      "Footwear",
      "Health products",
      "Jewellers",
      "Mobile phone",
      "Office furnitures",
      "Home Furnitures",
      "Other Goods Suppliers & Retailers",
    ],
    currency: ["USD", "AED", "AUD", "AWG", "CAD", "EUR", "GBP", "INR", "USN"],
    health_Beauty: [
      "Alternative therapies",
      "Beauty treatments",
      "Chiropodists and podiatrists",
      "Dentists",
      "Doctors and Clinics",
      "Hair Salon",
      "Life coaching",
      "Makeup artist",
      "Massages",
      "Model and actors",
      "Nursing and care",
      "Opticians",
      "Personal trainers",
      "Pregnancy and child care",
      "Tatooing and piercing",
      "Other health and beauty services",
    ],
    automotive_Services: [
      "Body repair",
      "Car breakers",
      "Car servicing and repair",
      "Car valeting",
      "Car wash",
      "Garage and mechanic service",
      "MOT testing",
      "Tyer fitting",
      "Vehicle recovery service",
      "Windshield repair",
      "Other Automotive Services",
    ],
    maintenance_and_Construction: [
      "Cleaners",
      "Commercial proprerty agents",
      "Drain and pipe cleaning",
      "Lawn and Garden",
      "Housekeapers",
      "Interior design",
      "Heating and Air conditioning",
      "Plumbers",
      "Remodeling",
      "Electricians",
      "Satellite, cable and TV",
      "Security service",
      "architect",
      "Bathroom fitter",
      "Bedroom fitters",
      "Other Property Maintenance and Construction Services",
    ],
    transport: [
      "Trucking Serices",
      "Chauffeur & Limousine Hire",
      "Bus & Coach",
      "Other transport Services",
    ],
    travel_Tourism: [
      "Travel Agents",
      "Group Travel Coordinators",
      "Other travel and tourism",
    ],
    tuition_Classes: [
      "Academic",
      "Arts & Crafts",
      "Business",
      "Construction",
      "Cookery Classes",
      "Dance Classes",
      "Driving Lessons & Instructors",
      "Health & Fitness",
      "IT & Computing",
      "Language",
      "Music",
      "Other Classes",
    ],
    weddings: [
      "Cars & Transportation",
      "Catering & Services",
      "Dress & Suit Hire",
      "Entertainment",
      "Florists",
      "Hairdressers",
      "Hen & Stag Planners",
      "Honeymoons",
      "Marquee Hire",
      "Organisers & Planners",
      "Photography & Film",
      "Wedding & Reception Venues",
      "Weddings Abroad",
      "Other Wedding Services",
    ],
    funneral_Services: [],
    photography_Video: [],
    pets: [],
    other: [],
    // sub_categories: [
    //   "Local sub_categoriesal - Individuals who offer services at customer doorstep (e.g., Plumber, Electrician)",
    //   "Business Center / Local Retailer / Showroom - Customers visit provider’s location to access service (e.g., Beauty salon, Grocery store)",
    //   "Brand - Customers are familiar with the brand of your service/product (e.g., Ethiopian Airlines).",
    //   "Agent - A mediator between user and service providers (e.g., Real estate agent)",
    //   "Other - Enter your sub_categories",
    // ],
    preferableModeContact: [`Phone Number`, `Email`],
    buisness_experience: ["0-5 Years", "5-15 Years", "Above 15 Years"],
  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validatebizAdsData = async (req, res, next) => {
  try {
    const {
      status,
      adsType,
      sub_categories,
      categories,
      business_name,
      tagline,
      experience,
      // working_hours,
      location_name,
      
      // price,
      descriptions,
      accreditation_files,
      accreditation_name,
      image,
      video_link,
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

    if (!isValidString(categories))
      return failureJSONResponse(res, {
        message: `Please provide valid category`,
      });
    // if (!isValidString(sub_categories))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid sub category`,
    // });
    if (!isValidString(business_name))
      return failureJSONResponse(res, {
        message: `Please provide valid business_name`,
      });
    // if(req.files.accreditation_document && !accreditation_name)return failureJSONResponse(res, {
    //   message: `Please provide accreditation file name`,
    // });
    // if (!isValidString(tagline))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid tagline`,
    //   });
    if (!isValidString(location_name))
      return failureJSONResponse(res, {
        message: "Pleae provide us your buisness location",
      });
    if (!isValidString(descriptions))
      return failureJSONResponse(res, {
        message: `please provide valid Description`,
      });
    // // if (isNaN(Number(price)))
    // //   return failureJSONResponse(res, {
    // //     message: `Please provide valid price`,
    // //   });
    // if (!isValidString(experience))
    //   return failureJSONResponse(res, {
    //     message: `Please provide us experience`,
    //   });
    // if (!isValidUrl(video_link))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid video link`,
    // });

    return next();
  } catch (err) {
    console.log(err);
  }
};
//////////////
exports.validateListerBasicinfo = async (req, res, next) => {
  try {
    const {
      email_address,
      // phoneNumber,
      // countryCode,
      hideAddress,
      preferableModeContact,
    } = req.body;

    // if (countryCode && isNaN(Number(countryCode)))
    // return failureJSONResponse(res, {
    //   message: `Please provide valid country code`,
    // });
    // if (preferableModeContact) {
    //   if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".")) {
    //     return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
    //   } else if (preferableModeContact != 1 && preferableModeContact != 2 && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` }); }
    // }
    // if (preferableModeContact && isNaN(Number(preferableModeContact))) {
    //   return failureJSONResponse(res, { message: "Please provide valid preferable Contact Mode" });
    // }
    if (email_address && !isValidEmailAddress(email_address)) {
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

exports.createbizAds = async (req, res, next) => {
  try {
    console.log(req.body, "this is body data ");
    const {
      isfeatured,
      status,
      adsType,
      categories,
      sub_categories,
      business_name,
      experience,
      tagline,
      location_name,
      longitude,
      latitude,
      accreditation_name,
      accreditation_files,
      week_day,
      week_end,
      weekday_open_at,
      weekday_close_at,
      weekday_24_hour,
      weekend_open_at,
      weekend_close_at,
      weekend_24_hour,
      is_24_seven,
      
      is_appointment,
      // price,
      descriptions,
      image,
      video_link,
    } = req.body;

    const userId = req.userId;

    let working_hour;
    let weekday = {
      is_available: false,
      open_at: "",
      close_at: "",
    };
    let weekend = {
      is_available: false,
      open_at: "",
      close_at: "",
    };
    if (week_day == "true") {
      weekday = {
        is_available: true,
        open_at: weekday_open_at,
        close_at: weekday_close_at,
        is_24_hour: JSON.parse(weekday_24_hour),
      };
      working_hour = {
        week_days: weekday,
      };
    }
    if (week_end == "true") {
      weekend = {
        is_available: true,
        open_at: weekend_open_at,
        close_at: weekend_close_at,
        is_24_hour: JSON.parse(weekend_24_hour),
      };
      working_hour = {
        week_ends: weekend,
      };
    }
    if (week_end == "true" && week_day == "true") {
      working_hour = {
        week_days: weekday,
        week_ends: weekend,
      };
    }
    if (is_24_seven == "true") {
      working_hour = {
        is_24_seven: true,
      };
    }
    if (is_appointment == "true") {
      working_hour = {
        appointment: true,
      };
    }
    const imageArr = [];
    let accreditationArr = [];

    if (req.files.photos) {
      for (var i = 0; i < req.files.photos.length; i++) {
        console.log(req.files.photos);

        if (req.files.photos[i].fieldname === `photos`) {
          let type_of_file = req.files.photos[i].mimetype;
          if (
            type_of_file === "image/png" ||
            type_of_file === "application/octet-stream" ||
            type_of_file === "image/jpg" ||
            type_of_file === "image/jpg"
          ) {
            var thumbnail = req.files.photos[i].path;
            productImages = await Media.create({ url: thumbnail });
            imageArr.push(productImages._id);
          } else {
            return failureJSONResponse(res, {
              message: `Please provide only png,jpg,jpeg,octet-stream`,
            });
          }
        }
      }
    }
    if (req.files.accreditation_document) {
      if (!accreditation_name) {
        return failureJSONResponse(res, {
          message: `Please provide accreditation_name`,
        });
      }
      for (var i = 0; i < req.files.accreditation_document.length; i++) {
        if (
          req.files.accreditation_document[i].fieldname ===
          `accreditation_document`
        ) {
          let type_of_files = req.files.accreditation_document[i].mimetype;
          // if (type_of_files === 'application/pdf' || type_of_files === 'image/jpg' ||  type_of_file === 'application/octet-stream' || type_of_files === 'image/jpeg') {
          var doc = req.files.accreditation_document[i].path;
          productDoc = await Media.create({
            url: doc,
            url_type: type_of_files,
          });
          console.log(productDoc, "hdhcbdhh");
          let acrredationn = {
            accreditation_name: accreditation_name,
            accreditation_files: productDoc._id,
          };
          accreditationArr.push(acrredationn);
          // } else {
          //   return failureJSONResponse(res, {
          //     message: `Please provide only pdf,png`,
          //   });
          // }
        }
      }
    }
    console.log(tagline, "this is tagline array");
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

    // console.log(work_hour.length, "dcdnjchnbjbc");

    const dataObj = {
      isfeatured,
      status: status,
      adsType,
      adsInfo: {
        categories,
        sub_categories,
        title:business_name,
        experience,
        working_hours: working_hour,
        tagline,
        location:{
          locationName:location_name,
          latitude:latitude,
          longitude:longitude
        },
        // price,
        descriptions,
        image: imageArr,
        video_link,
        accreditation_file: accreditationArr,
      },

      userId: userId,
    };

    const newbizPost = await postbizAndServicesAd.create(dataObj);
    const stringToHash = newbizPost._id.toString();
    const hash = await crypto.createHash('sha256').update(stringToHash).digest('hex');
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % (Math.pow(10, 10));
    let ad_Id = numericHash.toString().padStart(10, '0') 
  console.log(newbizPost);
   await postbizAndServicesAd.findByIdAndUpdate({_id:newbizPost._id},{$set:{advertisement_id:ad_Id}})
    
    const bizAndServices = {};

    for (let key in newbizPost.toObject()) {
      if (
        !fieldsToExclude.hasOwnProperty(String(key)) &&
        !listerBasicInfo.hasOwnProperty(String(key))
      ) {
        bizAndServices[key] = newbizPost[key];
      }
    }
    if (newbizPost) {
      return successJSONResponse(res, {
        message: `success`,
        bizAndServices: bizAndServices,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

///--------------------------Edit event-----------------------------///

exports.editbizAds = async (req, res, next) => {
  try {
    const bizId = req?.params?.bizId;

    const validate_id = await postbizAndServicesAd.findById(bizId);
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your loacl biz And Services id`,
      });
    }

    if (!bizId)
      return successJSONResponse(res, {
        message: `success`,
        updatebizAdObjToSend,
        status: 200,
      });

    const {
      status,
      adsType,

      categories,
      sub_categories,
      business_name,
      experience,
      tagline,
      accreditation_name,
      accreditation_files,
      // price,
      week_day,
      week_end,
      weekday_open_at,
      weekday_close_at,
      weekday_24_hour,
      weekend_open_at,
      weekend_close_at,
      weekend_24_hour,
      is_24_seven,
      is_appointment,
      descriptions,
      image,
      video_link,
      location_name,
      longitude,
      latitude,
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
    const accreditationArr = [];

    if (req.files.photos) {
      for (var i = 0; i < req.files.photos.length; i++) {
        if (req.files.photos[i].fieldname === `photos`) {
          let type_of_file = req.files.photos[i].mimetype;
          // if (type_of_file === 'image/png' || type_of_file === 'image/jpeg') {
          var thumbnail = req.files.photos[i].path;
          productImages = await Media.create({
            url: thumbnail,
            url_type: type_of_file,
          });
          imageArr.push(productImages._id);
          // } else {
          //   return failureJSONResponse(res, {
          //     message: `Please provide only png,jpg`,
          //   });
          // }
        }
      }
    }

    // if (req.files.accreditation_document) {
    //   for (var i = 0; i < req.files.accreditation_document.length; i++) {
    //        if (req.files.accreditation_document[i].fieldname === `accreditation_document`) {
    //       let type_of_file = req.files.accreditation_document[i].mimetype;
    //       let name = req.body.accreditation_name[i]
    //       // if (type_of_file === 'image/png' || type_of_file === 'image/jpeg') {
    //         var thumbnail = req.files.accreditation_document[i].path;
    //         productImages = await Media.create({ url: thumbnail, url_type: type_of_file });
    //         accreditationArr.push({accreditation_name:name},{accreditation_files:productImages._id});
    //       // } else {
    //       //   return failureJSONResponse(res, {
    //       //     message: `Please provide only png,jpg`,
    //       //   });
    //       // }
    //     }
    //   }
    // }
    //   if(accreditation_name){
    //   if (req.files.accreditation_document) {
    //     console.log(req.files.accreditation_document,accreditation_name);
    //     // for (var i = 0; i < req.files.accreditation_document.length; i++) {
    //       // if (req.files.accreditation_document.fieldname === `accreditation_document`) {
    //         let type_of_files = req.files.accreditation_document.mimetype;
    //         // if (type_of_files === 'application/pdf' || type_of_files === 'image/jpg' || type_of_files === 'image/jpeg') {
    //           var doc = req.files.accreditation_document.path;
    //          let productDoc = await Media.create({ url: doc, url_type: type_of_files });
    //           let addpush = await postbizAndServicesAd.findByIdAndUpdate({_id:bizId},{$push:{adsInfo:{accreditation_file:{accreditation_name:accreditation_name,
    //             accreditation_files:productDoc._id}}}},{upsert:true})

    //           console.log(addpush, "hdhcbdhh");
    //         //  await accreditationArr.push({accreditation_name:accreditation_name,
    //         //   accreditation_files:productDoc._id});
    //         //   console.log(accreditationArr);
    //         // } else {
    //         //   return failureJSONResponse(res, {
    //         //     message: `Please provide only pdf,png`,
    //         //   });
    //         // }
    //       // }
    //     // }

    //   }
    // }
    let working_hour;
    let weekday = {
      is_available: false,
      open_at: "",
      close_at: "",
    };
    let weekend = {
      is_available: false,
      open_at: "",
      close_at: "",
    };
    if (week_day == "true") {
      weekday = {
        is_available: true,
        open_at: weekday_open_at,
        close_at: weekday_close_at,
        is_24_hour: JSON.parse(weekday_24_hour),
      };
      working_hour = {
        week_days: weekday,
      };
    }
    if (week_end == "true") {
      weekend = {
        is_available: true,
        open_at: weekend_open_at,
        close_at: weekend_close_at,
        is_24_hour: JSON.parse(weekend_24_hour),
      };
      working_hour = {
        week_ends: weekend,
      };
    }
    if (week_end == "true" && week_day == "true") {
      working_hour = {
        week_days: weekday,
        week_ends: weekend,
      };
    }
    if (is_24_seven == "true") {
      working_hour = {
        is_24_seven: true,
      };
    }
    if (is_appointment == "true") {
      working_hour = {
        appointment: true,
      };
    }

    const dataObj = {},
      adsInfoObj = {},
      accreditation_data = {};
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

    if (sub_categories) adsInfoObj.sub_categories = sub_categories;
    if (categories) adsInfoObj.categories = categories;
    if (business_name) adsInfoObj.title = business_name;
    if (tagline) adsInfoObj.tagline = tagline;
    // if (business_location) adsInfoObj.business_location = business_location;
    let locationobj={}
  if (location_name) locationobj.locationName = location_name;
  if (longitude) locationobj.longitude = longitude;
  if (latitude) locationobj.latitude = latitude;
  if (locationobj) adsInfoObj.location = locationobj;
    if (experience) adsInfoObj.experience = experience;
    if (descriptions) adsInfoObj.descriptions = descriptions;

    if (imageArr.length) adsInfoObj.image = imageArr;
    if (video_link) adsInfoObj.video_link = video_link;
    // if (accreditationArr.length) accreditation_data.accreditation_files = accreditationArr;
    // if (accreditation_name) accreditation_data.accreditation_name = accreditation_name;
    if (accreditationArr.length)
      adsInfoObj.accreditation_file = accreditationArr;
    if (working_hour) adsInfoObj.working_hours = working_hour;
    if (adsInfoObj && Object.keys(adsInfoObj).length) {
      dataObj.adsInfo = adsInfoObj;
    }

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
    const updatebiz = await postbizAndServicesAd.findByIdAndUpdate(
      { _id: bizId },
      { $set: dataObjq },
      { new: true }
    );
    let updatebizAdObjToSend = {};
    for (let key in updatebiz.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updatebizAdObjToSend[key] = updatebiz[key];
      }
    }

    if (updatebiz) {
      return successJSONResponse(res, {
        message: `success`,
        updatebizAdObjToSend: updatebizAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updatebizAdObjToSend: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.fetchAll = async (req, res, next) => {
  try {
    let searchTerm = req.body.searchTerm;
    let dbQuery = {};
    const {
      status,
      categories,
      sub_categories,
      business_name,
      tagline,
      business_location,
      is_24_seven,
    } = req.query;
    var perPage = parseInt(req.query.perpage) || 6;
    var page = parseInt(req.query.page) || 1;

    if (status) {
      dbQuery.status = status;
    }

    if (categories) {
      dbQuery.categories = categories;
    }

    if (sub_categories) {
      dbQuery.sub_categories = sub_categories;
    }

    if (business_name) {
      dbQuery["adsInfo.title"] = business_name;
    }

    if (tagline) {
      dbQuery["adsInfo.tagline"] = tagline;
    }

    if (business_location) {
      dbQuery["adsInfo.business_location"] = business_location;
    }

    if (is_24_seven) {
      dbQuery["adsInfo.is_24_seven"] = is_24_seven;
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
    let records = await postbizAndServicesAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage);
    const responseModelCount = await postbizAndServicesAd.countDocuments({
      $or: [queryFinal],
    });
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
      return failureJSONResponse(res, { message: `ads not Available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};


exports.fetchonead = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    let data_Obj
    let checkId = await postbizAndServicesAd.findOne({_id:adsId})
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
    let records = await postbizAndServicesAd.findOne(data_Obj)
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

exports.fetchBizData = async (req, res, next) => {
  try {
    const sub_categories = {
      "Business & Office": [
        "Accounting",
      "Advertising Agencies",
      "Courier services",
      "Funeral directors",
      "Tax Service",
      "Insurance Agencies",
      "Translation Service",
      "Realestate",
      "Realtor",
      "Marketing",
      "Printing",
      "Recuriment",
      "Shipping",
      "Shredding service",
      "Sign makers",
      "Storage",
      "Writing and litterature",
      "Other bussines and office service",
      ],
      "Childcare": [
        "Daycare",
        "Kindergarton",
        "Childeren's activity",
        "Child care agencies",
        "Nursery school",
        "Parent support",
        "Other childeren service",
      ],
      "Clothing": [
        "Dry cleaning and loundery",
        "Fashion designers",
        "Printing",
        "Seamstress/tailors",
        "Stylists",
        "Other Clothing Services",
      ],
      "Computers & Telecoms": [
        "Computer network",
      "Computer repair",
      "Computer services",
      "Computer support",
      "Online content providers",
      "Phone and tablet repair",
      "Software application development",
      "Telecom and internet service provider",
      "Web development",
      "Web service",
      "Website design",
      "Other computer service",
      ],
      "Entertainment": [
        "Bands and  musicians",
        "Cake makers",
        "Catering",
        "DJ and disco hire",
        "Cultural music",
        "Entertainers",
        "Venues and nightclubs",
        "Other entertainments",
      ],
      "Finance & Legal": [
        "Loan Service",
        "Financial Advice",
        "Insolvency Practitioners",
        "Insurance",
        "Legal Service",
        "Money transfer",
        "Mortgage brokers",
        "Solicitors and conveyancing",
        "Visa and immigration",
        "Other finance and legal Service",
      ],
      "Food & Drink": [
        "Bakery",
        "Bars and Restaurants",
        "Cafes",
        "Takeaways",
        "Other foods and drinks",
      ],
      "Goods Suppliers & Retailers": [
        "Grocery Store",
      "Wholesale Distributors",
      "Accessories",
      "Bike shops",
      "Clotheing Stores",
      "Electrical",
      "Florists",
      "Footwear",
      "Health products",
      "Jewellers",
      "Mobile phone",
      "Office furnitures",
      "Home Furnitures",
      "Other Goods Suppliers & Retailers",
      ],
      "Health & Beauty": [
        "Alternative therapies",
        "Beauty treatments",
        "Chiropodists and podiatrists",
        "Dentists",
        "Doctors and Clinics",
        "Hair Salon",
        "Life coaching",
        "Makeup artist",
        "Massages",
        "Model and actors",
        "Nursing and care",
        "Opticians",
        "Personal trainers",
        "Pregnancy and child care",
        "Tatooing and piercing",
        "Other health and beauty services",
      ],
      "Automotive Services": [
        "Body repair",
      "Car breakers",
      "Car servicing and repair",
      "Car valeting",
      "Car wash",
      "Garage and mechanic service",
      "MOT testing",
      "Tyer fitting",
      "Vehicle recovery service",
      "Windshield repair",
      "Other Automotive Services",
      ],
      "Property Maintenance and Construction": [
        "Cleaners",
        "Commercial proprerty agents",
        "Drain and pipe cleaning",
        "Lawn and Garden",
        "Housekeapers",
        "Interior design",
        "Heating and Air conditioning",
        "Plumbers",
        "Remodeling",
        "Electricians",
        "Satellite, cable and TV",
        "Security service",
        "architect",
        "Bathroom fitter",
        "Bedroom fitters",
        "Other Property Maintenance and Construction Services",
      ],
      "Transport": [
        "Trucking Serices",
      "Chauffeur & Limousine Hire",
      "Bus & Coach",
      "Other transport Services",
      ],
      "Travel & Tourism": [
        "Travel Agents",
        "Group Travel Coordinators",
        "Other travel and tourism",
      ],
      "Tuition & Classes": [
        "Academic",
        "Arts & Crafts",
        "Business",
        "Construction",
        "Cookery Classes",
        "Dance Classes",
        "Driving Lessons & Instructors",
        "Health & Fitness",
        "IT & Computing",
        "Language",
        "Music",
        "Other Classes",
      ],
      "Weddings": [
        "Limousine",
        "Trucks",
        "Wedding Appliances",
        "Wedding Clothes",
        "Cars",
        "DJ Equipment",
        "Event Decorations",
        "Other",
      ],
      "Funneral Services": [
        "Cars & Transportation",
      "Catering & Services",
      "Dress & Suit Hire",
      "Entertainment",
      "Florists",
      "Hairdressers",
      "Hen & Stag Planners",
      "Honeymoons",
      "Marquee Hire",
      "Organisers & Planners",
      "Photography & Film",
      "Wedding & Reception Venues",
      "Weddings Abroad",
      "Other Wedding Services",
      ],
      "Photography & Video": [
       
      ],
      "Pets": [
       
      ],
      "Other": [
        
      ],
    };
    
    const responseArray = [];
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];

      for (const subCategory of subCategoryArray) {
        const query = { "adsInfo.categories": category, "adsInfo.sub_categories": subCategory ,"status" :"active",["plan_validity.expired_on"]:{ $gte: currentDateOnly }};
        
        const count = await postbizAndServicesAd.countDocuments(query);
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
    return errorJSONResponse(res, {
      message: 'An error occurred',
      error: error.message,
    });
  }
};
