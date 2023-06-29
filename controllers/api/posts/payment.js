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
  Notification = require("../../../resources/notification");
bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  rentals = mongoose.model("rental"),
  jobsAd = mongoose.model("job"),
  USER = mongoose.model("user"),
  category = mongoose.model("PostType"),
  payment_logs = require("../../../model/posts/paymentEvent"),
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
    isValidlink,
  } = require(`../../../utils/validators`);

const env = require("dotenv").config({ path: "../../" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

///-----------------------Validate Data---------------------------//

exports.validatepaymentData = async (req, res, next) => {
  //   console.log(req.body)
  try {
    const { ads, plan_id, adstype } = req.body;

    console.log(plan_id);

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
      if (error.type === 'StripeInvalidRequestError' && error.raw.code === 'resource_missing') {
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
        console.error('Error retrieving customer from Stripe:', error);
        throw error;
      }
    }

    customerStripeId = customer.id;
  }
    // customerStripeId = userInfoModel.stripe_id;
  return customerStripeId;
}
const paymentIntentCreate = async (request, dataobj, totalprice, customerStripeId, deviceType = null, user) => {
  let successUrl;
  let cancelUrl
  let UserId = dataobj.user
  console.log(UserId, "bol ve channa bol");
  if (deviceType != null)
    dataobj.device_type = deviceType;
  let PaymentModelId = await PaymentModel.create(dataobj);
  if (dataobj.total_amount == 0) {
    await paymentSuccessModelUpdate(PaymentModelId._id, UserId);
    return null;
  }
  let paymentIntent = null;
  if (deviceType == 'web') {
    if (request.body.redirect_uri_success) {
      successUrl = request.body.redirect_uri_success
    } else {
      successUrl = `http://localhost:3005/success`
    }
    if (request.body.redirect_uri_cancel) {
      cancelUrl = request.body.redirect_uri_cancel
    } else {
      cancelUrl = 'http://localhost:3005/cancel'
    }

    let findModelName = await category.findById({ "_id": dataobj.ads_type.toString() })
    let sessionName = findModelName.name;
    if (request.body.add_ons.length > 0)
      sessionName += ' and ' + request.body.add_ons.length.toString() + ' addons';
    paymentIntent = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: sessionName,
            },
            // unit_amount: totalprice,
            unit_amount: (totalprice.toFixed(2) * 100).toFixed(0),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer: customerStripeId,
      // customer_email: request.body.useremail,
      metadata: {
        "payment_id": PaymentModelId._id.toString()
      },

      success_url: successUrl,
      cancel_url: cancelUrl,
    });
    console.log("eh chaalu hoya");
  } else {
    // List the customer's payment methods to find one to charge
    // const paymentMethods = await stripe.paymentMethods.list({
    //   customer: customerStripeId,
    //   type: "card"
    // });
    // console.log(paymentMethods,"payment methods");
    paymentIntent = await stripe.paymentIntents.create({
      amount: (totalprice.toFixed(2) * 100).toFixed(0),
      currency: "usd",
      setup_future_usage: 'off_session',
      customer: customerStripeId,
      metadata: {
        "payment_id": PaymentModelId._id.toString()
      },
      payment_method_types: [
        'card',
      ],
      // off_session: true,
      // payment_method: paymentMethods.data[0].id,
    });
    console.log(paymentIntent, "po po po po po ki ku ka ll oii cc bd yf jg nv");
  }

  await PaymentModel.findOneAndUpdate({ "_id": PaymentModelId._id }, { "payment_intent": paymentIntent }, { upsert: true });
  if (deviceType == 'web') {
    return paymentIntent.url
  } else {
    return paymentIntent.client_secret;
  }
}


exports.create_payment_intent = async (req, res) => {
  try {
    console.log(req.body, "body hai je");
    let deviceType = null;
    if (req.headers['m-device-type'] == 'web')
      deviceType = 'web';
    else
      deviceType = 'mobile';

    let userID = req.userId;
    let userInfoModel = await UserModel.findOne({ _id: userID });
    userInfoModel = userInfoModel.userInfo;
    req.body.useremail = userInfoModel.email_address

    let planId = req.body.planId;
    //-----find plan -----//
    console.log(planId, "plan Id");
    let find_ads_type = await AdsPlan.find({ _id: planId }).populate("add_ons");
    console.log(find_ads_type, "vndvndj");
    let adstype = find_ads_type[0].ads_type;
    console.log(adstype, "njdnjd");
    let plan_price = find_ads_type[0].price.amount;
    let plan_currency = JSON.stringify(find_ads_type[0].price.currency);
    let addonsId = req.body.add_ons;
    let ModelName = await getModelNameByAdsType(adstype);
    let adsModel = await ModelName.findOne({
      '_id': req.body.postId,
    });
    // console.log(adstype,"**",ModelName,"&&&&",req.body.postId,"***",adsModel"adsmodal",adsModel.status);
    if (adsModel?.status == 'active') {
      return failureJSONResponse(res, {
        message: 'Add is already active',
      }, 422);
    }
    // console.log(addonsId,"arraya ");
    let foundObjects = [];

    // if (userID != adsModel.userId) {
    //   return failureJSONResponse(res, {
    //     message: "This Add doesn't belongs to your profile.",
    //   }, 422);
    // }
    //-----find add ons -----//
    let totalprice = plan_price
    //  console.log(totalprice,"arraya ", addonsId, "aala kala bala tala mala ola yala uala pala nala mala vala cala xala zala");
    if (addonsId.length) {
      if (!Array.isArray(req.body.add_ons)) {
        addonsId = JSON.parse(req.body.add_ons);
      }
      let result = await AddOns.find({ "price._id": { $in: addonsId } }).exec();
      addonsId.forEach((targetId) => {
        result.forEach((item) => {
          const priceArray = item.price;
          const foundObj = priceArray.find((priceObj) => priceObj._id == targetId);
          if (foundObj) {
            foundObjects.push(foundObj);
          }
        });
      });

      console.log(foundObjects, "hhhhhjjjjjj00000");
      const totalAmount = foundObjects.reduce((acc, obj) => acc + obj.amount, 0);
      totalprice = plan_price + totalAmount;
    }
    console.log(userInfoModel, "vhndsjvnsdjnsnvskjdrvkrsd --------------->>>>>>>>>>>>>>>>");

    let customerStripeId = await getStripeCustomer(userID);
    console.log(customerStripeId,"25-25 =50 mainu kithe eh line chldi dikha ");
    // return customerStripeId;

    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customerStripeId },
      { apiVersion: "2022-11-15" }
    );

    console.log(ephemeralKey,"25-25=70 je tu na aayi terer pain ge chitter");
    let paymentModelInfo = await PaymentModel.findOne({
      ads: req.body.postId,
      payment_status: "pending",
      device_type: deviceType,
    });

    let paymentIntentClientSecret = null;
    let statusCode = 200
    // return console.log(paymentModelInfo, paymentModelInfo.payment_intent.client_secret, (paymentModelInfo == null || paymentModelInfo == ""), (paymentModelInfo.total_amount != totalprice), '**/*//////****', totalprice, '*****', paymentModelInfo.total_amount);
    if (paymentModelInfo == null || paymentModelInfo == "") {
      //payment intene
      let dataObj = { plan_id: planId, plan_addons: foundObjects, plan_price: plan_price, total_amount: JSON.parse(totalprice.toFixed(2)), ads: req.body.postId, ads_type: adstype, user: userID, payment_status: "pending" };
      paymentIntentClientSecret = await paymentIntentCreate(req, dataObj, totalprice, customerStripeId, deviceType);
      statusCode = 201;
    } else if (paymentModelInfo.total_amount != totalprice) {
      let dataObj = { plan_id: planId, plan_addons: foundObjects, plan_price: plan_price, total_amount: JSON.parse(totalprice.toFixed(2)), ads: req.body.postId, ads_type: adstype, user: userID, payment_status: "pending" };
      statusCode = 201;
      paymentIntentClientSecret = await paymentIntentCreate(req, dataObj, totalprice, customerStripeId, deviceType);
    } else {
      if (deviceType == 'web') {
        paymentIntentClientSecret = paymentModelInfo.payment_intent.url;
      } else {
        paymentIntentClientSecret = paymentModelInfo.payment_intent.client_secret;
      }
    }
    // return console.log(paymentIntentClientSecret,statusCode,(paymentIntentClientSecret == null || paymentIntentClientSecret ==''));
    if (paymentIntentClientSecret == null || paymentIntentClientSecret == '' || paymentIntentClientSecret == undefined) {
      let dataObj = { plan_id: planId, plan_addons: foundObjects, plan_price: plan_price, total_amount: JSON.parse(totalprice.toFixed(2)), ads: req.body.postId, ads_type: adstype, user: userID, payment_status: "pending" };
      paymentIntentClientSecret = await paymentIntentCreate(req, dataObj, totalprice, customerStripeId, deviceType);
      statusCode = 201;
    }

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
      console.log(dbQu, "dvdvvdcdcccc");

      try {
        let datarr = await ModelName.findByIdAndUpdate(
          req.body.postId,
          dbQu,
          { new: true }
        );

        console.log(datarr, "Key updated successfully.");
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
    return successJSONResponse(res, {
      status: statusCode,
      message: `success`,
      paymentIntent: paymentIntentClientSecret,
      ephemeralKey: ephemeralKey.secret,
      stripe_customer_id: customerStripeId,
    }, statusCode)

  } catch (error) {
    console.log("vdvdvdvvvvdvvvdvdvdvdvdvdvdvdvd", error, "bbooklakituramu");
    return failureJSONResponse(res, {
      message: `Something went wrong`,
      error: error.message
    });
  }
};
exports.webhooks = async (request, response) => {
  try {
    let getNotification;
    let event = request.body;
    console.log(event, "this is event");
    let payment_id = event.data.object.metadata.payment_id;
    if (payment_id == '' || payment_id == null || payment_id == undefined)
      return successJSONResponse(response, { status: 200, message: `paymentn Id not found`, }, 200)
    // Handle the event
    let findUser = await PaymentModel.findById({ "_id": payment_id })
    console.log(findUser, "findUser");
    let UserId = findUser.user.toString()
    let Adstype_Id = findUser.ads_type.toString()
    let getAdDetails = await category.findById({ "_id": Adstype_Id })
    let adsName = getAdDetails.name;
    // console.log(findUser.user, "jsncjsn", getAdDetails, "dasshbc", Adstype_Id);
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


        paymentStatus = "confirmed"
        const paymentIntentCreated = event.data.object;
        // Then define and call a function to handle the event payment_intent.created
        break;
      case "payment_intent.payment_failed":
        paymentStatus = "failed"
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
        await Notification.sendNotifications([UserId], getNotification.title, getNotification.body, { 'model_id': Adstype_Id, 'model': adsName }, true, { 'subject': 'Payment succeedded of post', 'email_template': 'paymentstatus', 'data': { 'payment_status': 'succeeded' } });

        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      case "checkout.session.completed":
        paymentSuccessModelUpdate(payment_id, UserId);
        getNotification = await getNotificationTitles(event.type);
        await Notification.sendNotifications([UserId], getNotification.title, getNotification.body, { 'model_id': Adstype_Id, 'model': adsName }, true, { 'subject': 'Payment succedded of post', 'email_template': 'paymentstatus', 'data': { 'payment_status': 'succeeded' } });

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    let dataobj = {
      payment_id: payment_id,
      payment_status: paymentStatus,
      payment_intent: event
    }
    await PaymentEventModel.create(dataobj);
    return successJSONResponse(response, { status: 200, message: event.type + " success", }, 200)
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
  let paymentDetails = await PaymentModel.findById({ "_id": payment_id })
  if (paymentDetails) {
    plan_id = paymentDetails.plan_id;
    ads_id = paymentDetails.ads;
    ads_type = paymentDetails.ads_type;
    // Continue with your logic...
  }
  let AddOnsArr = []
  let currentDate = new Date()
  let activedate = currentDate.toISOString().split('T')[0]
  let planDuration = await AdsPlan.findById({ "_id": plan_id })
  console.log(planDuration, "kaali boli raat utto paiondi barsaat aake mainu mil sohniye  ");
  let plan_obj = {
    plan_id: planDuration._id.toString(),
    active_on: activedate,
    expired_on: new Date(currentDate.getTime() + (planDuration.duration * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  }
  await Promise.all(paymentDetails?.plan_addons?.map(async obj => {
    let { amount, duration, _id } = obj;
    duration = new Date(currentDate.getTime() + (duration * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
    let result = await AddOns.find({ "price._id": { $in: _id.toString() } }).select("name").exec();
    let name = result[0].name;
    return AddOnsArr.push({
      add_ons_id: _id.toString(), name: name, amount: amount, expired_on: duration, active_on:
        currentDate.toISOString().split('T')[0]
    });
  }));

  let data_Obj = {
    status: 'active',
    plan_validity: plan_obj,
    addons_validity: AddOnsArr,
  }

  let ModelName = await getModelNameByAdsType(ads_type);
  let statusUpdate = await ModelName.findByIdAndUpdate({ "_id": ads_id }, { $set: data_Obj });
  let title = 'Post Successfully Created!';
  let body = 'Post Successfully Created!';
  if (statusUpdate)
    await Notification.sendNotifications([userID], title, body, { 'model_id': userID, 'model': 'user' }, false, { 'subject': 'Post Successfully Created!', 'email_template': 'postSuccess', 'data': {} });
  return true;
}
const getNotificationTitles = async (status) => {
  let title;
  let body;

  switch (status) {
    case 'payment_intent.succeeded':
      title = 'Payment succesfully paid';
      body = 'Payment succesfully paid on post';
      break;
    case 'checkout.session.completed':
      title = 'Payment succesfully paid';
      body = 'Payment succesfully paid on post';
      break;

  }
  return { 'title': title, 'body': body };
}
const getModelNameByAdsType = async (ads_type) => {

  let findModelName = await category.findById({ "_id": ads_type.toString() })

  let ModelName;

  switch (findModelName.name) {
    case "Rentals":
      ModelName = rentals
      break;
    case "Jobs":
      ModelName = jobsAd
      break;
    case "Local Biz & Services":
      ModelName = bizAd
      break;
    case "Events":
      ModelName = eventAd
      break;
    case "Buy & Sell":
      ModelName = buysellAd
      break;
    case "Babysitters & Nannies":
      ModelName = babysitterAd
      break;
    default:
      console.log(`Please provide valid ads id`);
  }
  return ModelName;
}


exports.billingInfo = async(req,res)=>{
  try{
    let userId = req.userId;
    let cusId;
if(userId){
  cusId = await UserModel.findById({_id:userId});
  
}
    console.log("saun di jhadi ni lagi saun di jhadi mai khda kothe tu v satt te chadi saun di jhadi de vich nachne nu ji krda aaaaaqaaaa paake baaha vich baaha nachne nu ji krda ",cusId);
    // return res.json({message :"saun di jhadi ni lagi saun di jhadi mai khda kothe tu v satt te chadi saun di jhadi de vich nachne nu ji krda aaaaaqaaaa paake baaha vich baaha nachne nu ji krda"})
  }catch(err){
    console.log(err,"nvdjnjdsnjdvjnzsd");
  }
}