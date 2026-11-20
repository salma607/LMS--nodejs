
import Attendance from "../../models/attendance/attendance.js";
import Student from "../../models/students/student.js";

// ==============================
// Normalize Session Date
// ==============================

const normalizeSessionDate = (date) => {
  const sessionDate =
    typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? new Date(`${date}T00:00:00.000Z`)
      : new Date(date);

  if (Number.isNaN(sessionDate.getTime())) {
    throw new Error("Invalid session date");
  }

  sessionDate.setUTCHours(0, 0, 0, 0);

  return sessionDate;
};

// ==============================
// Check Permission
// ==============================

const checkPermission = (authUser) => {
  if (!authUser || !["admin", "teacher"].includes(authUser.role)) {
    throw new Error("You do not have permission to manage attendance");
  }
};

// ==============================
// Calculate Student Attendance
// ==============================

export const calculateStudentAttendance = async (studentId) => {
  const records = await Attendance.find({
    student: studentId,
    status: { $in: ["present", "absent", "late"] },
  }).select("status");

  const totalSessions = records.length;

  const attendedSessions = records.filter(
    (record) =>
      record.status === "present" || record.status === "late"
  ).length;

  const percentage =
    totalSessions === 0
      ? 0
      : Number(
          ((attendedSessions / totalSessions) * 100).toFixed(2)
        );

  await Student.findByIdAndUpdate(studentId, {
    attendancePercentage: percentage,
  });

  return percentage;
};

// ==============================
// Mark Attendance
// ==============================

export const markAttendance = async (data, authUser) => {
  checkPermission(authUser);

  const { student, sessionDate, status, remarks } = data;

  if (!student || !sessionDate || !status) {
    throw new Error(
      "Student, session date and status are required"
    );
  }

  const studentData = await Student.findById(student);

  if (!studentData) {
    throw new Error("Student not found");
  }

  const normalizedDate = normalizeSessionDate(sessionDate);

  const attendance = await Attendance.create({
    student,
    sessionDate: normalizedDate,
    status,
    remarks,
    markedBy: authUser.id,
  });

  await calculateStudentAttendance(student);

  return await Attendance.findById(attendance._id)
    .populate({
      path: "student",
      populate: {
        path: "auth",
        select: "userId name firstName lastName email",
      },
    })
    .populate("markedBy", "name email");
};

// ==============================
// Get All Attendance
// ==============================

export const getAllAttendance = async () => {
  return await Attendance.find()
    .populate({
      path: "student",
      populate: {
        path: "auth",
        select: "userId name firstName lastName email",
      },
    })
    .populate("markedBy", "name email")
    .sort({ sessionDate: -1 });
};

// ==============================
// Get Attendance By Student
// Admin Only
// ==============================

export const getAttendanceByStudent = async (studentId) => {
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  return await Attendance.find({
    student: studentId,
  })
    .populate("markedBy", "name email")
    .sort({ sessionDate: -1 });
};

// ==============================
// Get Logged-in Student Attendance
// ==============================

export const getMyAttendance = async (authId) => {
  const student = await Student.findOne({
    auth: authId,
  });

  if (!student) {
    throw new Error("Student profile not found");
  }

  return await Attendance.find({
    student: student._id,
  })
    .populate("markedBy", "name email")
    .sort({ sessionDate: -1 });
};

// ==============================
// Update Attendance
// ==============================

export const updateAttendanceByStudent = async (
  studentId,
  sessionDate,
  data,
  authUser
) => {
  checkPermission(authUser);

  if (!sessionDate) {
    throw new Error("Session date is required");
  }

const date = normalizeSessionDate(sessionDate);

  const attendance = await Attendance.findOne({
    student: studentId,
    sessionDate: date,
  });

  if (!attendance) {
    throw new Error("Attendance record not found");
  }

  const { status, remarks } = data;

  if (status === undefined && remarks === undefined) {
    throw new Error("Please provide status or remarks to update");
  }

  const updatedAttendance = await Attendance.findByIdAndUpdate(
    attendance._id,
    {
      ...(status !== undefined && { status }),
      ...(remarks !== undefined && { remarks }),
    },
    { new: true, runValidators: true }
  )
    .populate({
      path: "student",
      populate: {
        path: "auth",
        select: "userId name firstName lastName email",
      },
    })
    .populate("markedBy", "name email");

  await calculateStudentAttendance(studentId);

  return updatedAttendance;
};
// ==============================
// Delete Attendance
// ==============================

export const deleteAttendanceByStudent = async (
  studentId,
  sessionDate,
  authUser
) => {
  checkPermission(authUser);

  if (!sessionDate) {
    throw new Error("Session date is required");
  }

  const date = normalizeSessionDate(sessionDate);

  const attendance = await Attendance.findOne({
    student: studentId,
    sessionDate: date,
  });

  if (!attendance) {
    throw new Error("Attendance record not found");
  }

  await Attendance.findByIdAndDelete(attendance._id);

  const attendancePercentage =
    await calculateStudentAttendance(studentId);

  return {
    message: "Student attendance deleted successfully",
    attendancePercentage,
  };
};
