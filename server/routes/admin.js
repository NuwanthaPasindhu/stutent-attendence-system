const { getAllSections, createSectionHead } = require('../controller/adminController');
const api = require('../middleware/api');
const {adminRoleCheck} = require('../middleware/role');
const Router = require('express').Router();


Router.get("/all",api,adminRoleCheck, getAllSections);
Router.post("/create", api, adminRoleCheck,createSectionHead);

module.exports = Router;