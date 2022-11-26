const StudentClasses = require("../model/StudentClasses");
const UserClasses = require("../model/UserClasses");
const Students = require("../model/Students");
const { validatedStudent } = require("../util/validation/studentValidation");

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
      message: err.message,
    });
    return;
  }

  response.status(200).json({ status: 200, message: "New Student Created" });
  return;
};
