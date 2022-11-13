const { getAllSections, createSectionHead } = require('../controller/adminController');
const api = require('../middleware/api');
const Router = require('express').Router();

Router.get("/all",api, getAllSections);
Router.post("/create", api, createSectionHead);

module.exports = Router;