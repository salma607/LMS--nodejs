import {Teacher} from "../models/index.js";
import AbstractRepository from "./abstractrepo.js";

const teacherRepository = new AbstractRepository(Teacher);

export default teacherRepository;