const bcrypt = require("bcryptjs");

module.exports.hashPassword = (password) => {
  const salt = bcrypt.genSaltSync(10);
  const hashPassword = bcrypt.hashSync(password, salt);

  return hashPassword;
};

module.exports.comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};

module.exports.randomPasswordGenerator = () => {
  const length = 8;
  const charList =
    "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789!@#$%^&*()_-+=[{}]|:<,.>?/";
  let randomPassword = "";
  for (let i = 0, n = charList.length; i < length; ++i) {
    randomPassword += charList.charAt(Math.floor(Math.random() * n));
  }

  return randomPassword.toString();
};
