const {
  classAttendance,
  sectionAttendance,
  schoolAttendance,
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
Router.get("/summary/school", api, adminRoleCheck, schoolAttendance);
module.exports = Router;
