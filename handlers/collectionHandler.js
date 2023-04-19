const { json } = require("express");
const mongoose = require("mongoose"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("RoomRent"),
  jobsAd = mongoose.model("job");


  let records = [
    ...eventAd,
    ...bizAd,
    ...babysitterAd,
    ...roomrentAd,
    ...jobsAd,
    ...buysellAd,
  ];
  
  if (records) {
    return successJSONResponse(res, {
      message: `success`,
      isfeatured: Object.keys(records).length,
      status: 200,
    });
  } else {
    return failureJSONResponse(res, { message: `Ads not available` });
  }