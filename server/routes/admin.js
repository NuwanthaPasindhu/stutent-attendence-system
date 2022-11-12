const { getAllSections } = require('../controller/adminController');
const api = require('../middleware/api');
const Router = require('express').Router();

Router.get("/all",api, getAllSections);

module.exports = Router;