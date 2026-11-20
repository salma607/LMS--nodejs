
import {
  createCourse,
  getAllCourses,
  getCourseById,
  getCoursesByTeacher,
  getMyCourses,
  updateCourse,
  deleteCourse,
  toggleCourseStatus,
} from "./courseservice.js";

// ==============================
// Create Course
// ==============================

export const createCourseController = async (req, res) => {
  try {
    const course = await createCourse(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Courses
// ==============================

export const getAllCoursesController = async (req, res) => {
  try {
    const courses = await getAllCourses();

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Course By ID
// ==============================

export const getCourseByIdController = async (req, res) => {
  try {
    const course = await getCourseById(req.params.id);

    return res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Courses By Teacher
// ==============================

export const getCoursesByTeacherController = async (req, res) => {
  try {
    const courses = await getCoursesByTeacher(req.params.teacherId);

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get My Courses (Teacher)
// ==============================

export const getMyCoursesController = async (req, res) => {
  try {
    const courses = await getMyCourses(req.user.id);

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Course
// ==============================

export const updateCourseController = async (req, res) => {
  try {
    const course = await updateCourse(
      req.params.id,
      req.body,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Course
// ==============================

export const deleteCourseController = async (req, res) => {
  try {
    const result = await deleteCourse(req.params.id, req.user);

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

// ==============================
// Toggle Course Status
// ==============================

export const toggleCourseStatusController = async (req, res) => {
  try {
    const course = await toggleCourseStatus(
      req.params.id,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Course status updated successfully",
      data: course,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
