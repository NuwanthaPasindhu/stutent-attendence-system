const Joi = require("joi");

const validator = (Schema) => (payload) =>
  Schema.validate(payload, { abortEarly: false });

const profileCompleteValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().trim().required().min(8),
  fullName: Joi.string().trim().required().label("Full Name"),
  mobileNumber: Joi.string()
    .trim()
    .max(11)
    .min(10)
    .required()
    .label("Mobile Number"),
  address: Joi.string().trim().required(),
  id: Joi.string().required().trim(),
});

const profileUpdateValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  fullName: Joi.string().trim().required().label("Full Name"),
  mobileNumber: Joi.string()
    .trim()
    .max(11)
    .min(10)
    .required()
    .label("Mobile Number"),
  address: Joi.string().trim().required(),
});
const loginValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().trim().required().min(8),
});

const passwordValidationSchema = Joi.object({
  password: Joi.string().trim().required().min(8),
});
const profilePicValidationSchema = Joi.object({
  id: Joi.string().required().trim(),
});

const resendOtpValidationSchema = Joi.object({
  email: Joi.string().required().email(),
});
const otpValidationSchema = Joi.object({
  otp: Joi.number().required(),
});

module.exports.validateLogin = validator(loginValidationSchema);
module.exports.validateResendOtp = validator(resendOtpValidationSchema);
module.exports.validateOtp = validator(otpValidationSchema);
module.exports.validateProfilePic = validator(profilePicValidationSchema);
module.exports.validateProfileComplete = validator(
  profileCompleteValidationSchema
);
module.exports. validatedUpdateProfile = validator(
  profileUpdateValidationSchema
);
module.exports.validatedPassword = validator(passwordValidationSchema);
