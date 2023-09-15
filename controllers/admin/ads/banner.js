const { json } = require("express");

const mongoose = require("mongoose"),
  Media = mongoose.model("media"),
  BannerSchema=mongoose.model("Banner"),
  {
    successJSONResponse,
    failureJSONResponse,
  } = require(`../../../handlers/jsonResponseHandlers`),
  { fieldsToExclude,listerBasicInfo } = require(`../../../utils/mongoose`),
  {
    isValidString,
    isValidMongoObjId,
    isValidBoolean,
    isValidDate,
    isValidEmailAddress,
    isValidIndianMobileNumber,
  } = require(`../../../utils/validators`);

  exports.createBanner = async (req, res, next) => {
    try {
    //  console.log(BannerSchema);
      const {
        image,
        caption,
        target_url,
        img_type,
      } = req.body;
 if(!isValidString(caption)) return failureJSONResponse(res, {message: `Please provide caption`,})
 if(!isValidString(target_url)) return failureJSONResponse(res, {message: `Please provide target url`,})
 if(!req.files.length) return failureJSONResponse(res, {message: `Please provide Banner img`,})
      let productImages
    //   console.log(req.file,"----------------------");
      if (req.files.length) {
        var thumbnail = req.files[0].path;
 
        productImages = await Media.create({ url: thumbnail });
       
      }
  
      
      const dataObj = {
                image: productImages.id,
                caption,
                target_url,
                img_type,
      };
  
      const newBuySellPost = await BannerSchema.create(dataObj);
     
  
      if (newBuySellPost) {
        return successJSONResponse(res, {
          message: `success`,
        
        });
      } else {
        return failureJSONResponse(res, {
          message: `Something went wrong`,
          postBuySellAdObjToSend: null,
        });
      }
    } catch (err) {
      console.log(err);
      return failureJSONResponse(res, {
        message: `Something went wrong`,
      })
    }
  };