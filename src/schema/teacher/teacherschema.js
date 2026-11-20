
import Joi from "joi";

export const teacherSchema = Joi.object({
  user: Joi.string()
    .required(),

  teacherId: Joi.string()
    .trim()
    .required(),

  specialization: Joi.string()
    .trim()
    .required(),

  qualification: Joi.string()
    .trim()
    .allow(""),

  experience: Joi.number()
    .min(0)
    .default(0),

  department: Joi.string()
    .trim()
    .allow(""),

  hireDate: Joi.date()
    .default(Date.now),

  isActive: Joi.boolean()
    .default(true),
});

