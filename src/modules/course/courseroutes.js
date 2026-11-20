
import express from "express";

import {
  createCourseController,
  getAllCoursesController,
  getCourseByIdController,
  getCoursesByTeacherController,
  getMyCoursesController,
  updateCourseController,
  deleteCourseController,
  toggleCourseStatusController,
} from "./coursecontroller.js";

import authMiddleware from "../../middleware/Auth/authmiddleware.js";
import roleMiddleware from "../../middleware/role/rolemiddleware.js";

const router = express.Router();

// All course routes require authentication
router.use(authMiddleware);

// Teacher: Get own courses
router.get(
  "/my",
  roleMiddleware("teacher"),
  getMyCoursesController
);

// Admin / Teacher: Create course
router.post(
  "/",
  roleMiddleware("admin", "teacher"),
  createCourseController
);

// Admin / Teacher: Get all courses
router.get(
  "/",
  roleMiddleware("admin", "teacher"),
  getAllCoursesController
);

// Admin / Teacher: Get courses by teacher
router.get(
  "/teacher/:teacherId",
  roleMiddleware("admin", "teacher"),
  getCoursesByTeacherController
);

// Admin / Teacher: Get course by ID
router.get(
  "/:id",
  roleMiddleware("admin", "teacher"),
  getCourseByIdController
);

// Admin / Teacher: Update course
router.put(
  "/:id",
  roleMiddleware("admin", "teacher"),
  updateCourseController
);

// Admin / Teacher: Delete course
router.delete(
  "/:id",
  roleMiddleware("admin", "teacher"),
  deleteCourseController
);

// Admin / Teacher: Activate / Deactivate course
router.patch(
  "/:id/status",
  roleMiddleware("admin", "teacher"),
  toggleCourseStatusController
);

export default router;
