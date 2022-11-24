const Joi = require("joi");

const validator = (Schema) => (payload) =>
  Schema.validate(payload, { abortEarly: false });

const sectionValidationSchema = Joi.object({
  section: Joi.string().required().trim(),
  year: Joi.date().required(),
  userID: Joi.string().required().trim(),
});

const teacherValidationSchema = Joi.object({
  sectionClass: Joi.string().required().trim(),
  userID: Joi.string().required().trim(),
});

const newUserValidationSchema = Joi.object({
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

module.exports.validatedNewUser = validator(newUserValidationSchema);
module.exports.validatedSection = validator(sectionValidationSchema);
module.exports.validatedTeacher = validator(teacherValidationSchema);
