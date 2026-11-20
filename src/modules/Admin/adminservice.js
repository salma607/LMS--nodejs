import bcrypt from "bcryptjs";

import Auth from "../../models/auth/auth.js";
import Admin from "../../models/admin/admin.js";

// ==============================
// Generate Admin Code
// ==============================

const generateAdminCode = async () => {
  const lastAdmin = await Admin.findOne({
    adminId: /^ADM-\d+$/,
  }).sort({ adminId: -1 });

  let nextNumber = 1;

  if (lastAdmin?.adminId) {
    const lastNumber = parseInt(
      lastAdmin.adminId.replace("ADM-", ""),
      10
    );

    nextNumber = lastNumber + 1;
  }

  return `ADM-${String(nextNumber).padStart(4, "0")}`;
};

// ==============================
// Create Admin
// ==============================

export const createAdmin = async (data) => {
  const {
    name,
    firstName,
    lastName,
    email,
    password,
    phone,
    profileImage,
    department,
    position,
    bio,
  } = data;

  // 1. Validate required information
  if (!name || !firstName || !lastName || !email || !password) {
    throw new Error(
      "Name, first name, last name, email and password are required"
    );
  }

  // 2. Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // 3. Check existing account
  const existingAuth = await Auth.findOne({
    email: normalizedEmail,
  });

  if (existingAuth) {
    throw new Error("Email already exists");
  }

  // 4. Generate Admin code
  const adminCode = await generateAdminCode();

  // 5. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 6. Create Auth account
  const auth = await Auth.create({
    userId: adminCode,
    name: name.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "admin",
    phone,
    profileImage,
  });

  try {
    // 7. Create Admin profile
    const admin = await Admin.create({
      auth: auth._id,
      adminId: adminCode,
      department,
      position,
      bio,
    });

    // 8. Return created data
    return {
      auth: {
        _id: auth._id,
        userId: auth.userId,
        name: auth.name,
        firstName: auth.firstName,
        lastName: auth.lastName,
        email: auth.email,
        role: auth.role,
        phone: auth.phone,
        profileImage: auth.profileImage,
      },
      admin,
    };
  } catch (error) {
    // Rollback Auth if Admin creation fails
    await Auth.findByIdAndDelete(auth._id);
    throw error;
  }
};

// ==============================
// Get All Admins
// ==============================

export const getAllAdmins = async () => {
  return await Admin.find()
    .populate(
      "auth",
      "userId name firstName lastName email role phone profileImage isActive"
    )
    .sort({ createdAt: -1 });
};

// ==============================
// Get Admin By ID
// ==============================

export const getAdminById = async (id) => {
  const admin = await Admin.findById(id).populate(
    "auth",
    "userId name firstName lastName email role phone profileImage isActive"
  );

  if (!admin) {
    throw new Error("Admin not found");
  }

  return admin;
};

// ==============================
// Update Admin Profile
// ==============================

export const updateAdmin = async (id, data) => {
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new Error("Admin not found");
  }

  // 1. Separate Auth information from Admin information
  const {
    name,
    firstName,
    lastName,
    email,
    phone,
    profileImage,
    isActive,
    department,
    position,
    bio,
  } = data;

  // 2. Prepare Auth information
  const authData = {
    name,
    firstName,
    lastName,
    email: email?.trim().toLowerCase(),
    phone,
    profileImage,
    isActive,
  };

  // Remove undefined values
  Object.keys(authData).forEach((key) => {
    if (authData[key] === undefined) {
      delete authData[key];
    }
  });

  // 3. Update Auth information
  if (Object.keys(authData).length > 0) {
    const existingAuth = await Auth.findById(admin.auth);

    if (!existingAuth) {
      throw new Error("Admin Auth account not found");
    }

    // Check if email is already used by another account
    if (authData.email) {
      const emailExists = await Auth.findOne({
        email: authData.email,
        _id: { $ne: admin.auth },
      });

      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    await Auth.findByIdAndUpdate(
      admin.auth,
      authData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // 4. Prepare Admin-specific information
  const adminData = {
    department,
    position,
    bio,
  };

  // Remove undefined values
  Object.keys(adminData).forEach((key) => {
    if (adminData[key] === undefined) {
      delete adminData[key];
    }
  });

  // 5. Update Admin information
  const updatedAdmin = await Admin.findByIdAndUpdate(
    id,
    adminData,
    {
      new: true,
      runValidators: true,
    }
  );

  // 6. Get updated Auth information
  const updatedAuth = await Auth.findById(admin.auth).select(
    "userId name firstName lastName email role phone profileImage isActive"
  );

  // 7. Return both updated documents
  return {
    auth: updatedAuth,
    admin: updatedAdmin,
  };
};

// ==============================
// Delete Admin
// ==============================

export const deleteAdmin = async (id) => {
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new Error("Admin not found");
  }

  // Delete related Auth account
  await Auth.findByIdAndDelete(admin.auth);

  // Delete Admin profile
  await Admin.findByIdAndDelete(id);

  return {
    message: "Admin deleted successfully",
  };
};

// ==============================
// Get Logged-in Admin Profile
// ==============================

export const getAdminProfile = async (authId) => {
  const admin = await Admin.findOne({
    auth: authId,
  }).populate(
    "auth",
    "userId name firstName lastName email role phone profileImage isActive"
  );

  if (!admin) {
    throw new Error("Admin profile not found");
  }

  return admin;
};