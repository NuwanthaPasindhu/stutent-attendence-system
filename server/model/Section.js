const { default: mongoose } = require("mongoose");
const sectionSchema = new mongoose.Schema(
  {
    mimeType: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
