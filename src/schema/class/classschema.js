import Joi from "joi";

export const classSchema = Joi.object({
  name: Joi.string().trim().required(),

  course: Joi.string().required(),

  teacher: Joi.string().required(),

  students: Joi.array().items(Joi.string()).default([]),

  room: Joi.string().trim().allow(""),

  schedule: Joi.object({
    day: Joi.string().valid(
      "Saturday",
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
    ),

    startTime: Joi.string().allow(""),

    endTime: Joi.string().allow(""),
  }),

  startDate: Joi.date().allow(null),

  endDate: Joi.date().allow(null),

  isActive: Joi.boolean().default(true),
});
