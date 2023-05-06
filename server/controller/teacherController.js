const StudentClasses = require("../model/StudentClasses");
const UserClasses = require("../model/UserClasses");
const Students = require("../model/Students");
const {
  validatedStudent,
  validatedStudentAssign,
} = require("../util/validation/studentValidation");
const StdAttendence = require("../model/StdAttendence");

module.exports.students = async (request, response) => {
  const authenticatedUser = request.user;
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });

  // FETCH STUDENTS IN AUTHENTICATED USESR'S SECTION AND CLASS
  const students = await StudentClasses.find({
    sectionId: authUserSection.sectionId,
    classId: authUserSection.classId,
    year: authUserSection.year,
  }).populate("stdId");

  response.status(200).json({ status: 200, students });
  return;
};
module.exports.studentProfile = async (request, response) => {
  const params = request.params;
  const studentProfile = await Students.findById(params.id);

  response.status(200).json({ status: 200, profile: studentProfile });
  return;
};
module.exports.admissionNumberStudentProfile = async (request, response) => {
  const params = request.params;
  // FETCH STUDENTS USING ADMISSION NUMBER
  const studentProfile = await Students.findOne({
    admissionNumber: params.admissionID,
  });
  if (studentProfile) {
    response.status(200).json({ status: 200, profile: studentProfile });
    return;
  } else {
    response.status(200).json({ status: 200, profile: "Profile Not Found" });
    return;
  }
};
module.exports.assignStudent = async (request, response) => {
  const payload = request.body;
  const today = new Date();
  const authenticatedUser = request.user;
  let newStudentClass;
  const { error } = validatedStudentAssign(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
    return;
  }
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });
  const studentProfile = await Students.findOne({
    admissionNumber: payload.admissionID,
  });
  if (!studentProfile) {
    response.status(400).json({ status: 400, message: "Profile Not Found" });
    return;
  }
  //    CHECK PREVIOUS CLASS

  const studentClass = await StudentClasses.findOne({
    stdId: studentProfile._id,
  });
  //  SAME YEAR PREVIOUS ATTENDANCE

  if (!studentClass) {
    // ASSIGN STUDENT TO STUDENT CLASS
    try {
      const studentClass = new StudentClasses({
        stdId: studentProfile._id,
        sectionId: authUserSection.sectionId,
        classId: authUserSection.classId,
        year: authUserSection.year,
      });

      newStudentClass = await studentClass.save();
      response
        .status(200)
        .json({ status: 200, message: "student assigned successfully" });
      return;
    } catch (error) {
      response.status(400).json({
        status: 400,
        message: error.message,
      });
      return;
    }
  } else {
    try {
      newStudentClass = await StudentClasses.findOneAndUpdate(
        {
          stdId: studentProfile._id,
        },
        {
          sectionId: authUserSection.sectionId,
          classId: authUserSection.classId,
          year: authUserSection.year,
        }
      );
    } catch (error) {
      response.status(400).json({
        status: 400,
        message: error.message,
      });
      return;
    }
  }
  const previousAttendance = await StdAttendence.find({
    stdId: studentProfile._id,
    date: { $regex: today.getFullYear() },
  });
  if (previousAttendance.length > 0) {
    try {
      await StdAttendence.updateMany(
        {
          stdId: studentProfile._id,
          date: { $regex: today.getFullYear() },
        },
        {
          $set: {
            classId: newStudentClass.classId,
            sectionId: newStudentClass.sectionId,
          },
        }
      );
    } catch (error) {
      response.status(400).json({
        status: 400,
        message: error.message,
      });
      return;
    }
  }
  response
    .status(200)
    .json({ status: 200, message: "student assigned successfully" });
  return;
};
module.exports.addStudent = async (request, response) => {
  const payload = request.body;
  const authenticatedUser = request.user;
  let newStudent;
  // VALIDATE THE REQUEST BODY
  const { error } = validatedStudent(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details,
    });
    return;
  }
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });
  // CHECK ADMISSION NUMBER ALL READY EXISTS
  const checkAdmissionNumber = await Students.find({
    admissionNumber: payload.admissionNumber,
  });
  if (checkAdmissionNumber.length > 0) {
    response.status(400).json({
      status: 400,
      message: "Admission Number Already Exists",
    });
    return;
  }

  // CREATE STUDENTS
  try {
    newStudent = new Students({
      admissionNumber: payload.admissionNumber,
      fullName: payload.fullName,
      mobileNumber: payload.mobileNumber,
      address: payload.address,
      motherName: payload.motherName,
      fatherName: payload.fatherName,
    });
    await newStudent.save();
  } catch (err) {
    response.status(400).json({
      status: 400,
      message: err.message,
    });
    return;
  }
  // ASSIGN STUDENT TO STUDENT CLASS

  try {
    const studentClass = new StudentClasses({
      stdId: newStudent._id,
      sectionId: authUserSection.sectionId,
      classId: authUserSection.classId,
      year: authUserSection.year,
    });

    await studentClass.save();
  } catch (error) {
    response.status(400).json({
      status: 400,
      message: error.message,
    });
    return;
  }

  response.status(200).json({ status: 200, message: "New Student Created" });
  return;
};
module.exports.attendance = async (request, response) => {
  const payload = request.body;

  const { error } = validatedStudentAssign(payload);
  if (error) {
    response.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
    return;
  }
  // FETCH STUDENTS USING ADMISSION NUMBER
  const studentProfile = await Students.findOne({
    admissionNumber: payload.admissionID,
  });
  if (!studentProfile) {
    response.status(200).json({ status: 200, profile: "Profile Not Found" });
    return;
  }

  const studentClass = await StudentClasses.findOne({
    stdId: studentProfile._id,
  });

  const Today = new Date();
  // CHECK IF TODAY IS A WEEKEND OR NOT
  if (Today.getDay() === 0 || Today.getDay() === 6) {
    response.status(400).json({
      status: 400,
      message: "Attendance of students cannot be marked on weekends",
    });
    return;
  }
  //  CONST FIND PREVIOUS ATTENDANCE
  const previousAttendance = await StdAttendence.findOne({
    stdId: studentProfile._id,
    attendance: true,
    date: `${Today.getFullYear()}-0${Today.getMonth() + 1}-0${Today.getDate()}`,
  });

  if (!previousAttendance) {
    try {
      const attendance = await new StdAttendence({
        attendance: true,
        stdId: studentProfile._id,
        sectionId: studentClass.sectionId,
        classId: studentClass.classId,
      });
      attendance.save();

      response.status(200).json({
        status: 200,
        message: "Attendance Marked",
      });
    } catch (error) {
      response.status(400).json({
        status: 400,
        message: error.message,
      });
    }
  } else {
    response.status(200).json({
      status: 200,
      message: "attendance all ready marked",
    });
  }
};

module.exports.todayAttendance = async (request, response) => {
  const payload = request.body;
  const authenticatedUser = request.user;
  const today = new Date();
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });
  const todayAttendance = await StdAttendence.find({
    sectionId: authUserSection.sectionId,
    classId: authUserSection.classId,
    date: `${today.getFullYear()}-0${today.getMonth() + 1}-0${today.getDate()}`,
  }).populate("stdId");

  response.status(200).json({
    status: 200,
    todayAttendance,
  });
  return;
};
