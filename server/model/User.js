const { default: mongoose } = require("mongoose");
const {
  USER_ROLE_ADMIN,
  USER_ROLE_SECTION_HEAD,
  USER_ROLE_TEACHER,
} = require("../enum");
const OTP = require('../util/otp');
const userSchema = new mongoose.Schema(
  {
    profilePic: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "File",
      required: true,
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
      unique: true,
    },
    email: {
      type: String,
      validate: (val) => val.includes("@"),
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: [USER_ROLE_ADMIN, USER_ROLE_SECTION_HEAD, USER_ROLE_TEACHER],
      default: USER_ROLE_TEACHER,
      required: true,
    },
    otp: {
      type: Number,
      default: OTP,
    },
    status: {
      type: Boolean,
      default: false,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
