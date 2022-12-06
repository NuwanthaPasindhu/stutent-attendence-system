const {
  USER_ROLE_ADMIN,
  USER_ROLE_SECTION_HEAD,
  USER_ROLE_TEACHER,
} = require("../enum");

const adminRoleCheck = async (request, response, next) => {
  if (request.user.role === USER_ROLE_ADMIN) {
    next();
  } else {
    response.status(401).json({
      status: 401,
      message: "You don't have permission to do this",
    });
    return;
  }
};

module.exports.adminRoleCheck = adminRoleCheck;

const sectionHeadRoleCheck = async (request, response, next) => {
  if (request.user.role === USER_ROLE_SECTION_HEAD || USER_ROLE_ADMIN) {
    next();
  } else {
    response.status(401).json({
      status: 401,
      message: "You don't have permission to do this",
    });
    return;
  }
};

module.exports.sectionHeadRoleCheck = sectionHeadRoleCheck;

const teacherRoleCheck = async (request, response, next) => {
  if (
    request.user.role === USER_ROLE_SECTION_HEAD ||
    USER_ROLE_ADMIN ||
    USER_ROLE_TEACHER
  ) {
    next();
  } else {
    response.status(401).json({
      status: 401,
      message: "You don't have permission to do this",
    });
    return;
  }
};

module.exports.teacherRoleCheck = teacherRoleCheck;
