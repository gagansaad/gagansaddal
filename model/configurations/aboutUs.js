const mongoose = require("mongoose");

const aboutUsSchema = new mongoose.Schema(
  {
    htmlText: {
      type: String,
      // required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("aboutus", aboutUsSchema);
