const Router = require("express").Router();
const api = require("../middleware/api");
const {
  login,
  authenticatedUser,
  profilePicUpload,
  profileComplete,
  profileUpdate,
  passwordUpdate,
} = require("../controller/authController");
const { profileUpload } = require("../middleware/fileUpload");

Router.post("/login", login);
Router.post("/forget-password");

Router.get("/me", api, authenticatedUser);
Router.put(
  "/profile-pic",
  api,
  profileUpload.single("profilePic"),
  profilePicUpload
);
Router.put("/profile-complete", api, profileComplete);
Router.put("/profile-update/:id", api, profileUpdate);
Router.put("/password-update/:id", api, passwordUpdate);

module.exports = Router;
