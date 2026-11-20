import Joi from "joi";

export const assignmentSchema = Joi.object({
  title: Joi.string().trim().min(2).max(100).required(),

  description: Joi.string().trim().required(),

  course: Joi.string().required(),

  class: Joi.string().allow(null, ""),

  teacher: Joi.string().required(),

  dueDate: Joi.date().required(),

  totalMarks: Joi.number().min(1).required(),

  attachment: Joi.string().uri().allow(""),

  isPublished: Joi.boolean().default(false),
});
