
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    sessionDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
      default: "present",
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// One attendance record per student, class and date
attendanceSchema.index(
  {
    student: 1,
    class: 1,
    sessionDate: 1,
  },
  {
    unique: true,
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
