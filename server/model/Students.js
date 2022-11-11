const { default: mongoose } = require("mongoose");
const studentSchema = new mongoose.Schema(
  {
    profilePic: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "File",
      required: true,
    },
    admissionNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      min: 10,
      max: 11,
    },
    address: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
