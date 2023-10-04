const mongoose = require(`mongoose`);
const {
  defaultStringConfig,
  nonEmptyArrayValidator,
  defaultPriceProperty,
  defaultCurrencyProperty,
  getAlphaNumID,
  defaultBooleanConfig,
} = require(`../../utils/mongoose`);

const NotificationSchema = new mongoose.Schema(
  {
    title: {
      ...defaultStringConfig,
      // required: true
    },
    body: {
      ...defaultStringConfig,
      // required: true
    },
    data: {
      type:String,
      // required: true
    },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    status: {
      type: String,
      possibleValues: ["seen", "unseen"],
      default: "unseen",
    },
  },
  { timestamps: true }
);

exports.module = mongoose.model(`notification`, NotificationSchema);
