const { json } = require("express");
const {
  EventListInstance,
} = require("twilio/lib/rest/taskrouter/v1/workspace/event");
const payment = require("../../../model/posts/payment");

const mongoose = require("mongoose"),
  AdsPlan = mongoose.model("adsplan"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("RoomRent"),
  jobsAd = mongoose.model("job"),
  USER = mongoose.model("user"),
  category = mongoose.model("PostType"),
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
exports.plan_payment = async (req, res) => {
  try {
    const {
      isfeatured_price,
      plan_id,
      total_amount,
      price,
      ads,
      adstype,
      user,
      customer,
      paymentMethodType,
      currency,
    } = req.body;

    let totalprice;
    let coins;
    let dbQuery = {
      _id: ads,
    };
    let findCategory = await category.find({ _id: adstype });

    if (!findCategory) {
      return failureJSONResponse(res, {
        message: `Please provide valid ads id`,
      });
    }
    const adsTypes = [
      { type: "Babysitters and Nannies", model: babysitterAd },
      { type: "Buy & Sell", model: buysellAd },
      { type: "Local Biz and services", model: bizAd },
      { type: "Events", model: eventAd },
      { type: "Job", model: jobsAd },
      { type: "Room For Rent", model: roomrentAd },
    ];

    const adModel = adsTypes.find(
      (adType) => adType.type === findCategory?.[0]?.name
    )?.model;
    console.log(adModel);
    if (!adModel) {
      return failureJSONResponse(res, {
        message: `Please provide valid adstype`,
      });
    }

    const ad = await adModel.findById(dbQuery);
    console.log(ad);
    if (!ad) {
      return failureJSONResponse(res, {
        message: `Please provide valid ads id`,
      });
    }
    let selectplan = await AdsPlan.findById({ _id: plan_id });
    if (!selectplan) {
      return failureJSONResponse(res, {
        message: `Please provide plan id`,
      });
    } else {
      coins = selectplan.price.currency;
      if (isfeatured_price == "true") {
        totalprice = selectplan.featured_price.amount + selectplan.price.amount;
      } else {
        totalprice = selectplan.price.amount;
      }
    }
    // let customerName = await USER.findById({_id:req.userId}).select({ "userInfo.name": 1, "_id": 1});
    // if (customerName?.userInfo?.name) {
    //   dataObj.customer = customerName.userInfo.name;
    // }
    const dataObj = {
      isfeatured_price,
      plan_id,
      total_amount: totalprice,
      price: {
        featured_price: selectplan.featured_price,
        post_price: selectplan.price,
      },
      ads,
      ads_type: findCategory?.[0]?.name,
      user: userId,
    };

    const paymentIntent = await stripe.paymentIntents.create({
      amount: dataObj.total_amount,
      currency: currency,
      payment_method_types: [paymentMethodType],
    });
    if (paymentIntent) {
      return successJSONResponse(res, {
        message: `success`,
        clientsecret: paymentIntent.client_secret,
        nextAction: paymentIntent.next_action,
      });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
      });
    }
  } catch (e) {
    return res.status(400).send({
      error: {
        message: e.message,
      },
    });
  }
};
