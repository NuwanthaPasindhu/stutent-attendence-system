const XLSX = require("xlsx");
const fs = require("fs");
const User = require("../model/User");
const Students = require("../model/Students");
const UserClasses = require("../model/UserClasses");
const StudentClasses = require("../model/StudentClasses");

module.exports.teacherBulkDataUpload = async (request, response) => {
  if (!file) {
    response.status(400).json({
      status: 400,
      message: "No file uploaded",
    });
    return;
  }
  const workBook = XLSX.readFile(file.path);
  const jsonData = XLSX.utils.sheet_to_json(
    workBook.Sheets[workBook.SheetNames[0]]
  );

  try {
    await User.insertMany(jsonData);
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
    return;
  }
  fs.unlinkSync(file.path);
  response.status(201).json({ status: 201, message: "Created successfully" });
  return;
};
module.exports.studentBulkDataUpload = async (request, response) => {
  const authenticatedUser = request.user;
  let newStudents;
  const TODAY = new Date();
  // FETCH THE AUTHENTICATED USER SECTION
  const authUserSection = await UserClasses.findOne({
    userId: authenticatedUser._id,
    year: new Date().getFullYear(),
  });

  const file = request.file;
  if (!file) {
    response.status(400).json({
      status: 400,
      message: "No file uploaded",
    });
    return;
  }

  const workBook = XLSX.readFile(file.path);
  const jsonData = XLSX.utils.sheet_to_json(
    workBook.Sheets[workBook.SheetNames[0]]
  );

  try {
    newStudents = await Students.insertMany(jsonData);
  } catch (error) {
    response.status(400).json({ status: 400, message: error.message });
    return;
  }

  fs.unlinkSync(file.path);

  response.status(201).json({ status: 201, message: "Created successfully" });
  return;
};
