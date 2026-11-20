
import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
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
    teacherId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    department: {
      type: String,
      trim: true,
      default: "",
    },

    specialization: {
      type: String,
      trim: true,
      default: "",
    },

    qualification: {
      type: String,
      trim: true,
      default: "",
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
