const {
  createTeacher,
  allClasses,
  sectionTeacherList,
  sectionTeacherProfile,
} = require("../controller/sectionHeadController");
const api = require("../middleware/api");
const Router = require("express").Router();
const { sectionHeadRoleCheck } = require("../middleware/role");

Router.post("/create", api, sectionHeadRoleCheck, createTeacher);
Router.get("/all", api, sectionHeadRoleCheck, allClasses);
Router.get("/teacher-list", api, sectionHeadRoleCheck, sectionTeacherList);

module.exports = Router;
