
import Joi from "joi";

export const courseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required(),

  description: Joi.string()
    .trim()
    .required(),

  code: Joi.string()
    .trim()
    .uppercase()
    .required(),

  teacher: Joi.string()
    .required(),

  category: Joi.string()
    .trim()
    .allow(""),

  level: Joi.string()
    .valid("beginner", "intermediate", "advanced")
    .default("beginner"),

  duration: Joi.number()
    .min(1)
    .allow(null),

  maxStudents: Joi.number()
    .min(1)
    .default(30),

  isActive: Joi.boolean()
    .default(true),
});

