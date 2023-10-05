const { json } = require("express");
const user = require("../accounts/user");

const mongoose = require("mongoose"),
  Alert = mongoose.model("Alert"),
  eventAd = mongoose.model("event"),
  bizAd = mongoose.model("Local_biz & Service"),
  buysellAd = mongoose.model("Buy & Sell"),
  babysitterAd = mongoose.model("babysitter & nannie"),
  roomrentAd = mongoose.model("rental"),
  jobsAd = mongoose.model("job"),
  category = mongoose.model("PostType"),
  Media = mongoose.model("media"),
  User = mongoose.model("user"),
  Notification = mongoose.model("notification"),
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

const Category = mongoose.model("PostType");

exports.createAlert = async (req, res, next) => {
  try {
    const { ads_type, add_name, notification_status } = req.body;
    const userId = req.userId;
    let adsName = "";
    if (!(ads_type || add_name) && !notification_status) {
      return failureJSONResponse(res, {
        message: "Please provide ads type and notification status",
      });
    }
    if (add_name == "" || add_name == undefined || add_name == null) {
      const category = await Category.findById(ads_type);

      if (!category) {
        return failureJSONResponse(res, {
          message: "Invalid ads_type Category not found.",
        });
      }

      adsName = category.name;
    } else {
      adsName = add_name;
    }
    const updateQuery = {};

    switch (adsName) {
      case "Events":
        updateQuery["userNotification.event"] = notification_status;
        break;
      case "Jobs":
        updateQuery["userNotification.job"] = notification_status;
        break;
      case "Rentals":
        updateQuery["userNotification.rental"] = notification_status;
        break;
      case "Local Biz & Services":
        updateQuery["userNotification.localBiz"] = notification_status;
        break;
      case "Buy & Sell":
        updateQuery["userNotification.buysell"] = notification_status;
        break;
      case "Babysitters & Nannies":
        updateQuery["userNotification.careService"] = notification_status;
        break;
      default:
        return failureJSONResponse(res, {
          message: "Invalid adsName. Cannot update notification status.",
        });
    }

    let alert = await User.findOneAndUpdate(
      { _id: userId },
      { $set: updateQuery },
      { new: true, upsert: true }
    );

    return successJSONResponse(res, {
      message: "Success",
      alert: alert.userNotification,
    });
  } catch (error) {
    console.error(error);
    return failureJSONResponse(res, { message: "Something went wrong" });
  }
};

exports.getAlerts = async (req, res, next) => {
  try {
    let myid = req.userId;

    let notification = await User.findOne({ _id: myid }).select(
      "userNotification"
    );

    let returnNotification = [
      {
        category: "Buy & Sell",
        value: notification?.userNotification?.buysell || false,
      },
      {
        category: "Babysitters & Nannies",
        value: notification?.userNotification?.careService || false,
      },
      {
        category: "Local Biz & Services",
        value: notification?.userNotification?.localBiz || false,
      },
      {
        category: "Jobs",
        value: notification?.userNotification?.job || false,
      },
      {
        category: "Rentals",
        value: notification?.userNotification?.rental || false,
      },
      {
        category: "Events",
        value: notification?.userNotification?.event || false,
      },
    ];

    // return successJSONResponse(res, { message: "Success", notification:notification.userNotification});
    return successJSONResponse(res, {
      message: "Success",
      notification: returnNotification,
    });
  } catch (error) {
    console.error(error);
    return failureJSONResponse(res, { message: "Something went wrong" });
  }
};

exports.getMyNotifications = async (req, res, next) => {
  try {
    let myid = req.userId;
    let page = req.query.page || 1;
    let pageSize = req.query.pageSize || 10;
    if (typeof page === 'string') {
      page = JSON.parse(page);
    }
    // Calculate the number of documents to skip based on the page number and page size
    let skip = (page - 1) * pageSize;

    // Query to get the total count of notifications for the user
    const totalNotifications = await Notification.countDocuments({
      user_id: myid,
    });
    const unseen_total = await Notification.countDocuments({
      $and: [{ user_id: myid }, { status: "unseen" }],
    });

    // Query to retrieve paginated notifications
    const notifications = await Notification.find({ user_id: myid })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .exec();

    // Calculate the total number of pages
    const totalPages = Math.ceil(totalNotifications / pageSize);

    return successJSONResponse(res, {
      message: "Success",
      unseen_total: unseen_total,
      total: totalNotifications,
      perPage: pageSize,
      page: page,
      totalPages: totalPages,
      notifications,
    });
  } catch (error) {
    console.error(error);
    return failureJSONResponse(res, { message: "Something went wrong" });
  }
};

exports.Notifications_status = async (req, res, next) => {
  try {
    let myid = req.userId;
    const { read_all, read_id } = req.query;
    let notification;
    if (read_all == "true") {
      notification = await Notification.updateMany(
        { $and: [{ user_id: myid }, { status: "unseen" }] },
        { $set: { status: "seen" } }
      );
    } else {
      if (!read_id.length) {
        return failureJSONResponse(res, {
          message: "Please provide notificationId",
        });
      }
      notification = await Notification.updateOne(
        { _id: read_id },
        { $set: { status: "seen" } }
      );
    }
    if (notification) {
      return successJSONResponse(res, { message: "Success" });
    }
  } catch (error) {
    console.error(error);
    return failureJSONResponse(res, { message: "Something went wrong" });
  }
};
