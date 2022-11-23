const { default: mongoose } = require("mongoose");
const { USER_ROLE_ADMIN } = require("../enum");
const User = require("../model/User");

module.exports.getAllUsers = async (request, response) => {
  const allUsers = await User.find();
  const Users = allUsers.filter(
    (user) =>
      user.role !== USER_ROLE_ADMIN &&
      user._id.toString() !== request.user._id.toString()
  );
  response.status(200).json({
    allUsers: Users,
  });
  return;
};
module.exports.getSpecificUsers = async (request, response) => {
  // CHECK USER ID IS A REAL OBJECT ID
  const params = request.params;
  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    response.status(400).json({
      status: 400,
      message: "Invalid User ID",
    });
    return;
  }

  const user = await User.findById(params.id);
  const profilePic = await user.populate("profilePic");

  if (!profilePic) {
    response.status(404).json({
      message: "User not found",
    });
    return;
  }

  response.status(200).json({
    user: profilePic,
  });
  return;
};
