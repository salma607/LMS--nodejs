import express from "express";

import {
  markAttendanceController,
  getAllAttendanceController,
  getAttendanceByStudentController,
  getMyAttendanceController,
  updateAttendanceByStudentController,
  deleteAttendanceByStudentController,
} from "./attendancecontroller.js";

import authMiddleware from "../../middleware/Auth/authmiddleware.js";
import roleMiddleware from "../../middleware/role/rolemiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Student: View own attendance
router.get("/my", roleMiddleware("student"), getMyAttendanceController);

// Admin and Teacher: Mark attendance
router.post("/", roleMiddleware("admin", "teacher"), markAttendanceController);

// Admin: Get all attendance
router.get("/", roleMiddleware("admin"), getAllAttendanceController);

// Admin: Get attendance by student
router.get(
  "/student/:studentId",
  roleMiddleware("admin"),
  getAttendanceByStudentController,
);

// Admin and Teacher: Update attendance
router.put(
  "/student/:studentId",
  roleMiddleware("admin", "teacher"),
  updateAttendanceByStudentController,
);

// Admin and Teacher: Delete attendance
// you must put a session date in url
router.delete(
  "/student/:studentId",
  roleMiddleware("admin", "teacher"),
  deleteAttendanceByStudentController,
);

export default router;
