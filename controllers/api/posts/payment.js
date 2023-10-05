const { json } = require("express");
const { ObjectId } = require("mongodb");
const {
  EventListInstance,
} = require("twilio/lib/rest/taskrouter/v1/workspace/event");
const payment = require("../../../model/posts/payment");
const UserModel = require("../../../model/accounts/users");
const PaymentModel = require("../../../model/posts/payment");
const PaymentEventModel = require("../../../model/posts/paymentEvent");
const plan_adons = require("../../../model/plan/plan_adons");
const { failure } = require("../../../utils/alertMessage");
const mongoose = require("mongoose"),
  AdsPlan = mongoose.model("plan"),
  AddOns = mongoose.model("plan_addons"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  rentals = mongoose.model("rental"),
  jobsAd = mongoose.model("job"),
  USER = mongoose.model("user"),
  category = mongoose.model("PostType"),
  Alert = mongoose.model("Alert");
(payment_logs = require("../../../model/posts/paymentEvent")),
  ({
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`)),
  ({ fieldsToExclude, listerBasicInfo } = require(`../../../utils/mongoose`)),
  ({
    isValidString,
    isValidMongoObjId,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
    isValidUrl,
    isValidlink,
  } = require(`../../../utils/validators`));
let Notification = require("../../../resources/notification");

const env = require("dotenv").config({ path: "../../" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

///-----------------------Validate Data---------------------------//

exports.validatepaymentData = async (req, res, next) => {
  try {
    const { ads, plan_id, adstype } = req.body;

    if (!plan_id)
      return failureJSONResponse(res, { message: `Please provide plan id` });
    else if (plan_id && !isValidMongoObjId(mongoose, plan_id))
      return failureJSONResponse(res, { message: `Please provide valid plan` });
    if (!adstype)
      return failureJSONResponse(res, {
        message: `Please provide post type  id`,
      });
    else if (adstype && !isValidMongoObjId(mongoose, adstype))
      return failureJSONResponse(res, {
        message: `Please provide valid post type id`,
      });
    if (!ads)
      return failureJSONResponse(res, { message: `Please provide ads id` });
    else if (ads && !isValidMongoObjId(mongoose, ads))
      return failureJSONResponse(res, { message: `Please provide valid ads` });

    return next();
  } catch (err) {
    console.log(err);
  }
};

/////------------payment intent ----///////
const getStripeCustomer = async (userID) => {
  let userInfoModel = await UserModel.findOne({ _id: userID });
  userInfoModel = userInfoModel.userInfo;
  let customerStripeId;

  if (userInfoModel?.stripe_id == "" || userInfoModel?.stripe_id == null) {
    const customer = await stripe.customers.create({
      name: userInfoModel.name,
      email: userInfoModel.email_address,
    });

    await UserModel.findOneAndUpdate(
      { _id: userID },
      { "userInfo.stripe_id": customer.id }
    );
    customerStripeId = customer.id;
  } else {
    try {
      customer = await stripe.customers.retrieve(userInfoModel.stripe_id);
    } catch (error) {
      if (
        error.type === "StripeInvalidRequestError" &&
        error.raw.code === "resource_missing"
      ) {
        // Customer not found, create a new one
        customer = await stripe.customers.create({
          name: userInfoModel.name,
          email: userInfoModel.email_address,
        });

        await UserModel.findOneAndUpdate(
          { _id: userID },
          { "userInfo.stripe_id": customer.id }
        );
      } else {
        throw error;
      }
    }

    customerStripeId = customer.id;
  }
  return customerStripeId;
};
const paymentIntentCreate = async (
  request,
  dataobj,
  totalprice,
  customerStripeId,
  deviceType = null,
  user
) => {
  let successUrl;
  let cancelUrl;
  let UserId = dataobj.user;
  if (deviceType != null) dataobj.device_type = deviceType;
  let PaymentModelId = await PaymentModel.create(dataobj);
  if (dataobj.total_amount == 0) {
    await paymentSuccessModelUpdate(PaymentModelId._id, UserId);
    return null;
  }
  let paymentIntent = null;
  if (deviceType == "web") {
    if (request.body.redirect_uri_success) {
      successUrl = request.body.redirect_uri_success;
    } else {
      successUrl = `http://localhost:3005/success`;
    }
    if (request.body.redirect_uri_cancel) {
      cancelUrl = request.body.redirect_uri_cancel;
    } else {
      cancelUrl = "http://localhost:3005/cancel";
    }

    let findModelName = await category.findById({
      _id: dataobj.ads_type.toString(),
    });
    let sessionName = findModelName.name;

    if (request.body.add_ons.length > 0) {
      let addonsId = request.body.add_ons;

      let addonsName = "";
      let result = await AddOns.find({ "price._id": { $in: addonsId } }).exec();

      if (result.length) {
        result.forEach((item) => {
          addonsName += item.name + ", ";
        });
      }

      if (addonsName.endsWith(", ")) {
        addonsName = addonsName.slice(0, -2);
      }
      sessionName += " and Ad-  ons (" + addonsName + ")";
    }
    paymentIntent = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: sessionName,
            },
            // unit_amount: totalprice,
            unit_amount: (totalprice.toFixed(2) * 100).toFixed(0),
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        setup_future_usage: "on_session",
      },
      mode: "payment",
      customer: customerStripeId,
      metadata: {
        payment_id: PaymentModelId._id.toString(),
      },

      success_url: successUrl,
      cancel_url: cancelUrl,
    });
  } else {
    paymentIntent = await stripe.paymentIntents.create({
      amount: (totalprice.toFixed(2) * 100).toFixed(0),
      currency: "usd",
      setup_future_usage: "off_session",
      customer: customerStripeId,
      metadata: {
        payment_id: PaymentModelId._id.toString(),
      },
      payment_method_types: ["card"],
    });
  }

  await PaymentModel.findOneAndUpdate(
    { _id: PaymentModelId._id },
    { payment_intent: paymentIntent },
    { upsert: true }
  );
  if (deviceType == "web") {
    return paymentIntent.url;
  } else {
    return paymentIntent.client_secret;
  }
};

exports.create_payment_intent = async (req, res) => {
  try {
    let deviceType = null;
    if (req.headers["m-device-type"] == "web") deviceType = "web";
    else deviceType = "mobile";

    let userID = req.userId;
    let userInfoModel = await UserModel.findOne({ _id: userID });
    userInfoModel = userInfoModel.userInfo;
    req.body.useremail = userInfoModel.email_address;

    let planId = req.body.planId;
    //-----find plan -----//
    let find_ads_type = await AdsPlan.find({ _id: planId }).populate("add_ons");
    let adstype = find_ads_type[0].ads_type;
    let plan_price = find_ads_type[0].price.amount;
    let plan_currency = JSON.stringify(find_ads_type[0].price.currency);
    let addonsId = req.body.add_ons;
    let ModelName = await getModelNameByAdsType(adstype);
    let adsModel = await ModelName.findOne({
      _id: req.body.postId,
    });
    if (adsModel?.status == "active") {
      return failureJSONResponse(
        res,
        {
          message: "Add is already active",
        },
        422
      );
    }
    let foundObjects = [];

    //-----find add ons -----//
    let totalprice = plan_price;
    if (addonsId.length) {
      if (!Array.isArray(req.body.add_ons)) {
        addonsId = JSON.parse(req.body.add_ons);
      }
      let result = await AddOns.find({ "price._id": { $in: addonsId } }).exec();
      addonsId.forEach((targetId) => {
        result.forEach((item) => {
          const priceArray = item.price;
          const foundObj = priceArray.find(
            (priceObj) => priceObj._id == targetId
          );
          if (foundObj) {
            foundObjects.push(foundObj);
          }
        });
      });

      const totalAmount = foundObjects.reduce(
        (acc, obj) => acc + obj.amount,
        0
      );
      totalprice = plan_price + totalAmount;
    }

    let customerStripeId = await getStripeCustomer(userID);

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerStripeId },
      { apiVersion: "2022-11-15" }
    );

    let paymentModelInfo = await PaymentModel.findOne({
      ads: req.body.postId,
      payment_status: "pending",
      device_type: deviceType,
    });

    let paymentIntentClientSecret = null;
    let statusCode = 200;
    if (paymentModelInfo == null || paymentModelInfo == "") {
      let dataObj = {
        plan_id: planId,
        plan_addons: foundObjects,
        plan_price: plan_price,
        total_amount: JSON.parse(totalprice.toFixed(2)),
        ads: req.body.postId,
        ads_type: adstype,
        user: userID,
        payment_status: "pending",
      };
      paymentIntentClientSecret = await paymentIntentCreate(
        req,
        dataObj,
        totalprice,
        customerStripeId,
        deviceType
      );
      statusCode = 201;
    } else if (paymentModelInfo.total_amount != totalprice) {
      let dataObj = {
        plan_id: planId,
        plan_addons: foundObjects,
        plan_price: plan_price,
        total_amount: JSON.parse(totalprice.toFixed(2)),
        ads: req.body.postId,
        ads_type: adstype,
        user: userID,
        payment_status: "pending",
      };
      statusCode = 201;
      paymentIntentClientSecret = await paymentIntentCreate(
        req,
        dataObj,
        totalprice,
        customerStripeId,
        deviceType
      );
    } else {
      console.log("rana maaf krna");
      if (deviceType == "web") {
        paymentIntentClientSecret = paymentModelInfo.payment_intent.url;
      } else {
        paymentIntentClientSecret =
          paymentModelInfo.payment_intent.client_secret;
      }
    }
    if (
      paymentIntentClientSecret == null ||
      paymentIntentClientSecret == "" ||
      paymentIntentClientSecret == undefined
    ) {
      let dataObj = {
        plan_id: planId,
        plan_addons: foundObjects,
        plan_price: plan_price,
        total_amount: JSON.parse(totalprice.toFixed(2)),
        ads: req.body.postId,
        ads_type: adstype,
        user: userID,
        payment_status: "pending",
      };
      if(dataObj.total_amount != 0){
        paymentIntentClientSecret = await paymentIntentCreate(
          req,
          dataObj,
          totalprice,
          customerStripeId,
          deviceType
        );
        statusCode = 201;
      }
      }
    
console.log(paymentIntentClientSecret,"88888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888888");
    let link = req.body.website_url;
    let price = req.body.price_drop;
    let dbQu = {};

    if (link) {
      dbQu.website_url = link;
    }

    if (price >= 0) {
      dbQu.price_drop = price;
    }
    if (Object.keys(dbQu).length > 0) {
      try {
        let datarr = await ModelName.findByIdAndUpdate(req.body.postId, dbQu, {
          new: true,
        });
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
    return successJSONResponse(
      res,
      {
        status: statusCode,
        message: `success`,
        paymentIntent: paymentIntentClientSecret,
        ephemeralKey: ephemeralKey.secret,
        stripe_customer_id: customerStripeId,
      },
      statusCode
    );
  } catch (error) {
    return failureJSONResponse(res, {
      message: `Something went wrong`,
      error: error.message,
    });
  }
};
exports.webhooks = async (request, response) => {
  try {
    let ModelName;
    let getNotification;
    let event = request.body;
    let payment_id = event.data.object.metadata.payment_id;
    if (payment_id == "" || payment_id == null || payment_id == undefined)
      return successJSONResponse(
        response,
        { status: 200, message: `payment Id not found` },
        200
      );
    // Handle the event
    let dataobj = {};
    let findUser = await PaymentModel.findById({ _id: payment_id });
    let UserId = findUser.user.toString();
    let Adstype_Id = findUser.ads_type.toString();
    let Ad_id = findUser.ads.toString();
    let getAdDetails = await category.findById({ _id: Adstype_Id });
    let adsName = getAdDetails.name;
    let paymentStatus = "pending";
    switch (event.type) {
      case "payment_intent.amount_capturable_updated":
        const paymentIntentAmountCapturableUpdated = event.data.object;
        // Then define and call a function to handle the event payment_intent.amount_capturable_updated
        break;
      case "payment_intent.canceled":
        const paymentIntentCanceled = event.data.object;
        // Then define and call a function to handle the event payment_intent.canceled
        break;
      case "payment_intent.created":
        paymentStatus = "confirmed";
        dataobj = {
          payment_id: payment_id,
          payment_status: paymentStatus,
          payment_intent: event,
        };
        await PaymentEventModel.create(dataobj);
        const paymentIntentCreated = event.data.object;
        // Then define and call a function to handle the event payment_intent.created
        break;
      case "payment_intent.payment_failed":
        paymentStatus = "failed";
        dataobj = {
          payment_id: payment_id,
          payment_status: paymentStatus,
          payment_intent: event,
        };
        await PaymentEventModel.create(dataobj);
        const paymentIntentPaymentFailed = event.data.object;
        // Then define and call a function to handle the event payment_intent.payment_failed
        break;
      case "payment_intent.processing":
        const paymentIntentProcessing = event.data.object;
        // Then define and call a function to handle the event payment_intent.processing
        break;

      case "payment_intent.succeeded":
        paymentSuccessModelUpdate(payment_id, UserId);

        getNotification = await getNotificationTitles(event.type);
        await Notification.sendNotifications(
          [UserId],
          getNotification.title,
          getNotification.body,
          { model_id: Ad_id, model: adsName },
          true,
          {
            subject: "Payment succeedded of post",
            email_template: "paymentstatus",
            data: { payment_status: "succeeded" },
          }
        );

        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      case "checkout.session.completed":
        paymentSuccessModelUpdate(payment_id, UserId);
        ModelName = await getModelNameByAdsType(Adstype_Id);
        getNotification = await getNotificationTitles(event.type);

        await Notification.sendNotifications(
          [UserId],
          getNotification.title,
          getNotification.body,
          { model_id: Ad_id, model: adsName },
          true,
          {
            subject: "Payment succedded of post",
            email_template: "paymentstatus",
            data: { payment_status: "succeeded" },
          }
        );

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return successJSONResponse(
      response,
      { status: 200, message: event.type + " success" },
      200
    );
  } catch (error) {
    console.log(error);
    return response.status(422).send({
      error: {
        message: error.message,
      },
    });
  }
};

const paymentSuccessModelUpdate = async (payment_id, userId) => {
  // let userID = req.userId;
  let userID = userId;
  let paymentDetails = await PaymentModel.findById({ _id: payment_id });
  if (paymentDetails) {
    plan_id = paymentDetails.plan_id;
    ads_id = paymentDetails.ads;
    ads_type = paymentDetails.ads_type;
    // Continue with your logic...
  }
  const newPaymentStatus = "confirmed";
  await PaymentModel.findByIdAndUpdate(
    { _id: payment_id },
    { $set: { payment_status: newPaymentStatus } },
    { new: true }
  );
  let getAdDetails = await category.findById({ _id: ads_type });
  let adsName = getAdDetails.name;
  let userIds;
  let ModelName = await getModelNameByAdsType(ads_type);
  const updateQuery = {};
let adlink;
let description;
  switch (adsName) {
    case "Events":
      updateQuery["userNotification.event"] = true;
      adlink=`https://menehariya.netscapelabs.com/eventDetails/${ads_id}`
      break;
    case "Jobs":
      updateQuery["userNotification.job"] = true;
      adlink=`https://menehariya.netscapelabs.com/jobDetails/${ads_id}`
      break;
    case "Rentals":
      updateQuery["userNotification.rental"] = true;
      adlink=`https://menehariya.netscapelabs.com/rentDetails/${ads_id}`
      break;
    case "Local Biz & Services":
      updateQuery["userNotification.localBiz"] = true;
      adlink=`https://menehariya.netscapelabs.com/localBizDetails/${ads_id}`
      break;
    case "Buy & Sell":
      updateQuery["userNotification.buysell"] = true;
      adlink=`https://menehariya.netscapelabs.com/buySellDetails/${ads_id}`
      break;
    case "Babysitters & Nannies":
      updateQuery["userNotification.careService"] = true;
      adlink=`https://menehariya.netscapelabs.com/babySitterDetails/${ads_id}`
      break;
    default:
      return failureJSONResponse(res, {
        message: "Invalid adsName. Cannot update notification status.",
      });
  }
  if (adsName) {
    let adLocation = await ModelName.findById(ads_id)
    console.log(adLocation);
    let long ;
    let lat ;
    if(adLocation.adsInfo.coordinates){
      long = adLocation.adsInfo.coordinates[0]
      lat = adLocation.adsInfo.coordinates[1]
    }
  
     let Distance = 200000;
    

    if (long && lat && Distance) {
      const targetPoint = {
        type: "Point",
        coordinates: [long, lat],
      };
     
      updateQuery["userBasicInfo.live_location.coordinates"] = {
        $near: {
          $geometry: targetPoint,
          $maxDistance: Distance,
        },
      };
    }
   
    let alertdata = await USER.find(updateQuery);
    userIds = alertdata.map((alert) => String(alert._id));
    console.log(userIds,"------------------------------------------------------------------------------------------");
  }
  const myidIndex = userIds.indexOf(String(userID));

  if (myidIndex !== -1) {
    // If myid is found, remove it from the array
    userIds.splice(myidIndex, 1);
  }
console.log(userIds,"------------------------------------------------------------------------------------------");
  let title1 = `${adsName}`;
  let body1 = `${adsName} New Post Added Click to See`;

  let AddOnsArr = [];
  let currentDate = new Date();
  let activedate = currentDate.toISOString().split("T")[0];
  let planDuration = await AdsPlan.findById({ _id: plan_id });

  let expired_data = new Date(
    currentDate.getTime() + planDuration.duration * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];
  let plan_obj = {
    plan_id: planDuration._id.toString(),
    active_on: activedate,
    expired_on: new Date(
      currentDate.getTime() + planDuration.duration * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
  };
  await Promise.all(
    paymentDetails?.plan_addons?.map(async (obj) => {
      let { amount, duration, _id } = obj;
      let days = duration;
      duration = new Date(
        currentDate.getTime() + duration * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0];
      let result = await AddOns.find({ "price._id": { $in: _id.toString() } })
        .select("name")
        .exec();
      let name = result[0].name;
      let expired = duration;

      if (name === "Bump up") {
        expired = expired_data;
      }
      // Create the object
      const addOn = {
        add_ons_id: _id.toString(),
        name: name,
        amount: amount,
        days: days,
        expired_on: expired,
        active_on: currentDate.toISOString().split("T")[0],
      };

      // Add the "days" property when the name is "Bump up"

      // Push the object into AddOnsArr
      return AddOnsArr.push(addOn);
    })
  );

  let data_Obj = {
    status: "active",
    plan_validity: plan_obj,
    addons_validity: AddOnsArr,
  };

  
  let statusUpdate = await ModelName.findByIdAndUpdate(
    { _id: ads_id },
    { $set: data_Obj }
  );
  let title = "Post Created!";
  let body = "Your Post is Successfully Created!";

  if (statusUpdate) {
    if (statusUpdate.adsInfo.descriptions) {
    let words = statusUpdate.adsInfo.descriptions.replace(/<[^>]+>/g, "");
    let wordArray = words.split(' ');
    
    // Check if the description has more than 20 words
    if (wordArray.length > 20) {
        // If it does, select the first 20 words and join them back into a string
        description = wordArray.slice(0, 20).join(' ') + '...';
    } else {
        description = statusUpdate.adsInfo.descriptions;
    }
  }
    await Notification.sendNotifications(
      [userID],
      title,
      body,
      { model_id: ads_id, model: adsName},
      true,
      {
        subject: "Post Successfully Created!",
        email_template: "postSuccess",
        data: {},
      }
    );
    await Notification.sendNotifications(
      userIds,
      title1,
      body1,
      { model_id: ads_id.toString(), model: adsName },
      true,
      {
        subject: `${adsName} New Post Added`,
        email_template: "newpostalert",
        data: {category:adsName,title:statusUpdate.adsInfo.title,description:description,adlink},
      }
    );
  }

  return true;
};
const getNotificationTitles = async (status) => {
  let title;
  let body;

  switch (status) {
    case "payment_intent.succeeded":
      title = "Payment succesfully paid";
      body = "Payment succesfully paid on post";
      break;
    case "checkout.session.completed":
      title = "Payment succesfully paid";
      body = "Payment succesfully paid on post";
      break;
  }
  return { title: title, body: body };
};
const getModelNameByAdsType = async (ads_type) => {
  let findModelName = await category.findById({ _id: ads_type.toString() });

  let ModelName;

  switch (findModelName.name) {
    case "Rentals":
      ModelName = rentals;
      break;
    case "Jobs":
      ModelName = jobsAd;
      break;
    case "Local Biz & Services":
      ModelName = bizAd;
      break;
    case "Events":
      ModelName = eventAd;
      break;
    case "Buy & Sell":
      ModelName = buysellAd;
      break;
    case "Babysitters & Nannies":
      ModelName = babysitterAd;
      break;
    default:
      console.log(`Please provide valid ads id`);
  }

  return ModelName;
};

exports.billingInfo = async (req, res) => {
  try {
    let userId = req.userId;
    let cusId;
    let paymentMethods;
    if (userId) {
      cusId = await UserModel.findById({ _id: userId });
      cusId = cusId.userInfo.stripe_id;
    }
    if (cusId) {
      paymentMethods = await stripe.customers.listPaymentMethods(cusId, {
        type: "card",
      });
    }

    if (paymentMethods.data.length > 0) {
      return successJSONResponse(
        res,
        { status: 200, message: " success", paymentMethods },
        200
      );
    } else {
      return successJSONResponse(
        res,
        {
          status: 200,
          message: " Does not have any card",
          paymentMethods: { paymentMethods: paymentMethods.data },
        },
        200
      );
    }
  } catch (error) {
    return failureJSONResponse(res, {
      message: `Something went wrong`,
      error: error.message,
    });
  }
};

exports.detachcard = async (req, res) => {
  try {
    let payment_id = req.body.card_id;
    let paymentMethods;
    if (payment_id.length) {
      paymentMethods = await stripe.paymentMethods.detach(payment_id);
    }

    if (paymentMethods) {
      return successJSONResponse(
        res,
        { status: 200, message: " success" },
        200
      );
    } else {
      return failureJSONResponse(res, {
        message: `failure `,
      });
    }
  } catch (error) {
    return failureJSONResponse(res, {
      message: `Something went wrong`,
      error: error.message,
    });
  }
};
exports.defaultcard = async (req, res) => {
  try {
    let userId = req.userId;
    let cusId;
    let paymentMethods;
    let card_id = req.body.card_id;
    if (userId) {
      cusId = await UserModel.findById({ _id: userId });
      cusId = cusId.userInfo.stripe_id;
    }
    if (cusId) {
      paymentMethods = await stripe.paymentMethods.attach(card_id, {
        customer: cusId,
      });
    }

    if (paymentMethods) {
      return successJSONResponse(
        res,
        { status: 200, message: " success" },
        200
      );
    } else {
      return successJSONResponse(res, { status: 200, message: "failure" }, 200);
    }
  } catch (error) {
    return failureJSONResponse(res, {
      message: `Something went wrong`,
      error: error.message,
    });
  }
};
exports.createcard = async (req, res) => {
  try {
    const { number, exp_month, exp_year, cvc } = req.body;
    let userID = req.userId;
    let customerStripeId = await getStripeCustomer(userID);
    let paymentMethod;
    if (customerStripeId) {
      paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          number: number,
          exp_month: exp_month,
          exp_year: exp_year,
          cvc: cvc,
        },
      });

      paymentMethod = await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customerStripeId,
      });
    }
    if (paymentMethod) {
      return successJSONResponse(
        res,
        { status: 200, message: " success" },
        200
      );
    } else {
      return failureJSONResponse(res, {
        message: `failure `,
      });
    }
  } catch (error) {
    return failureJSONResponse(res, {
      message: `Something went wrong`,
      error: error.message,
    });
  }
};
