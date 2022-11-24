const {
  getAllSections,
  createSectionHead,
  getSelectedSections,
  createAdmin,
  createTeacher,
  getAllAdminUsers,
} = require("../controller/adminController");
const api = require("../middleware/api");
const { adminRoleCheck } = require("../middleware/role");
const Router = require("express").Router();

Router.get("/all", api, adminRoleCheck, getAllSections);
Router.get("/all-admin", api, adminRoleCheck, getAllAdminUsers);
Router.post("/create", api, adminRoleCheck, createSectionHead);
Router.get("/details/:id/:year", api, adminRoleCheck, getSelectedSections);
Router.post("/create-admin", api, adminRoleCheck, createAdmin);
Router.post("/create-teacher", api, adminRoleCheck, createTeacher);

module.exports = Router;
