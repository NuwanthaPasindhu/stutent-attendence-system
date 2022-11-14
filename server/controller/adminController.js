const { USER_ROLE_SECTION_HEAD } = require("../enum");
const Selection = require("../model/Section");
const UserClasses = require("../model/UserClasses");
const SectionClass = require("../model/Sectionclasses");
const { randomPasswordGenerator, hashPassword } = require("../util/password");
const User = require("../model/User");
const { validatedSection } = require("../util/validation/accValidation");
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

  //  FIND THE USER BY EMAIL
  const findUserByEmail = await User.find({ email: payload.email });
  if (findUserByEmail.length > 0) {
    response.status(400).json({
      status: 400,
      message: "Email already exist",
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

  // CHECK SECTION ID IS A REAL OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(payload.section)) {
    response.status(400).json({
      status: 400,
      message: "Invalid ObjectId",
    });
    return;
  }

  // CHECKING IF THE SECTION ID EXISTS
  const checkSectionIdExist = await Section.findById(payload.section);
  if (!checkSectionIdExist) {
    response.status(400).json({
      status: 400,
      message: "Invalid Section ID",
    });
    return;
  }

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

  // CREATE THE USER
  try {
    const newUser = new User({
      fullName: payload.SectionHeadName,
      email: payload.email,
      mobileNumber: payload.mobileNumber,
      password: hashPassword(randomPassword),
      role: USER_ROLE_SECTION_HEAD,
    });

    latestUser = await newUser.save();
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
      userId: latestUser._id,
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
      payload.email,
      payload.SectionHeadName,
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

  const sections = allSections.filter(section => {
    return section.name !== '*'
  })
  response.status(200).json({
    status: 200,
    sections,
  });
  return;
};

