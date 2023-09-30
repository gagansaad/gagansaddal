const mongoose = require(`mongoose`);
const MediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
    },
    url_type: {
      type: String,
    },
  },
  { timestamps: true }
);
exports.module = mongoose.model(`media`, MediaSchema);
