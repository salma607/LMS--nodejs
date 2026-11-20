import express from "express";

import {
  createTeacherController,
  getAllTeachersController,
  getTeacherByIdController,
  updateTeacherController,
  deleteTeacherController,
  getTeacherProfileController,
  getTeacherClassesController,
} from "./teachercontroller.js";

import authMiddleware from "../../middleware/Auth/authmiddleware.js";
import roleMiddleware from "../../middleware/role/rolemiddleware.js";

const router = express.Router();

// Admin can manage all teachers
router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createTeacherController
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  getAllTeachersController
);

router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("teacher"),
  getTeacherProfileController
);

router.get(
  "/classes",
  authMiddleware,
  roleMiddleware("teacher"),
  getTeacherClassesController
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  getTeacherByIdController
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateTeacherController
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteTeacherController
);

export default router;