import {Attendance} from "../models/index.js";
import AbstractRepository from "./abstractrepo.js";

const AttendanceRepository = new AbstractRepository(Attendance);

export default AttendanceRepository;