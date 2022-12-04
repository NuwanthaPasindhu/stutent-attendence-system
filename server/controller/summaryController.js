const UserClasses = require("../model/UserClasses");
const StudentClasses = require("../model/StudentClasses");
const StdAttendence = require("../model/StdAttendence");
const Section = require("../model/Section");

module.exports.classAttendance = async (request, response) => {
  const query = request.query;
  const authenticatedUser = request.user;
  const today = new Date();
  let attendance;
  let allStudentLength;
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });

  const classID = query.classID || authUserSection.classId;
  const date =
    query.date ||
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const sectionId = query.sectionId || authUserSection.sectionId;
  // ALL STUDENTS IN CLASS

  try {
    allStudentLength = await StudentClasses.find({
      classId: classID,
      sectionId: sectionId,
      year: new Date().getFullYear(),
    });
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }
  try {
    // TODAY ATTENDANCE IN THE CLASS
    attendance = await StdAttendence.find({
      classId: classID,
      sectionId: sectionId,
      date: date,
    }).populate("stdId");
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }
  response.status(200).json({
    status: 200,
    studentList: attendance,
    abLength: allStudentLength.length - attendance.length,
    todayAttendance: attendance.length,
  });
  return;
};
module.exports.sectionAttendance = async (request, response) => {
  const query = request.query;
  const authenticatedUser = request.user;
  const today = new Date();
  let attendance;
  let allStudentLength;
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });

  const date =
    query.date ||
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  const sectionId = authUserSection.sectionId;
  // ALL STUDENTS IN SECTION

  try {
    allStudentLength = await StudentClasses.find({
      sectionId: sectionId,
      year: new Date().getFullYear(),
    });
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }
  try {
    // TODAY ATTENDANCE IN THE CLASS
    attendance = await StdAttendence.find({
      sectionId: sectionId,
      date: date,
    }).populate("stdId");
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }
  response.status(200).json({
    status: 200,
    studentList: attendance,
    abLength: allStudentLength.length - attendance.length,
    todayAttendance: attendance.length,
  });
  return;
};

module.exports.schoolAttendance = async (request, response) => {
  const today = new Date();
  const attendance = [];
  const day = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  // SECTION LIST IN SCHOOL
  const sections = await Section.find();
  const filteredSections = sections.filter((section) => section.name !== "*");

  console.log(attendance);
  filteredSections.map(async (section) => {
    const schoolAttendance = await StdAttendence.find({
      date: day,
      sectionId: section._id,
    });
    attendance.push(schoolAttendance.length);
    console.log(attendance);
  });
  console.log(attendance);

  response.status(200).json({
    status: 200,
  });
  return;
};
