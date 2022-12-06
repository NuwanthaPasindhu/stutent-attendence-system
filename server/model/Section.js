const { default: mongoose } = require("mongoose");
const sectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique:true
      
    },
    details: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Section", sectionSchema);
