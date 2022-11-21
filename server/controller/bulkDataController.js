module.exports.teacherBulkDataUpload = async (request, response) => {
  const file = request.file;
  if (!file) {
    response.status(400).json({
      status: 400,
      message: "No file uploaded",
    });
    return;
  }
  console.log("======================================");
  console.log(file);
  console.log("======================================");
};
