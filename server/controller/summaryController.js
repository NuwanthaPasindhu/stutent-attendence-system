const UserClasses = require("../model/UserClasses");
const StudentClasses = require("../model/StudentClasses");
const StdAttendence = require("../model/StdAttendence");

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
