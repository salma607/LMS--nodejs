import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    marks: {
      type: Number,
      required: true,
      min: 0,
    },

    totalMarks: {
      type: Number,
      required: true,
      min: 1,
    },

    feedback: {
      type: String,
      trim: true,
      default: "",
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    gradedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;