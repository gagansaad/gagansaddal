const { json } = require("express");

const mongoose = require("mongoose"),
  Media = mongoose.model("media"),
  postbizAndServicesAd = mongoose.model("Local_biz & Service"),
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
  } = require(`../../../utils/validators`);

///-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
  const dynamicsData = {
    categories:       ["Business & Office", "Childcare", "Clothing", "Computers & Telecoms", "Entertainment", "Finance & Legal", "Food & Drink", "Goods Suppliers & Retailers", "Health & Beauty", "Automotive Services", "Property Maintenance and Construction", "Transport", "Travel & Tourism", "Tuition & Classes", "Weddings", "Funneral Services", "Photography & Video", "Pets", "Other"],
    business_Office: ["Accounting", "Advertising Agencies", "Courier services", "Funeral directors", "Tax Service", "Insurance Agencies", "Translation Service", "Realestate", "Realtor", "Marketing", "Printing", "Recuriment", "Shipping", "Shredding service", "Sign makers", "Storage", "Writing and litterature", "Other bussines and office service"],
    childcare:         ["Daycare", "Kindergarton", "Childeren's activity", "Child care agencies", "Nursery school", "Parent support", "Other childeren service"],
    clothing:            ["Dry cleaning and loundery", "Fashion designers", "Printing", "Seamstress/tailors", "Stylists"],
    computers_Telecoms: ["Computer network", "Computer repair", "Computer services", "Computer support", "Online content providers", "Phone and tablet repair", "Software application development", "Telecom and internet service provider", "Web development", "Web service", "Website design", "Other computer service"],
    entertainment: ["Bands and  musicians", "Cake makers", "Catering", "DJ and disco hire", "Cultural music", "Entertainers", "Venues and nightclubs", "Other entertainments"],
    finance_Legal: ["Loan Service", "Financial Advice", "Insolvency Practitioners", "Insurance", "Legal Service", "Money transfer", "Mortgage brokers", "Solicitors and conveyancing", "Visa and immigration", "Other finance and legal Service"],
    food_Drink: ["Bakery", "Bars and Restaurants", "Cafes", "Takeaways", "Other foods and drinks"],
    suppliers_Retailers: ["Grocery Store", "Wholesale Distributors", "Accessories", "Bike shops", "Clotheing Stores", "Electrical", "Florists", "Footwear", "Health products", "Jewellers", "Mobile phone", "Office furnitures", "Home Furnitures", "other good and suppliers and retailers"],

    health_Beauty: ["Alternative therapies", "Beauty treatments", "Chiropodists and podiatrists", "Dentists", "Doctors and Clinics", "Hair Salon", "Life coaching", "Makeup artist", "Massages", "Model and actors", "Nursing and care", "Opticians", "Personal trainers", "Pregnancy and child care", "Tatooing and piercing", "Other health and beauty services"],
    automotive_Services: ["Body repair", "Car breakers", "Car servicing and repair", "Car valeting", "Car wash", "Garage and mechanic service", "MOT testing", "Tyer fitting", "Vehicle recovery service", "Windshield repair", "Other Automotive Services"],
    maintenance_and_Construction: ["Cleaners", "Commercial proprerty agents", "Drain and pipe cleaning", "Lawn and Garden", "Housekeapers", "Interior design", "Heating and Air conditioning", "Plumbers", "Remodeling", "Electricians", "Satellite, cable and TV", "Security service", "architect", "Bathroom fitter", "Bedroom fitters", "Other Property Maintenance and Construction Services"],
    transport: ["Trucking Serices", "Chauffeur & Limousine Hire", "Bus & Coach", "Other transport Services"],
    travel_Tourism: ["Travel Agents", "Group Travel Coordinators", "Other travel and tourism"],
    tuition_Classes: ["Academic", "Arts & Crafts", "Business", "Construction", "Cookery Classes", "Dance Classes", "Driving Lessons & Instructors", "Health & Fitness", "IT & Computing", "Language", "Music", "Other Classes"],
    weddings: ["Cars & Transportation", "Catering & Services", "Dress & Suit Hire", "Entertainment", "Florists", "Hairdressers", "Hen & Stag Planners", "Honeymoons", "Marquee Hire", "Organisers & Planners", "Photography & Film", "Wedding & Reception Venues", "Weddings Abroad", "Other Wedding Services"],
    funneral_Services: ["funneral_Services"],
    photography_Video: ["photography_Video"],
    pets: ["pets"],
    other: ["other"],
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
      business_location,
      // price,
      descriptions,
      accreditation_files,
      accreditation_name,
      image,
      video_link
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
      if (!isValidString(sub_categories))
      return failureJSONResponse(res, {
        message: `Please provide valid sub category`,
      });
    if (!isValidString(business_name))
      return failureJSONResponse(res, {
        message: `Please provide valid business_name`,
      });
    // if(req.files.accreditation_document && !accreditation_name)return failureJSONResponse(res, {
    //   message: `Please provide accreditation file name`,
    // });
    if (!isValidString(tagline))
      return failureJSONResponse(res, {
        message: `Please provide valid tagline`,
      });
    if (!isValidString(business_location))
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
    if (!isValidString(experience))
      return failureJSONResponse(res, {
        message: `Please provide us experience`,
      });
      if (!isValidUrl(video_link)) 
      return failureJSONResponse(res, {
        message: `Please provide valid video link`,
      });

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

    const {
      isfeatured,
      status,
      adsType,
      categories,
      sub_categories,
      business_name,
      experience,
      tagline,
      business_location,
      accreditation_name,
      accreditation_files,
      // price,
      descriptions,
      image,
      video_link,
    } = req.body;

    let work_hour = [];
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    let mondayObj = {};

    for (i = 0; i <= days.length - 1; i++) {
      let monday = {
        is_24hour: false,
        is_status: false,
        day_name: "",
        open_at: "",
        close_at: "",
      };
      let day_s = `is_status_${days[i].toLocaleLowerCase()}`;
      let day_24 = `is_24_hour_${days[i].toLocaleLowerCase()}`;
      let day_o = `open_at_${days[i].toLocaleLowerCase()}`;
      let day_c = `close_at_${days[i].toLocaleLowerCase()}`;
      let day_n = `day_name_${days[i].toLocaleLowerCase()}`;
      let day_status;
      let day_24_hour;
      var day_open;
      let day_close;
      let day_Name;
      if (day_s in req.body) {
        day_status = req.body[day_s];
      }
      if (day_24 in req.body) {
        day_24_hour = req.body[day_24];
      }
      if (day_o in req.body) {
        day_open = req.body[day_o];
      }
      if (day_c in req.body) {
        day_close = req.body[day_c];
      }
      if (day_n in req.body) {
        day_Name = req.body[day_n];
      }

      if (day_status == `true`) {
        if (!work_hour[day_Name]) {
          monday.is_status = day_status;
          monday.day_name = day_Name;
          if (day_24_hour == `true`) {
            monday.is_24_hour = true;
            monday.open_at = "00:00:00";
            monday.close_at = "23:59:00";
          } else {
            monday.is_24_hour = false;
            monday.day_name = day_Name;
            monday.open_at = day_open;
            monday.close_at = day_close;
          }
        }
      } else {

        monday.is_status = false;
        monday.day_name = day_Name;
        monday.open_at = null;
        monday.close_at = null;
        monday.is_24_hour = false;
      }
      work_hour.push(monday);
    }



    const userId = req.userId;

    const imageArr = [];
    let accreditationArr = [];

    if (req.files.photos) {
      for (var i = 0; i < req.files.photos.length; i++) {
console.log(req.files.photos);

        if (req.files.photos[i].fieldname === `photos`) {
          let type_of_file = req.files.photos[i].mimetype;
          if (type_of_file === 'image/png' || type_of_file === 'application/octet-stream' ||  type_of_file === 'image/jpg' || type_of_file === 'image/jpg' ) {
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
if(!accreditation_name){
  return failureJSONResponse(res, {
        message: `Please provide accreditation_name`,
      });
}
      for (var i = 0; i < req.files.accreditation_document.length; i++) {
        if (req.files.accreditation_document[i].fieldname === `accreditation_document`) {
          let type_of_files = req.files.accreditation_document[i].mimetype;
          // if (type_of_files === 'application/pdf' || type_of_files === 'image/jpg' ||  type_of_file === 'application/octet-stream' || type_of_files === 'image/jpeg') {
            var doc = req.files.accreditation_document[i].path;
            productDoc = await Media.create({ url: doc, url_type: type_of_files });
            console.log(productDoc, "hdhcbdhh");
            let acrredationn = {
              accreditation_name:accreditation_name,
              accreditation_files: productDoc._id
            }
            accreditationArr.push(acrredationn);
          // } else {
          //   return failureJSONResponse(res, {
          //     message: `Please provide only pdf,png`,
          //   });
          // }
        }
      }

    }

    console.log(work_hour.length, "dcdnjchnbjbc");

    const dataObj = {
      isfeatured,
      status: status,
      adsType,
      adsInfo: {
        categories,
        sub_categories,
        business_name,
        experience,
        working_hours: work_hour,
        tagline,
        business_location,
        // price,
        descriptions,
        image: imageArr,
        video_link,
        accreditation_file:accreditationArr,
      },

      userId: userId,
    };

    const newbizPost = await postbizAndServicesAd.create(dataObj);
    console.log(newbizPost);
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
        bizAndServices: null,
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
      business_location,
      accreditation_name,
      accreditation_files,
      // price,
      descriptions,
      image,
      video_link,
      location,
      name,
      email_address,
      primary_phone_number,
      secondary_phone_number,
      website_link,
      hide_my_phone,
      hide_my_email,
    } = req.body;

    let work_hour = [];
    let days = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];


    for (i = 0; i <= days.length - 1; i++) {
      let monday = {
        is_24hour: false,
        is_status: false,
        day_name: "",
        open_at: "",
        close_at: "",
      };
      let day_s = `is_status_${days[i].toLocaleLowerCase()}`;
      let day_24 = `is_24_hour_${days[i].toLocaleLowerCase()}`;
      let day_o = `open_at_${days[i].toLocaleLowerCase()}`;
      let day_c = `close_at_${days[i].toLocaleLowerCase()}`;
      let day_n = `day_name_${days[i].toLocaleLowerCase()}`;
      let day_status;
      let day_24_hour;
      var day_open;
      let day_close;
      let day_Name;
      if (day_s in req.body) {
        day_status = req.body[day_s];
      }
      if (day_24 in req.body) {
        day_24_hour = req.body[day_24];
      }
      if (day_o in req.body) {
        day_open = req.body[day_o];
      }
      if (day_c in req.body) {
        day_close = req.body[day_c];
      }
      if (day_n in req.body) {
        day_Name = req.body[day_n];
      }

      if (day_status == `true`) {
        if (!work_hour[day_Name]) {
          monday.is_status = day_status;
          monday.day_name = day_Name;
          if (day_24_hour == `true`) {
            monday.is_24_hour = true;
            monday.open_at = "00:00:00";
            monday.close_at = "23:59:00";
          } else {
            monday.is_24_hour = false;
            monday.day_name = day_Name;
            monday.open_at = day_open;
            monday.close_at = day_close;
          }
        }
      } else {

        monday.is_status = false;
        monday.day_name = day_Name;
        monday.open_at = null;
        monday.close_at = null;
        monday.is_24_hour = false;
      }
      work_hour.push(monday);
    }

    console.log(work_hour.length, "dcdnjchnbjbc");

    const imageArr = [];
    const accreditationArr = [];

    if (req.files.photos) {
      for (var i = 0; i < req.files.photos.length; i++) {


        if (req.files.photos[i].fieldname === `photos`) {
          let type_of_file = req.files.photos[i].mimetype;
          // if (type_of_file === 'image/png' || type_of_file === 'image/jpeg') {
            var thumbnail = req.files.photos[i].path;
            productImages = await Media.create({ url: thumbnail, url_type: type_of_file });
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
    if(accreditation_name){
    if (req.files.accreditation_document) {
      console.log(req.files.accreditation_document,accreditation_name);
      // for (var i = 0; i < req.files.accreditation_document.length; i++) {
        // if (req.files.accreditation_document.fieldname === `accreditation_document`) {
          let type_of_files = req.files.accreditation_document.mimetype;
          // if (type_of_files === 'application/pdf' || type_of_files === 'image/jpg' || type_of_files === 'image/jpeg') {
            var doc = req.files[0].path
            console.log(doc);
           let productDoc = await Media.create({ url: doc, url_type: type_of_files });
           console.log(productDoc,"gagan"); 
           let upd ={accreditation_name:accreditation_name, accreditation_files:productDoc._id}
            let addpush = await postbizAndServicesAd.findByIdAndUpdate({_id:bizId}, {$push:{"adsInfo.accreditation_file":upd}},{upsert:true})

            console.log(addpush, "hdhcbdhh");
          //  await accreditationArr.push();
          //   console.log(accreditationArr);
          // } else {
          //   return failureJSONResponse(res, {
          //     message: `Please provide only pdf,png`,
          //   });
          // }
        // }
      // }

    }
  }
  




    const dataObj = {},
      adsInfoObj = {},
      accreditation_data = {};
      let my_phone = false;
      let my_email = false;
      if (hide_my_phone == "true") {
          my_phone = true
      } else if (hide_my_phone == 'false') {
          my_phone = false
      }
  
      if (hide_my_email == "true") {
          my_email = true
      } else if (hide_my_email == 'false') {
          my_email = false
      }
    if (status) dataObj.status = status;
    if (adsType) dataObj.adsType = adsType;

    if (sub_categories) adsInfoObj.sub_categories = sub_categories;
    if (categories) adsInfoObj.categories = categories;
    if (business_name) adsInfoObj.business_name = business_name;
    if (tagline) adsInfoObj.tagline = tagline;
    if (business_location) adsInfoObj.business_location = business_location;
     if (experience) adsInfoObj.experience = experience;
    if (descriptions) adsInfoObj.descriptions = descriptions;
  
    if (imageArr.length) adsInfoObj.image = imageArr;
    if (video_link) adsInfoObj.video_link = video_link;
    // if (accreditationArr.length) accreditation_data.accreditation_files = accreditationArr;
    // if (accreditation_name) accreditation_data.accreditation_name = accreditation_name;
     if (accreditationArr.length) adsInfoObj.accreditation_file = accreditationArr;
    if (work_hour.length == 7) adsInfoObj.working_hours = work_hour;
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

/////----------------------Update Job Status -------------------/////

exports.editJobStatus = async (req, res, next) => {

  try {
    const jobId = req?.params?.jobId;

    if (!jobId)
      return successJSONResponse(res, {
        message: `success`,
        newJobPost,
        status: 200,
      });
    const dataObj = {};
    const { status } = req.body;

    if (status) dataObj.status = parseInt(status);

    const updateJob = await postJobAd.findByIdAndUpdate(
      { _id: jobId },
      { $set: dataObj },
      { new: true }
    );

    if (updateJob) {
      return successJSONResponse(res, {
        message: `success`,
        updateJob,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updatejob: null,
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
      status: 1,
    };

    if (isFeatured) dbQuery.isfeatured = isFeatured;
    let records = await postJobAd.find(dbQuery);
    if (records) {
      return successJSONResponse(res, {
        message: `success`,
        total: Object.keys(records).length,
        records,
        status: 200,
      });
    } else {
      return failureJSONResponse(res, { message: `Room not Available` });
    }
  } catch (err) {
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};
