import bcrypt from "bcryptjs";

import Auth from "../../models/auth/auth.js";
import Teacher from "../../models/teachers/teacher.js";
import teacherRepository from "../../repository/teacherrepo.js";
import { Class } from "../../models/index.js";

// ==============================
// Generate Teacher Code
// ==============================

const generateTeacherCode = async () => {
  const lastTeacher = await Auth.findOne({
    role: "teacher",
    userId: /^TCH-\d+$/,
  }).sort({ userId: -1 });

  let nextNumber = 1;

  if (lastTeacher?.userId) {
    const lastNumber = parseInt(
      lastTeacher.userId.replace("TCH-", ""),
      10
    );

    nextNumber = lastNumber + 1;
  }

  return `TCH-${String(nextNumber).padStart(4, "0")}`;
};

// ==============================
// Create Teacher
// ==============================

export const createTeacher = async (data) => {
  const {
    name,
    firstName,
    lastName,
    email,
    password,
    phone,
    profileImage,
    department,
    specialization,
    qualification,
    experience,
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

  // 4. Generate teacher code
  const teacherCode = await generateTeacherCode();

  // 5. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 6. Create Auth account
  const auth = await Auth.create({
    userId: teacherCode,
    name: name.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "teacher",
    phone,
    profileImage,
  });

  try {
    // 7. Create Teacher profile
    const teacher = await Teacher.create({
      auth: auth._id,
      teacherId: teacherCode,
      department,
      specialization,
      qualification,
      experience,
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
      teacher,
    };
  } catch (error) {
    // Rollback Auth if Teacher creation fails
    await Auth.findByIdAndDelete(auth._id);
    throw error;
  }
};

// ==============================
// Get All Teachers
// ==============================

export const getAllTeachers = async () => {
  return await teacherRepository.findAll();
};

// ==============================
// Get Teacher By ID
// ==============================

export const getTeacherById = async (id) => {
  const teacher = await teacherRepository.findById(id);

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return teacher;
};

// ==============================
// Update Teacher Profile
// ==============================

export const updateTeacher = async (id, data) => {
  const teacher = await teacherRepository.findById(id);

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  // 1. Separate Auth information from Teacher information
  const {
    name,
    firstName,
    lastName,
    email,
    phone,
    profileImage,
    isActive,
    department,
    specialization,
    qualification,
    experience,
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
    const existingAuth = await Auth.findById(teacher.auth);

    if (!existingAuth) {
      throw new Error("Teacher Auth account not found");
    }

    // Check if email is already used by another account
    if (authData.email) {
      const emailExists = await Auth.findOne({
        email: authData.email,
        _id: { $ne: teacher.auth },
      });

      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    await Auth.findByIdAndUpdate(
      teacher.auth,
      authData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // 4. Prepare Teacher-specific information
  const teacherData = {
    department,
    specialization,
    qualification,
    experience,
    bio,
  };

  // Remove undefined values
  Object.keys(teacherData).forEach((key) => {
    if (teacherData[key] === undefined) {
      delete teacherData[key];
    }
  });

  // 5. Update Teacher information
  const updatedTeacher = await teacherRepository.updateById(
    id,
    teacherData
  );

  // 6. Get updated Auth information
  const updatedAuth = await Auth.findById(teacher.auth).select(
    "userId name firstName lastName email role phone profileImage isActive"
  );

  // 7. Return both updated documents
  return {
    auth: updatedAuth,
    teacher: updatedTeacher,
  };
};

// ==============================
// Delete Teacher
// ==============================

export const deleteTeacher = async (id) => {
  const teacher = await teacherRepository.findById(id);

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return await teacherRepository.deleteById(id);
};

// ==============================
// Get Logged-in Teacher Profile
// ==============================

export const getTeacherProfile = async (authId) => {
  const teacher = await teacherRepository.findOne({
    auth: authId,
  });

  if (!teacher) {
    throw new Error("Teacher profile not found");
  }

  return teacher;
};

// ==============================
// Get Teacher Classes
// ==============================

export const getTeacherClasses = async (authId) => {
  const teacher = await teacherRepository.findOne({
    auth: authId,
  });

  if (!teacher) {
    throw new Error("Teacher profile not found");
  }

  const classes = await Class.find({
    teacher: teacher._id,
  });

  return classes;
};