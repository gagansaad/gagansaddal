const { json } = require("express");

const mongoose = require("mongoose"),
eventAd = mongoose.model("event"),
bizAd = mongoose.model("Local_biz & Service"),
buysellAd = mongoose.model("Buy & Sell"),
babysitterAd = mongoose.model("babysitter & nannie"),
roomrentAd = mongoose.model("RoomRent"),
jobsAd = mongoose.model("job"),
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

////////////////





exports.fetchAll = async (req, res, next) => {

  try {
    let adstype = req.body.adsType;
    let pageSize = req.body.pageSize;
    let page = req.body.page || 1;
    if (!adstype) return failureJSONResponse(res, { message: `Please provide post type  id` });
      else if (adstype && !isValidMongoObjId(mongoose, adstype)) return failureJSONResponse(res, { message: `Please provide valid post type id` });

    let findCategory = await category.findOne({_id:req.body.adsType})
   
    if(!findCategory){
      return  failureJSONResponse(res, {
        message: `Category not found`
    })
    }
     
    if (findCategory.name === "Babysitters and Nannies"){
      let babysitter = await babysitterAd.find().limit(pageSize || 10 ).skip(pageSize * page);;
      if(babysitter){
        return  successJSONResponse(res, {
          message: `Record found successfully`,
          records:babysitter
      })
      }else{
            return failureJSONResponse(res, {
        message: `Record not found`
    })
      }
    }
    if (findCategory.name === "Buy & Sell"){
      let buysell = await buysellAd.find().limit(pageSize).skip(pageSize * page);;
      if(buysell){
        return  successJSONResponse(res, {
          message: `Record found successfully`,
          records:buysell
      })
      }else{
return failureJSONResponse(res, {
        message: `Record not found`
    })

      }
    }
    if (findCategory.name === "Local Biz and services"){
      let biz = await bizAd.find().limit(pageSize).skip(pageSize * page);;
      if(biz){
        return  successJSONResponse(res, {
          message: `Record found successfully`,
          records:biz
      })
      }else{
return failureJSONResponse(res, {
        message: `Record not found`
    })

      }
    }
    if (findCategory.name === "Events"){
      let event = await eventAd.find().limit(pageSize).skip(pageSize * page);;
      if(event){
        return  successJSONResponse(res, {
          message: `Record found successfully`,
          records:event
      })
      }else{
    return failureJSONResponse(res, {
        message: `Record not found`
    })  
    }
    }
    if (findCategory.name  === "Job"){
      let jobs = await jobsAd.find().limit(pageSize).skip(pageSize * page);;
      if(jobs){
        return  successJSONResponse(res, {
          message: `Record found successfully`,
          records:jobs
      })
      }else{
    return failureJSONResponse(res, {
        message: `Record not found`
    })  
    }
    }
    if (findCategory.name === "Room For Rent"){
      let roomrent = await roomrentAd.find().limit(pageSize).skip(pageSize * page);;
      if(roomrent){
        return  successJSONResponse(res, {
          message: `Record found successfully`,
          records:roomrent
      })
      }else{
    return failureJSONResponse(res, {
        message: `Record not found`
    })  
    }
    }
   
  } catch (err) {
      return failureJSONResponse(res, { message: `something went wrong` })
  }
}




