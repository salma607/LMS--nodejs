import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  getAdminProfile,
} from "./adminservice.js";

// ==============================
// Create Admin
// ==============================

export const createAdminController = async (req, res) => {
  try {
    const admin = await createAdmin(req.body);

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Create Admin Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Admins
// ==============================

export const getAllAdminsController = async (req, res) => {
  try {
    const admins = await getAllAdmins();

    return res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (error) {
    console.error("Get All Admins Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Admin By ID
// ==============================

export const getAdminByIdController = async (req, res) => {
  try {
    const admin = await getAdminById(req.params.id);

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get Admin Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Admin
// ==============================

export const updateAdminController = async (req, res) => {
  try {
    const admin = await updateAdmin(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    console.error("Update Admin Error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Admin
// ==============================

export const deleteAdminController = async (req, res) => {
  try {
    const result = await deleteAdmin(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    console.error("Delete Admin Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Logged-in Admin Profile
// ==============================

export const getAdminProfileController = async (req, res) => {
  try {
    const authId = req.user.id;

    const admin = await getAdminProfile(authId);

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error);

    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};