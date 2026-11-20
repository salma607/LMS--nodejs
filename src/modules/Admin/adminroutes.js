import express from "express";

import {
  createAdminController,
  getAllAdminsController,
  getAdminByIdController,
  updateAdminController,
  deleteAdminController,
  getAdminProfileController,
} from "./admincontroller.js";

import authMiddleware from "../../middleware/Auth/authmiddleware.js";
import roleMiddleware from "../../middleware/role/rolemiddleware.js";

const router = express.Router();

// ==============================
// Admin Routes
// ==============================

// Create Admin
router.post("/", createAdminController);

// Get All Admins
router.get("/", getAllAdminsController);

// Get Logged-in Admin Profile
router.get("/profile", getAdminProfileController);

// Get Admin By ID
router.get("/:id", getAdminByIdController);

// Update Admin
router.put("/:id", updateAdminController);

// Delete Admin
router.delete("/:id", deleteAdminController);

export default router;
