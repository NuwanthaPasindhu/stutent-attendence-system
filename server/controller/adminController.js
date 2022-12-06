const {
  USER_ROLE_SECTION_HEAD,
  USER_ROLE_ADMIN,
  USER_ROLE_TEACHER,
} = require("../enum");
const Selection = require("../model/Section");
const UserClasses = require("../model/UserClasses");
const SectionClass = require("../model/Sectionclasses");
const { randomPasswordGenerator, hashPassword } = require("../util/password");
const User = require("../model/User");
const {
  validatedSection,
  validatedNewUser,
} = require("../util/validation/accValidation");
const { default: mongoose } = require("mongoose");
const Section = require("../model/Section");
const { newAccNotification } = require("./emailController");

module.exports.createSectionHead = async (request, response) => {
  const payload = request.body;
  const randomPassword = randomPasswordGenerator();
  let latestUser;

  // VALIDATE THE REQUEST BODY
  const { error } = validatedSection(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }

  // CHECK SECTION ID IS A REAL OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(payload.section)) {
    response.status(400).json({
      status: 400,
      message: "Invalid ObjectId",
    });
    return;
  }
  // CHECK USER ID IS A REAL OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(payload.userID)) {
    response.status(400).json({
      status: 400,
      message: "Invalid ObjectId",
    });
    return;
  }

  //  FIND THE USER BY userID
  const findUserByEmail = await User.findById(payload.userID);

  // FETCH ADMIN CLASS
  const adminClass = await SectionClass.findOne({
    name: "*",
    details: "ADMIN CLASS",
  });

  // CHECKING IF THE SECTION HEAD ALL READY EXISTS FOR THIS YEAR USING SECTION ID AND YEAR
  const checkSectionHead = await UserClasses.findOne({
    year: payload.year,
    sectionId: payload.section,
    classId: adminClass._id,
  });
  if (checkSectionHead) {
    response.status(400).json({
      status: 400,
      message: `The section head already exists for ${payload.year}`,
    });
    return;
  }
  // CHECKING IF THE SECTION HEAD ALL READY ASSIGNED TO THE CLASS
  const checkSectionHeadExisting = await UserClasses.findOne({
    year: payload.year,
    userId: payload.userID,
  });
  if (checkSectionHeadExisting) {
    const sectionHeadExistingClass = await checkSectionHeadExisting.populate([
      "classId",
      "sectionId",
    ]);
    response.status(400).json({
      status: 400,
      message: `${findUserByEmail.fullName} is already assigned to  the ${sectionHeadExistingClass.sectionId.details} ,${sectionHeadExistingClass.classId.details}`,
    });
    return;
  }

  // UPDATE THE USER
  try {
    await User.findByIdAndUpdate(payload.userID, {
      password: hashPassword(randomPassword),
      role: USER_ROLE_SECTION_HEAD,
      status: true,
    });
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }

  // ASSIGN USER TO SECTION HEAD CLASS
  try {
    const newSectionHead = new UserClasses({
      classId: adminClass._id,
      sectionId: payload.section,
      userId: payload.userID,
      year: payload.year,
    });
    await newSectionHead.save();
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }

  // SEND MAIL
  try {
    newAccNotification(
      findUserByEmail.email,
      findUserByEmail.fullName,
      randomPassword,
      USER_ROLE_SECTION_HEAD
    );
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }

  response.status(201).json({
    status: 201,
    message: "Successfully Created",
  });
  return;
};

module.exports.getAllSections = async (request, response) => {
  const allSections = await Selection.find();

  const sections = allSections.filter((section) => {
    return section.name !== "*";
  });
  response.status(200).json({
    status: 200,
    sections,
  });
  return;
};

module.exports.getSelectedSections = async (request, response) => {
  const params = request.params;
  const sectionClasses = await UserClasses.find({
    sectionId: params.id,
    year: params.year,
  }).populate([
    { path: "userId", populate: { path: "profilePic" } },
    { path: "sectionId" },
    { path: "classId" },
  ]);
  response.status(200).json({
    status: 200,
    sectionClasses,
  });
  return;
};

module.exports.createAdmin = async (request, response) => {
  const payload = request.body;
  const randomPassword = randomPasswordGenerator();
  // VALIDATE THE REQUEST BODY
  const { error } = validatedNewUser(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
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
  //  FIND THE USER BY EMAIL
  const findUserByEmail = await User.findOne({ email: payload.email });
  if (findUserByEmail) {
    response.status(400).json({
      status: 400,
      message: "Email already exist",
    });
    return;
  }
  try {
    const newUser = new User({
      email: payload.email,
      mobileNumber: payload.mobileNumber,
      address: payload.address,
      fullName: payload.fullName,
      password: hashPassword(randomPassword),
      role: USER_ROLE_ADMIN,
      status: true,
      profileComplete: true,
    });

    await newUser.save();
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }
  // SEND MAIL
  try {
    newAccNotification(
      payload.email,
      payload.fullName,
      randomPassword,
      USER_ROLE_ADMIN
    );
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }

  response
    .status(201)
    .json({ status: 201, message: "new Admin User successfully created" });
};
module.exports.createTeacher = async (request, response) => {
  const payload = request.body;
  const randomPassword = randomPasswordGenerator();
  // VALIDATE THE REQUEST BODY
  const { error } = validatedNewUser(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
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

  //  FIND THE USER BY EMAIL
  const findUserByEmail = await User.findOne({ email: payload.email });
  if (findUserByEmail) {
    response.status(400).json({
      status: 400,
      message: "Email already exist",
    });
    return;
  }

  try {
    const newUser = new User({
      email: payload.email,
      mobileNumber: payload.mobileNumber,
      address: payload.address,
      fullName: payload.fullName,
      password: hashPassword(randomPassword),
      role: USER_ROLE_TEACHER,
      profileComplete: true,
    });
    await newUser.save();
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }

  response
    .status(201)
    .json({ status: 201, message: "new Teacher successfully created" });
};

module.exports.getAllAdminUsers = async (request, response) => {
  const allUsers = await User.find({ role: USER_ROLE_ADMIN }).populate(
    "profilePic"
  );

  response.status(200).json({
    allUsers,
  });
  return;
};
