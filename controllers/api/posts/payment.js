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

exports.create_payment_intent = async (req, res) => {
  try {
    let userID = req.userId;
    let userInfoModel = await UserModel.findOne({ _id: userID });
    userInfoModel = userInfoModel.userInfo;
    let planId = req.body.planId;
    //-----find plan -----//
    let find_ads_type = await AdsPlan.find({ _id: planId }).populate("add_ons");
    let adstype = find_ads_type[0].ads_type;
    let plan_price = find_ads_type[0].price.amount;
    let plan_currency = JSON.stringify(find_ads_type[0].price.currency);
    let addonsId = req.body.add_ons;
    

    // console.log(addonsId,"arraya ");
    let foundObjects = [];
   
    
    //-----find add ons -----//
    let totalprice = plan_price
    if(addonsId.length){
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

    console.log(foundObjects,"hhhhhjjjjjj00000");
    const totalAmount = foundObjects.reduce((acc, obj) => acc + obj.amount, 0);
    totalprice = plan_price + totalAmount;
  }
    let customerStripeId = null;
    if (userInfoModel.stripe_id == "" && userInfoModel.stripe_id == null) {
      const customer = await stripe.customers.create({
        name: userInfoModel.name,
        email: userInfoModel.email_address,
      });
      await UserModel.findOneAndUpdate(
        { _id: userID },
        { $set: { "userInfo.stripe_id": customer.id } }
      );
      customerStripeId = customer.id;
    } else {
      customerStripeId = userInfoModel.stripe_id;
    }



    // const ephemeralKey = await stripe.ephemeralKeys.create(
    //   { customer: customerStripeId },
    //   { apiVersion: "2022-11-15" }
    // );

    let paymentModelInfo = await PaymentModel.findOne({
      ads: req.body.postId,
      payment_status: "pending",
    });
    // console.log();
    let paymentIntentClientSecret = null;
    let statusCode = 200
    if (paymentModelInfo == null || paymentModelInfo == "") {

      let dataobj = {
        plan_id: planId,
        plan_addons: foundObjects,
        plan_price: plan_price,
        total_amount: JSON.parse(totalprice.toFixed(2)),
        ads: req.body.postId,
        ads_type: adstype,
        user: userID,
        payment_status: "pending",

      };
     
      let PaymentModelId = await PaymentModel.create(dataobj);
      // console.log(PaymentModelId._id, "id ------id---------id---------id");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: (totalprice.toFixed(2) * 100).toFixed(0),
        currency: "usd",
        customer: customerStripeId,
        metadata: {
          "payment_id": PaymentModelId._id.toString()
        },
        payment_method_types: [
          'card',
        ]
      });

      PaymentModelInfo = await PaymentModel.findOneAndUpdate({ "_id": PaymentModelId._id }, { "payment_intent": paymentIntent }, { upsert: true });

      paymentIntentClientSecret = paymentIntent.client_secret;
      statusCode = 201;
    } else {
      paymentIntentClientSecret = paymentModelInfo.payment_intent.client_secret;
    }
    return successJSONResponse(res, {
      status: statusCode,
      message: `success`,
      paymentIntent: paymentIntentClientSecret,
      // ephemeralKey: ephemeralKey.secret,
    })
  } catch (error) {
    console.log(error.message,"bbooklakituramu");
    return failureJSONResponse(res, {
      message: `Something went wrong`,
      error: error.message
    });
  }
};
exports.webhooks = async (request, response) => {
  try {
  
    let event = request.body;
    
    let payment_id = event.data.object.metadata.payment_id;
    let paymentDetails = await PaymentModel.findById({ "_id":payment_id})
    let successArr = []
    await Promise.all(paymentDetails?.plan_addons?.map(async obj => {
      let { amount, duration,_id } = obj;
      const currentDate = new Date();
      duration=  new Date(currentDate.getTime() + (duration * 24 * 60 * 60 * 1000)).toISOString().split('T')[0];
      let result = await AddOns.find({ "price._id": { $in:_id.toString() } }).select("name").exec();
      let name = result[0].name;
     
      return successArr.push({ name:name,amount:amount, duration:duration ,currentDate:currentDate});
    }));
  console.log(successArr,"ruuvbbydsjkkkmmmmnjueu");
    // const ids = paymentDetails?.plan_addons?.map(obj => obj); 
    // const duration = paymentDetails?.plan_addons?.map(obj => obj?.duration); 
  let addons_duration= []
  
  let plan_id ;
  let ads_id ;
  let ads_type;
  if (paymentDetails) {
    plan_id = paymentDetails.plan_id;
    ads_id = paymentDetails.ads;
    ads_type = paymentDetails.ads_type
    // Continue with your logic...
  }
   
    let findModelName = await category.findById({ "_id": ads_type })
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
    let findAd = await ModelName.findById({"_id":ads_id})

    // Handle the event
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
        paymentStatus = "confirmed"
        const paymentIntentSucceeded = event.data.object;
        // Then define and call a function to handle the event payment_intent.succeeded
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
    let PaymentEventInfo = await PaymentEventModel.create(dataobj);
    // Return a 200 response to acknowledge receipt of the event
    response.send({ status: 200 });
  } catch (error) {
    console.log(error);
    return response.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
};
