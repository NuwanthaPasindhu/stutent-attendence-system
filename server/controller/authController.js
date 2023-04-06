const { otpVerificationMail } = require("./emailController");
const User = require("../model/User");
const File = require("../model/File");
const fs = require("fs");
const {
  comparePassword,
  hashPassword,
  randomPasswordGenerator,
} = require("../util/password");
const {
  validateLogin,
  validateProfilePic,
  validateProfileComplete,
  validatedUpdateProfile,
  validatedPassword,
  validateResendOtp,
} = require("../util/validation/authValidation");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

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
      link: file.path,
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
    const existingUserById = await User.findById(payload.id);
    if (existingUserById.profilePic !== undefined) {
      if (
        (existingUserWithProfilePic = await existingUserById.populate(
          "profilePic"
        ))
      ) {
        fs.unlinkSync(existingUserWithProfilePic.profilePic.link);
        await File.findByIdAndDelete(existingUserById.profilePic._id);
      }
    }
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }

  try {
    const existingUserById = await User.findByIdAndUpdate(payload.id, {
      profilePic: saveFile._id,
    });
    if (existingUserById) {
      response.status(201).json({
        status: 201,
        path: saveFile.link,
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
  //  FIND THE USER BY MOBILE NUMBER
  const findUserByMobileNumber = await User.find({
    mobileNumber: payload.mobileNumber,
  });
  if (findUserByMobileNumber.length > 0) {
    response.status(400).json({
      status: 400,
      message: "Mobile Number already exist",
    });
    return;
  }

  try {
    const existingUserById = await User.findById(payload.id);
    if (!existingUserById.status) {
      response.status(400).json({
        status: 400,
        message: "Profile Not Activate Please Active Your Account",
      });
      return;
    }

    const updateUserById = await User.findByIdAndUpdate(payload.id, {
      fullName: payload.fullName,
      mobileNumber: payload.mobileNumber,
      email: payload.email,
      password: hashPassword(payload.password),
      address: payload.address,
      profileComplete: true,
    });
    if (updateUserById) {
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
module.exports.profileUpdate = async (request, response) => {
  const params = request.params;
  const payload = request.body;
  // VALIDATE THE REQUEST PARAMS ID
  if (!params.id) {
    response.status(400).json({
      status: 400,
      message: "Invalid Request",
    });
    return;
  }
  // VALIDATE THE REQUEST BODY
  const { error } = validatedUpdateProfile(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }

  const isValidObjectId = mongoose.Types.ObjectId.isValid(params.id);
  if (!isValidObjectId) {
    response.status(400).json({
      status: 400,
      message: "invalid user id",
    });
    return;
  }

  try {
    const existingUserById = await User.findById(params.id);
    if (!existingUserById.status) {
      response.status(400).json({
        status: 400,
        message: "Profile Not Activate Please Active Your Account",
      });
      return;
    }

    const updateUserById = await User.findByIdAndUpdate(params.id, {
      fullName: payload.fullName,
      mobileNumber: payload.mobileNumber,
      email: payload.email,
      address: payload.address,
    });
    if (updateUserById) {
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
module.exports.passwordUpdate = async (request, response) => {
  const params = request.params;
  const payload = request.body;
  // VALIDATE THE REQUEST PARAMS ID
  if (!params.id) {
    response.status(400).json({
      status: 400,
      message: "Invalid Request",
    });
    return;
  }
  // VALIDATE THE REQUEST BODY
  const { error } = validatedPassword(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }

  const isValidObjectId = mongoose.Types.ObjectId.isValid(params.id);
  if (!isValidObjectId) {
    response.status(400).json({
      status: 400,
      message: "invalid user id",
    });
    return;
  }

  try {
    const existingUserById = await User.findById(params.id);
    if (!existingUserById.status) {
      response.status(400).json({
        status: 400,
        message: "Profile Not Activate Please Active Your Account",
      });
      return;
    }

    const updateUserById = await User.findByIdAndUpdate(params.id, {
      password: hashPassword(payload.password),
    });
    if (updateUserById) {
      response.status(200).json({
        status: 200,
        message: "Password Updated Successfully",
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
module.exports.emailVerification = async (request, response) => {
  const payload = request.body;
  let user;
  // VALIDATE THE REQUEST BODY
  const { error } = validateResendOtp(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
    return;
  }

  const token = hashPassword(randomPasswordGenerator());

  //  FIND THE USER BY EMAIL
  try {
    user = await User.findOneAndUpdate(
      { email: payload.email },
      { passwordResetToken: token, status: false }
    );
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: "Invalid email Address",
    });
    return;
  }

  otpVerificationMail(user.email, token);
  response
    .status(200)
    .json({ status: 200, message: "email verification sended successfully" });

  return;
};

module.exports.forgotPasswordUpdate = async (request, response) => {
  const payload = request.body;
  const query = request.query;
  // VALIDATE THE REQUEST BODY
  if (query.token) {
    // FETCH THE USER BY TOKEN
    const findUserByToken = await User.findOne({
      passwordResetToken: query.token,
    });
    if (!findUserByToken) {
      response.status(400).json({ status: 400, message: "Invalid token." });
      return;
    }

    const { error } = validatedPassword(payload);
    if (error) {
      response.status(400).json({
        status: 400,
        message: error.details,
      });
      return;
    }
    try {
      await User.findOneAndUpdate(
        { passwordResetToken: query.token },
        {
          passwordResetToken: null,
          status: true,
          password: hashPassword(payload.password),
        }
      );
      response.status(200).json({
        status: 200,
        message: "Password updated.",
      });
      return;
    } catch (error) {
      response.status(400).json({
        status: 400,
        message: error.message,
      });
      return;
    }
  } else {
    response.status(400).json({ status: 400, message: "Token is required" });
    return;
  }
};
