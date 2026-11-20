
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    auth: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
    },

    adminId: {
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

    position: {
      type: String,
      trim: true,
      default: "",
    },

    bio: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
