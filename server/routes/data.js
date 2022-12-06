const {
  teacherBulkDataUpload,
  studentBulkDataUpload,
} = require("../controller/bulkDataController");
const api = require("../middleware/api");
const {
  teacherListUpload,
  studentListUpload,
} = require("../middleware/fileUpload");
const { adminRoleCheck, teacherRoleCheck } = require("../middleware/role");
const Router = require("express").Router();

Router.post(
  "/bulk/teacher-list-upload",
  teacherListUpload.single("teacherList"),
  api,
  adminRoleCheck,
  teacherBulkDataUpload
);
Router.post(
  "/bulk/student-list-upload",
  studentListUpload.single("studentList"),
  api,
  teacherRoleCheck,
  studentBulkDataUpload
);

module.exports = Router;
