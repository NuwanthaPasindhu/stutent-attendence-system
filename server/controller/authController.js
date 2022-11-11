const User = require("../model/User");
const File = require("../model/File");
const { otpVerificationMail } = require("./emailController");
const { comparePassword, hashPassword } = require("../util/password");
const {
  validateLogin,
  validateProfilePic,
  validateProfileComplete,
  validateOtp,
  validateResendOtp,
} = require("../util/validation/authValidation");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const OTP = require("../util/otp");

module.exports.login = async (request, response) => {
  const payload = request.body;

  // VALIDATE THE REQUEST BODY
  const { error } = validateLogin(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }

  //  FIND THE USER BY EMAIL
  const findUserByEmail = await User.findOne({ email: payload.email });
  if (!findUserByEmail) {
    response.status(400).json({
      status: 400,
      message: "Invalid email or password",
    });
    return;
  }
  //  CHECK THE PASSWORD
  const validUser = comparePassword(payload.password, findUserByEmail.password);
  if (!validUser) {
    response.status(400).json({
      status: 400,
      message: "Invalid email or password",
    });
    return;
  }

  // CHECK USER ACCOUNT STATUS
  if (findUserByEmail.status) {
    // CREATE THE JWT TOKEN
    const token = jwt.sign(
      {
        id: findUserByEmail._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    response.status(200).json({ status: 200, token });
  } else {
    response.status(401).json({ status: 401, message: "Account Blocked" });
  }
};

module.exports.authenticatedUser = async (request, response) => {
  const authenticatedUser = request.user;
  const authenticatedUserWithProfile = await authenticatedUser.populate(
    "profilePic"
  );
  console.log();
  response.status(200).json({
    status: 200,
    authenticatedUser: authenticatedUser.profilePic
      ? authenticatedUserWithProfile
      : authenticatedUser,
  });
};

module.exports.profilePicUpload = async (request, response) => {
  const payload = request.body;
  const file = request.file;
  let saveFile;
  const { error } = validateProfilePic(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }
  if (file) {
    const newFile = new File({
      link: file.filename,
      mimeType: file.mimetype,
    });

    try {
      saveFile = await newFile.save();
    } catch (error) {
      response.status(400).json({
        status: 400,
        message: error.message,
      });
      return;
    }
  }
  try {
    const existingUserById = await User.findByIdAndUpdate(payload.id, {
      profilePic: saveFile._id,
    });
    if (existingUserById) {
      response.status(200).json({
        status: 200,
        message: "Profile Pic Uploaded",
      });
      return;
    }
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }
};

module.exports.profileComplete = async (request, response) => {
  const payload = request.body;
  // VALIDATE THE REQUEST BODY
  const { error } = validateProfileComplete(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }

  const isValidObjectId = mongoose.Types.ObjectId.isValid(payload.id);
  if (!isValidObjectId) {
    response.status(400).json({
      status: 400,
      message: "invalid user id",
    });
    return;
  }
  try {
    const existingUserById = await User.findByIdAndUpdate(payload.id, {
      fullName: payload.fullName,
      mobileNumber: payload.mobileNumber,
      email: payload.email,
      password: hashPassword(payload.password),
      address: payload.address,
      profileComplete: true,
    });
    if (existingUserById) {
      response.status(200).json({
        status: 200,
        message: "Profile Updated Successfully",
      });
      return;
    }
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }
};

module.exports.otpVerification = async (request, response) => {
  const payload = request.body;
  const { error } = validateOtp(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }
  const checkOtpExistingUser = await User.findOne({ otp: payload.otp });

  if (checkOtpExistingUser) {
    const user = await User.findByIdAndUpdate(checkOtpExistingUser._id, {
      status: true,
    });

    if (user) {
      response.status(200).json({
        status: 200,
        message: "Account is Activated",
      });
      return;
    }
  } else {
    response.status(200).json({
      status: 200,
      message: "Invalid OTP or Account is already Activated",
    });
    return;
  }
};

module.exports.resendOtp = async (request, response) => {
  const payload = request.body;

  const { error } = validateResendOtp(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
    }
    
  try {
    const user = await User.findOne({
      email: payload.email,
      status: false,
    });
    if (user) {
      const newOTP = OTP();
      // CHECK THE OTP EXPIRED OR NOT USING USER ID IF EXISTS UPDATE THE NEW OTP
      await User.findByIdAndUpdate(user._id, { otp: newOTP });
      otpVerificationMail(user.email, newOTP);
      response.status(200).json({
        status: 200,
        message: "OTP sended successfully ",
      });
      return;
    }
  } catch (error) {
    if (error) {
      response.status(400).json({
        status: 400,
        message: error.message,
      });
      return;
    }
  }
};
