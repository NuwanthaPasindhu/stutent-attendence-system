const { default: mongoose } = require("mongoose");
const sectionClassSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Section",
      required: true,
    },
    className: {
      type: String,
      required: true,
    },
    other: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SectionClass", sectionClassSchema);
