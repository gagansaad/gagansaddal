const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },

    code: {
      type: String,
      required: true,
    },
    for: {
      type: Number,
      required: true,
      // 2= email
      // 1= mobile number
    },

    used_for: {
      type: Number,
      required: true,

      //1= forget password
      //2= sign up
      //3= change email address or phone number
    },

    email_address: {
      type: String,
    },

    phone_number: {
      type: String,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: `user`,
      required: true,
    },
    // createdAt: { type: Date, default: Date.now, index: { expires: 100 } },
  },
  { timestamps: true }
);

module.exports = mongoose.model("otp", otpSchema);
