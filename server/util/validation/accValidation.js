const Joi = require('joi');

const validator = (Schema) => (payload) =>
  Schema.validate(payload, { abortEarly: false });

const sectionValidationSchema = Joi.object({
  section: Joi.string().required().trim(),
  year: Joi.date().required(),
  SectionHeadName: Joi.string().required(),
  email: Joi.string().required().email(),
  mobileNumber: Joi.string()
    .trim()
    .max(11)
    .min(10)
    .required()
    .label("Mobile Number"),
});

const teacherValidationSchema = Joi.object({
  class: Joi.string().required().trim(),
  year: Joi.date().required(),
  classTeacherName: Joi.string().required(),
  email: Joi.string().required().email(),
  mobileNumber: Joi.string()
    .trim()
    .max(11)
    .min(10)
    .required()
    .label("Mobile Number"),
});

module.exports.validatedSection = validator(sectionValidationSchema);
module.exports.validatedTeacher = validator(teacherValidationSchema);