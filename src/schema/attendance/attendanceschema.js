import Joi from "joi";

export const attendanceSchema = Joi.object({
  student: Joi.string().required(),

  class: Joi.string().required(),

  course: Joi.string().required(),

  teacher: Joi.string().required(),

  date: Joi.date().required(),

  status: Joi.string()
    .valid("present", "absent", "late", "excused")
    .default("present"),

  notes: Joi.string().trim().allow(""),
});
