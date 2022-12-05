const { default: mongoose } = require("mongoose");
const studentClassSchema = new mongoose.Schema(
  {
    stdId: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      ref: "Student",
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
      type: Number,
      default: new Date().getFullYear(),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentClass", studentClassSchema);
