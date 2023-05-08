const { json } = require("express");
const { EventListInstance } = require("twilio/lib/rest/taskrouter/v1/workspace/event");
const payment = require("../../../model/posts/payment");

const mongoose = require("mongoose"),
AdsPlan = mongoose.model("adsplan"),
eventAd = mongoose.model("event"),
bizAd = mongoose.model("Local_biz & Service"),
buysellAd = mongoose.model("Buy & Sell"),
babysitterAd = mongoose.model("babysitter & nannie"),
roomrentAd = mongoose.model("RoomRent"),
jobsAd = mongoose.model("job"),
USER =  mongoose.model("user"),
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

  const env = require('dotenv').config({path: '../../'});

  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);



  ///-----------------------Validate Data---------------------------//

exports.validatepaymentData = async (req, res, next) => {
    //   console.log(req.body)
    try {
      const {
        ads,
        plan,
        adstype
      
      } = req.body;
    
   
     

      if (!plan) return failureJSONResponse(res, { message: `Please provide plan id` });
      else if (plan && !isValidMongoObjId(mongoose,plan)) return failureJSONResponse(res, { message: `Please provide valid plan` });
      if (!adstype) return failureJSONResponse(res, { message: `Please provide post type  id` });
      else if (adstype && !isValidMongoObjId(mongoose, adstype)) return failureJSONResponse(res, { message: `Please provide valid post type id` });
      if (!ads) return failureJSONResponse(res, { message: `Please provide ads id` });
      else if (ads && !isValidMongoObjId(mongoose, ads)) return failureJSONResponse(res, { message: `Please provide valid ads` });

  
      return next();
    } catch (err) {
      console.log(err);
    }
  };
  

  
  /////------------payment intent ----///////
 exports.plan_payment = async (req, res) => {
  // featured_price,paymentMethodType,paymentMethodOptions
  try{
    const {isfeatured_price,plan,total_amount,price,ads,adstype,user,customer} = req.body;

    let totalprice;
    let coins;
    let dbQuery = {
      _id:ads
    };
    let findCategory = await category.find({_id:adstype})
    
    if(!findCategory){
      return  failureJSONResponse(res, {
        message: `Please provide valid ads id`
    })
    }

    if (findCategory && findCategory.find((adsname) => adsname.name === "Babysitters and Nannies")){
      let babysitter = await babysitterAd.findById(dbQuery);
      if(!babysitter){
        return  failureJSONResponse(res, {
          message: `Please provide valid ads id`
      })
      }
    }
    if (findCategory && findCategory.find((adsname) => adsname.name === "Buy & Sell")){
      let buysell = await buysellAd.findById(dbQuery);
      if(!buysell){
        return  failureJSONResponse(res, {
          message: `Please provide valid ads id`
      })
      }
    }
    if (findCategory && findCategory.find((adsname) => adsname.name === "Local Biz and services")){
      let biz = await bizAd.findById(dbQuery);
      if(!biz){
        return  failureJSONResponse(res, {
          message: `Please provide valid ads id`
      })
      }
    }
    if (findCategory && findCategory.find((adsname) => adsname.name === "Events")){
      let event = await eventAd.findById(dbQuery);
      if(!event){
        return  failureJSONResponse(res, {
          message: `Please provide valid ads id`
      })
      }
    }
    if (findCategory && findCategory.find((adsname) => adsname.name  === "Job")){
      let jobs = await jobsAd.findById(dbQuery);
      if(!jobs){
        return  failureJSONResponse(res, {
          message: `Please provide valid ads id`
      })
      }
    }
    if (findCategory && findCategory.find((adsname) => adsname.name === "Room For Rent")){
      let roomrent = await roomrentAd.findById(dbQuery);
      if(!roomrent){
        return  failureJSONResponse(res, {
          message: `Please provide valid ads id`
      })
      }
    }
   
    
    let selectplan = await AdsPlan.findById({_id:plan})
    if(!selectplan){
      return  failureJSONResponse(res, {
        message: `Please provide plan id`
    })
    }else{
      coins = selectplan.price.currency;
      if(isfeatured_price == "true"){
       totalprice=selectplan.featured_price.amount+selectplan.price.amount
      }else{
       totalprice= selectplan.price.amount
      }
    }
    // let customerName = await USER.findById({_id:req.userId}).select({ "userInfo.name": 1, "_id": 1});
   
    const dataObj = {
      isfeatured_price,
      plan,
      total_amount:totalprice,
      price:{
        featured_price:selectplan.featured_price,
        post_price:selectplan.price,
      },
      ads,
      ads_type:findCategory[0].name,
      user:userId,
      // customer:customerName.userInfo.name
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: dataObj.total_amount,
      currency: 'usd',
      automatic_payment_methods: {enabled: true},
     
    });
    // const newJobPost = await payment.create(dataObj);

  
  


    if (paymentIntent && newJobPost) {
      return successJSONResponse(res, {
        message: `success`,
        clientsecret:paymentIntent.client_secret,
        nextAction: paymentIntent.next_action
         });
    } else {
      return failureJSONResponse(res, {
        message: `Something went wrong`,
        
      });
    }
    // let findad = await 
    // let setprice = totalprice*100

    // const params = {
    //   amount: setprice,
    //   currency: coins,
    // }
    // if(paymentMethodType === 'acss_debit') {
    //   params.payment_method_options = {
    //     acss_debit: {
    //       mandate_options: {
    //         payment_schedule: 'sporadic',
    //         transaction_type: 'personal',
    //       },
    //     },
    //   }
    // } else if (paymentMethodType === 'konbini') {
    //   /**
    //    * Default value of the payment_method_options
    //    */
    //   params.payment_method_options = {
    //     konbini: {
    //       product_description: 'Tシャツ',
    //       expires_after_days: 3,
    //     },
    //   }
    // } else if (paymentMethodType === 'customer_balance') {
    //   params.payment_method_data = {
    //     type: 'customer_balance',
    //   }
    //   params.confirm = true
    //   params.customer = req.body.customerId || await stripe.customers.create().then(data => data.id)
    // }
  
    // /**
    // * If API given this data, we can overwride it
    //  *
    // if (paymentMethodOptions) {
    //   params.payment_method_options = paymentMethodOptions
    // }
    // Create a PaymentIntent with the amount, currency, and a payment method type.
    

    //   const paymentIntent = await stripe.paymentIntents.create(params);
  
    //   // Send publishable key and PaymentIntent details to client
    //   res.send({
    //     clientSecret: paymentIntent.client_secret,
    //     nextAction: paymentIntent.next_action,
    //   });
    } catch (e) {
      return res.status(400).send({
        error: {
          message: e.message,
        },
      });
    }
  }