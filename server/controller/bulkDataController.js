const XLSX = require("xlsx");
const { USER_ROLE_TEACHER } = require("../enum");
const User = require("../model/User");
const { hashPassword, randomPasswordGenerator } = require("../util/password");
module.exports.teacherBulkDataUpload = async (request, response) => {
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
  console.log("====================================");
  console.log(jsonData);

  console.log("====================================");
  jsonData.forEach((user) => {
    try {
      insertUser(user);
    } catch (error) {
      response.status(400).json({ status: 400, message: error.message });
    }
  });

  response.status(201).json({ status: 201, message: "Success" });
  return;
};
