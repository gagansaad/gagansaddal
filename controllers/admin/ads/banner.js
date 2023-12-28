const { json } = require("express");

const mongoose = require("mongoose"),
  Media = mongoose.model("media"),
  BannerSchema = mongoose.model("Banner"),
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
  } = require(`../../../utils/validators`);

exports.createBanner = async (req, res, next) => {
  try {
    const { image, caption, target_url, img_type } = req.body;
    if (!isValidString(caption))
      return failureJSONResponse(res, { message: `Please provide caption` });
    if (!isValidString(target_url))
      return failureJSONResponse(res, { message: `Please provide target url` });
   
      if (!isValidString(image))
      return failureJSONResponse(res, { message: `Please provide valid image` });
    
    const dataObj = {
      image: image,
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
    });
  }
};
// Update Banner
exports.updateBanner = async (req, res, next) => {
  try {
    const bannerId = req.params.id; // Assuming bannerId is part of the URL path
    const { caption, target_url, img_type ,status,image} = req.body;

    // Your validation logic here if needed
console.log(req.body);
    // Find the banner by ID
    const existingBanner = await BannerSchema.findById(bannerId);

    if (!existingBanner) {
      return failureJSONResponse(res, { message: 'Banner not found' });
    }

    // Update banner properties
    if (caption) {
      existingBanner.caption = caption;
    }

    if (target_url) {
      existingBanner.target_url = target_url;
    }

    if (img_type) {
      existingBanner.img_type = img_type;
    }
    
    if (status == true || status == false) {
      
      existingBanner.status = status;
    }

    if (image) {
      existingBanner.image = image;
    }
    // Save the updated banner
    console.log(existingBanner,"ekmk");
    const updatedBanner = await existingBanner.save();

    return successJSONResponse(res, {
      message: 'Banner updated successfully',
      updatedBanner,
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, {
      message: 'Something went wrong during the update',
    });
  }
};



// Get Banner by ID
exports.getBannerById = async (req, res, next) => {
  try {
    const bannerId = req.query.bannerId; // Assuming bannerId is part of the URL path

    // Find the banner by ID
    const banner = await BannerSchema.findById(bannerId);

    if (!banner) {
      return failureJSONResponse(res, { message: 'Banner not found' });
    }

    return successJSONResponse(res, {
      message: 'Banner retrieved successfully',
      banner,
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, {
      message: 'Something went wrong while retrieving the banner',
    });
  }
};


// Delete Banner by ID
exports.deleteBannerById = async (req, res, next) => {
  try {
    const bannerId = req.query.bannerId; // Assuming bannerId is part of the URL path

    // Find the banner by ID and remove it
    const deletedBanner = await BannerSchema.findByIdAndRemove(bannerId);

    if (!deletedBanner) {
      return failureJSONResponse(res, { message: 'Banner not found' });
    }

    return successJSONResponse(res, {
      message: 'Banner deleted successfully',
      deletedBanner,
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, {
      message: 'Something went wrong while deleting the banner',
    });
  }
};


// Get All Banners
// Get All Banners with Pagination and Search
// Get All Banners with Pagination and Search
exports.getAllBanners = async (req, res, next) => {
  try {
    // Extract query parameters for pagination and search
    const page = parseInt(req.query.page) || 1; // default to page 1
    const pageSize = parseInt(req.query.pageSize) || 10; // default page size
    const searchQuery = req.query.search || ''; // default to empty string

    // Calculate the skip value for pagination
    const skip = (page - 1) * pageSize;

    // Define the search criteria (modify based on your schema)
    const searchCriteria = {
      $or: [
        { caption: { $regex: searchQuery, $options: 'i' } }, // case-insensitive search on caption
        { target_url: { $regex: searchQuery, $options: 'i' } }, // case-insensitive search on target_url
      ],
    };

    // Fetch banners with pagination and search from the database
    const query = BannerSchema.find(searchCriteria).skip(skip).limit(pageSize);
    const allBanners = await query.exec();

    // Get total count of documents that match the search criteria
    const totalRecords = await BannerSchema.countDocuments(searchCriteria);

    // Calculate total pages
    const totalPages = Math.ceil(totalRecords / pageSize);

    return successJSONResponse(res, {
      message: 'Banners retrieved successfully with pagination and search',
      banners: allBanners,
      currentPage: page,
      pageSize: pageSize,
      totalRecords: totalRecords,
      totalPages: totalPages,
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, {
      message: 'Something went wrong while retrieving banners with pagination and search',
    });
  }
};


exports.uploadfile = async (req, res, next) => {
  try {
    let file = req.file
   

    return successJSONResponse(res, {
      message: 'success',
      url: file.path,
      
    });
  } catch (err) {
    console.log(err);
    return failureJSONResponse(res, { message: 'something went wrong' });
  }
};
