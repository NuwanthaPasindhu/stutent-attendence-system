const {
  students,
  studentProfile,
  addStudent,
} = require("../controller/teacherController");
const api = require("../middleware/api");
const { teacherRoleCheck } = require("../middleware/role");
const Router = require("express").Router();

Router.get("/", api, teacherRoleCheck, students);
Router.get("/details/:id", api, teacherRoleCheck, studentProfile);
Router.post("/add", api, teacherRoleCheck, addStudent);

module.exports = Router;
