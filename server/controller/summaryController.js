const Sectionclasses = require("../model/Sectionclasses");
const UserClasses = require("../model/UserClasses");
const StudentClasses = require("../model/StudentClasses");
const StdAttendence = require("../model/StdAttendence");
const Section = require("../model/Section");
const { default: mongoose } = require("mongoose");
const Students = require("../model/Students");

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
  const sectionId = query.sectionID || authUserSection.sectionId;
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
module.exports.allSectionClassesAttendance = async (request, response) => {
  const query = request.query;
  const today = new Date();
  const classAttendance = [];
  const date =
    `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}` ||
    query.date;
  if (!query.sectionID) {
    response.status(400).json({ status: 400, message: " sectionId required" });
    return;
  }

  // CHECK SECTION ID IS A REAL OBJECT ID
  if (!mongoose.Types.ObjectId.isValid(query.sectionID)) {
    response.status(400).json({
      status: 400,
      message: "Invalid ObjectId",
    });
    return;
  }
  // CHECK SECTIONID IS A REAL ID

  const checkSection = await Section.findById(query.sectionID);
  if (!checkSection) {
    response
      .status(400)
      .json({ status: 400, message: "Section is not a valid section." });
    return;
  }
  const sectionId = query.sectionID;
  // FETCH All CLASS
  const allClasses = await Sectionclasses.find();
  // REMOVE ADMIN CLASS FROM ALL CLASSES ARRAY
  const filterdClass = allClasses.filter(
    (sectionClass) => sectionClass.name !== "*"
  );

  filterdClass.map(async (sectionClass) => {
    const attendance = await StdAttendence.find({
      sectionId: sectionId,
      classId: sectionClass._id,
      date,
    });
    classAttendance.push({
      class: sectionClass.details,
      attendance: attendance.length,
    });
  });

  setTimeout(() => {
    response.status(200).json({
      status: 200,
      attendance: classAttendance,
    });
    return;
  }, 500);
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
  filteredSections.map(async (section) => {
    const schoolAttendance = await StdAttendence.find({
      date: day,
      sectionId: section._id,
    });
    attendance.push(schoolAttendance.length);
  });

  setTimeout(() => {
    response.status(200).json({
      status: 200,
      attendance,
    });
    return;
  }, 500);
};

module.exports.oneStdAttendencePercentage = async (request, response) => {
  const params = request.params;
  const authenticatedUser = request.user;
  const today = new Date();
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });
  // ALL ATTENDANCE MARKED DATES
  const allAttendanceDates = await StdAttendence.find({
    classId: authUserSection.classId,
    sectionId: authUserSection.sectionId,
    date: { $regex: today.getFullYear() },
  }).select("date");

  let allAttendance = [
    ...new Map(allAttendanceDates.map((item) => [item["date"], item])).values(),
  ];

  if (params.id) {
    // CHECK USER ID IS A REAL OBJECT ID
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      response.status(400).json({
        status: 400,
        message: "Invalid ObjectId",
      });
      return;
    }

    // CHECK USER ID IS A REAL USER ID
    const checkStudentIdExists = await Students.findById(params.id);
    if (!checkStudentIdExists) {
      response.status(400).json({ status: 400, message: "Student not found" });
      return;
    }

    // FETCH STUDENT ALL ATTENDANCE
    const allStudentAttendance = await StdAttendence.find({
      classId: authUserSection.classId,
      sectionId: authUserSection.sectionId,
      stdId: params.id,
      date: { $regex: today.getFullYear() },
    }).select("date");

    response.status(200).json({
      status: 200,
      allAttendanceDates: allAttendance.length,
      allStudentAttendance: allStudentAttendance.length,
      percentage:
        Math.round((allStudentAttendance.length / allAttendance.length) * 100) +
        "%",
    });
    return;
  } else {
    response.status(400).json({ status: 400, message: "Student Id required" });
    return;
  }
};

module.exports.stdAttendancePercentage = async (request, response) => {
  const authenticatedUser = request.user;
  const today = new Date();
  const attendance = [];
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });
  // ALL ATTENDANCE MARKED DATES
  const allAttendanceDates = await StdAttendence.find({
    sectionId: authUserSection.sectionId,
    date: { $regex: today.getFullYear() },
  }).select("date");

  let allAttendance = [
    ...new Map(allAttendanceDates.map((item) => [item["date"], item])).values(),
  ];

  // FETCH ALL STUDENTS IS AUTHENTICATED USER CLASS

  const allStudents = await StudentClasses.find({
    year: new Date().getFullYear(),
    sectionId: authUserSection.sectionId,
    classId: authUserSection.classId,
  }).populate({ path: "stdId", select: "fullName" });

  allStudents.map(async (student) => {
    const studentAttendance = await StdAttendence.find({
      classId: authUserSection.classId,
      sectionId: authUserSection.sectionId,
      stdId: student.stdId._id,
      date: { $regex: today.getFullYear() },
    }).select("date");
    attendance.push({
      student: student.stdId.fullName,
      attendance: studentAttendance.length,
      allAttendanceMarkedDates: allAttendance.length,
      percentage: Math.round(
        (studentAttendance.length / allAttendance.length) * 100
      ),
    });
  });

  setTimeout(() => {
    response.status(200).json({
      status: 200,
      attendance,
    });
    return;
  }, 500);
};
