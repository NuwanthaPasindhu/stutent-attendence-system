const Joi = require("joi");

const validator = (Schema) => (payload) =>
  Schema.validate(payload, { abortEarly: false });

const sectionValidationSchema = Joi.object({
  section: Joi.string().required().trim(),
  year: Joi.date().required(),
  userID: Joi.string().required().trim(),
});

const teacherValidationSchema = Joi.object({
  class: Joi.string().required().trim(),
  year: Joi.date().required(),
});

module.exports.validatedSection = validator(sectionValidationSchema);
module.exports.validatedTeacher = validator(teacherValidationSchema);
