
import {
  markAttendance,
  getAllAttendance,
  getAttendanceByStudent,
  getMyAttendance,
  updateAttendanceByStudent,
 deleteAttendanceByStudent,
} from "./attendanceservice.js";

// ==============================
// Mark Attendance
// ==============================

export const markAttendanceController = async (req, res) => {
  try {
    const attendance = await markAttendance(req.body, req.user);

    return res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Attendance
// ==============================

export const getAllAttendanceController = async (req, res) => {
  try {
    const attendance = await getAllAttendance();

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Attendance By Student
// ==============================

export const getAttendanceByStudentController = async (req, res) => {
  try {
    const attendance = await getAttendanceByStudent(
      req.params.studentId
    );

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get My Attendance
// ==============================

export const getMyAttendanceController = async (req, res) => {
  try {
    const attendance = await getMyAttendance(req.user.id);

    return res.status(200).json({
      success: true,
      count: attendance.length,
      data: attendance,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Attendance
// ==============================

// ==============================
// Update Attendance By Student ID
// ==============================

export const updateAttendanceByStudentController = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { sessionDate } = req.body;

    const attendance = await updateAttendanceByStudent(
      studentId,
      sessionDate,
      req.body,
      req.user
    );

    return res.status(200).json({
      success: true,
      message: "Student attendance updated successfully",
      data: attendance,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
// ==============================
// Delete Attendance
// ==============================

export const deleteAttendanceByStudentController = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { sessionDate } = req.query;

    const result = await deleteAttendanceByStudent(
      studentId,
      sessionDate, 
      req.user
    );

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