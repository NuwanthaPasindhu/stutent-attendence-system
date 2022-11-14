const { USER_ROLE_TEACHER } = require("../enum");
const UserClasses = require("../model/UserClasses");
const SectionClass = require("../model/Sectionclasses");
const { randomPasswordGenerator, hashPassword } = require("../util/password");
const User = require("../model/User");
const { validatedTeacher } = require("../util/validation/accValidation");
const { default: mongoose } = require("mongoose");
const { newAccNotification } = require("./emailController");

module.exports.createTeacher = async (request, response) => {
  const payload = request.body;
  const authenticatedUser = request.user;
  const randomPassword = randomPasswordGenerator();
  let latestUser;

  // GET AUTHENTICATED USER's SECTION
  const authenticatedUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: payload.year,
  });

  if (!authenticatedUserSection) {
    response.status(400).json({
      status: 400,
      message: `You haven't permission to Create ${payload.year} Teachers Accounts`,
    });
    return;
  }

  // VALIDATE THE REQUEST BODY
  const { error } = validatedTeacher(payload);
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
  if (!mongoose.Types.ObjectId.isValid(payload.class)) {
    response.status(400).json({
      status: 400,
      message: "Invalid ObjectId",
    });
    return;
  }

  // CHECKING IF THE CLASS ID EXISTS
  const checkClassIdExist = await SectionClass.findById(payload.class);
  if (!checkClassIdExist) {
    response.status(400).json({
      status: 400,
      message: "Invalid Class ID",
    });
    return;
  }

  // CHECKING IF THE SECTION HEAD ALL READY EXISTS FOR THIS YEAR USING SECTION ID AND YEAR AND CLASS ID
  const checkTeacherHead = await UserClasses.findOne({
    year: payload.year,
    sectionId: authenticatedUserSection.sectionId,
    classId: payload.class,
  });
  if (checkTeacherHead) {
    response.status(400).json({
      status: 400,
      message: `The class teacher already exists for ${payload.year}`,
    });
    return;
  }

  // CREATE THE USER
  try {
    const newUser = new User({
      fullName: payload.classTeacherName,
      email: payload.email,
      mobileNumber: payload.mobileNumber,
      password: hashPassword(randomPassword),
      role: USER_ROLE_TEACHER,
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
      classId: payload.class,
      sectionId: authenticatedUserSection.sectionId,
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
      payload.classTeacherName,
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
module.exports.allClassesWithTeacher = async (request, response) => {};
