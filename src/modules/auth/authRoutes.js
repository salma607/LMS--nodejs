import express from "express";

import {
  login,
  updateUserProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} from "./authcontroller.js";

import authMiddleware from "../../middleware/Auth/authmiddleware.js";

const router = express.Router();

// Login
router.post("/login", login);

// Update Account
router.put("/profile", authMiddleware, updateUserProfile);

// Change Password
router.patch("/change-password", authMiddleware, changePassword);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

export default router;