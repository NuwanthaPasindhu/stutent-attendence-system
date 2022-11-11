const transporter = require("../config/mail.config");

module.exports.otpVerificationMail = async (to, otp) => {
  const mail = {
    from: process.env.MAIL_USERNAME,
    to: to,
    subject: "OTP",
    template: "otp",
    context: {
      otp,
    },
  };
  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.log(error);
  }
};
