const { json } = require("express");
const crypto = require('crypto');
const mongoose = require("mongoose"),
  postBuySellAd = mongoose.model("Buy & Sell"),
  PostViews = mongoose.model("Post_view"),
  Media = mongoose.model("media"),
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

////-----------------------Dynamic Data---------------------------////
exports.getDnymicsData = async (req, res, next) => {
 
  let records = await tagline_keywords
    .find()
    .select({ keywords: 1, _id: 1 });

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
  //   console.log(req.body)
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
    // console.log(object);
    // if (!(negotiable)) return failureJSONResponse(res, { message: `Please provide valid negotiable value` });
    //  else if (!isValidBoolean(negotiable)) return failureJSONResponse(res, { message: `Please provide boolean value for negotiable` });
    // if (!isValidString(payment_mode))
    //   return failureJSONResponse(res, { message: `please provide valid payment mode` });
    // if (!isValidString(fullfilment))
    //   return failureJSONResponse(res, {
    //     message: `please provide valid fullfilment`,
    //   });

    // if (!isValidString(location_name))
    //   return failureJSONResponse(res, {
    //     message: `please provide valid location`,
    //   });
    // if (!isValidString(tagline))
    //   return failureJSONResponse(res, { message: `please provide valid tagline` });
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

    // if (preferableModeContact) {
    //   if (preferableModeContact < 1 || preferableModeContact > 3 || preferableModeContact.includes(".")) {
    //     return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` });
    //   } else if (preferableModeContact != 1 && preferableModeContact != 2 && preferableModeContact != 3) { return failureJSONResponse(res, { message: `Please enter preferable Contact Mode between 1 to 3` }); }
    // }
    // if (preferableModeContact && isNaN(Number(preferableModeContact))) {
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
        console.log(tags);
        if (!tags) {
          let tag = {
            keywords: taglines[i],
            ads_type: ads_type,
          };
          let ja = await tagline_keywords.create(tag);
          console.log(ja, "jaj");
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
    let mode_payment= payment_mode
    // console.log(payment_mode, "jai ho");
    // if(payment_mode){
    //    mode_payment = 
    //   .split(",");
    // }
    
    console.log(mode_payment, "jai ho jai jai jai gagan ki jai");
    const dataObj = {
      isfeatured,
      status: status,
      adsType:ads_type,
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
          is_contact:iscontact
        },
        quantity,
        payment_mode: mode_payment,
        fullfilment,
        location:{
          locationName:location_name,
          latitude:latitude,
          longitude:longitude
        },
        tagline,
        video_link,
        image: imageArr,
      },
      userId: userId,
    };

    const newBuySellPost = await postBuySellAd.create(dataObj);
    const stringToHash = newBuySellPost._id.toString();
    const hash = await crypto.createHash('sha256').update(stringToHash).digest('hex');
    const truncatedHash = hash.slice(0, 10);
    const numericHash = parseInt(truncatedHash, 16) % (Math.pow(10, 10));
    let ad_Id = numericHash.toString().padStart(10, '0') 
  
   await postBuySellAd.findByIdAndUpdate({_id:newBuySellPost._id},{$set:{advertisement_id:ad_Id}})
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
    console.log(req.params);
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
    let iscontact = false
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
    const imageArr = [];

    for (var i = 0; i < req.files.length; i++) {
      var thumbnail = req.files[i].path;

      productImages = await Media.create({ url: thumbnail });
      imageArr.push(productImages._id);
    }

    console.log(`imageArr`, imageArr);

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
    let locationobj={}
  if (location_name) locationobj.locationName = location_name;
  if (longitude) locationobj.longitude = longitude;
  if (latitude) locationobj.latitude = latitude;
  if (locationobj) adsInfoObj.location = locationobj;
    if (tagline) adsInfoObj.tagline = tagline;
    if (video_link) adsInfoObj.video_link = video_link;
    if (imageArr.length) adsInfoObj.image = imageArr;

    if (name) listerBasicInfo.name = name;

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

    console.log(dataObjq);
    console.log("object", { image: imageArr });

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
  console.log(`kejhrjhyewgrjhew`);
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

/////////////

exports.fetchAll = async (req, res, next) => {
  try {
    let searchTerm = req.body.searchTerm;
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
    } = req.query;
    var perPage = parseInt(req.query.perpage) || 6;
    var page = parseInt(req.query.page) || 1;
    if (status) {
      dbQuery.status = status;
    }

    if (ads_type) {
      dbQuery.adsType = ads_type;
    }

    if (category) {
      dbQuery["adsInfo.category"] = category;
    }

    if (sub_category) {
      dbQuery["adsInfo.sub_category"] = sub_category;
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

    if (payment_mode) {
      dbQuery["adsInfo.payment_mode"] = payment_mode;
    }

    if (fullfilment) {
      dbQuery["adsInfo.fullfilment"] = fullfilment;
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
     dbQuery.status = "active";
     dbQuery["plan_validity.expired_on"] = { $gte: currentDateOnly };
console.log(dbQuery,"77777777777777777777777777777777777777777777777");
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
    let records = await postBuySellAd
      .find({ $or: [queryFinal] })
      .populate({ path: "adsInfo.image", strictPopulate: false, select: "url" })
      .populate({ path: "favoriteCount", select: "_id" })
      .populate({ path: "viewCount" })
      .populate({ path: 'isFavorite', select: 'user', match: { user: myid } })
      .sort({ createdAt: -1 })
      .skip(perPage * page - perPage)
      .limit(perPage);
    const responseModelCount = await postBuySellAd.countDocuments({
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
    console.log(err);
    return failureJSONResponse(res, { message: `something went wrong` });
  }
};




exports.fetchonead = async (req, res, next) => {
  try {
    const adsId = req.query.adsId;
    let data_Obj
    let checkId = await postBuySellAd.findOne({_id:adsId})
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
    let records = await postBuySellAd.findOne(data_Obj)
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

exports.fetchBuysellData = async (req, res, next) => {
  try {
  
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
      "Home and Kitchen Appliance":[
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
      "Real Estate":  [
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
      "Books": [
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
      "Phones": [
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
      "Pets": [
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
      "Bikes & Moterbikes":[
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
      "Cars": [
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
      "Free Stuffs": [
       
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
        const query = { "adsInfo.category": category, "adsInfo.sub_category": subCategory ,"status" :"active",["plan_validity.expired_on"]:{ $gte: currentDateOnly }};
        
        const count = await postBuySellAd.countDocuments(query);
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
