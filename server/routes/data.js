const { teacherBulkDataUpload } = require("../controller/bulkDataController");
const api = require("../middleware/api");
const { teacherListUpload } = require("../middleware/fileUpload");
const { adminRoleCheck } = require("../middleware/role");
const Router = require("express").Router();

Router.post(
  "/bulk/teacher-list-upload",
  teacherListUpload.single("teacherList"),
  api,
  adminRoleCheck,
  teacherBulkDataUpload
);

module.exports = Router;
