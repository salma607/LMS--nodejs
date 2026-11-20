
import {
  createAssignment,
  getAllAssignments,
  getAssignmentById,
  getAssignmentsByCourse,
  getMyAssignments,
  updateAssignment,
  deleteAssignment,
  toggleAssignmentStatus,
} from "./assigmentservice.js";

// CREATE
export const createAssignmentController = async (req, res) => {
  try {
    const assignment = await createAssignment(req.body, req.user);

    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL
export const getAllAssignmentsController = async (req, res) => {
  try {
    const assignments = await getAllAssignments();

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BY ID
export const getAssignmentByIdController = async (req, res) => {
  try {
    const assignment = await getAssignmentById(req.params.id);

    res.status(200).json({
      success: true,
      data: assignment,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// GET BY COURSE
export const getAssignmentsByCourseController = async (req, res) => {
  try {
    const assignments = await getAssignmentsByCourse(
      req.params.courseId,
      req.user
    );

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MY ASSIGNMENTS
export const getMyAssignmentsController = async (req, res) => {
  try {
    const assignments = await getMyAssignments(req.user.id);

    res.status(200).json({
      success: true,
      count: assignments.length,
      data: assignments,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE
export const updateAssignmentController = async (req, res) => {
  try {
    const assignment = await updateAssignment(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE
export const deleteAssignmentController = async (req, res) => {
  try {
    const result = await deleteAssignment(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// TOGGLE STATUS
export const toggleAssignmentStatusController = async (req, res) => {
  try {
    const assignment = await toggleAssignmentStatus(
      req.params.id,
      req.user
    );

    res.status(200).json({
      success: true,
      message: "Assignment status updated successfully",
      data: assignment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
