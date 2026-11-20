import express from "express";

import {
  createStudentController,
  getAllStudentsController,
  getStudentByIdController,
  updateStudentController,
  deleteStudentController,
  getStudentProfileController,
} from "./studentcontroller.js";

import authMiddleware from "../../middleware/Auth/authmiddleware.js";
import roleMiddleware from "../../middleware/role/rolemiddleware.js";

const router = express.Router();

// Student own profile
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware("student"),
  getStudentProfileController,
);

// Admin-only student management
router.use(authMiddleware, roleMiddleware("admin"));

router.post("/", createStudentController);
router.get("/All", getAllStudentsController);
router.get("/:id", getStudentByIdController);
router.put("/:id", updateStudentController);
router.delete("/:id", deleteStudentController);

export default router;
