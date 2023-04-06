const transporter = require("../config/mail.config");

module.exports.otpVerificationMail = async (to, token) => {
  const mail = {
    from: process.env.MAIL_USERNAME,
    to: to,
    subject: "Email verification",
    template: "otp",
    context: {
      link: `${process.env.APP_CLIENT_URL}password-update?token=${token}`,
    
    },
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.log(error);
  }
};

module.exports.newAccNotification = async (email, name, password, role) => {
  const mail = {
    from: process.env.MAIL_USERNAME,
    to: email,
    subject: "Ananda College Attendance app",
    template: "newAcc",
    context: {
      clientUrl: process.env.APP_CLIENT_URL,
      name,
      password,
      role,
    },
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.log(error);
  }
};
