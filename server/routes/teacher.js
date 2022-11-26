const {
  students,
  studentProfile,
  addStudent,
  admissionNumberStudentProfile,
  assignStudent,
} = require("../controller/teacherController");
const api = require("../middleware/api");
const { teacherRoleCheck } = require("../middleware/role");
const Router = require("express").Router();

Router.get("/", api, teacherRoleCheck, students);
Router.get("/details/:id", api, teacherRoleCheck, studentProfile);
Router.get(
  "/details/admission/:admissionID",
  api,
  teacherRoleCheck,
  admissionNumberStudentProfile
);
Router.post("/add", api, teacherRoleCheck, addStudent);
Router.post("/assign", api, teacherRoleCheck, assignStudent);

module.exports = Router;
