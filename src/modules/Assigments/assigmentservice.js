
import Assignment from "../../models/assigment/assigment.js";
import Course from "../../models/course/course.js";
import Teacher from "../../models/teachers/teacher.js";

// Get Teacher profile using Auth ID
const getTeacherProfile = async (authId) => {
  const teacher = await Teacher.findOne({ auth: authId });

  if (!teacher) {
    throw new Error("Teacher profile not found");
  }

  return teacher;
};

// Check if teacher owns the course
const checkCoursePermission = async (courseId, authUser) => {
  const course = await Course.findById(courseId);

  if (!course) {
    throw new Error("Course not found");
  }

  if (authUser.role === "admin") {
    return course;
  }

  const teacher = await getTeacherProfile(authUser.id);

  if (course.teacher.toString() !== teacher._id.toString()) {
    throw new Error("You are not allowed to manage this course");
  }

  return course;
};

// Check if teacher owns assignment
const checkAssignmentPermission = async (assignment, authUser) => {
  if (authUser.role === "admin") {
    return;
  }

  const teacher = await getTeacherProfile(authUser.id);

  if (assignment.teacher.toString() !== teacher._id.toString()) {
    throw new Error("You are not allowed to manage this assignment");
  }
};

// Populate assignment information
const populateAssignment = (query) => {
  return query
    .populate("course", "title code category level")
    .populate({
      path: "teacher",
      select: "userId firstName lastName department",
      populate: {
        path: "auth",
        select: "userId name email",
      },
    });
};

// CREATE ASSIGNMENT
export const createAssignment = async (data, authUser) => {
  const {
    title,
    description,
    course,
    dueDate,
    totalMarks,
    attachments,
    isActive,
  } = data;

  if (
    !title ||
    !description ||
    !course ||
    !dueDate ||
    totalMarks === undefined
  ) {
    throw new Error("Please provide all required fields");
  }

  if (Number(totalMarks) < 1) {
    throw new Error("Total marks must be at least 1");
  }

  const parsedDueDate = new Date(dueDate);

  if (Number.isNaN(parsedDueDate.getTime())) {
    throw new Error("Invalid due date");
  }

  await checkCoursePermission(course, authUser);

  const teacher = await getTeacherProfile(authUser.id);

  const assignment = await Assignment.create({
    title,
    description,
    course,
    teacher: teacher._id,
    dueDate: parsedDueDate,
    totalMarks: Number(totalMarks),
    attachments: attachments || [],
    isActive: isActive ?? true,
  });

  return populateAssignment(
    Assignment.findById(assignment._id)
  );
};

// GET ALL ASSIGNMENTS (Admin)
export const getAllAssignments = async () => {
  return populateAssignment(
    Assignment.find().sort({ createdAt: -1 })
  );
};

// GET ASSIGNMENT BY ID
export const getAssignmentById = async (assignmentId) => {
  const assignment = await populateAssignment(
    Assignment.findById(assignmentId)
  );

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  return assignment;
};

// GET ASSIGNMENTS BY COURSE
export const getAssignmentsByCourse = async (courseId, authUser) => {
  await checkCoursePermission(courseId, authUser);

  const filter = { course: courseId };

  // Students should only see active assignments
  if (authUser.role === "student") {
    filter.isActive = true;
  }

  return populateAssignment(
    Assignment.find(filter).sort({ dueDate: 1 })
  );
};

// GET MY ASSIGNMENTS (Teacher)
export const getMyAssignments = async (authId) => {
  const teacher = await getTeacherProfile(authId);

  return populateAssignment(
    Assignment.find({ teacher: teacher._id }).sort({
      createdAt: -1,
    })
  );
};

// UPDATE ASSIGNMENT
export const updateAssignment = async (
  assignmentId,
  data,
  authUser
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await checkAssignmentPermission(assignment, authUser);

  if (data.course) {
    await checkCoursePermission(data.course, authUser);
  }

  if (data.totalMarks !== undefined && Number(data.totalMarks) < 1) {
    throw new Error("Total marks must be at least 1");
  }

  if (data.dueDate !== undefined) {
    const parsedDueDate = new Date(data.dueDate);

    if (Number.isNaN(parsedDueDate.getTime())) {
      throw new Error("Invalid due date");
    }

    data.dueDate = parsedDueDate;
  }

  // Do not allow changing assignment owner directly
  delete data.teacher;

  const updatedAssignment = await Assignment.findByIdAndUpdate(
    assignmentId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  return populateAssignment(
    Assignment.findById(updatedAssignment._id)
  );
};

// DELETE ASSIGNMENT
export const deleteAssignment = async (
  assignmentId,
  authUser
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await checkAssignmentPermission(assignment, authUser);

  await Assignment.findByIdAndDelete(assignmentId);

  return { message: "Assignment deleted successfully" };
};

// TOGGLE ASSIGNMENT STATUS
export const toggleAssignmentStatus = async (
  assignmentId,
  authUser
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  await checkAssignmentPermission(assignment, authUser);

  assignment.isActive = !assignment.isActive;

  await assignment.save();

  return populateAssignment(
    Assignment.findById(assignment._id)
  );
};
