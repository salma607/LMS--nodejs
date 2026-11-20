import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/DB/connection.js";
import authroute from "./src/modules/auth/authRoutes.js"
import teacherroute from "./src/modules/teachers/teacherRoutes.js"
import adminroutes from "./src/modules/Admin/adminroutes.js"
import studentroutes from "./src/modules/student/studentroutes.js"
import attendanceroutes from "./src/modules/attendance/attendanceroutes.js"
import courseroutes from "./src/modules/course/courseroutes.js"
import gradeRoutes from "./src/modules/grades/gradesroutes.js";
import assigmentRoutes from "./src/modules/Assigments/assigmentroutes.js";

dotenv.config();

const app = express();

app.use(express.json());

connectDB();

app.use("/auth", authroute);
app.use("/teacher",teacherroute)
app.use("/Admin",adminroutes)
app.use("/student",studentroutes)
app.use("/attendance",attendanceroutes)
app.use("/course",courseroutes)
app.use("/grades", gradeRoutes);
app.use("/assigments", assigmentRoutes);


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});