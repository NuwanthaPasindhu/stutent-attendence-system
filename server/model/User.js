const { default: mongoose } = require("mongoose");
const {
  USER_ROLE_ADMIN,
  USER_ROLE_SECTION_HEAD,
  USER_ROLE_TEACHER,
} = require("../enum");
const userSchema = new mongoose.Schema(
  {
    profilePic: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "File",
    },
    fullName: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
      min: 10,
      max: 11,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      validate: (val) => val.includes("@"),
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      type: String,
    },
    role: {
      type: String,
      enum: [USER_ROLE_ADMIN, USER_ROLE_SECTION_HEAD, USER_ROLE_TEACHER],
      default: USER_ROLE_TEACHER,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
