const Router = require("express").Router();
const api = require("../middleware/api");
const {
  login,
  authenticatedUser,
  profilePicUpload,
  profileComplete,
} = require("../controller/authController");
const { profileUpload } = require("../middleware/fileUpload");

Router.post("/login", login);

Router.get("/me", api, authenticatedUser);
Router.put(
  "/profile-pic",
  api,
  profileUpload.single("profilePic"),
  profilePicUpload
);
Router.put("/profile-complete", api, profileComplete);

module.exports = Router;
