const { classAttendance } = require("../controller/summaryController");
const api = require("../middleware/api");
const { teacherRoleCheck } = require("../middleware/role");
const Router = require("express").Router();

Router.get("/summary/", api, teacherRoleCheck, classAttendance);
module.exports = Router;
