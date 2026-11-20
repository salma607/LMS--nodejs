
import Joi from "joi";

export const userSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required(),

  email: Joi.string()
    .email()
    .lowercase()
    .trim()
    .required(),

  password: Joi.string()
    .min(6)
    .max(100)
    .required(),

  role: Joi.string()
    .valid("student", "teacher", "admin")
    .default("student"),

  phone: Joi.string()
    .trim()
    .allow(""),

  profileImage: Joi.string()
    .uri()
    .allow(""),

  isActive: Joi.boolean()
    .default(true),
});
