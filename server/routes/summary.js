const {
  classAttendance,
  sectionAttendance,
  schoolAttendance,
  allSectionClassesAttendance,
  oneStdAttendencePercentage,
  stdAttendancePercentage,
} = require("../controller/summaryController");
const api = require("../middleware/api");
const {
  teacherRoleCheck,
  sectionHeadRoleCheck,
  adminRoleCheck,
} = require("../middleware/role");
const Router = require("express").Router();

Router.get("/summary/", api, teacherRoleCheck, classAttendance);
Router.get("/summary/section", api, sectionHeadRoleCheck, sectionAttendance);
Router.get(
  "/summary/section/all-class",
  api,
  adminRoleCheck,
  allSectionClassesAttendance
);
Router.get("/summary/school", api, adminRoleCheck, schoolAttendance);
Router.get(
  "/summary/student/:id",
  api,
  teacherRoleCheck,
  oneStdAttendencePercentage
);
Router.get(
  "/summary/student/attendance/percentage",
  api,
  teacherRoleCheck,
  stdAttendancePercentage
);
module.exports = Router;
