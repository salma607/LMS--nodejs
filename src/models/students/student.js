
import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // Auth account reference
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
    },
 email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    // Student Code
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Academic Information
    grade: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
      trim: true,
    },

    // Parent Information
    parentName: {
      type: String,
      trim: true,
      default: "",
    },

    parentPhone: {
      type: String,
      trim: true,
      default: "",
    },

    // Attendance
    attendancePercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    // Courses
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;
