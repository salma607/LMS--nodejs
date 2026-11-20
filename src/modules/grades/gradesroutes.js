
import express from "express";
import {
  createGradeController,
  getAllGradesController,
  getGradeByIdController,
  getGradesByStudentController,
  getGradesByCourseController,
  getGradesByAssignmentController,
  getMyGradesController,
  updateGradeController,
  deleteGradeController,
} from "./gradescontroller.js";

import authMiddleware from "../../middleware/Auth/authmiddleware.js";
import roleMiddleware from "../../middleware/role/rolemiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Student: Get own grades
router.get(
  "/my",
  roleMiddleware("student"),
  getMyGradesController
);

// Admin: Get all grades
router.get(
  "/",
  roleMiddleware("admin"),
  getAllGradesController
);

// Admin: Get grades by student
router.get(
  "/student/:studentId",
  roleMiddleware("admin"),
  getGradesByStudentController
);

// Admin / Teacher: Get grades by course
router.get(
  "/course/:courseId",
  roleMiddleware("admin", "teacher"),
  getGradesByCourseController
);

// Admin / Teacher: Get grades by assignment
router.get(
  "/assignment/:assignmentId",
  roleMiddleware("admin", "teacher"),
  getGradesByAssignmentController
);

// Teacher: Create grade
router.post(
  "/",
  roleMiddleware("teacher"),
  createGradeController
);

// Admin / Teacher: Get grade by ID
router.get(
  "/:id",
  roleMiddleware("admin", "teacher"),
  getGradeByIdController
);

// Admin / Teacher: Update grade
router.put(
  "/:id",
  roleMiddleware("admin", "teacher"),
  updateGradeController
);

// Admin / Teacher: Delete grade
router.delete(
  "/:id",
  roleMiddleware("admin", "teacher"),
  deleteGradeController
);

export default router;
