
import {
  createTeacher,
  getAllTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherProfile,
  getTeacherClasses,
} from "./teacherservice.js";

// ==============================
// Create Teacher
// ==============================

export const createTeacherController = async (req, res) => {
  try {
    const teacher = await createTeacher(req.body);

    return res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Create Teacher Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Teachers
// ==============================

export const getAllTeachersController = async (req, res) => {
  try {
    const teachers = await getAllTeachers();

    return res.status(200).json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (error) {
    console.error("Get All Teachers Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Teacher By ID
// ==============================

export const getTeacherByIdController = async (req, res) => {
  try {
    const teacher = await getTeacherById(req.params.id);

    return res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Get Teacher Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Teacher
// ==============================

export const updateTeacherController = async (req, res) => {
  try {
    const teacher = await updateTeacher(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Update Teacher Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Teacher
// ==============================

export const deleteTeacherController = async (req, res) => {
  try {
    const teacher = await deleteTeacher(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Teacher deleted successfully",
      data: teacher,
    });
  } catch (error) {
    console.error("Delete Teacher Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Logged-in Teacher Profile
// ==============================

export const getTeacherProfileController = async (req, res) => {
  try {
    const authId = req.user.id;

    const teacher = await getTeacherProfile(authId);

    return res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Get Teacher Profile Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Teacher Classes
// ==============================

export const getTeacherClassesController = async (req, res) => {
  try {
    const authId = req.user.id;

    const classes = await getTeacherClasses(authId);

    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    console.error("Get Teacher Classes Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
