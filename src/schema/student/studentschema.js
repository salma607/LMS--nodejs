
import Joi from "joi";

export const createStudentSchema = Joi.object({
  // Auth Information
  name: Joi.string()
    .trim()
    .required(),

  firstName: Joi.string()
    .trim()
    .required(),

  lastName: Joi.string()
    .trim()
    .required(),

  email: Joi.string()
    .trim()
    .email()
    .lowercase()
    .required(),

  password: Joi.string()
    .min(8)
    .required(),

  phone: Joi.string()
    .trim()
    .allow("", null),

  profileImage: Joi.string()
    .trim()
    .allow("", null),

  // Student Information
  grade: Joi.string()
    .trim()
    .required(),

  className: Joi.string()
    .trim()
    .required(),

  parentName: Joi.string()
    .trim()
    .allow("", null),

  parentPhone: Joi.string()
    .trim()
    .allow("", null),

  courses: Joi.array()
    .items(Joi.string())
    .default([]),
});

// ==============================
// Update Student Validation
// ==============================

export const updateStudentSchema = Joi.object({
  // Auth Information
  name: Joi.string()
    .trim(),

  firstName: Joi.string()
    .trim(),

  lastName: Joi.string()
    .trim(),

  email: Joi.string()
    .trim()
    .email()
    .lowercase(),

  phone: Joi.string()
    .trim()
    .allow("", null),

  profileImage: Joi.string()
    .trim()
    .allow("", null),

  isActive: Joi.boolean(),

  // Student Information
  grade: Joi.string()
    .trim(),

  className: Joi.string()
    .trim(),

  parentName: Joi.string()
    .trim()
    .allow("", null),

  parentPhone: Joi.string()
    .trim()
    .allow("", null),

  courses: Joi.array()
    .items(Joi.string()),
})
  .min(1);
