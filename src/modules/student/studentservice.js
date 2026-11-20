
import bcrypt from "bcryptjs";

import Auth from "../../models/auth/auth.js";
import Student from "../../models/students/student.js";

// ==============================
// Generate Student Code
// ==============================

const generateStudentCode = async () => {
  const lastStudent = await Student.findOne({
    studentId: /^STD-\d+$/,
  }).sort({ studentId: -1 });

  let nextNumber = 1;

  if (lastStudent?.studentId) {
    const lastNumber = parseInt(
      lastStudent.studentId.replace("STD-", ""),
      10
    );

    nextNumber = lastNumber + 1;
  }

  return `STD-${String(nextNumber).padStart(4, "0")}`;
};

// ==============================
// Create Student
// ==============================

export const createStudent = async (data) => {
  const {
    name,
    firstName,
    lastName,
    email,
    password,
    phone,
    profileImage,
    grade,
    className,
    parentName,
    parentPhone,
    courses,
  } = data;

  // 1. Validate required information
  if (
    !name ||
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !grade ||
    !className
  ) {
    throw new Error(
      "Name, first name, last name, email, password, grade and class are required"
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

  // 4. Generate Student Code
  const studentCode = await generateStudentCode();

  // 5. Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 6. Create Auth account
  const auth = await Auth.create({
    userId: studentCode,
    name: name.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role: "student",
    phone,
    profileImage,
  });

  try {
    // 7. Create Student profile
    const student = await Student.create({
      auth: auth._id,
      studentId: studentCode,
      grade,
      className,
      parentName,
      parentPhone,
      courses,
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
      student,
    };
  } catch (error) {
    // Rollback Auth if Student creation fails
    await Auth.findByIdAndDelete(auth._id);
    throw error;
  }
};

// ==============================
// Get All Students
// ==============================

export const getAllStudents = async () => {
  return await Student.find()
    .populate(
      "auth",
      "userId name firstName lastName email role phone profileImage isActive"
    )
    .populate("courses")
    .sort({ createdAt: -1 });
};

// ==============================
// Get Student By ID
// ==============================

export const getStudentById = async (id) => {
  const student = await Student.findById(id)
    .populate(
      "auth",
      "userId name firstName lastName email role phone profileImage isActive"
    )
    .populate("courses");

  if (!student) {
    throw new Error("Student not found");
  }

  return student;
};

// ==============================
// Update Student
// ==============================

export const updateStudent = async (id, data) => {
  const student = await Student.findById(id);

  if (!student) {
    throw new Error("Student not found");
  }

  const {
    name,
    firstName,
    lastName,
    email,
    phone,
    profileImage,
    isActive,
    grade,
    className,
    parentName,
    parentPhone,
    courses,
  } = data;

  // 1. Prepare Auth information
  const authData = {
    name,
    firstName,
    lastName,
    email:
      email !== undefined
        ? email.trim().toLowerCase()
        : undefined,
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

  // 2. Update Auth information
  if (Object.keys(authData).length > 0) {
    const existingAuth = await Auth.findById(student.auth);

    if (!existingAuth) {
      throw new Error("Student Auth account not found");
    }

    // Check duplicate email
    if (authData.email !== undefined) {
      if (!authData.email) {
        throw new Error("Email cannot be empty");
      }

      const emailExists = await Auth.findOne({
        email: authData.email,
        _id: { $ne: student.auth },
      });

      if (emailExists) {
        throw new Error("Email already exists");
      }
    }

    await Auth.findByIdAndUpdate(
      student.auth,
      authData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // 3. Prepare Student information
  const studentData = {
    grade,
    className,
    parentName,
    parentPhone,
    courses,
  };

  // Remove undefined values
  Object.keys(studentData).forEach((key) => {
    if (studentData[key] === undefined) {
      delete studentData[key];
    }
  });

  // 4. Update Student information
  let updatedStudent = student;

  if (Object.keys(studentData).length > 0) {
    updatedStudent = await Student.findByIdAndUpdate(
      id,
      studentData,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  // 5. Get updated Auth information
  const updatedAuth = await Auth.findById(student.auth).select(
    "userId name firstName lastName email role phone profileImage isActive"
  );

  // 6. Return both documents
  return {
    auth: updatedAuth,
    student: updatedStudent,
  };
};

// ==============================
// Delete Student
// ==============================

export const deleteStudent = async (id) => {
  const student = await Student.findById(id);

  if (!student) {
    throw new Error("Student not found");
  }

  // Delete related Auth account
  await Auth.findByIdAndDelete(student.auth);

  // Delete Student profile
  await Student.findByIdAndDelete(id);

  return {
    message: "Student deleted successfully",
  };
};

// ==============================
// Get Logged-in Student Profile
// ==============================

export const getStudentProfile = async (authId) => {
  const student = await Student.findOne({
    auth: authId,
  })
    .populate(
      "auth",
      "userId name firstName lastName email role phone profileImage isActive"
    )
    .populate("courses");

  if (!student) {
    throw new Error("Student profile not found");
  }

  return student;
};
