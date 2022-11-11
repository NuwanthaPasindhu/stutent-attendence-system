const multer = require("multer");
const path = require("path");

module.exports.profilePicStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/profilePictures");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
