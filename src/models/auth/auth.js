
import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    // ==============================
    // Account ID
    // ==============================

    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // ==============================
    // Personal Information
    // ==============================

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    // ==============================
    // Authentication
    // ==============================

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: "student",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ==============================
    // Password Reset
    // ==============================

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },

    // ==============================
    // Login Information
    // ==============================

    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ==============================
// Model
// ==============================

const Auth = mongoose.model("Auth", authSchema);

export default Auth;
