import {
  loginUser,
  updateUser,
  changeUserPassword,
  forgotUserPassword,
  resetUserPassword,

} from "./authservice.js";


// ==============================
// Login
// ==============================

export const login = async (req, res) => {
  try {

    const {
      email,
      password,
    } = req.body;

    const result = await loginUser(
      email,
      password
    );

    res.status(200).json({
      message: "Login successful",
      ...result,
    });

  } catch (error) {

    if (
      error.message ===
      "Invalid email or password"
    ) {
      return res.status(401).json({
        message: error.message,
      });
    }

    if (
      error.message ===
      "Your account is inactive"
    ) {
      return res.status(403).json({
        message: error.message,
      });
    }
    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
// ==============================
// Get Current User
// ==============================

export const getMe = async (req, res) => {
  try {

    const user = await getCurrentUser(
      req.user.id
    );

    res.status(200).json({
      user,
    });

  } catch (error) {

    if (
      error.message ===
      "User not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to get user",
      error: error.message,
    });
  }
};


// ==============================
// Update Profile
// ==============================

export const updateUserProfile = async (
  req,
  res
) => {
  try {

    const user = await updateUser(
      req.user.id,
      req.body
    );

    res.status(200).json({
      message: "User updated successfully",
      user,
    });

  } catch (error) {

    if (
      error.message ===
      "User not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error.message ===
      "Email already exists"
    ) {
      return res.status(409).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: "Failed to update user",
      error: error.message,
    });
  }
};


// ==============================
// Change Password
// ==============================

export const changePassword = async (
  req,
  res
) => {
  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    await changeUserPassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      message:
        "Password changed successfully",
    });

  } catch (error) {

    if (
      error.message ===
      "User not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    if (
      error.message ===
      "Current password is incorrect"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message:
        "Failed to change password",
      error: error.message,
    });
  }
};


// ==============================
// Forgot Password
// ==============================

export const forgotPassword = async (
  req,
  res
) => {
  try {

    const {
      email,
    } = req.body;

    const resetToken =
      await forgotUserPassword(email);

    res.status(200).json({
      message:
        "Password reset token generated",
      resetToken,
    });

  } catch (error) {

    if (
      error.message ===
      "User not found"
    ) {
      return res.status(404).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message:
        "Forgot password failed",
      error: error.message,
    });
  }
};


// ==============================
// Reset Password
// ==============================

export const resetPassword = async (
  req,
  res
) => {
  try {

    const {
      token,
      newPassword,
    } = req.body;

    await resetUserPassword(
      token,
      newPassword
    );

    res.status(200).json({
      message:
        "Password reset successfully",
    });

  } catch (error) {

    if (
      error.message ===
      "Invalid or expired reset token"
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message:
        "Reset password failed",
      error: error.message,
    });
  }
};