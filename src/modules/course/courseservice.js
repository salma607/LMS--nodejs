
import Course from "../../models/course/course.js";
import Teacher from "../../models/teachers/teacher.js";

// ==============================
// Check Teacher
// ==============================

const getTeacherProfile = async (authId) => {
  const teacher = await Teacher.findOne({ auth: authId });

  if (!teacher) {
    throw new Error("Teacher profile not found");
  }

  return teacher;
};

// ==============================
// Check Course Ownership
// ==============================

const checkCoursePermission = async (course, authUser) => {
  if (authUser.role === "admin") return true;

  if (authUser.role === "teacher") {
    const teacher = await getTeacherProfile(authUser.id);

    if (course.teacher.toString() !== teacher._id.toString()) {
      throw new Error("You can only manage your own courses");
    }

    return true;
  }

  throw new Error("You do not have permission to manage courses");
};

// ==============================
// Create Course
// ==============================

export const createCourse = async (data, authUser) => {
  let teacherId = data.teacher;

  if (authUser.role === "teacher") {
    const teacher = await getTeacherProfile(authUser.id);
    teacherId = teacher._id;
  }

  if (!teacherId) {
    throw new Error("Teacher is required");
  }

  const teacherExists = await Teacher.findById(teacherId);

  if (!teacherExists) {
    throw new Error("Teacher not found");
  }

  const createdCourse = await Course.create({
    ...data,
    teacher: teacherId,
  });

  return await Course.findById(createdCourse._id).populate({
    path: "teacher",
    populate: {
      path: "auth",
      select: "userId name firstName lastName email",
    },
  });
};

// ==============================
// Get All Courses
// ==============================

export const getAllCourses = async () => {
  return await Course.find()
    .populate({
      path: "teacher",
      populate: {
        path: "auth",
        select: "userId name firstName lastName email",
      },
    })
    .sort({ createdAt: -1 });
};

// ==============================
// Get Course By ID
// ==============================

export const getCourseById = async (courseId) => {
  const foundCourse = await Course.findById(courseId).populate({
    path: "teacher",
    populate: {
      path: "auth",
      select: "userId name firstName lastName email",
    },
  });

  if (!foundCourse) {
    throw new Error("Course not found");
  }

  return foundCourse;
};

// ==============================
// Get Courses By Teacher
// ==============================

export const getCoursesByTeacher = async (teacherId) => {
  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    throw new Error("Teacher not found");
  }

  return await Course.find({ teacher: teacherId })
    .populate({
      path: "teacher",
      populate: {
        path: "auth",
        select: "userId name firstName lastName email",
      },
    })
    .sort({ createdAt: -1 });
};

// ==============================
// Get My Courses (Teacher)
// ==============================

export const getMyCourses = async (authId) => {
  const teacher = await getTeacherProfile(authId);

  return await Course.find({ teacher: teacher._id })
    .populate({
      path: "teacher",
      populate: {
        path: "auth",
        select: "userId name firstName lastName email",
      },
    })
    .sort({ createdAt: -1 });
};

// ==============================
// Update Course
// ==============================

export const updateCourse = async (courseId, data, authUser) => {
  const existingCourse = await Course.findById(courseId);

  if (!existingCourse) {
    throw new Error("Course not found");
  }

  await checkCoursePermission(existingCourse, authUser);

  if (authUser.role === "teacher") {
    delete data.teacher;
  }

  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: "teacher",
    populate: {
      path: "auth",
      select: "userId name firstName lastName email",
    },
  });

  return updatedCourse;
};

// ==============================
// Delete Course
// ==============================

export const deleteCourse = async (courseId, authUser) => {
  const existingCourse = await Course.findById(courseId);

  if (!existingCourse) {
    throw new Error("Course not found");
  }

  await checkCoursePermission(existingCourse, authUser);

  await Course.findByIdAndDelete(courseId);

  return {
    message: "Course deleted successfully",
  };
};

// ==============================
// Activate / Deactivate Course
// ==============================

export const toggleCourseStatus = async (courseId, authUser) => {
  const existingCourse = await Course.findById(courseId);

  if (!existingCourse) {
    throw new Error("Course not found");
  }

  await checkCoursePermission(existingCourse, authUser);

  existingCourse.isActive = !existingCourse.isActive;

  await existingCourse.save();

  return existingCourse;
};
