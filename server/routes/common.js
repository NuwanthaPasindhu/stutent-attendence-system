const Router = require('express').Router();
const api = require("../middleware/api");
const { adminRoleCheck } = require("../middleware/role");
const { getAllUsers,getSpecificUsers } = require('../controller/commonData');


Router.get("/users/all",api,adminRoleCheck, getAllUsers);
Router.get("/users/:id",api,adminRoleCheck, getSpecificUsers);

module.exports = Router;