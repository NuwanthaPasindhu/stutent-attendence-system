const multer = require("multer");

const {
  profilePicStorage,
  teacherListStorage,
} = require("../config/multer.config");

module.exports.teacherListUpload = multer({
  storage: teacherListStorage,
  limits: {
    fieldSize: 1024 * 1024 * 10,
  },
  fileFilter: (req, file, cb, res) => {
    if (
      file.mimetype.match(
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only xlsx files are allowed").message);
    }
  },
});

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
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!").message);
    }
  },
});
