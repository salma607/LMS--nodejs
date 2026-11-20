
import Grade from "../../models/grades/grade.js";
import Student from "../../models/students/student.js";
import Assignment from "../../models/assigment/assigment.js";
import Course from "../../models/course/course.js";
import Teacher from "../../models/teachers/teacher.js";

// ==============================
// Get Teacher Profile
// ==============================

const getTeacherProfile = async (authId) => {
  const teacher = await Teacher.findOne({ auth: authId });

  if (!teacher) {
    throw new Error("Teacher profile not found");
  }

  return teacher;
};

// ==============================
// Check Course Permission
// ==============================

const checkCoursePermission = async (courseId, authUser) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (authUser.role === "admin") {
    return course;
  }

  if (authUser.role === "teacher") {
    const teacher = await getTeacherProfile(authUser.id);

    if (course.teacher.toString() !== teacher._id.toString()) {
      throw new Error("You can only manage grades for your own courses");
    }

    return course;
  }

  throw new Error("You do not have permission to manage grades");
};

// ==============================
// Populate Grade
// ==============================

const populateGrade = (query) => {
  return query
    .populate({
      path: "student",
      populate: {
        path: "auth",
        select: "userId name firstName lastName email",
      },
    })
    .populate("assignment")
    .populate("course", "title code")
    .populate({
      path: "gradedBy",
      populate: {
        path: "auth",
        select: "userId name firstName lastName email",
      },
    });
};

// ==============================
// Create Grade
// ==============================

export const createGrade = async (data, authUser) => {
  const {
    student,
    assignment,
    course,
    marks,
    totalMarks,
    feedback,
  } = data;

  if (
    !student ||
    !assignment ||
    !course ||
    marks === undefined ||
    totalMarks === undefined
  ) {
    throw new Error(
      "Student, assignment, course, marks and total marks are required"
    );
  }

  if (
    Number(marks) < 0 ||
    Number(totalMarks) <= 0 ||
    Number(marks) > Number(totalMarks)
  ) {
    throw new Error("Marks must be between 0 and total marks");
  }

  const studentExists = await Student.findById(student);

  if (!studentExists) {
    throw new Error("Student not found");
  }

  const assignmentExists = await Assignment.findById(assignment);

  if (!assignmentExists) {
    throw new Error("Assignment not found");
  }

  // Assignment must belong to the selected course
  if (assignmentExists.course.toString() !== course) {
    throw new Error("Assignment does not belong to this course");
  }

  await checkCoursePermission(course, authUser);

  const teacher = await getTeacherProfile(authUser.id);

  const grade = await Grade.create({
    student,
    assignment,
    course,
    marks,
    totalMarks,
    feedback,
    gradedBy: teacher._id,
  });

  return await populateGrade(Grade.findById(grade._id));
};

// ==============================
// Get All Grades
// ==============================

export const getAllGrades = async () => {
  return await populateGrade(
    Grade.find().sort({ gradedAt: -1 })
  );
};

// ==============================
// Get Grade By ID
// ==============================

export const getGradeById = async (gradeId) => {
  const grade = await populateGrade(Grade.findById(gradeId));

  if (!grade) {
    throw new Error("Grade not found");
  }

  return grade;
};

// ==============================
// Get Grades By Student
// ==============================

export const getGradesByStudent = async (studentId) => {
  const student = await Student.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  return await populateGrade(
    Grade.find({ student: studentId }).sort({ gradedAt: -1 })
  );
};

// ==============================
// Get Grades By Course
// ==============================

export const getGradesByCourse = async (courseId, authUser) => {
  await checkCoursePermission(courseId, authUser);

  return await populateGrade(
    Grade.find({ course: courseId }).sort({ gradedAt: -1 })
  );
};

// ==============================
// Get Grades By Assignment
// ==============================

export const getGradesByAssignment = async (assignmentId, authUser) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await checkCoursePermission(assignment.course, authUser);

  return await populateGrade(
    Grade.find({ assignment: assignmentId }).sort({ gradedAt: -1 })
  );
};

// ==============================
// Get My Grades (Student)
// ==============================

export const getMyGrades = async (authId) => {
  const student = await Student.findOne({ auth: authId });

  if (!student) {
    throw new Error("Student profile not found");
  }

  return await populateGrade(
    Grade.find({ student: student._id }).sort({ gradedAt: -1 })
  );
};

// ==============================
// Update Grade
// ==============================

export const updateGrade = async (gradeId, data, authUser) => {
  const grade = await Grade.findById(gradeId);

  if (!grade) {
    throw new Error("Grade not found");
  }

  await checkCoursePermission(grade.course, authUser);

  const marks =
    data.marks !== undefined ? Number(data.marks) : grade.marks;

  const totalMarks =
    data.totalMarks !== undefined
      ? Number(data.totalMarks)
      : grade.totalMarks;

  if (
    marks < 0 ||
    totalMarks <= 0 ||
    marks > totalMarks
  ) {
    throw new Error("Marks must be between 0 and total marks");
  }

  const updatedGrade = await Grade.findByIdAndUpdate(
    gradeId,
    {
      marks,
      totalMarks,
      ...(data.feedback !== undefined && {
        feedback: data.feedback,
      }),
      gradedAt: new Date(),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return await populateGrade(
    Grade.findById(updatedGrade._id)
  );
};

// ==============================
// Delete Grade
// ==============================

export const deleteGrade = async (gradeId, authUser) => {
  const grade = await Grade.findById(gradeId);

  if (!grade) {
    throw new Error("Grade not found");
  }

  await checkCoursePermission(grade.course, authUser);

  await Grade.findByIdAndDelete(gradeId);

  return {
    message: "Grade deleted successfully",
  };
};
