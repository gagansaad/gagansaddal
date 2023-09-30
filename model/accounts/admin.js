const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String },
    email_address: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile_number: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("admin", adminSchema);
