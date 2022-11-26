const Joi = require("joi");

const validator = (Schema) => (payload) =>
  Schema.validate(payload, { abortEarly: false });

const newStudentValidationSchema = Joi.object({
  fullName: Joi.string().trim().required().label("Full Name"),
  motherName: Joi.string().trim().required().label("Mother Name"),
  fatherName: Joi.string().trim().required().label("Father Name"),
  mobileNumber: Joi.string()
    .trim()
    .max(11)
    .min(10)
    .required()
    .label("Mobile Number"),
  address: Joi.string().trim().required(),
  admissionNumber: Joi.number().required().label("Admission Number"),
});
module.exports.validatedStudent = validator(newStudentValidationSchema);
