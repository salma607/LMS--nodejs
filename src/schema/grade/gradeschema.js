import Joi from "joi";

export const gradeSchema = Joi.object({
  student: Joi.string().required(),

  assignment: Joi.string().required(),

  course: Joi.string().required(),

  marks: Joi.number().min(0).required(),

  totalMarks: Joi.number().min(1).required(),

  feedback: Joi.string().trim().allow(""),

  gradedBy: Joi.string().required(),

  gradedAt: Joi.date().default(Date.now),
});
