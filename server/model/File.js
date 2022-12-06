const { default: mongoose } = require("mongoose");
const fileSchema = new mongoose.Schema(
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

module.exports = mongoose.model("File", fileSchema);