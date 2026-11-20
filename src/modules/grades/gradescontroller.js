
import {
  createGrade,
  getAllGrades,
  getGradeById,
  getGradesByStudent,
  getGradesByCourse,
  getGradesByAssignment,
  getMyGrades,
  updateGrade,
  deleteGrade,
} from "./gradesservice.js";

// Create Grade
export const createGradeController = async (req, res) => {
  try {
    const grade = await createGrade(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Grade created successfully",
      data: grade,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Grades
export const getAllGradesController = async (req, res) => {
  try {
    const grades = await getAllGrades();

    return res.status(200).json({
      success: true,
      count: grades.length,
      data: grades,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Grade By ID
export const getGradeByIdController = async (req, res) => {
  try {
    const grade = await getGradeById(req.params.id);

    return res.status(200).json({
      success: true,
      data: grade,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Grades By Student
export const getGradesByStudentController = async (req, res) => {
  try {
    const grades = await getGradesByStudent(req.params.studentId);

    return res.status(200).json({
      success: true,
      count: grades.length,
      data: grades,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Grades By Course
export const getGradesByCourseController = async (req, res) => {
  try {
    const grades = await getGradesByCourse(
      req.params.courseId,
      req.user
    );

    return res.status(200).json({
      success: true,
      count: grades.length,
      data: grades,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Grades By Assignment
export const getGradesByAssignmentController = async (req, res) => {
  try {
    const grades = await getGradesByAssignment(
      req.params.assignmentId,
      req.user
    );

    return res.status(200).json({
      success: true,
      count: grades.length,
      data: grades,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Grades
export const getMyGradesController = async (req, res) => {
  try {
    const grades = await getMyGrades(req.user.id);

    return res.status(200).json({
      success: true,
      count: grades.length,
      data: grades,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Grade
export const updateGradeController = async (req, res) => {
  try {
    const grade = await updateGrade(
      req.params.id,
      req.body,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Grade updated successfully",
      data: grade,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Grade
export const deleteGradeController = async (req, res) => {
  try {
    const result = await deleteGrade(req.params.id, req.user);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
