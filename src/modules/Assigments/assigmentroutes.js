
import express from "express";

import {
  createAssignmentController,
  getAllAssignmentsController,
  getAssignmentByIdController,
  getAssignmentsByCourseController,
  getMyAssignmentsController,
  updateAssignmentController,
  deleteAssignmentController,
  toggleAssignmentStatusController,
} from "./assigmentcontroller.js";

import authMiddleware from "../../middleware/Auth/authmiddleware.js";
import roleMiddleware from "../../middleware/role/rolemiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Teacher
router.get(
  "/my",
  roleMiddleware("teacher"),
  getMyAssignmentsController
);

// Admin
router.get(
  "/",
  roleMiddleware("admin"),
  getAllAssignmentsController
);

// Student / Teacher / Admin
router.get(
  "/course/:courseId",
  roleMiddleware("admin", "teacher", "student"),
  getAssignmentsByCourseController
);

// Create: Teacher
router.post(
  "/",
  roleMiddleware("teacher"),
  createAssignmentController
);

// Toggle status: Admin / Teacher
router.patch(
  "/:id/toggle-status",
  roleMiddleware("admin", "teacher"),
  toggleAssignmentStatusController
);

// Get by ID: Admin / Teacher
router.get(
  "/:id",
  roleMiddleware("admin", "teacher"),
  getAssignmentByIdController
);

// Update: Admin / Teacher
router.put(
  "/:id",
  roleMiddleware("admin", "teacher"),
  updateAssignmentController
);

// Delete: Admin / Teacher
router.delete(
  "/:id",
  roleMiddleware("admin", "teacher"),
  deleteAssignmentController
);

export default router;
