const {
  createTeacher,
  allClasses,
} = require("../controller/sectionHeadController");
const api = require("../middleware/api");
const Router = require("express").Router();
const { sectionHeadRoleCheck } = require("../middleware/role");

Router.post("/create", api, sectionHeadRoleCheck, createTeacher);
Router.get("/all", api, sectionHeadRoleCheck, allClasses);

module.exports = Router;
