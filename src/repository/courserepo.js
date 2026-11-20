import {Course} from "../models/index.js";
import AbstractRepository from "./abstractrepo.js";

const CourseRepository = new AbstractRepository(Course);

export default CourseRepository;