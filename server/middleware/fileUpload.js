const multer = require("multer");

const { profilePicStorage } = require('../config/multer.config');

module.exports.profileUpload = multer({
  storage: profilePicStorage,
  limits: {
    fieldSize: 1024 * 1024 * 10,
  },
    fileFilter: (req, file, cb) => {
        if (
          file.mimetype == "image/png" ||
          file.mimetype == "image/jpg" ||
          file.mimetype == "image/jpeg"
        ) {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(
            new Error("Only .png, .jpg and .jpeg format allowed!").message
          );
        }
  },
});