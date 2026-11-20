
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Auth from "../../models/auth/auth.js";

// ==============================
// Generate JWT
// ==============================

const generateToken = (auth) => {
  return jwt.sign(
    {
      id: auth._id,
      role: auth.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// ==============================
// Login
// ==============================

export const loginUser = async (email, password) => {
  const normalizedEmail = email?.trim().toLowerCase();

  const auth = await Auth.findOne({
    email: normalizedEmail,
  }).select("+password");

  if (!auth) {
    throw new Error("Invalid email or password");
  }

  if (!auth.isActive) {
    throw new Error("Your account is inactive");
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    auth.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Invalid email or password");
  }

  auth.lastLogin = new Date();
  await auth.save();

  return {
    token: generateToken(auth),
    auth: {
      _id: auth._id,
      userId: auth.userId,
      firstName: auth.firstName,
      lastName: auth.lastName,
      email: auth.email,
      role: auth.role,
      phone: auth.phone,
      profileImage: auth.profileImage,
    },
  };
};

// ==============================
// Update Account
// ==============================

export const updateUser = async (authId, data) => {
  const auth = await Auth.findById(authId);

  if (!auth) {
    throw new Error("Account not found");
  }

  const allowedFields = [
    "firstName",
    "lastName",
    "email",
    "phone",
    "profileImage",
  ];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      auth[field] =
        field === "email"
          ? data[field].trim().toLowerCase()
          : data[field];
    }
  }

  const existingAuth = await Auth.findOne({
    email: auth.email,
    _id: { $ne: auth._id },
  });

  if (existingAuth) {
    throw new Error("Email already exists");
  }

  await auth.save();

  return {
    _id: auth._id,
    userId: auth.userId,
    firstName: auth.firstName,
    lastName: auth.lastName,
    email: auth.email,
    role: auth.role,
    phone: auth.phone,
    profileImage: auth.profileImage,
  };
};

// ==============================
// Change Password
// ==============================

export const changeUserPassword = async (
  authId,
  currentPassword,
  newPassword
) => {
  const auth = await Auth.findById(authId).select("+password");

  if (!auth) {
    throw new Error("Account not found");
  }

  const isPasswordCorrect = await bcrypt.compare(
    currentPassword,
    auth.password
  );

  if (!isPasswordCorrect) {
    throw new Error("Current password is incorrect");
  }

  auth.password = await bcrypt.hash(newPassword, 10);
  auth.passwordChangedAt = new Date();

  await auth.save();

  return true;
};

// ==============================
// Forgot Password
// ==============================

export const forgotUserPassword = async (email) => {
  const normalizedEmail = email?.trim().toLowerCase();

  const auth = await Auth.findOne({
    email: normalizedEmail,
  });

  if (!auth) {
    throw new Error("Account not found");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  auth.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  auth.resetPasswordExpires = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await auth.save();

  // Development only: return token.
  // Production: send reset link by email.

  return resetToken;
};

// ==============================
// Reset Password
// ==============================

export const resetUserPassword = async (token, newPassword) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const auth = await Auth.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!auth) {
    throw new Error("Invalid or expired reset token");
  }

  auth.password = await bcrypt.hash(newPassword, 10);
  auth.passwordChangedAt = new Date();

  auth.resetPasswordToken = null;
  auth.resetPasswordExpires = null;

  await auth.save();

  return true;
};
