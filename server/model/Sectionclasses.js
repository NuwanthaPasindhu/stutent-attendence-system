const { default: mongoose } = require("mongoose");
const sectionClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SectionClass", sectionClassSchema);
