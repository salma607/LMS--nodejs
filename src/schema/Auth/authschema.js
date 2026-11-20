
import Joi from "joi";

// Register
export const registerSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),

  lastName: Joi.string().trim().min(2).max(50).required(),

  email: Joi.string().email().lowercase().trim().required(),

  password: Joi.string().min(6).max(100).required(),

  role: Joi.string()
    .valid("student", "teacher", "admin")
    .default("student"),

  phone: Joi.string().trim().allow(""),

  profileImage: Joi.string().uri().allow(""),
});

// Login
export const loginSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),

  password: Joi.string().required(),
});

// Change password
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),

  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
    }),
});

// Forgot password
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().trim().required(),
});

// Reset password
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),

  newPassword: Joi.string()
    .min(6)
    .max(100)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .messages({
      "any.only": "Passwords do not match",
    }),
});

