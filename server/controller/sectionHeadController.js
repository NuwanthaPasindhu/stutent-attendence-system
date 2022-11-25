const { USER_ROLE_TEACHER } = require("../enum");
const UserClasses = require("../model/UserClasses");
const SectionClass = require("../model/Sectionclasses");
const { randomPasswordGenerator, hashPassword } = require("../util/password");
const User = require("../model/User");
const { validatedTeacher } = require("../util/validation/accValidation");
const { default: mongoose } = require("mongoose");
const { newAccNotification } = require("./emailController");
const Sectionclasses = require("../model/Sectionclasses");

module.exports.createTeacher = async (request, response) => {
  const payload = request.body;
  const authenticatedUser = request.user;
  const randomPassword = randomPasswordGenerator();
  let latestUser;

  // VALIDATE THE REQUEST BODY
  const { error } = validatedTeacher(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }

  // CHECK SECTION CLASS ID IS A REAL OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(payload.sectionClass)) {
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
  // CHECK SECTION CLASS ID IS A REAL ID

  const checkSectionClass = await Sectionclasses.findById(payload.sectionClass);
  if (!checkSectionClass) {
    response
      .status(400)
      .json({ status: 400, message: "Class is not a valid class." });
    return;
  }

  //  FIND THE USER BY userID
  const findUserByEmail = await User.findById(payload.userID);
  if (!findUserByEmail) {
    response.status(400).json({
      status: 400,
      message: "User not found",
    });
    return;
  }
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  }).populate(["userId", "sectionId", "classId"]);

  // CHECKING IF THE TEAChER ALL READY EXISTS FOR THIS YEAR USING SECTION ID CLASS ID and YEAR
  const checkTeacher = await UserClasses.findOne({
    year: authUserSection.year,
    sectionId: authUserSection.sectionId._id,
    classId: payload.sectionClass,
  });
  if (checkTeacher) {
    response.status(400).json({
      status: 400,
      message: `The teacher already exists for ${authUserSection.year}`,
    });
    return;
  }

  // CHECKING IF THE Teacher ALL READY ASSIGNED TO THE CLASS
  const checkTeacherExisting = await UserClasses.findOne({
    year: authUserSection.year,
    userId: payload.userID,
  }).populate(["classId", "sectionId"]);
  if (checkTeacherExisting) {
    response.status(400).json({
      status: 400,
      message: `${findUserByEmail.fullName} is already assigned to  the ${checkTeacherExisting.sectionId.details} ,${checkTeacherExisting.classId.details}`,
    });
    return;
  }
  // UPDATE THE USER
  try {
    await User.findByIdAndUpdate(payload.userID, {
      password: hashPassword(randomPassword),
      role: USER_ROLE_TEACHER,
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
    const newTeacher = new UserClasses({
      classId: payload.sectionClass,
      sectionId: authUserSection.sectionId._id,
      userId: payload.userID,
      year: authUserSection.year,
    });
    await newTeacher.save();
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
      USER_ROLE_TEACHER
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

module.exports.allClasses = async (request, response) => {
  const allClasses = await SectionClass.find({});

  const classes = allClasses.filter((sectionClass) => {
    return sectionClass.name !== "*";
  });

  response.status(200).json({
    status: 200,
    classes,
  });
  return;
};
module.exports.sectionTeacherList = async (request, response) => {
  const authenticatedUser = request.user;
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });
  const sectionTeacherList = await UserClasses.find({
    sectionId: authUserSection.sectionId,
    year: new Date().getFullYear(),
  }).populate([
    { path: "userId", select: ["fullName", "mobileNumber"] },
    { path: "classId" },
  ]);

  response.status(200).json({
    status: 200,
    sectionTeacherList,
  });
  return;
};
