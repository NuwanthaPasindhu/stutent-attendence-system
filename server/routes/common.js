const Router = require("express").Router();
const api = require("../middleware/api");
const { sectionHeadRoleCheck } = require("../middleware/role");
const { getAllUsers, getSpecificUsers } = require("../controller/commonData");

Router.get("/users/all", api, sectionHeadRoleCheck, getAllUsers);
Router.get("/users/:id", api, sectionHeadRoleCheck, getSpecificUsers);

module.exports = Router;
