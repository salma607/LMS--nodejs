
import {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getStudentProfile,
} from "./studentservice.js";

// ==============================
// Create Student
// ==============================

export const createStudentController = async (req, res) => {
  try {
    const student = await createStudent(req.body);

    return res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: student,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Students
// ==============================

export const getAllStudentsController = async (req, res) => {
  try {
    const students = await getAllStudents();

    return res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Student By ID
// ==============================

export const getStudentByIdController = async (req, res) => {
  try {
    const student = await getStudentById(req.params.id);

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Student
// ==============================

export const updateStudentController = async (req, res) => {
  try {
    const student = await updateStudent(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Student
// ==============================

export const deleteStudentController = async (req, res) => {
  try {
    const result = await deleteStudent(req.params.id);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Logged-in Student Profile
// ==============================

export const getStudentProfileController = async (req, res) => {
  try {
    const student = await getStudentProfile(req.user.id);

    return res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};
