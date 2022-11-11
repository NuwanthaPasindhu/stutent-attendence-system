const { default: mongoose } = require("mongoose");
const userClassSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "User",
    },
    sectionId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Section",
    },
    classId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "SectionClass",
    },
    year: {
      type: Date,
      default:new Date().getFullYear()
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserClass", userClassSchema);
