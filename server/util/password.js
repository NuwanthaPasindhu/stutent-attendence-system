const bcrypt = require("bcryptjs");

module.exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  return hashPassword;
};

module.exports.comparePassword = (password, hashPassword) => { 
    return bcrypt.compareSync(password, hashPassword);
}
