const nodemailer = require("nodemailer");
const path = require("path");
//REFERENCE THE PLUGIN
const hbs = require("nodemailer-express-handlebars");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const hbsOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve("mail"),
    defaultLayout: false,
  },
  viewPath: path.resolve("mail"),
  extName: ".handlebars",
};
// ATTACH THE PLUGIN TO THE NODEMAILER TRANSPORTER
transporter.use("compile", hbs(hbsOptions));

module.exports = transporter;
