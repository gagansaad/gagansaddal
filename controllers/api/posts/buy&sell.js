const { json } = require("express");
const crypto = require("crypto");
const { mongoose, ObjectId, modelNames } = require("mongoose"),
  postBuySellAd = mongoose.model("Buy & Sell"),
  PostViews = mongoose.model("Post_view"),
  Media = mongoose.model("media"),
  tagline_keywords = mongoose.model("keywords"),
  Users = mongoose.model("user"),
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
          deletedAt: new Date().toISOString(),
          "plan_validity.expired_on": new Date().toISOString(), // Set the plan validity expiry date
          "addons_validity.$[].expired_on": new Date().toISOString(), // Add your temporary field and its value here
        }
      };
  
      let records = await postBuySellAd.update(dbQuery, updateFields, { new: true });
  
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
  
////-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
  let records = await tagline_keywords.find().select({ keywords: 1, _id: 1 });

  const dynamicsData = {
    tagline: records,
    quantity_unit: [
      "Units",
      "Pound",
      "Kg",
      "Foot",
      "sqf",
      "Litre",
      "Gallon",
      "Meter",
      "Yard",
      "Inches",
      "Cubic meter",
      "Centimeter",
      "Gram",
      "Quart",
      "Length",
    ],
    categories: [
      "Furniture and Home decore",
      "Baby & Kids stuff",
      "Home and Kitchen Appliance",
      "Real Estate",
      "Electronics appliance",
      "Computers & Accsosories",
      "Books",
      "Musical instrument",
      "Phones",
      "Clothing and Footwear",
      "Pets",
      "Fashion & Jewllery",
      "Home, Lawn & Garden",
      "Video Games & Consoles",
      "Bikes & Moterbikes",
      "Sport & Health product",
      "Cars",
      "Arts & Collectabiles",
      "Free Stuffs",
      "Other",
    ],
    categories_Furniture: [
      "Tea table",
      "Sudy table",
      "Double bed",
      "Curtains",
      "Book shelf",
      "Center table",
      "Dining table and chairs",
      "Coffee tables",
      "Drawers",
      "Television stand",
      "Office furniture",
      "Bed & Bedroom furniture",
      "Chairs",
      "Computer table",
      "Cabinets",
      "Doors",
      "Couch",
      "Modular kitchen",
      "Windows",
      "Other",
    ],
    categories_Baby: [
      "Baby toilet seat",
      "Drawing bed",
      "Swing",
      "Bags",
      "Clothes",
      "Feeding botles & nepples",
      "Toddler bed",
      "Bicycles & Tricycles",
      "Kids bath tube",
      "Shoe and boots",
      "Toys",
      "Breast pump",
      "Diapers",
      "Stroller",
      "Walker",
      "Kids Party Wear",
      "Other",
    ],
    categories_Home: [
      "Esprresso machine",
      "Freezer",
      "Kitchen Utensils & Accessories",
      "Blender",
      "Food processor",
      "Microwave oven",
      "Sandwich maker",
      "Water filter",
      "Coffee maker",
      "Toaster",
      "Indoor grill",
      "Mixer/grinder",
      "Dish washer",
      "Food Warmer",
      "Juicer",
      "Pressure cooker",
      "Stoves & toaser ovens",
      "Refrigerators",
      "dish washers",
      "Heaters,humidifiers & dehumidifiers",
      "Iron & garment steamer",
      "Vacuums",
      "Washers & Dryers",
    ],
    categories_Real: [
      "Single House",
      "Condo",
      "Apartment",
      "Townhouse",
      "Duplex",
      "Land",
      "Other",
    ],
    categories_Electronics: [
      "Amplifiers",
      "Decoders",
      "Flat Screen Television",
      "LCD Television",
      "Receivers",
      "Home & Office Phones",
      "Cables",
      "IPods & Mp3 Players",
      "Fan",
      "Security Systems",
      "Satellite Dishes",
      "Blue Ray And DVD Players",
      "Home & Office Phones",
      "Digital Video Recorders",
      "Television",
      "Radio",
      "Security Systems",
      "Other",
    ],
    categories_Computers: [
      "Desktop computers",
      "Ipad and tablets",
      "Laptops",
      "Mouse",
      "Servers",
      "Cable and connectors",
      "Flash memory and usb sticks",
      "ipad and tablet accessories",
      "laptop accessories",
      "Mic, keyboard and webcams",
      "Monitors",
      "Networking",
      "Printers,scanners and fax",
      "Services (training and repair)",
      "Software",
      "Speakers and Headseats",
      "System Componenets",
      "Other",
    ],
    categories_Books: [
      "children and young adult",
      "Comics and graphic novels",
      "Fiction",
      "Magazines",
      "Non-fiction",
      "Textbooks",
      "other",
    ],
    categories_Musical: [
      "Amps & Pedals",
      "Brass",
      "Drums & Percussion",
      "Guitars",
      "Fluet",
      "Performance & Dj equipmnets",
      "Pianos & Keyboards",
      "Pro audio & Recording equipment",
      "String",
      "Wood wind",
      "Kirar",
      "Kebero",
      "Masinko",
      "speaker",
      "Streo system and Home theatre",
      "Headephones",
      "Other",
    ],
    categories_Phones: [
      "Cellphones",
      "Cell phone accessories",
      "Cell phone services",
      "Home phone & Answering machine",
      "Other",
    ],
    categories_Clothing: [
      "Caltural Clothes",
      "Bridal Wear",
      "Designer Clothings",
      "Women's Party Wear",
      "Tights",
      "Shirts",
      "Men's Clothing",
      "Wedding Collection",
      "Tops",
      "Suits & Blazers",
      "Shorts",
      "Mens Formal Shirts",
      "Designer Sarees",
      "Blouse",
      "Casual Wear",
      "Men's Party Wear",
      "Winter Wear",
      "Skirts",
      "Formal Wear",
      "Jackets & Coats",
      "Mens Shoes",
      "Womens Shoes",
      "Jeans",
      "Other",
    ],
    categories_Pets: [
      "Birds",
      "Cats",
      "Dogs",
      "Fish",
      "Monkey",
      "Pet supplies & Accessories",
    ],
    categories_Fashion: [
      "Anklets",
      "Belt",
      "Diamond Earring",
      "Fashion jewellery",
      "Cultural Jewellery",
      "Purses",
      "Necklace",
      "Handbags",
      "Bracelet",
      "Diamond finger ring",
      "Watches",
      "Gold finger ring",
      "Artificial jewellery",
      "Sunglasses",
      "Pearl Bangles",
      "Jewelry Supplies",
      "Beauty Accessories",
      "Diamond Pendants",
      "Vintage & Antique Jewellery",
      "Other",
    ],
    categories_Home_lawn: [
      "BBQ &outdoor cooking",
      "Decks and Fences",
      "Garage doors and openers",
      "Hot tubs & pools",
      "Lawnmowers & leaf blowers",
      "Outdoor decore",
      "Outdoor lightning",
      "Outdoor tools & storage",
      "Patio & garden furniture",
      "Plants,fertilizer & soil",
      "Snowblowers",
      "Bathwares",
      "Bedding",
      "Fireplace and firewood",
      "Holiday,eventand seasonal",
      "Home decor and accent",
      "indoor lightning and fans",
      "Kitchen and dining wares",
      "Rugs, carpets and runners",
      "Storage and organization",
      "Window treatment",
      "Other",
    ],
    categories_Video: [
      "Nintendo DS",
      "Nintendo switch",
      "Nintendo Wii",
      "Nintendo Wii U",
      "Older Generation",
      "PC Games",
      "Sony Playstation 3",
      "Sony Playstation 4",
      "Sony Playstation 5",
      "Sony psp & vita",
      "XBOX 360",
      "XBOX One",
      "XBOX Series X&S",
      "Other",
    ],
    categories_Bikes: [
      "Bmx",
      "Clothing, shoes and accessories",
      "Cruiser, commuter and hybrid",
      "ebike",
      "fixie (singlespeed)",
      "Frames and parts",
      "Kids",
      "Mountain",
      "Other",
    ],
    categories_Sport: [
      "Ab Exerciser",
      "Bicycles",
      "Elliptical",
      "Extreme Sports",
      "American Football",
      "Soccer",
      "Hunting",
      "Snowboarding",
      "Swimming Suits",
      "Basketball",
      "Table Tennis",
      "Skateboarding",
      "Martial Arts",
      "Golf",
      "Badminton",
      "Beam Braces",
      "Board Games",
      "Cycling",
      "Exercise Ball",
      "Sports Equipment",
      "Skipping Ropes",
      "Fitness Equipment",
      "Exercise Machines",
      "Health Supplements",
      "Other",
    ],
    categories_Cars: [
      "Acura",
      "Afeela",
      "Alfa Romeo",
      "Audi",
      "BMW",
      "Bentley",
      "Buick",
      "Cadillac",
      "Chevrolet",
      "Chrysler",
      "Defender",
      "Discovery",
      "Dodge",
      "Fiat",
      "Fisker",
      "Ford",
      "GMC",
      "Genesis",
      "Honda",
      "Hyundai",
      "Infiniti",
      "Jaguar",
      "Jeep",
      "Kia",
      "Land Rover",
      "Lexus",
      "Lincoln",
      "Lotus",
      "Lucid",
      "Maserati",
      "Mazda",
      "Mercedes-Benz",
      "Mercury",
      "Mini",
      "Mitsubishi",
      "Nissan",
      "Ram",
      "Ranger Rover",
      "Rivian",
      "Rolls-Royce",
      "Saab",
      "Saturn",
      "Scion",
      "Scout",
      "Smart",
      "Subaru",
      "Suzuki",
      "Tesla",
      "Toyota",
      "VinFast",
      "Volkswagen",
      "Volvo",
      "Other",
    ],
    categories_Arts: [
      "Fine Art",
      "Advertising, Paper & Ephemera",
      "African Art",
      "Ethiopian Art",
      "Eritrean Art",
      "Flags",
      "Asian Antiques & Collectibles",
      "Bronze & Metalwork",
      "Cameras, Optics & Photography",
      "Carpets & Oriental Rugs",
      "Clocks, Barometers & Scientific Instruments",
      "Coins & Numismatics",
      "Decoys",
      "Fashion & Textiles",
      "Fine & Antique Toys",
      "Furniture",
      "General Collectibles",
      "Glass",
      "Jewelry",
      "Lamps",
      "Maps, Globes, and Atlases",
      "Militaria & Firearms",
      "Musical Instruments",
      "Native American & Ethnographic Arts",
      "Natural History",
      "Porcelain Art",
      "Pottery & Ceramics",
      "Silver",
      "Sports, Industry & Entertainment Memorabilia",
      "Whiskey",
      "Wines & Spirits",
      "Wristwatches and Chronometers",
    ],
    categories_freestuff: [],
    categories_others: [],
    payment_mode: ["Cashless payment", "Cash accepted"],
    fullfilment: [
      "Free shipping",
      "In person pickup",
      "Only local delivery",
      "Please contact",
    ],
    product_condition: ["New", "Used - Like new", "Used - Good", "Used - Fair"],
    user_type: [`Individual`, `Business`],
    currency: ["USD", "AED", "AUD", "AWG", "CAD", "EUR", "GBP", "INR", "USN"],
  };
  return successJSONResponse(res, {
    message: `success`,
    data: dynamicsData,
  });
};

///-----------------------Validate Data---------------------------//

exports.validateBuySellAdsData = async (req, res, next) => {
  try {
    const {
      status,
      ads_type,
      category,
      sub_category,
      title,
      descriptions,
      product_condition,
      product_model,
      user_type,
      amount,
      negotiable,
      quantity,
      payment_mode,
      fullfilment,
      location_name,
      tagline,
      latitude,
      longitude,
      image,
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
    if (!ads_type)
      return failureJSONResponse(res, { message: `Please provide ads type` });
    else if (ads_type && !isValidMongoObjId(mongoose, ads_type))
      return failureJSONResponse(res, {
        message: `Please provide valid ads type`,
      });

    if (!isValidString(title))
      return failureJSONResponse(res, {
        message: "Pleae provide us your title",
      });

    if (!isValidString(descriptions))
      return failureJSONResponse(res, {
        message: `please provide valid description`,
      });

    if (!isValidString(category))
      return failureJSONResponse(res, {
        message: `Please provide valid category`,
      });
    // if (!isValidString(sub_category))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid sub_category`,
    //   });
    // if (!isValidString(product_model))
    //   return failureJSONResponse(res, {
    //     message: `Please provide valid product_model`,
    //   });
    if (!isValidString(user_type))
      return failureJSONResponse(res, {
        message: `Please provide valid user_type`,
      });
    if (!isValidString(product_condition))
      return failureJSONResponse(res, {
        message: `Please provide valid product_condition`,
      });
    if (!latitude && !longitude) {
      return failureJSONResponse(res, {
        message: `Please provide both latitude and longitude`,
      });
    }

    // if (!quantity)
    //   return failureJSONResponse(res, {
    //     message: `please provide valid quantity`,
    //   });
    if (quantity && isNaN(Number(quantity)))
      return failureJSONResponse(res, {
        message: `please provide valid quantity`,
      });
    if (amount && isNaN(Number(amount)))
      return failureJSONResponse(res, {
        message: `please provide valid amount`,
      });

    return next();
  } catch (err) {
    console.log(err);
  }
};

///////////////

exports.validateListerBasicinfo = async (req, res, next) => {
  try {
    const {
      emailAddress,
      // phoneNumber,
      // countryCode,
      hideAddress,
      preferableModeContact,
    } = req.body;

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

////-----------------------Create buysell------------------------------//

exports.createBuySellAds = async (req, res, next) => {
  try {
    const {
      isfeatured,
      status,
      ads_type,
      category,
      sub_category,
      title,
      descriptions,
      product_condition,
      product_model,
      amount,
      currency,
      user_type,
      negotiable,
      is_contact,
      quantity,
      payment_mode,
      fullfilment,
      location_name,
      longitude,
      latitude,
      tagline,
      video_link,
      image,
    } = req.body;

    let taglines = tagline;
    if (taglines) {
      for (i = 0; i < taglines.length; i++) {
        let tags = await tagline_keywords.findOne({ keywords: taglines[i] });
        if (!tags) {
          let tag = {
            keywords: taglines[i],
            ads_type: ads_type,
          };
          let ja = await tagline_keywords.create(tag);
        }
      }
    }
    const userId = req.userId;

    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
    }

    let negov = false;

    if (negotiable == "true") {
      negov = true;
    }
    let iscontact = false;

    if (is_contact == "true") {
      iscontact = true;
    }
    let mode_payment = payment_mode;

    const dataObj = {
      isfeatured,
      status: status,
      adsType: ads_type,
      adsInfo: {
        category,
        sub_category,
        title,
        user_type,
        descriptions,
        product_condition,
        product_model,
        price: {
          amount,
          currency,
          negotiable: negov,
          is_contact: iscontact,
        },
        quantity,
        payment_mode: mode_payment,
        fullfilment,
        location: {
          location_name: location_name,
          coordinates: [longitude, latitude],
        },
        tagline,
        video_link,
        image: imageArr,
      },
      userId: userId,
    };

    const newBuySellPost = await postBuySellAd.create(dataObj);
    const stringToHash = newBuySellPost._id.toString();
    const hash = await crypto
      .createHash("sha256")
      .update(stringToHash)
      .digest("hex");
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % Math.pow(10, 10);
    let ad_Id = numericHash.toString().padStart(10, "0");

    await postBuySellAd.findByIdAndUpdate(
      { _id: newBuySellPost._id },
      { $set: { advertisement_id: ad_Id } }
    );
    const postBuySellAdObjToSend = {};

    for (let key in newBuySellPost.toObject()) {
      if (
        !fieldsToExclude.hasOwnProperty(String(key)) &&
        !listerBasicInfo.hasOwnProperty(String(key))
      ) {
        postBuySellAdObjToSend[key] = newBuySellPost[key];
      }
    }

    if (newBuySellPost) {
      return successJSONResponse(res, {
        message: `success`,
        postBuySellAdObjToSend: postBuySellAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        postBuySellAdObjToSend: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

///--------------------------Edit buysell-----------------------------///

exports.editBuySellAds = async (req, res, next) => {
  try {
    const buyAndSellId = req?.params?.buyAndSellId;

    const validate_id = await postBuySellAd.findById(buyAndSellId);
    if (!validate_id) {
      return failureJSONResponse(res, {
        message: `Failed to find your buy sell id`,
      });
    }

    const {
      status,
      ads_type,
      category,
      sub_category,
      title,
      descriptions,
      product_condition,
      product_model,
      amount,
      currency,
      user_type,
      negotiable,
      is_contact,
      quantity,
      payment_mode,
      fullfilment,
      location_name,
      longitude,
      latitude,
      tagline,
      video_link,
      image,
      name,
      email_address,
      primary_phone_number,
      secondary_phone_number,
      website_link,
      hide_my_phone,
      hide_my_secondary_phone,
      hide_my_email,

      // address_info,
      // preferableModeContact,
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
            ads_type: ads_type,
          };
          await tagline_keywords.create(tag);
        }
      }
    }
    let imageArr = [];
    const existingRoomRents = await postBuySellAd.findById(buyAndSellId);
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
      listerBasicInfoObj = {};
    let negoval = false;

    if (negotiable == "true") {
      negoval = true;
    }
    let price = {};

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
    if (ads_type) dataObj.adsType = ads_type;
    if (category) adsInfoObj.category = category;
    if (sub_category) adsInfoObj.sub_category = sub_category;
    if (title) adsInfoObj.title = title;
    if (user_type) adsInfoObj.user_type = user_type;
    if (descriptions) adsInfoObj.descriptions = descriptions;
    if (user_type) adsInfoObj.user_type = user_type;
    if (product_condition) adsInfoObj.product_condition = product_condition;
    if (product_model) adsInfoObj.product_model = product_model;
    if (amount) price.amount = amount;
    if (currency) price.currency = currency;
    if (negotiable) price.negotiable = negoval;
    if (is_contact) price.is_contact = iscontact;
    if (price) adsInfoObj.price = price;

    if (quantity) adsInfoObj.quantity = quantity;
    if (payment_mode) adsInfoObj.payment_mode = payment_mode;
    if (fullfilment) adsInfoObj.fullfilment = fullfilment;
    let locationobj = {};
    if (longitude && latitude) {
      locationobj = {
        coordinates: [longitude, latitude],
      };
    }
    if (location_name) locationobj.location_name = location_name;

    if (locationobj) adsInfoObj.location = locationobj;
    if (tagline) adsInfoObj.tagline = tagline;
    if (video_link) adsInfoObj.video_link = video_link;
    if (imageArr.length) adsInfoObj.image = imageArr;

    if (adsInfoObj && Object.keys(adsInfoObj).length) {
      dataObj.adsInfo = adsInfoObj;
    }

    const dataObjq = {
      adsInfo: adsInfoObj,
      lister_basic_info: {
        name,
        email_address,
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

    const updateProduct = await postBuySellAd.findByIdAndUpdate(
      { _id: buyAndSellId },
      { $set: dataObjq },
      { new: true }
    );

    let updateBuySellAdObjToSend = {};
    for (let key in updateProduct.toObject()) {
      if (!fieldsToExclude.hasOwnProperty(String(key))) {
        updateBuySellAdObjToSend[key] = updateProduct[key];
      }
    }

    if (updateProduct) {
      return successJSONResponse(res, {
        message: `success`,
        updateBuySellAdObjToSend: updateBuySellAdObjToSend,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updateBuySellAdObjToSend: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

/////----------------------Update Buy Sell Status -------------------/////

exports.editBuySellStatus = async (req, res, next) => {
  try {
    const buyAndSellId = req?.params?.buyAndSellId;

    if (!buyAndSellId)
      return successJSONResponse(res, {
        message: `success`,
        newProductPost,
        status: 200,
      });
    const dataObj = {};
    const { status } = req.body;

    if (status) dataObj.status = parseInt(status);

    const updateProduct = await postBuySellAd.findByIdAndUpdate(
      { _id: buyAndSellId },
      { $set: dataObj },
      { new: true }
    );

    if (updateProduct) {
      return successJSONResponse(res, {
        message: `success`,
        updateProductStatus: updateProduct,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        updateProduct: null,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

///////

exports.fetchAll = async (req, res, next) => {
  try {
    let searchTerm = req.query.search_term || "";
    let dbQuery = {};
    const {
      status,
      ads_type,
      category,
      sub_category,
      title,
      product_condition,
      user_type,
      payment_mode,
      fullfilment,
      location,
      tagline,
      sortBy,
      longitude,
      latitude,
      maxDistance,
      add_on,
      negotiable,
      amount,
      is_contact,
      min_price,
      max_price,
      is_favorite,
      is_myad,
    } = req.query;
    console.log(req.query,"fkmvkfv");
    let adOnsQuery = {};
    // let is_myadCheck;
    // is_myadCheck=(!is_myad && is_myad==false && is_myad==null && is_myad ==undefined)?false:true;
    if (min_price && max_price) {
      dbQuery["adsInfo.price.amount"] = {
        $gte: parseFloat(min_price),
        $lte: parseFloat(max_price),
      };
    }
    if (negotiable !== undefined) {
      // Add filter for negotiable
      dbQuery["adsInfo.price.negotiable"] =
        negotiable === true || negotiable === "true";
    }
    if (amount) {
      // Add filter for rent amount
      dbQuery["adsInfo.price.amount"] = { $lte: amount };
    }
    if (is_contact !== undefined) {
      // Add filter for is_contact
      dbQuery["adsInfo.price.is_contact"] =
        is_contact === true || is_contact === "true";
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
  

    if (ads_type) {
      dbQuery.adsType = ads_type;
    }

    if (category) {
      dbQuery["adsInfo.category"] = category;
      adOnsQuery["adsInfo.category"] = category;
    }

    if (sub_category) {
      dbQuery["adsInfo.sub_category"] = sub_category;
      adOnsQuery["adsInfo.sub_category"] = sub_category;
    }

    if (title) {
      dbQuery["adsInfo.title"] = title;
    }

    if (product_condition) {
      dbQuery["adsInfo.product_condition"] = product_condition;
    }

    if (user_type) {
      dbQuery["adsInfo.user_type"] = user_type;
    }

    if (fullfilment) {
      // Convert prefered_age to an array if it's not already
      const fullfilmentArray = Array.isArray(fullfilment)
        ? fullfilment
        : [fullfilment];

      // Add $in query to filter based on prefered_age
      dbQuery["adsInfo.fullfilment"] = {
        $in: fullfilmentArray,
      };
    }
    if (payment_mode) {
      // Convert prefered_age to an array if it's not already
      const payment_modeArray = Array.isArray(payment_mode)
        ? payment_mode
        : [payment_mode];

      // Add $in query to filter based on prefered_age
      dbQuery["adsInfo.payment_mode"] = {
        $in: payment_modeArray,
      };
    }
    if (location) {
      dbQuery["adsInfo.location"] = location;
    }

    if (tagline) {
      dbQuery["adsInfo.tagline"] = tagline;
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
      dbQuery.userId = myid;
      if (status == 0) {
        dbQuery.status = "active";
      }
      if (status == 1) {
        dbQuery.status = { $in: ["inactive", "deleted"] };
      }
      if (status == 2) {
        dbQuery.status = "draft";
      }
    }
    dbQuery ={  ...dbQuery,
      ...locationQuery,
      ...addOnsQuery,}
    let queryFinal = dbQuery;
    if (searchTerm) {
      queryFinal = {
        ...dbQuery,
        $or: [
          { "adsInfo.title": { $regex: searchTerm.trim(), $options: "i" } },
          { "adsInfo.tagline": { $regex: searchTerm.trim(), $options: "i" } },
          {"advertisement_id":searchTerm}
        ],
      };
    }

    let notification = await Users.findOne({ _id: myid }).select(
      "userNotification.buysell"
    );
    let valueofnotification = notification?.userNotification?.buysell;
   
      let featuredData;
      let commonId;
      if(is_favorite != "true"){
      if (is_myad != "true" && !searchTerm) {
        let FeaturedData = await postBuySellAd
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
            ...job._doc,
            // Add other job fields as needed
            view_count: job.viewCount,
            favorite_count: job.favoriteCount,
            is_favorite: !!job.isFavorite,
          };
        });
        // let bumpId = featuredData.map(featuredItem => featuredItem._id)
        // commonId = [...bumpId]
      }}
      let query = {
        $or: [queryFinal]
      };
      
      // if (commonId && commonId.length > 0) {
      //   query._id = { $nin: commonId };
      // }

      let records = await postBuySellAd
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
    // const totalCount = await postBuySellAd.find({
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
      /////
      const isFavoriteFilter = is_favorite === "true" ? true : undefined;
      if (isFavoriteFilter) {
        jobData = jobData.filter((job) => job.is_favorite === true);
      }

      // Pagination
      let totalCount = jobData.length; 
      let totalresult;
      let paginationlength = req.query.perpage || 40
      // let freedata
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
      // if (perPage === 0) {
      //   paginatedData = []; // Create an empty array
      // } else {
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
      
        paginatedData = jobData.slice(startIndex, endIndex);
      // }

      //////
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
    let checkId = await postBuySellAd.findOne({ _id: adsId });
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
    let records = await postBuySellAd
      .findOne(data_Obj)
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: "ReportCount", select: "_id" })
      .populate({
        path: "isReported",
        select: "userId",
        match: { userId: myid },
      })
      .populate({ path: "isFavorite", select: "user", match: { user: myid } });
      records = records.toObject({ virtuals: true });
    if (records) {
      const ads_type = records.adsType.toString();

      let { ModelName, Typename } = await ModelNameByAdsType(ads_type);
      let dbQuery = {
        userId: myid,
        ad: records._id,
        adType: Typename,
        ads_type: ads_type,
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

exports.fetchBuysellData = async (req, res, next) => {
  try {
    let maxDistance = req.query.maxDistance || 200;
    const sub_categories = {
      "Furniture and Home decore": [
        "Tea table",
        "Sudy table",
        "Double bed",
        "Curtains",
        "Book shelf",
        "Center table",
        "Dining table and chairs",
        "Coffee tables",
        "Drawers",
        "Television stand",
        "Office furniture",
        "Bed & Bedroom furniture",
        "Chairs",
        "Computer table",
        "Cabinets",
        "Doors",
        "Couch",
        "Modular kitchen",
        "Windows",
        "Other",
      ],
      "Baby & Kids stuff": [
        "Baby toilet seat",
        "Drawing bed",
        "Swing",
        "Bags",
        "Clothes",
        "Feeding botles & nepples",
        "Toddler bed",
        "Bicycles & Tricycles",
        "Kids bath tube",
        "Shoe and boots",
        "Toys",
        "Breast pump",
        "Diapers",
        "Stroller",
        "Walker",
        "Kids Party Wear",
        "Other",
      ],
      "Home and Kitchen Appliance": [
        "Esprresso machine",
        "Freezer",
        "Kitchen Utensils & Accessories",
        "Blender",
        "Food processor",
        "Microwave oven",
        "Sandwich maker",
        "Water filter",
        "Coffee maker",
        "Toaster",
        "Indoor grill",
        "Mixer/grinder",
        "Dish washer",
        "Food Warmer",
        "Juicer",
        "Pressure cooker",
        "Stoves & toaser ovens",
        "Refrigerators",
        "dish washers",
        "Heaters,humidifiers & dehumidifiers",
        "Iron & garment steamer",
        "Vacuums",
        "Washers & Dryers",
      ],
      "Real Estate": [
        "Single House",
        "Condo",
        "Apartment",
        "Townhouse",
        "Duplex",
        "Land",
        "Other",
      ],
      "Electronics appliance": [
        "Amplifiers",
        "Decoders",
        "Flat Screen Television",
        "LCD Television",
        "Receivers",
        "Home & Office Phones",
        "Cables",
        "IPods & Mp3 Players",
        "Fan",
        "Security Systems",
        "Satellite Dishes",
        "Blue Ray And DVD Players",
        "Home & Office Phones",
        "Digital Video Recorders",
        "Television",
        "Radio",
        "Security Systems",
        "Other",
      ],
      "Computers & Accsosories": [
        "Desktop computers",
        "Ipad and tablets",
        "Laptops",
        "Mouse",
        "Servers",
        "Cable and connectors",
        "Flash memory and usb sticks",
        "ipad and tablet accessories",
        "laptop accessories",
        "Mic, keyboard and webcams",
        "Monitors",
        "Networking",
        "Printers,scanners and fax",
        "Services (training and repair)",
        "Software",
        "Speakers and Headseats",
        "System Componenets",
        "Other",
      ],
      Books: [
        "children and young adult",
        "Comics and graphic novels",
        "Fiction",
        "Magazines",
        "Non-fiction",
        "Textbooks",
        "other",
      ],
      "Musical instrument": [
        "Amps & Pedals",
        "Brass",
        "Drums & Percussion",
        "Guitars",
        "Fluet",
        "Performance & Dj equipmnets",
        "Pianos & Keyboards",
        "Pro audio & Recording equipment",
        "String",
        "Wood wind",
        "Kirar",
        "Kebero",
        "Masinko",
        "speaker",
        "Streo system and Home theatre",
        "Headephones",
        "Other",
      ],
      Phones: [
        "Cellphones",
        "Cell phone accessories",
        "Cell phone services",
        "Home phone & Answering machine",
        "Other",
      ],
      "Clothing and Footwear": [
        "Caltural Clothes",
        "Bridal Wear",
        "Designer Clothings",
        "Women's Party Wear",
        "Tights",
        "Shirts",
        "Men's Clothing",
        "Wedding Collection",
        "Tops",
        "Suits & Blazers",
        "Shorts",
        "Mens Formal Shirts",
        "Designer Sarees",
        "Blouse",
        "Casual Wear",
        "Men's Party Wear",
        "Winter Wear",
        "Skirts",
        "Formal Wear",
        "Jackets & Coats",
        "Mens Shoes",
        "Womens Shoes",
        "Jeans",
        "Other",
      ],
      Pets: [
        "Birds",
        "Cats",
        "Dogs",
        "Fish",
        "Monkey",
        "Pet supplies & Accessories",
      ],
      "Fashion & Jewllery": [
        "Anklets",
        "Belt",
        "Diamond Earring",
        "Fashion jewellery",
        "Cultural Jewellery",
        "Purses",
        "Necklace",
        "Handbags",
        "Bracelet",
        "Diamond finger ring",
        "Watches",
        "Gold finger ring",
        "Artificial jewellery",
        "Sunglasses",
        "Pearl Bangles",
        "Jewelry Supplies",
        "Beauty Accessories",
        "Diamond Pendants",
        "Vintage & Antique Jewellery",
        "Other",
      ],
      "Home, Lawn & Garden": [
        "BBQ &outdoor cooking",
        "Decks and Fences",
        "Garage doors and openers",
        "Hot tubs & pools",
        "Lawnmowers & leaf blowers",
        "Outdoor decore",
        "Outdoor lightning",
        "Outdoor tools & storage",
        "Patio & garden furniture",
        "Plants,fertilizer & soil",
        "Snowblowers",
        "Bathwares",
        "Bedding",
        "Fireplace and firewood",
        "Holiday,eventand seasonal",
        "Home decor and accent",
        "indoor lightning and fans",
        "Kitchen and dining wares",
        "Rugs, carpets and runners",
        "Storage and organization",
        "Window treatment",
        "Other",
      ],
      "Video Games & Consoles": [
        "Nintendo DS",
        "Nintendo switch",
        "Nintendo Wii",
        "Nintendo Wii U",
        "Older Generation",
        "PC Games",
        "Sony Playstation 3",
        "Sony Playstation 4",
        "Sony Playstation 5",
        "Sony psp & vita",
        "XBOX 360",
        "XBOX One",
        "XBOX Series X&S",
        "Other",
      ],
      "Bikes & Moterbikes": [
        "Bmx",
        "Clothing, shoes and accessories",
        "Cruiser, commuter and hybrid",
        "ebike",
        "fixie (singlespeed)",
        "Frames and parts",
        "Kids",
        "Mountain",
        "Other",
      ],
      "Sport & Health product": [
        "Ab Exerciser",
        "Bicycles",
        "Elliptical",
        "Extreme Sports",
        "American Football",
        "Soccer",
        "Hunting",
        "Snowboarding",
        "Swimming Suits",
        "Basketball",
        "Table Tennis",
        "Skateboarding",
        "Martial Arts",
        "Golf",
        "Badminton",
        "Beam Braces",
        "Board Games",
        "Cycling",
        "Exercise Ball",
        "Sports Equipment",
        "Skipping Ropes",
        "Fitness Equipment",
        "Exercise Machines",
        "Health Supplements",
        "Other",
      ],
      Cars: [
        "Acura",
        "Afeela",
        "Alfa Romeo",
        "Audi",
        "BMW",
        "Bentley",
        "Buick",
        "Cadillac",
        "Chevrolet",
        "Chrysler",
        "Defender",
        "Discovery",
        "Dodge",
        "Fiat",
        "Fisker",
        "Ford",
        "GMC",
        "Genesis",
        "Honda",
        "Hyundai",
        "Infiniti",
        "Jaguar",
        "Jeep",
        "Kia",
        "Land Rover",
        "Lexus",
        "Lincoln",
        "Lotus",
        "Lucid",
        "Maserati",
        "Mazda",
        "Mercedes-Benz",
        "Mercury",
        "Mini",
        "Mitsubishi",
        "Nissan",
        "Ram",
        "Ranger Rover",
        "Rivian",
        "Rolls-Royce",
        "Saab",
        "Saturn",
        "Scion",
        "Scout",
        "Smart",
        "Subaru",
        "Suzuki",
        "Tesla",
        "Toyota",
        "VinFast",
        "Volkswagen",
        "Volvo",
        "Other",
      ],
      "Arts & Collectabiles": [
        "Fine Art",
        "Advertising, Paper & Ephemera",
        "African Art",
        "Ethiopian Art",
        "Eritrean Art",
        "Flags",
        "Asian Antiques & Collectibles",
        "Bronze & Metalwork",
        "Cameras, Optics & Photography",
        "Carpets & Oriental Rugs",
        "Clocks, Barometers & Scientific Instruments",
        "Coins & Numismatics",
        "Decoys",
        "Fashion & Textiles",
        "Fine & Antique Toys",
        "Furniture",
        "General Collectibles",
        "Glass",
        "Jewelry",
        "Lamps",
        "Maps, Globes, and Atlases",
        "Militaria & Firearms",
        "Musical Instruments",
        "Native American & Ethnographic Arts",
        "Natural History",
        "Porcelain Art",
        "Pottery & Ceramics",
        "Silver",
        "Sports, Industry & Entertainment Memorabilia",
        "Whiskey",
        "Wines & Spirits",
        "Wristwatches and Chronometers",
      ],
      "Free Stuffs": [],
      Other: [],
    };

    const responseArray = [];
    const lalcount = [];
    const currentDate = new Date();
    // Convert the date to ISO 8601 format
    const currentISODate = currentDate.toISOString();
    // Extract only the date portion
    const currentDateOnly = currentISODate.substring(0, 10);
    for (const category in sub_categories) {
      const subCategoryArray = sub_categories[category];
      const subcategoryData = [];

      for (const subCategory of subCategoryArray) {
        const query = {
          "adsInfo.category": category,
          "adsInfo.sub_category": subCategory,
          status: "active",
          ["plan_validity.expired_on"]: { $gte: currentISODate },
        };
        if (req.query.longitude && req.query.latitude) {
          console.log(req.query.longitude,req.query.latitude);
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
        const count = await postBuySellAd.countDocuments(query);
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
